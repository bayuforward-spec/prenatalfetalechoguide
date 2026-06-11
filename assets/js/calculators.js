/*
 * calculators.js — Mesin perhitungan medis (semua dihitung di sisi klien, instan).
 *
 * Catatan klinis: Rumus mengikuti acuan yang lazim dipakai di praktik kebidanan &
 * kandungan (Naegele, WHO, NICE, Rotterdam, Johnson, dll). Lihat komentar tiap fungsi.
 * Aplikasi ini alat bantu edukasi, BUKAN pengganti pemeriksaan dokter.
 */

const HARI = 86400000; // ms per hari

/* ---------- Util tanggal ---------- */
function parseTanggal(str) {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}
function tambahHari(d, n) { return new Date(d.getTime() + n * HARI); }
function selisihHari(a, b) { return Math.round((a - b) / HARI); }
function formatTanggalID(d) {
  if (!d) return '-';
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli',
    'Agustus','September','Oktober','November','Desember'];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

/* =========================================================
 * 1. KEHAMILAN — HPL & Usia Kehamilan (Naegele's rule)
 *    HPL = HPHT + 1 tahun - 3 bulan + 7 hari
 * ========================================================= */
function hitungKehamilan(hphtStr, siklus) {
  const hpht = parseTanggal(hphtStr);
  if (!hpht) return { error: 'Tanggal HPHT tidak valid.' };

  const panjangSiklus = Number(siklus) || 28;
  const koreksi = panjangSiklus - 28; // koreksi bila siklus bukan 28 hari

  // HPL via Naegele + koreksi siklus
  const hpl = tambahHari(hpht, 280 + koreksi);
  const hariIni = new Date(); hariIni.setHours(0,0,0,0);

  const totalHari = selisihHari(hariIni, hpht);
  const minggu = Math.floor(totalHari / 7);
  const sisaHari = totalHari % 7;

  let trimester = 1;
  if (minggu >= 28) trimester = 3;
  else if (minggu >= 13) trimester = 2;

  const sisaKeHpl = selisihHari(hpl, hariIni);

  return {
    hpht,
    hpl,
    usiaMinggu: minggu,
    usiaHari: sisaHari,
    usiaTeks: minggu >= 0 ? `${minggu} minggu ${sisaHari} hari` : 'Belum hamil / tanggal di masa depan',
    trimester,
    sisaKeHpl,
    valid: minggu >= 0 && minggu <= 45,
  };
}

/* Perkembangan janin ringkas per minggu */
const PERKEMBANGAN_JANIN = {
  4:  { ukuran: 'biji wijen (~2 mm)', info: 'Tabung saraf mulai terbentuk. Tes kehamilan positif.' },
  8:  { ukuran: 'buah raspberry (~1,6 cm)', info: 'Jari tangan & kaki mulai terbentuk, jantung berdetak.' },
  12: { ukuran: 'buah jeruk nipis (~5,4 cm)', info: 'Organ vital lengkap. Risiko keguguran menurun.' },
  16: { ukuran: 'buah alpukat (~11,6 cm)', info: 'Jenis kelamin mulai dapat terlihat via USG.' },
  20: { ukuran: 'buah pisang (~25 cm)', info: 'USG anomali (fetomaternal) ideal. Gerakan janin terasa.' },
  24: { ukuran: 'buah jagung (~30 cm)', info: 'Batas viabilitas. Paru mulai berkembang.' },
  28: { ukuran: 'terong (~37 cm)', info: 'Masuk trimester 3. Mata mulai bisa membuka.' },
  32: { ukuran: 'buah kelapa (~42 cm)', info: 'Berat naik pesat, posisi mulai kepala di bawah.' },
  36: { ukuran: 'selada romaine (~47 cm)', info: 'Paru hampir matang. Persiapan persalinan.' },
  40: { ukuran: 'semangka kecil (~51 cm)', info: 'Aterm — siap lahir kapan saja.' },
};
function infoJanin(minggu) {
  const kunci = Object.keys(PERKEMBANGAN_JANIN).map(Number).sort((a,b)=>a-b);
  let pilih = kunci[0];
  for (const k of kunci) if (minggu >= k) pilih = k;
  return { minggu: pilih, ...PERKEMBANGAN_JANIN[pilih] };
}

/* Estimasi Berat Janin — Rumus Johnson (bedside, dari Tinggi Fundus Uteri)
 * TBJ (gram) = (TFU - n) × 155 ; n=11 bila kepala sudah masuk PAP, 12 bila belum */
function estimasiBeratJanin(tfu, kepalaMasuk) {
  const t = Number(tfu);
  if (!t || t < 15 || t > 45) return { error: 'TFU tidak wajar (masukkan 15–45 cm).' };
  const n = kepalaMasuk ? 11 : 12;
  const tbj = (t - n) * 155;
  return { tbj: Math.round(tbj), rentang: `${Math.round(tbj*0.9)}–${Math.round(tbj*1.1)} g` };
}

/* =========================================================
 * 2. SIKLUS & KESUBURAN — Ovulasi & Masa Subur
 *    Ovulasi ≈ haid berikutnya - 14 hari ; jendela subur = ovulasi -5..+1
 * ========================================================= */
function hitungKesuburan(haidTerakhirStr, panjangSiklus) {
  const hpht = parseTanggal(haidTerakhirStr);
  if (!hpht) return { error: 'Tanggal haid terakhir tidak valid.' };
  const siklus = Number(panjangSiklus) || 28;
  if (siklus < 21 || siklus > 40) return { error: 'Panjang siklus tidak wajar (21–40 hari).' };

  const haidBerikut = tambahHari(hpht, siklus);
  const ovulasi = tambahHari(haidBerikut, -14);
  const suburMulai = tambahHari(ovulasi, -5);
  const suburAkhir = tambahHari(ovulasi, 1);

  return {
    ovulasi,
    suburMulai,
    suburAkhir,
    haidBerikut,
    teratur: siklus >= 24 && siklus <= 35,
  };
}

/* =========================================================
 * 3. SKRINING KESEHATAN
 * ========================================================= */

/* BMI / IMT */
function hitungBMI(beratKg, tinggiCm) {
  const b = Number(beratKg), t = Number(tinggiCm) / 100;
  if (!b || !t) return { error: 'Berat & tinggi wajib diisi.' };
  const bmi = b / (t * t);
  let kategori, warna;
  if (bmi < 18.5) { kategori = 'Berat badan kurang'; warna = 'info'; }
  else if (bmi < 23) { kategori = 'Normal (ideal)'; warna = 'ok'; }       // cut-off Asia-Pasifik
  else if (bmi < 25) { kategori = 'Berisiko (overweight)'; warna = 'warn'; }
  else if (bmi < 30) { kategori = 'Obesitas I'; warna = 'bad'; }
  else { kategori = 'Obesitas II'; warna = 'bad'; }
  return { bmi: bmi.toFixed(1), kategori, warna };
}

/* Risiko Preeklampsia — adaptasi faktor risiko NICE
 * faktorTinggi: array boolean ; faktorSedang: array boolean */
function risikoPreeklampsia(faktorTinggi, faktorSedang) {
  const nTinggi = faktorTinggi.filter(Boolean).length;
  const nSedang = faktorSedang.filter(Boolean).length;
  let level, warna, saran;
  if (nTinggi >= 1 || nSedang >= 2) {
    level = 'Risiko TINGGI';
    warna = 'bad';
    saran = 'Disarankan aspirin dosis rendah 75–150 mg/hari mulai usia 12 minggu (atas indikasi dokter) & pemantauan tekanan darah ketat.';
  } else if (nSedang === 1) {
    level = 'Risiko SEDANG';
    warna = 'warn';
    saran = 'Pantau tekanan darah & protein urin rutin tiap kontrol ANC.';
  } else {
    level = 'Risiko RENDAH';
    warna = 'ok';
    saran = 'Lanjutkan ANC rutin sesuai jadwal.';
  }
  return { level, warna, saran, nTinggi, nSedang };
}

/* Skrining Anemia kehamilan (cut-off WHO) */
function skriningAnemia(hb, trimester) {
  const v = Number(hb);
  if (!v) return { error: 'Masukkan nilai Hb (g/dL).' };
  const batas = (Number(trimester) === 2) ? 10.5 : 11.0;
  let kategori, warna, saran;
  if (v >= batas) { kategori = 'Tidak anemia'; warna = 'ok'; saran = 'Lanjutkan suplemen zat besi profilaksis sesuai anjuran.'; }
  else if (v >= 10) { kategori = 'Anemia ringan'; warna = 'warn'; saran = 'Tablet tambah darah (zat besi) & evaluasi pola makan tinggi besi.'; }
  else if (v >= 7) { kategori = 'Anemia sedang'; warna = 'bad'; saran = 'Perlu terapi besi & evaluasi penyebab. Konsultasi dokter.'; }
  else { kategori = 'Anemia berat'; warna = 'bad'; saran = 'Segera ke fasilitas kesehatan — mungkin perlu transfusi.'; }
  return { kategori, warna, saran, batas };
}

/* Skrining PCOS — kriteria Rotterdam (≥2 dari 3) */
function skriningPCOS(siklusTidakTeratur, tandaAndrogen, ovariumPolikistik) {
  const n = [siklusTidakTeratur, tandaAndrogen, ovariumPolikistik].filter(Boolean).length;
  if (n >= 2) {
    return { warna: 'warn', hasil: 'Memenuhi kriteria Rotterdam (kemungkinan PCOS)',
      saran: 'Konsultasikan ke dokter SpOG untuk konfirmasi (USG transvaginal & profil hormon). Eksklusi penyebab lain diperlukan.' };
  }
  return { warna: 'ok', hasil: 'Belum memenuhi kriteria PCOS',
    saran: 'Tetap pantau keteraturan siklus. Bila ada keluhan, konsultasikan ke dokter.' };
}

/* Indeks Risiko Kesehatan Reproduksi — faktor risiko skrining kanker serviks & payudara
 * (alat edukasi kesadaran, bukan diagnostik) */
function skriningKanker(jawaban) {
  // jawaban: {usia, seksualDini, multiPartner, merokok, riwayatKeluarga, belumPapsmear, belumSadari}
  let skor = 0;
  const f = [];
  if (Number(jawaban.usia) >= 30) { skor += 1; f.push('Usia ≥ 30 tahun'); }
  if (jawaban.seksualDini) { skor += 1; f.push('Hubungan seksual usia dini (<18 th)'); }
  if (jawaban.multiPartner) { skor += 1; f.push('Pasangan seksual lebih dari satu'); }
  if (jawaban.merokok) { skor += 1; f.push('Merokok'); }
  if (jawaban.riwayatKeluarga) { skor += 2; f.push('Riwayat kanker pada keluarga'); }
  if (jawaban.belumPapsmear) { skor += 1; f.push('Belum pernah Pap smear/IVA'); }
  if (jawaban.belumSadari) { skor += 1; f.push('Tidak rutin SADARI'); }

  let level, warna, saran;
  if (skor >= 4) { level = 'Perlu perhatian'; warna = 'bad';
    saran = 'Segera jadwalkan Pap smear/IVA & pemeriksaan payudara klinis. Lakukan SADARI tiap bulan.'; }
  else if (skor >= 2) { level = 'Waspada'; warna = 'warn';
    saran = 'Lakukan skrining IVA/Pap smear sesuai jadwal & SADARI rutin tiap bulan.'; }
  else { level = 'Risiko rendah'; warna = 'ok';
    saran = 'Pertahankan gaya hidup sehat & skrining berkala (IVA/Pap smear tiap 3 tahun).'; }
  return { skor, level, warna, saran, faktor: f };
}

window.Calc = {
  formatTanggalID,
  hitungKehamilan, infoJanin, estimasiBeratJanin,
  hitungKesuburan,
  hitungBMI, risikoPreeklampsia, skriningAnemia, skriningPCOS, skriningKanker,
};
