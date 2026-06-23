/**
 * Mesin render: gabungkan video + audio, ubah ke 9:16, beri "grade" gaya viral,
 * dan burn caption. Memakai biner FFmpeg/FFprobe statis (tanpa install manual).
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { config } from './config.js';
import { captionTextToAss } from './captions.js';

const ffprobePath = ffprobeStatic.path;

function run(bin, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, opts);
    let stderr = '';
    let stdout = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => {
      stderr += d.toString();
      if (opts.onProgress) opts.onProgress(d.toString());
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(bin)} keluar dengan kode ${code}:\n${stderr.slice(-2000)}`));
    });
  });
}

async function probe(file) {
  const { stdout } = await run(ffprobePath, [
    '-v', 'error',
    '-print_format', 'json',
    '-show_format',
    '-show_streams',
    file,
  ]);
  const data = JSON.parse(stdout);
  const duration = Number(data.format?.duration || 0);
  const hasAudio = (data.streams || []).some((s) => s.codec_type === 'audio');
  const hasVideo = (data.streams || []).some((s) => s.codec_type === 'video');
  return { duration, hasAudio, hasVideo };
}

function parseTimeToSec(str) {
  const m = /(\d+):(\d+):(\d+\.?\d*)/.exec(str);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/**
 * @param {object} job
 * @param {string} job.videoPath
 * @param {string} job.audioPath
 * @param {string} job.captionText
 * @param {string} [job.captionStyle]   bold | kuning | neon
 * @param {boolean} [job.uppercase]
 * @param {boolean} [job.keepOriginalAudio]  campur audio asli video pelan di belakang
 * @param {boolean} [job.viralGrade]    boost kontras/saturasi + sharpen
 * @param {string} job.outPath
 * @param {(p:{percent:number,stage:string})=>void} [onProgress]
 */
export async function renderShort(job, onProgress = () => {}) {
  const { videoPath, audioPath, outPath } = job;
  onProgress({ percent: 2, stage: 'Menganalisis media' });

  const v = await probe(videoPath);
  const a = await probe(audioPath);
  if (!v.hasVideo) throw new Error('File video tidak mengandung track video yang valid.');
  if (!a.hasAudio) throw new Error('File audio tidak mengandung track audio yang valid.');

  // Durasi target = mengikuti audio (audio jadi tulang punggung), dibatasi limit Shorts.
  const target = Math.min(a.duration || config.maxDurationSec, config.maxDurationSec);

  // Buat folder kerja per job agar referensi file .ass sederhana (hindari escaping path).
  const workDir = await fsp.mkdtemp(path.join(config.outputDir, 'job-'));
  const assName = 'captions.ass';
  const { ass, segments } = captionTextToAss(job.captionText, target, {
    width: config.width,
    height: config.height,
  }, {
    style: job.captionStyle,
    uppercase: job.uppercase,
    hookText: job.hookText,
    hookSeconds: job.hookSeconds || 3,
  });
  await fsp.writeFile(path.join(workDir, assName), ass, 'utf8');

  onProgress({ percent: 6, stage: 'Menyiapkan render' });

  // --- Filter video: background blur 9:16 + foreground fit + (opsional) grade + burn caption ---
  const grade = job.viralGrade !== false
    ? ',eq=contrast=1.06:saturation=1.18:brightness=0.01,unsharp=5:5:0.6:5:5:0.0'
    : '';

  const vf = [
    `[0:v]scale=${config.width}:${config.height}:force_original_aspect_ratio=increase,crop=${config.width}:${config.height},boxblur=20:4,eq=brightness=-0.06[bg]`,
    `[0:v]scale=${config.width}:${config.height}:force_original_aspect_ratio=decrease[fg]`,
    `[bg][fg]overlay=(W-w)/2:(H-h)/2${grade},fps=${config.fps},subtitles=${assName}[v]`,
  ].join(';');

  // Cek musik latar (opsional). Input ke-2 bila ada.
  let hasMusic = false;
  if (job.musicPath) {
    try { hasMusic = (await probe(job.musicPath)).hasAudio; } catch { hasMusic = false; }
  }
  const musicIdx = 2; // video=0, audio=1, music=2

  // --- Audio graph: audio utama + (opsional) musik di-duck + (opsional) audio asli video ---
  const aParts = [];
  const mixIns = [];
  if (hasMusic) {
    const vol = Number.isFinite(+job.musicVolume) ? +job.musicVolume : 0.18;
    // Pisah audio utama: satu untuk mix, satu sebagai "key" sidechain (penurun musik).
    aParts.push('[1:a]asplit=2[amain][akey]');
    aParts.push(`[${musicIdx}:a]volume=${vol}[mraw]`);
    // Ducking: musik otomatis mengecil saat audio utama berbunyi.
    aParts.push('[mraw][akey]sidechaincompress=threshold=0.03:ratio=8:attack=5:release=300[mduck]');
    mixIns.push('[amain]', '[mduck]');
  } else {
    mixIns.push('[1:a]');
  }
  if (job.keepOriginalAudio && v.hasAudio) {
    aParts.push('[0:a]volume=0.25[orig]');
    mixIns.push('[orig]');
  }

  let audioMap;
  if (mixIns.length > 1) {
    aParts.push(`${mixIns.join('')}amix=inputs=${mixIns.length}:duration=first:dropout_transition=0[aout]`);
    audioMap = '[aout]';
  } else {
    audioMap = mixIns[0]; // '[1:a]'
  }

  const filterComplex = [vf, ...aParts].join(';');

  const args = [
    '-y',
    '-stream_loop', '-1', '-i', videoPath, // loop video bila lebih pendek dari audio
    '-i', audioPath,
    ...(hasMusic ? ['-stream_loop', '-1', '-i', job.musicPath] : []), // loop musik
    '-t', String(target),
    '-filter_complex', filterComplex,
    '-map', '[v]',
    '-map', audioMap,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '44100',
    '-movflags', '+faststart',
    '-shortest',
    outPath,
  ];

  onProgress({ percent: 10, stage: 'Render video (FFmpeg)' });
  await run(ffmpegPath, args, {
    cwd: workDir,
    onProgress: (chunk) => {
      const m = /time=(\d+:\d+:\d+\.?\d*)/.exec(chunk);
      if (m && target > 0) {
        const cur = parseTimeToSec(m[1]);
        const percent = Math.min(98, 10 + Math.round((cur / target) * 88));
        onProgress({ percent, stage: 'Render video (FFmpeg)' });
      }
    },
  });

  // Bersihkan folder kerja.
  await fsp.rm(workDir, { recursive: true, force: true }).catch(() => {});

  onProgress({ percent: 100, stage: 'Selesai' });
  return { outPath, durationSec: target, captionSegments: segments.length, hasMusic };
}

export { probe };
