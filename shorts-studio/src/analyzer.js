/**
 * Analyzer virality lokal (heuristik, gratis, tanpa dependensi eksternal).
 * Menilai faktor-faktor yang secara nyata memengaruhi performa Shorts:
 * hook, durasi, kepadatan caption, format, musik. Memberi skor 0-100 + saran.
 *
 * Catatan: ini estimasi berbasis best-practice, BUKAN prediksi pasti.
 * Untuk analisis AI mendalam, gunakan Higgsfield virality_predictor (lihat README).
 */

/**
 * @param {object} d
 * @param {number} d.durationSec
 * @param {number} d.captionSegments
 * @param {boolean} d.hasHook
 * @param {boolean} d.hasMusic
 * @param {boolean} d.viralGrade
 * @param {string}  d.captionText
 */
export function analyze(d) {
  const factors = [];
  const tips = [];
  let score = 0;

  // Format 9:16 — aplikasi selalu menghasilkan ini (bobot 15).
  score += 15;
  factors.push({ name: 'Format 9:16 vertikal', points: 15, max: 15, ok: true });

  // Hook 3 detik pertama (bobot 25) — paling menentukan retensi.
  if (d.hasHook) {
    score += 25;
    factors.push({ name: 'Hook 3 detik pertama', points: 25, max: 25, ok: true });
  } else {
    factors.push({ name: 'Hook 3 detik pertama', points: 0, max: 25, ok: false });
    tips.push('Tambahkan teks hook di 3 detik pertama (mis. "TUNGGU SAMPAI AKHIR") — ini faktor retensi terbesar.');
  }

  // Durasi ideal (bobot 20). Sweet spot Shorts ~12-40 detik.
  const dur = d.durationSec || 0;
  if (dur >= 12 && dur <= 40) {
    score += 20;
    factors.push({ name: `Durasi ${Math.round(dur)}s (ideal)`, points: 20, max: 20, ok: true });
  } else if (dur >= 7 && dur <= 60) {
    score += 12;
    factors.push({ name: `Durasi ${Math.round(dur)}s (cukup)`, points: 12, max: 20, ok: true });
    tips.push('Durasi paling kuat untuk retensi sekitar 12-40 detik.');
  } else {
    score += 5;
    factors.push({ name: `Durasi ${Math.round(dur)}s (kurang ideal)`, points: 5, max: 20, ok: false });
    tips.push(dur < 7
      ? 'Video terlalu pendek — sulit menyampaikan nilai. Targetkan 12-40 detik.'
      : 'Video panjang menurunkan completion rate. Pertimbangkan persingkat ke <40 detik.');
  }

  // Caption (bobot 20). Kepadatan wajar membantu retensi & menonton tanpa suara.
  const seg = d.captionSegments || 0;
  const perSec = dur > 0 ? seg / dur : 0;
  if (seg >= 3 && perSec >= 0.15 && perSec <= 0.9) {
    score += 20;
    factors.push({ name: `Caption ${seg} potongan (pas)`, points: 20, max: 20, ok: true });
  } else if (seg > 0) {
    score += 10;
    factors.push({ name: `Caption ${seg} potongan`, points: 10, max: 20, ok: true });
    if (perSec > 0.9) tips.push('Caption berganti terlalu cepat — perpanjang teks atau kurangi potongan.');
    else if (perSec < 0.15) tips.push('Caption terlalu jarang berganti — tambahkan teks agar lebih dinamis.');
  } else {
    factors.push({ name: 'Caption', points: 0, max: 20, ok: false });
    tips.push('Tambahkan caption — mayoritas penonton Shorts menonton tanpa suara.');
  }

  // Musik latar (bobot 12).
  if (d.hasMusic) {
    score += 12;
    factors.push({ name: 'Musik latar', points: 12, max: 12, ok: true });
  } else {
    factors.push({ name: 'Musik latar', points: 0, max: 12, ok: false });
    tips.push('Tambahkan musik latar (idealnya yang sedang tren) untuk meningkatkan daya tarik.');
  }

  // Color grade (bobot 8).
  if (d.viralGrade) {
    score += 8;
    factors.push({ name: 'Color grade punchy', points: 8, max: 8, ok: true });
  } else {
    factors.push({ name: 'Color grade punchy', points: 0, max: 8, ok: false });
    tips.push('Aktifkan grade warna agar video lebih "pop" dan menonjol di feed.');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  let grade = 'Perlu perbaikan';
  if (score >= 85) grade = 'Sangat berpotensi';
  else if (score >= 70) grade = 'Berpotensi baik';
  else if (score >= 50) grade = 'Cukup';

  return { score, grade, factors, tips };
}
