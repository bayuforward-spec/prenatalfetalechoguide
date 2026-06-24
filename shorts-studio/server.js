import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { config, isYouTubeConfigured, ROOT } from './src/config.js';
import { renderShort } from './src/pipeline.js';
import { buildViralMetadata } from './src/viral.js';
import { analyze } from './src/analyzer.js';
import {
  getAuthUrl, exchangeCodeAndSave, isConnected, uploadVideo,
} from './src/youtube.js';
import { listFiles, browse, downloadFile, parseFileId } from './src/drive.js';
import { downloadClip, isYouTubeUrl } from './src/ytclip.js';

const app = express();
app.use(express.json());
// Anti-cache: pastikan browser selalu memuat HTML/JS/CSS terbaru (hindari versi basi).
app.use(express.static(path.join(ROOT, 'public'), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-store'),
}));

// Pastikan folder ada.
for (const d of [config.uploadsDir, config.outputDir]) {
  fs.mkdirSync(d, { recursive: true });
}

// ---------- Upload (multer) ----------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadsDir),
  filename: (_req, file, cb) => {
    const id = crypto.randomBytes(8).toString('hex');
    cb(null, `${id}${path.extname(file.originalname) || ''}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB
});

// ---------- Job store sederhana (in-memory) ----------
/** @type {Map<string, any>} */
const jobs = new Map();

function newJob() {
  const id = crypto.randomBytes(6).toString('hex');
  const job = { id, status: 'queued', percent: 0, stage: 'Antri', createdAt: Date.now() };
  jobs.set(id, job);
  return job;
}

// ---------- Status / konfigurasi ----------
app.get('/api/status', (_req, res) => {
  res.json({
    youtubeConfigured: isYouTubeConfigured(),
    youtubeConnected: isConnected(),
    defaultPrivacy: config.defaultPrivacy,
    maxDurationSec: config.maxDurationSec,
  });
});

// ---------- OAuth YouTube ----------
app.get('/auth/youtube', (_req, res) => {
  if (!isYouTubeConfigured()) {
    return res.status(400).send('Kredensial Google belum diatur di .env');
  }
  res.redirect(getAuthUrl());
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Tidak ada kode otorisasi.');
  try {
    await exchangeCodeAndSave(String(code));
    res.send('<meta charset="utf-8"><h2 style="font-family:sans-serif">✅ Akun Google terhubung (YouTube + Drive). Silakan kembali ke aplikasi & tutup tab ini.</h2><script>setTimeout(()=>window.close(),1500)</script>');
  } catch (e) {
    res.status(500).send('Gagal: ' + e.message);
  }
});

// ---------- Google Drive: daftar file ----------
app.get('/api/drive/list', async (req, res) => {
  if (!isConnected()) return res.status(400).json({ error: 'Belum terhubung ke Google. Klik "Hubungkan YouTube/Drive".' });
  const type = req.query.type === 'audio' ? 'audio' : 'video';
  try {
    const files = await listFiles(type);
    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- Google Drive: jelajah folder ----------
app.get('/api/drive/browse', async (req, res) => {
  if (!isConnected()) return res.status(400).json({ error: 'Belum terhubung ke Google.' });
  const type = req.query.type === 'audio' ? 'audio' : 'video';
  const folderId = req.query.folderId ? parseFileId(req.query.folderId) : '';
  try {
    res.json(await browse(folderId, type));
  } catch (e) {
    const msg = e?.errors?.[0]?.message || e?.response?.data?.error?.message || e.message;
    console.error('Drive browse error:', msg);
    res.status(500).json({ error: 'Drive: ' + msg });
  }
});

// ---------- Render (gabung + edit + caption) ----------
app.post(
  '/api/render',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'music', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const videoFile = req.files?.video?.[0];
      const audioFile = req.files?.audio?.[0];
      const musicFile = req.files?.music?.[0];
      const body = req.body || {};

      // Sumber bisa dari upload ATAU Google Drive (ID/link).
      const driveVideoId = parseFileId(body.driveVideoId);
      const driveAudioId = parseFileId(body.driveAudioId);
      const driveMusicId = parseFileId(body.driveMusicId);

      // Sumber video bisa juga klip dari link YouTube.
      const ytUrl = (body.ytUrl || '').trim();
      if (ytUrl && !isYouTubeUrl(ytUrl)) return res.status(400).json({ error: 'Link YouTube tidak valid.' });

      if (!videoFile && !driveVideoId && !ytUrl) return res.status(400).json({ error: 'Sumber video wajib (upload, Drive, atau klip YouTube).' });
      if (!audioFile && !driveAudioId) return res.status(400).json({ error: 'Sumber audio wajib (upload atau pilih dari Drive).' });
      if ((driveVideoId || driveAudioId || driveMusicId) && !isConnected()) {
        return res.status(400).json({ error: 'Sumber Drive dipilih tapi belum terhubung ke Google.' });
      }

      const job = newJob();
      job.status = 'rendering';
      job.outPath = path.join(config.outputDir, `${job.id}.mp4`);
      job.meta = buildViralMetadata({
        title: body.title,
        description: body.description,
        captionText: body.captionText,
        hashtags: body.hashtags,
      });
      job.videoPath = videoFile?.path || null;
      job.audioPath = audioFile?.path || null;
      job.musicPath = musicFile?.path || null;
      job.driveVideoId = driveVideoId;
      job.driveAudioId = driveAudioId;
      job.driveMusicId = driveMusicId;
      job.ytUrl = ytUrl || null;
      job.ytStart = body.ytStart || '0';
      job.ytDuration = body.ytDuration || '';
      job.privacy = body.privacy || config.defaultPrivacy;
      job.scheduledAt = (body.scheduledAt || '').trim() || null; // ISO string utk jadwal publish
      job.autoUpload = body.autoUpload === 'true' || body.autoUpload === true;

      // Render async; klien polling /api/job/:id.
      res.json({ jobId: job.id, meta: job.meta });

      renderJob(job, body).catch((e) => {
        job.status = 'error';
        job.error = e.message;
        console.error('Render error:', e);
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

async function renderJob(job, body) {
  // Ambil klip dari YouTube bila link diberikan (jadi sumber video).
  if (job.ytUrl) {
    job.stage = 'Mengunduh klip dari YouTube';
    job.percent = 2;
    const outPath = path.join(config.uploadsDir, `${job.id}-ytclip.mp4`);
    const clip = await downloadClip({
      url: job.ytUrl,
      start: job.ytStart,
      duration: job.ytDuration,
      outPath,
      maxDuration: config.maxDurationSec,
    });
    job.videoPath = clip.path;
    job.percent = 6;
  }

  // Unduh sumber dari Google Drive bila dipilih (otomatis, di latar belakang).
  if (job.driveVideoId || job.driveAudioId || job.driveMusicId) {
    job.stage = 'Mengambil file dari Google Drive';
    if (job.driveVideoId) {
      job.stage = 'Mengambil video dari Drive';
      job.videoPath = (await downloadFile(job.driveVideoId, config.uploadsDir, (p) => { job.percent = Math.round(p * 0.05); })).path;
    }
    if (job.driveAudioId) {
      job.stage = 'Mengambil audio dari Drive';
      job.audioPath = (await downloadFile(job.driveAudioId, config.uploadsDir, (p) => { job.percent = Math.round(p * 0.05); })).path;
    }
    if (job.driveMusicId) {
      job.stage = 'Mengambil musik dari Drive';
      job.musicPath = (await downloadFile(job.driveMusicId, config.uploadsDir, (p) => { job.percent = Math.round(p * 0.05); })).path;
    }
  }

  const hookText = (body.hookText || '').trim();
  const viralGrade = body.viralGrade !== 'false';
  const result = await renderShort(
    {
      videoPath: job.videoPath,
      audioPath: job.audioPath,
      musicPath: job.musicPath,
      musicVolume: body.musicVolume,
      captionText: body.captionText || '',
      captionStyle: body.captionStyle || 'bold',
      uppercase: body.uppercase !== 'false',
      hookText,
      keepOriginalAudio: body.keepOriginalAudio === 'true',
      viralGrade,
      outPath: job.outPath,
    },
    (p) => { job.percent = p.percent; job.stage = p.stage; }
  );

  job.status = 'rendered';
  job.percent = 100;
  job.stage = 'Render selesai';
  job.downloadUrl = `/output/${path.basename(job.outPath)}`;

  // Skor virality (heuristik lokal).
  job.analysis = analyze({
    durationSec: result.durationSec,
    captionSegments: result.captionSegments,
    hasHook: Boolean(hookText),
    hasMusic: result.hasMusic,
    viralGrade,
    captionText: body.captionText || '',
  });

  // Bersihkan file upload mentah.
  fsp.unlink(job.videoPath).catch(() => {});
  fsp.unlink(job.audioPath).catch(() => {});
  if (job.musicPath) fsp.unlink(job.musicPath).catch(() => {});

  if (job.autoUpload) {
    if (!isConnected()) {
      job.status = 'rendered';
      job.uploadError = 'Belum terhubung ke YouTube — render tersimpan, upload dilewati.';
      return;
    }
    job.status = 'uploading';
    job.uploadPercent = 0;
    const result = await uploadVideo(
      {
        filePath: job.outPath,
        title: job.meta.title,
        description: job.meta.description,
        tags: job.meta.tags,
        privacyStatus: job.privacy,
        publishAt: job.scheduledAt,
      },
      (p) => { job.uploadPercent = p; }
    );
    job.status = 'done';
    job.youtube = result;
  }
}

// ---------- Upload manual hasil render yang sudah ada ----------
app.post('/api/upload/:jobId', async (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job || !fs.existsSync(job.outPath || '')) {
    return res.status(404).json({ error: 'Hasil render tidak ditemukan.' });
  }
  if (!isConnected()) {
    return res.status(400).json({ error: 'Belum terhubung ke YouTube.' });
  }
  try {
    job.status = 'uploading';
    job.uploadPercent = 0;
    res.json({ ok: true });
    const result = await uploadVideo(
      {
        filePath: job.outPath,
        title: job.meta.title,
        description: job.meta.description,
        tags: job.meta.tags,
        privacyStatus: req.body?.privacy || job.privacy || config.defaultPrivacy,
        publishAt: req.body?.scheduledAt || job.scheduledAt || null,
      },
      (p) => { job.uploadPercent = p; }
    );
    job.status = 'done';
    job.youtube = result;
  } catch (e) {
    job.status = 'error';
    job.error = e.message;
  }
});

// ---------- Polling status job ----------
app.get('/api/job/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job tidak ditemukan.' });
  res.json({
    id: job.id,
    status: job.status,
    percent: job.percent,
    stage: job.stage,
    uploadPercent: job.uploadPercent,
    downloadUrl: job.downloadUrl,
    meta: job.meta,
    analysis: job.analysis,
    youtube: job.youtube,
    error: job.error,
    uploadError: job.uploadError,
  });
});

// Sajikan hasil render.
app.use('/output', express.static(config.outputDir));

app.listen(config.port, () => {
  console.log(`\n🎬 Shorts Studio berjalan di  http://localhost:${config.port}`);
  if (!isYouTubeConfigured()) {
    console.log('ℹ️  Auto-upload YouTube nonaktif (isi .env untuk mengaktifkan). Render & unduh tetap berfungsi.');
  } else if (!isConnected()) {
    console.log('ℹ️  Kredensial siap. Klik "Hubungkan YouTube" di aplikasi untuk login.');
  } else {
    console.log('✅ YouTube terhubung — siap auto-upload.');
  }
});
