/**
 * Ambil potongan (klip) dari video YouTube memakai yt-dlp (lewat youtube-dl-exec).
 * Mengunduh HANYA bagian yang diminta (start-end) agar cepat & hemat.
 * Memakai biner ffmpeg statis untuk penggabungan, jadi tak perlu install ffmpeg manual.
 *
 * Catatan hukum: gunakan hanya untuk konten yang Anda miliki/izinkan.
 */
import fsp from 'node:fs/promises';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';

// Impor yt-dlp secara lazy agar aplikasi inti tetap jalan walau paket opsional
// ini belum terpasang (lihat pesan di catch untuk cara mengaktifkan).
async function loadYoutubeDl() {
  try {
    const mod = await import('youtube-dl-exec');
    return mod.default || mod;
  } catch {
    throw new Error('Fitur klip YouTube belum aktif. Jalankan sekali: npm install youtube-dl-exec');
  }
}

/** Parse "HH:MM:SS" / "MM:SS" / "90" (detik) -> jumlah detik. */
export function parseTime(input) {
  const s = String(input ?? '').trim();
  if (!s) return 0;
  if (/^\d+(\.\d+)?$/.test(s)) return Math.max(0, Number(s));
  const parts = s.split(':').map((p) => Number(p) || 0);
  let sec = 0;
  for (const p of parts) sec = sec * 60 + p;
  return Math.max(0, sec);
}

/** Validasi sederhana URL YouTube. */
export function isYouTubeUrl(url) {
  return /(?:youtube\.com\/|youtu\.be\/)/i.test(String(url || ''));
}

/**
 * Unduh klip dari YouTube.
 * @param {object} o
 * @param {string} o.url
 * @param {string|number} o.start     mulai (detik atau MM:SS)
 * @param {string|number} o.duration  durasi (detik atau MM:SS)
 * @param {string} o.outPath          path output .mp4
 * @param {number} o.maxDuration      batas durasi (detik)
 * @returns {Promise<{path:string, start:number, duration:number}>}
 */
export async function downloadClip({ url, start, duration, outPath, maxDuration = 180 }) {
  if (!isYouTubeUrl(url)) throw new Error('Link YouTube tidak valid.');
  const startSec = parseTime(start);
  let durSec = parseTime(duration);
  if (!durSec || durSec <= 0) durSec = 60;
  if (durSec > maxDuration) durSec = maxDuration;
  const endSec = startSec + durSec;

  const youtubedl = await loadYoutubeDl();
  await youtubedl(url, {
    output: outPath,
    downloadSections: `*${startSec}-${endSec}`,
    forceKeyframesAtCuts: true,
    format: 'bv*[ext=mp4][height<=1920]+ba[ext=m4a]/b[ext=mp4]/b',
    mergeOutputFormat: 'mp4',
    noPlaylist: true,
    noWarnings: true,
    ffmpegLocation: ffmpegPath,
    retries: 3,
  });

  return { path: outPath, start: startSec, duration: durSec };
}

// ---------- Caption otomatis dari subtitle YouTube ----------

function vttTimeToSec(t) {
  const m = /(\d+):(\d+):(\d+[.,]\d+)/.exec(t) || /(\d+):(\d+[.,]\d+)/.exec(t);
  if (!m) return 0;
  if (m.length === 4) return +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3].replace(',', '.'));
  return +m[1] * 60 + parseFloat(m[2].replace(',', '.'));
}

/** Bersihkan satu baris cue: hapus tag <...>, entitas, spasi ganda. */
function cleanCueLine(line) {
  return line
    .replace(/<[^>]+>/g, '')           // tag timing/format
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Ekstrak transkrip teks dari isi VTT untuk jendela [startSec, endSec],
 * dengan dedup "rolling caption" khas auto-sub YouTube (hanya kata baru ditambahkan).
 */
export function transcriptFromVtt(content, startSec, endSec) {
  const blocks = String(content || '').replace(/\r/g, '').split('\n\n');
  const words = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    const timeLine = lines.find((l) => l.includes('-->'));
    if (!timeLine) continue;
    const [a, b] = timeLine.split('-->');
    const cStart = vttTimeToSec(a);
    const cEnd = vttTimeToSec(b);
    if (cEnd < startSec || cStart > endSec) continue; // di luar jendela klip
    const text = lines
      .filter((l) => !l.includes('-->') && !/^WEBVTT|^Kind:|^Language:|^\d+$/.test(l.trim()))
      .map(cleanCueLine)
      .filter(Boolean)
      .join(' ')
      .trim();
    if (!text) continue;
    // Dedup rolling: tambahkan hanya kata yang belum ada di ekor daftar.
    const cueWords = text.split(' ');
    let overlap = 0;
    const maxCheck = Math.min(cueWords.length, words.length, 12);
    for (let n = maxCheck; n > 0; n--) {
      if (words.slice(-n).join(' ').toLowerCase() === cueWords.slice(0, n).join(' ').toLowerCase()) {
        overlap = n; break;
      }
    }
    for (const w of cueWords.slice(overlap)) words.push(w);
  }
  return words.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Unduh auto-subtitle dari YouTube & kembalikan transkrip teks untuk jendela klip.
 * Mengembalikan '' bila tidak ada subtitle.
 */
export async function fetchAutoCaptionText({ url, start, duration, workDir, maxDuration = 180 }) {
  if (!isYouTubeUrl(url)) return '';
  const youtubedl = await loadYoutubeDl();
  const startSec = parseTime(start);
  let durSec = parseTime(duration);
  if (!durSec || durSec <= 0) durSec = 60;
  if (durSec > maxDuration) durSec = maxDuration;
  const endSec = startSec + durSec;

  const outTmpl = path.join(workDir, 'subs');
  try {
    await youtubedl(url, {
      skipDownload: true,
      writeAutoSubs: true,
      writeSubs: true,
      subLangs: 'id,id-ID,en,en-US,en-GB',
      subFormat: 'vtt',
      output: outTmpl,
      noPlaylist: true,
      noWarnings: true,
      ffmpegLocation: ffmpegPath,
      retries: 2,
    });
  } catch {
    return '';
  }

  let files = [];
  try { files = (await fsp.readdir(workDir)).filter((f) => f.endsWith('.vtt')); } catch { return ''; }
  if (!files.length) return '';
  // Prioritas bahasa Indonesia, lalu Inggris.
  files.sort((a, b) => {
    const score = (f) => (/\.id[.-]/.test(f) || /\.id\./.test(f) ? 0 : /\.en/.test(f) ? 1 : 2);
    return score(a) - score(b);
  });
  try {
    const content = await fsp.readFile(path.join(workDir, files[0]), 'utf8');
    return transcriptFromVtt(content, startSec, endSec).slice(0, 1200);
  } catch {
    return '';
  }
}
