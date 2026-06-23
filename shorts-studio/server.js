import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { config, isYouTubeConfigured, ROOT } from './src/config.js';
import { renderShort } from './src/pipeline.js';
import { buildViralMetadata } from './src/viral.js';
import {
  getAuthUrl, exchangeCodeAndSave, isConnected, uploadVideo,
} from './src/youtube.js';

const app = express();
app.use(express.json());
app.use(express.static(path.join(ROOT, 'public')));

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
    res.send('<meta charset="utf-8"><h2 style="font-family:sans-serif">✅ Akun YouTube terhubung. Silakan kembali ke aplikasi & tutup tab ini.</h2><script>setTimeout(()=>window.close(),1500)</script>');
  } catch (e) {
    res.status(500).send('Gagal: ' + e.message);
  }
});

// ---------- Render (gabung + edit + caption) ----------
app.post(
  '/api/render',
  upload.fields([{ name: 'video', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
  async (req, res) => {
    try {
      const videoFile = req.files?.video?.[0];
      const audioFile = req.files?.audio?.[0];
      if (!videoFile) return res.status(400).json({ error: 'File video wajib diupload.' });
      if (!audioFile) return res.status(400).json({ error: 'File audio wajib diupload.' });

      const body = req.body || {};
      const job = newJob();
      job.status = 'rendering';
      job.outPath = path.join(config.outputDir, `${job.id}.mp4`);
      job.meta = buildViralMetadata({
        title: body.title,
        description: body.description,
        captionText: body.captionText,
        hashtags: body.hashtags,
      });
      job.videoPath = videoFile.path;
      job.audioPath = audioFile.path;
      job.privacy = body.privacy || config.defaultPrivacy;
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
  await renderShort(
    {
      videoPath: job.videoPath,
      audioPath: job.audioPath,
      captionText: body.captionText || '',
      captionStyle: body.captionStyle || 'bold',
      uppercase: body.uppercase !== 'false',
      keepOriginalAudio: body.keepOriginalAudio === 'true',
      viralGrade: body.viralGrade !== 'false',
      outPath: job.outPath,
    },
    (p) => { job.percent = p.percent; job.stage = p.stage; }
  );

  job.status = 'rendered';
  job.percent = 100;
  job.stage = 'Render selesai';
  job.downloadUrl = `/output/${path.basename(job.outPath)}`;

  // Bersihkan file upload mentah.
  fsp.unlink(job.videoPath).catch(() => {});
  fsp.unlink(job.audioPath).catch(() => {});

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
