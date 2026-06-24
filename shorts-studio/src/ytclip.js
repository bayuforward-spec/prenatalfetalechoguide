/**
 * Ambil potongan (klip) dari video YouTube memakai yt-dlp (lewat youtube-dl-exec).
 * Mengunduh HANYA bagian yang diminta (start-end) agar cepat & hemat.
 * Memakai biner ffmpeg statis untuk penggabungan, jadi tak perlu install ffmpeg manual.
 *
 * Catatan hukum: gunakan hanya untuk konten yang Anda miliki/izinkan.
 */
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
