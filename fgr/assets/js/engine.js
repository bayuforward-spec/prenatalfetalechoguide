/*
 * engine.js — Mesin klinis FetoGuard (IUGR/FGR surveillance).
 * Semua perhitungan di sisi klien. ALAT BANTU KEPUTUSAN, bukan pengganti
 * penilaian klinis. Setiap ambang merujuk literatur (lihat REFERENSI di UI).
 *
 * Acuan utama:
 *  - EFW: Hadlock 1985 (4-param); persentil Hadlock 1991 & INTERGROWTH-21st 2017.
 *  - Definisi FGR vs SGA: konsensus Delphi (Gordijn 2016) & protokol Barcelona.
 *  - Staging I–IV & manajemen: Figueras & Gratacós (Fetal Diagn Ther 2014).
 *  - Waktu persalinan: ISUOG 2020 & SMFM 2020.
 *  - Risiko IUFD (OR): Caradeux 2018 (AJOG).
 *  - Doppler ref: Gómez 2008 (UtA-PI); tabel UA/MCA/CPR & DV (lihat komentar).
 */
(function () {
'use strict';

const DAY = 86400000;

/* ---------- util tanggal ---------- */
function parseDate(s) { if (!s) return null; const d = new Date(s + 'T00:00:00'); return isNaN(d) ? null : d; }
function addDays(d, n) { return new Date(d.getTime() + n * DAY); }
function diffDays(a, b) { return Math.round((a - b) / DAY); }
function fmtID(d) {
  if (!d) return '-';
  const b = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${b[d.getMonth()]} ${d.getFullYear()}`;
}
function gaText(days) {
  if (days == null || isNaN(days)) return '-';
  const w = Math.floor(days / 7), d = days % 7;
  return `${w}+${d} minggu`;
}

/* ---------- statistik ---------- */
function erf(x) {
  const s = x < 0 ? -1 : 1; x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}
function normCdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }       // z -> proporsi
function pct(z) { return normCdf(z) * 100; }                          // z -> persentil 0..100

/* interpolasi linier pada tabel [{ga, ...}] menurut field */
function interp(table, ga, field) {
  if (ga <= table[0].ga) return table[0][field];
  const last = table[table.length - 1];
  if (ga >= last.ga) return last[field];
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i], b = table[i + 1];
    if (ga >= a.ga && ga <= b.ga) {
      const t = (ga - a.ga) / (b.ga - a.ga);
      return a[field] + t * (b[field] - a[field]);
    }
  }
  return last[field];
}

/* =========================================================
 * 1. PENANGGALAN — usia kehamilan & HPL
 *    EDD via HPHT (Naegele + koreksi siklus) ATAU via USG (CRL/biometri).
 * ========================================================= */
function hitungEDD(p) {
  // p: {metode:'hpht'|'usg', hpht, siklus, usgTanggal, usgGAhari}
  if (p.metode === 'usg' && p.usgTanggal && p.usgGAhari != null) {
    const scan = parseDate(p.usgTanggal);
    if (!scan) return null;
    // EDD = tanggal scan + (280 - GA saat scan)
    return addDays(scan, 280 - Number(p.usgGAhari));
  }
  const hpht = parseDate(p.hpht);
  if (!hpht) return null;
  const koreksi = (Number(p.siklus) || 28) - 28;
  return addDays(hpht, 280 + koreksi);
}
// GA (hari) pada tanggal tertentu, anchor = EDD
function gaPada(edd, tanggal) {
  const t = parseDate(tanggal) || tanggal;
  if (!edd || !t) return null;
  return 280 - diffDays(edd, t);
}

/* Cek perlu redating USG vs HPHT (ACOG/ISUOG): selisih ambang per trimester */
function cekRedating(eddHpht, usgTanggal, usgGAhari) {
  if (!eddHpht || !usgTanggal || usgGAhari == null) return null;
  const eddUsg = addDays(parseDate(usgTanggal), 280 - Number(usgGAhari));
  const selisih = Math.abs(diffDays(eddHpht, eddUsg));
  const gaSaatScan = Number(usgGAhari) / 7;
  let ambang;
  if (gaSaatScan < 9) ambang = 5;
  else if (gaSaatScan < 14) ambang = 7;       // CRL
  else if (gaSaatScan < 16) ambang = 7;
  else if (gaSaatScan < 22) ambang = 10;
  else if (gaSaatScan < 28) ambang = 14;
  else ambang = 21;
  return { selisih, ambang, redate: selisih > ambang, eddUsg };
}

/* =========================================================
 * 2. EFW (Estimated Fetal Weight) & PERSENTIL
 *    Biometri dalam mm; dikonversi ke cm di dalam rumus.
 * ========================================================= */
// Hadlock 1985 IV (BPD, HC, AC, FL) — hasil gram
function efwHadlock4(bpd, hc, ac, fl) {
  const b = bpd / 10, h = hc / 10, a = ac / 10, f = fl / 10;
  return Math.pow(10, 1.3596 - 0.00386 * a * f + 0.0064 * h + 0.00061 * b * a + 0.0424 * a + 0.174 * f);
}
// Hadlock 1985 III (HC, AC, FL) — bila BPD tak tersedia
function efwHadlock3(hc, ac, fl) {
  const h = hc / 10, a = ac / 10, f = fl / 10;
  return Math.pow(10, 1.326 - 0.00326 * a * f + 0.0107 * h + 0.0438 * a + 0.158 * f);
}
function hitungEFW(b) {
  // b: {bpd, hc, ac, fl} mm
  const has = (x) => x != null && x !== '' && !isNaN(Number(x));
  const bpd = Number(b.bpd), hc = Number(b.hc), ac = Number(b.ac), fl = Number(b.fl);
  if (has(b.bpd) && has(b.hc) && has(b.ac) && has(b.fl))
    return { efw: Math.round(efwHadlock4(bpd, hc, ac, fl)), rumus: 'Hadlock-4 (BPD,HC,AC,FL)' };
  if (has(b.hc) && has(b.ac) && has(b.fl))
    return { efw: Math.round(efwHadlock3(hc, ac, fl)), rumus: 'Hadlock-3 (HC,AC,FL)' };
  return null;
}

// Persentil EFW — Hadlock 1991 (median exp(0.578+0.332·MA-0.00354·MA²), CV 12.7%)
function efwPctHadlock(efw, gaWeeks) {
  const med = Math.exp(0.578 + 0.332 * gaWeeks - 0.00354 * gaWeeks * gaWeeks);
  const sd = 0.127 * med;
  const z = (efw - med) / sd;
  return { pct: pct(z), z, median: Math.round(med), p3: Math.round(med - 1.88079 * sd), p10: Math.round(med - 1.28155 * sd) };
}
// Persentil EFW — INTERGROWTH-21st 2017 (LMS; tervalidasi pada contoh 3rd centile)
function efwPctIntergrowth(efw, ga) {
  const g3 = ga * ga * ga, lg = Math.log(ga);
  const lambda = -4.257629 - 2162.234 / (ga * ga) + 0.0002301829 * g3;
  const mu = 4.956737 + 0.0005019687 * g3 - 0.0001227065 * g3 * lg;
  const sigma = 1e-4 * (-6.997171 + 0.057559 * g3 - 0.01493946 * g3 * lg);
  const Y = Math.log(efw);
  const Z = (Math.pow(Y / mu, lambda) - 1) / (sigma * lambda);
  const cent = (z) => Math.round(Math.exp(mu * Math.pow(z * sigma * lambda + 1, 1 / lambda)));
  return { pct: pct(Z), z: Z, median: cent(0), p3: cent(-1.88079), p10: cent(-1.28155) };
}
function efwPersentil(efw, gaWeeks, standar) {
  if (!efw || gaWeeks < 10) return null;
  return (standar === 'intergrowth') ? efwPctIntergrowth(efw, gaWeeks) : efwPctHadlock(efw, gaWeeks);
}

/* =========================================================
 * 3. DOPPLER — estimasi persentil (ESTIMASI; lihat catatan tiap tabel)
 *    Centile diestimasi untuk MEMBANTU; klasifikasi abnormal dapat
 *    di-override manual oleh klinisi sesuai grafik referensi lokal.
 * ========================================================= */
// UA-PI 95th centile per GA. 32–40 mg: tervalidasi (Cohen 2019, Rambam, RMMJ.10379).
// 20–30 mg: nilai pendekatan mengikuti tren penurunan baku (Acharya/Arduini-style) — ESTIMASI.
const UA_PI = [
  { ga: 20, p50: 1.20, p95: 1.52 }, { ga: 24, p50: 1.10, p95: 1.40 },
  { ga: 28, p50: 1.04, p95: 1.30 }, { ga: 32, p50: 1.02, p95: 1.22 },
  { ga: 34, p50: 1.02, p95: 1.33 }, { ga: 36, p50: 0.99, p95: 1.37 },
  { ga: 38, p50: 0.91, p95: 1.27 }, { ga: 40, p50: 0.77, p95: 1.03 },
];
// MCA-PI 5th centile (rendah = abnormal). 32–40: Cohen 2019. <32: ESTIMASI.
const MCA_PI = [
  { ga: 20, p50: 1.55, p5: 1.30 }, { ga: 24, p50: 1.90, p5: 1.45 },
  { ga: 28, p50: 2.10, p5: 1.40 }, { ga: 32, p50: 2.24, p5: 1.30 },
  { ga: 34, p50: 1.90, p5: 1.24 }, { ga: 36, p50: 1.77, p5: 1.13 },
  { ga: 38, p50: 1.52, p5: 0.86 }, { ga: 40, p50: 1.28, p5: 0.88 },
];
// CPR 5th centile (rendah = abnormal). 32–40: Cohen 2019. <32: ESTIMASI.
const CPR = [
  { ga: 24, p50: 1.70, p5: 1.05 }, { ga: 28, p50: 1.95, p5: 1.08 },
  { ga: 32, p50: 2.10, p5: 1.09 }, { ga: 34, p50: 2.03, p5: 1.01 },
  { ga: 36, p50: 1.80, p5: 0.98 }, { ga: 38, p50: 1.68, p5: 1.09 },
  { ga: 40, p50: 1.61, p5: 1.08 },
];
// Duktus venosus PIV 95th centile (Nguyen 2020, Pediatr Rep, 22–37 mg).
const DV_PI = [
  { ga: 22, p50: 0.88, p95: 1.09 }, { ga: 24, p50: 0.86, p95: 1.10 },
  { ga: 28, p50: 0.82, p95: 1.10 }, { ga: 32, p50: 0.77, p95: 1.09 },
  { ga: 34, p50: 0.75, p95: 1.08 }, { ga: 36, p50: 0.73, p95: 1.09 },
];
// UtA-PI rata-rata — median via Gómez 2008 (GA hari); 95th ≈ median×1.40 (ESTIMASI).
function utaMedian(gaWeeks) {
  const d = gaWeeks * 7;
  return Math.exp(1.39 - 0.012 * d + 0.0000198 * d * d);
}

// Hasil: {nilai, p50, ambang, abnormal, cakupan} untuk satu indeks
function evalUA(pi, ga) {
  if (pi == null || pi === '') return null;
  const p95 = interp(UA_PI, ga, 'p95'), p50 = interp(UA_PI, ga, 'p50');
  return { nilai: Number(pi), p50: p50.toFixed(2), ambang: p95.toFixed(2), abnormal: Number(pi) > p95,
           cakupan: ga >= 32 ? 'val' : 'est', arah: '>P95' };
}
function evalMCA(pi, ga) {
  if (pi == null || pi === '') return null;
  const p5 = interp(MCA_PI, ga, 'p5'), p50 = interp(MCA_PI, ga, 'p50');
  return { nilai: Number(pi), p50: p50.toFixed(2), ambang: p5.toFixed(2), abnormal: Number(pi) < p5,
           cakupan: ga >= 32 ? 'val' : 'est', arah: '<P5' };
}
function evalCPR(mca, ua, ga) {
  if (mca == null || mca === '' || ua == null || ua === '' || Number(ua) === 0) return null;
  const cpr = Number(mca) / Number(ua);
  const p5 = interp(CPR, ga, 'p5'), p50 = interp(CPR, ga, 'p50');
  return { nilai: cpr, p50: p50.toFixed(2), ambang: p5.toFixed(2), abnormal: cpr < p5 || cpr < 1.0,
           cakupan: ga >= 32 ? 'val' : 'est', arah: '<P5 / <1.0' };
}
function evalUtA(pi, ga) {
  if (pi == null || pi === '') return null;
  const p50 = utaMedian(ga), p95 = p50 * 1.40;
  return { nilai: Number(pi), p50: p50.toFixed(2), ambang: p95.toFixed(2), abnormal: Number(pi) > p95,
           cakupan: 'est', arah: '>P95' };
}
function evalDV(pi, ga) {
  if (pi == null || pi === '') return null;
  const p95 = interp(DV_PI, ga, 'p95'), p50 = interp(DV_PI, ga, 'p50');
  return { nilai: Number(pi), p50: p50.toFixed(2), ambang: p95.toFixed(2), abnormal: Number(pi) > p95,
           cakupan: ga <= 37 ? 'val' : 'est', arah: '>P95' };
}

/* =========================================================
 * 4. DIAGNOSIS — SGA vs FGR (konsensus Delphi / Barcelona)
 *    flags: hasil boolean final (sudah memperhitungkan override manual).
 * ========================================================= */
function diagnosaFGR(ga, f) {
  // f: {efwP, acP, efw3, efw10, ac3, ac10, uaAbn, utaAbn, cprAbn, mcaAbn, edf, crossing}
  const early = ga < 32 * 7;
  const efwOrAc3 = f.efw3 || f.ac3;
  const efwOrAc10 = f.efw10 || f.ac10;
  const aedf = f.edf === 'aedf' || f.edf === 'redf';

  let fgr = false, sga = false, alasan = [];

  if (early) {
    // Delphi early FGR (<32 mg)
    if (efwOrAc3) { fgr = true; alasan.push('EFW/AC < persentil 3'); }
    if (aedf) { fgr = true; alasan.push('UA absent/reversed EDF'); }
    if (efwOrAc10 && (f.utaAbn || f.uaAbn)) { fgr = true; alasan.push('EFW/AC < P10 + UtA-PI/UA-PI > P95'); }
  } else {
    // Delphi late FGR (≥32 mg)
    if (efwOrAc3) { fgr = true; alasan.push('EFW/AC < persentil 3'); }
    const minor = [f.ac10 || f.efw10, f.crossing, (f.cprAbn || f.uaAbn)].filter(Boolean).length;
    if (efwOrAc10 && minor >= 2) { fgr = true; alasan.push('EFW/AC < P10 + ≥2 kriteria minor (crossing/CPR/UA-PI)'); }
    // varian Barcelona: EFW<P10 + Doppler abnormal apa pun
    if (efwOrAc10 && (f.utaAbn || f.cprAbn || f.uaAbn || f.mcaAbn)) { fgr = true; alasan.push('EFW/AC < P10 + Doppler abnormal'); }
  }

  if (!fgr && (f.efw10 || f.ac10)) { sga = true; alasan.push('EFW/AC P3–P10 dengan Doppler normal (SGA)'); }

  let dx, warna;
  if (fgr) { dx = early ? 'FGR DINI (early-onset, < 32 minggu)' : 'FGR LAMBAT (late-onset, ≥ 32 minggu)'; warna = 'bad'; }
  else if (sga) { dx = 'SGA (kecil masa kehamilan, risiko rendah)'; warna = 'warn'; }
  else { dx = 'Pertumbuhan dalam batas normal'; warna = 'ok'; }
  return { fgr, sga, early, dx, warna, alasan: [...new Set(alasan)] };
}

/* =========================================================
 * 5. STAGING (Barcelona / Figueras-Gratacós 2014) + manajemen
 * ========================================================= */
function staging(ga, dx, f) {
  // f: {edf, dvAbn, dvReversed, ctgAbn, decel, aortaReversed,
  //     efw3, cprAbn, mcaAbn, utaAbn, uaAbn}
  const gw = ga / 7;
  let stage = 0, kriteria = [];

  // Stage IV — tertinggi
  if (f.dvReversed || f.ctgAbn || f.decel) {
    stage = 4;
    if (f.dvReversed) kriteria.push('Duktus venosus: a-wave absent/reversed');
    if (f.ctgAbn) kriteria.push('cCTG: STV menurun (abnormal)');
    if (f.decel) kriteria.push('Deselerasi spontan pada CTG');
  } else if (f.edf === 'redf' || f.dvAbn || f.aortaReversed) {
    stage = 3;
    if (f.edf === 'redf') kriteria.push('UA reversed end-diastolic flow (REDF)');
    if (f.dvAbn) kriteria.push('Duktus venosus PI > P95');
    if (f.aortaReversed) kriteria.push('Aortic isthmus reversed flow');
  } else if (f.edf === 'aedf') {
    stage = 2;
    kriteria.push('UA absent end-diastolic flow (AEDF)');
  } else if (f.efw3 || f.cprAbn || f.mcaAbn || f.utaAbn || f.uaAbn) {
    stage = 1;
    if (f.efw3) kriteria.push('EFW < persentil 3 (severe smallness)');
    if (f.uaAbn) kriteria.push('UA-PI > P95 (EDF masih ada)');
    if (f.cprAbn) kriteria.push('CPR < P5');
    if (f.mcaAbn) kriteria.push('MCA-PI < P5');
    if (f.utaAbn) kriteria.push('UtA-PI > P95');
  }

  const M = {
    0: { label: 'Tanpa insufisiensi plasenta', warna: 'ok',
         monitor: dx && dx.sga ? 'Tiap 2 minggu (SGA risiko rendah)' : 'Rutin sesuai ANC',
         lahir: dx && dx.sga ? '≥ 40 minggu (SGA Doppler normal)' : 'Aterm sesuai indikasi',
         cara: 'Pervaginam (induksi bila ada indikasi)' },
    1: { label: 'Insufisiensi plasenta ringan / redistribusi serebral', warna: 'info',
         monitor: 'Tiap 1 minggu', lahir: '37 minggu', cara: 'Induksi (pervaginam tidak kontraindikasi)' },
    2: { label: 'Insufisiensi plasenta berat (AEDF)', warna: 'warn',
         monitor: 'Tiap 2–3 hari', lahir: '34 minggu', cara: 'Seksio sesarea elektif' },
    3: { label: 'Insufisiensi plasenta lanjut (REDF / DV-PI↑)', warna: 'bad',
         monitor: 'Tiap 24–48 jam', lahir: '30–32 minggu', cara: 'Seksio sesarea elektif' },
    4: { label: 'Kecurigaan tinggi asidosis janin — risiko kematian imminent', warna: 'crit',
         monitor: 'Tiap 12 jam (rawat inap)', lahir: '≥ 26 minggu (setelah steroid; segera)', cara: 'Seksio sesarea segera' },
  };
  const m = M[stage];
  // koreksi: jika stadium menetapkan lahir lebih dini dari GA sekarang → "pertimbangkan terminasi sekarang"
  return { stage, kriteria, ...m, gw };
}

/* =========================================================
 * 6. RISIKO IUFD — stratifikasi kualitatif (OR Caradeux 2018)
 * ========================================================= */
function risikoIUFD(stage, ga, f) {
  const gw = ga / 7;
  let tier, warna, or, ket;
  if (stage >= 4) {
    tier = 'KRITIS — kematian janin imminent'; warna = 'crit';
    or = 'DV a-wave absent/reversed: OR kematian janin ≈ 11,6 (Caradeux 2018)';
    ket = 'Terminasi dalam 12–24 jam setelah pematangan paru. Rawat di pusat dengan NICU.';
  } else if (stage === 3) {
    tier = 'SANGAT TINGGI'; warna = 'bad';
    or = 'UA-REDF: OR kematian janin ≈ 7,3; DV-PI>P95 menandai perburukan';
    ket = 'Surveilans intensif (12–48 jam), steroid + MgSO4, rencana persalinan 30–32 mg.';
  } else if (stage === 2) {
    tier = 'TINGGI'; warna = 'bad';
    or = 'UA-AEDF: OR kematian janin ≈ 3,6 (Caradeux 2018)';
    ket = 'Surveilans 2–3×/minggu, steroid, rencana persalinan ~34 mg.';
  } else if (stage === 1) {
    tier = 'MENINGKAT (ringan–sedang)'; warna = 'warn';
    or = f.efw3 ? 'EFW<P3: OR luaran buruk ≈ 6,3 (Meler 2021)' : 'Doppler dini abnormal, EDF masih ada';
    ket = 'Surveilans mingguan; sebagian besar dapat dipantau hingga 37 mg.';
  } else {
    tier = 'RENDAH (mendekati populasi umum)'; warna = 'ok';
    or = '—'; ket = 'Lanjutkan pemantauan rutin sesuai kategori.';
  }
  // modifikasi usia kehamilan: < 28 mg menambah mortalitas prematuritas
  let catatanGA = '';
  if (gw < 28 && stage >= 2) catatanGA = 'Usia kehamilan sangat muda: mortalitas prematuritas tinggi — keputusan terminasi vs ekspektatif harus mempertimbangkan keseimbangan risiko (rujuk pusat tersier).';
  return { tier, warna, or, ket, catatanGA };
}

/* =========================================================
 * Penilaian lengkap satu kunjungan
 * ========================================================= */
function nilaiKunjungan(visit, ctx) {
  // ctx: {edd, standar}
  const ga = gaPada(ctx.edd, visit.tanggal);
  const gw = ga != null ? ga / 7 : null;
  const out = { ga, gw, gaText: gaText(ga) };
  if (ga == null) return out;

  // EFW
  const e = hitungEFW(visit);
  let efwP = null;
  if (e) {
    efwP = efwPersentil(e.efw, gw, ctx.standar);
    out.efw = e.efw; out.efwRumus = e.rumus; out.efwPct = efwP;
  }

  // Doppler eval
  out.ua = evalUA(visit.uaPi, gw);
  out.mca = evalMCA(visit.mcaPi, gw);
  out.cpr = evalCPR(visit.mcaPi, visit.uaPi, gw);
  out.uta = evalUtA(visit.utaPi, gw);
  out.dv = evalDV(visit.dvPi, gw);

  // flags (auto dari estimasi, dapat di-override via visit.override*)
  const ovr = (key, auto) => visit['ovr_' + key] === 'on' ? true : (visit['ovr_' + key] === 'off' ? false : auto);
  const f = {
    efwP: efwP ? efwP.pct : null,
    efw3: efwP ? efwP.pct < 3 : false,
    efw10: efwP ? efwP.pct < 10 : false,
    ac3: !!visit.ac3, ac10: !!visit.ac10,
    uaAbn: ovr('ua', out.ua ? out.ua.abnormal : false),
    mcaAbn: ovr('mca', out.mca ? out.mca.abnormal : false),
    cprAbn: ovr('cpr', out.cpr ? out.cpr.abnormal : false),
    utaAbn: ovr('uta', out.uta ? out.uta.abnormal : false),
    dvAbn: ovr('dv', out.dv ? out.dv.abnormal : false),
    edf: visit.edf || 'present',
    dvReversed: visit.dvWave === 'reversed',
    ctgAbn: visit.ctg === 'abnormal',
    decel: visit.decel === 'on',
    aortaReversed: visit.aorta === 'reversed',
    crossing: visit.crossing === 'on',
  };
  out.flags = f;

  const dx = diagnosaFGR(ga, f);
  out.dx = dx;
  const st = staging(ga, dx, f);
  out.staging = st;
  out.iufd = risikoIUFD(st.stage, ga, f);
  return out;
}

window.Engine = {
  fmtID, gaText, parseDate, addDays, diffDays,
  hitungEDD, gaPada, cekRedating,
  hitungEFW, efwPersentil,
  nilaiKunjungan, diagnosaFGR, staging, risikoIUFD,
};
})();
