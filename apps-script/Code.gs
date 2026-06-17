/**
 * DATA POGI — Agregator untuk Dashboard
 * ------------------------------------------------------------------
 * Script ini membaca sheet "DATA POGI (Responses)", menghitung rekap,
 * lalu mengembalikan HANYA ANGKA AGREGAT (tanpa nama/HP/email/alamat)
 * sebagai JSON/JSONP. Aman dipublikasikan.
 *
 * Cara pakai: lihat SETUP.md. Singkatnya:
 *   1. Buka sheet → Extensions → Apps Script, tempel file ini.
 *   2. Sesuaikan SHEET_NAME bila perlu.
 *   3. Deploy → New deployment → Web app → Execute as: Me,
 *      Who has access: Anyone. Salin URL /exec ke dashboard (CONFIG.endpoint).
 *
 * Data pribadi TIDAK pernah keluar dari sheet — hanya hitungan.
 */

var SHEET_NAME = 'DATA POGI (Responses)'; // ganti bila nama tab berbeda

/* ====== ENTRY POINT (Web App) ====== */
function doGet(e) {
  var data = buildAggregate();
  var json = JSON.stringify(data);
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/* ====== AGREGASI ====== */
function buildAggregate() {
  var sheet = pickSheet_();
  var values = sheet.getDataRange().getValues();
  var header = values.shift().map(function (h) { return String(h).trim(); });
  var col = indexByHeader_(header);

  // 1) Dedup: kunci = email (lowercase); fallback = nama dinormalisasi.
  //    Simpan baris dengan Timestamp TERBARU.
  var byKey = {};
  var totalMasuk = 0;
  var dupOlder = 0;
  values.forEach(function (row) {
    if (isEmptyRow_(row)) return;
    totalMasuk++;
    var email = norm_(row[col.email]);
    var key = (email && email.indexOf('@') >= 0) ? email : 'name:' + norm_(row[col.nama]);
    var ts = toTime_(row[col.ts]);
    if (!byKey[key]) {
      byKey[key] = { row: row, ts: ts };
    } else {
      dupOlder++;
      if (ts >= byKey[key].ts) byKey[key] = { row: row, ts: ts };
    }
  });
  var rows = Object.keys(byKey).map(function (k) { return byKey[k].row; });
  var totalUnik = rows.length;

  // 2) Hitung kategori
  var kepeg = { 'SWASTA': 0, 'PNS': 0, 'PNS dan SWASTA': 0 };
  var jenjang = { 'Spesialis Obgyn': 0, 'Subspesialis': 0 };
  var subsp = { 'FER': 0, 'Obginsos': 0, 'KFm': 0, 'Onk': 0, 'Urogin-RE': 0, 'Lainnya': 0 };
  var pogi = { ya: 0, tidak: 0 };
  var agama = {};
  var nikah = { 'Menikah': 0, 'Belum menikah': 0, 'Tidak terisi': 0 };
  var asuransi = {};
  var sebaran = {};
  var unclassified = 0;
  var mk = { 1: 0, 2: 0, 3: 0 };   // jumlah dokter per banyaknya kab/kota praktik
  var mkLintas = 0;                // dokter praktik di >1 kab/kota

  rows.forEach(function (row) {
    // Kepegawaian
    var sk = String(row[col.kepeg] || '').toUpperCase();
    var hasP = sk.indexOf('PNS') >= 0, hasS = sk.indexOf('SWASTA') >= 0;
    if (hasP && hasS) kepeg['PNS dan SWASTA']++;
    else if (hasP) kepeg['PNS']++;
    else if (hasS) kepeg['SWASTA']++;

    // Jenjang & subspesialis
    var nama = String(row[col.nama] || '');
    var jen = String(row[col.jenjang] || '');
    var isSub = /subsp|subs-/i.test(nama) || /subspesialis/i.test(jen);
    if (isSub) {
      jenjang['Subspesialis']++;
      subsp[subspKategori_(nama + ' ' + (row[col.subUniv] || ''))]++;
    } else {
      jenjang['Spesialis Obgyn']++; // termasuk yang jenjang-nya kosong tapi SpOG
    }

    // ONE POGI
    var op = String(row[col.pogi] || '').trim().toLowerCase();
    if (op.indexOf('ya') === 0) pogi.ya++;
    else if (op.indexOf('tidak') === 0) pogi.tidak++;

    // Agama
    var ag = agamaKategori_(row[col.agama]);
    agama[ag] = (agama[ag] || 0) + 1;

    // Status pernikahan
    var nk = nikahKategori_(row[col.nikah]);
    nikah[nk]++;

    // Asuransi (hanya yang menyebut penyedia)
    var prov = asuransiProvider_(row[col.asuransi]);
    if (prov) asuransi[prov] = (asuransi[prov] || 0) + 1;

    // Sebaran kabupaten/kota (utamakan instansi + SIP1, lalu domisili)
    var reg = geoRegion_(String(row[col.instansi] || '') + ' ' + String(row[col.sip1] || ''));
    if (!reg) reg = geoRegion_(String(row[col.domisili] || ''));
    if (reg) sebaran[reg] = (sebaran[reg] || 0) + 1;
    else unclassified++;

    // Praktik lintas kabupaten: hitung kab/kota berbeda dari SIP 1-3
    var set = {};
    [row[col.sip1], row[col.sip2], row[col.sip3]].forEach(function (sip) {
      var r = geoRegion_(String(sip || ''));
      if (r) set[r] = 1;
    });
    var nKab = Math.max(Object.keys(set).length, 1); // 0 terbaca dianggap 1
    if (nKab >= 3) mk[3]++; else mk[nKab]++;
    if (Object.keys(set).length >= 2) mkLintas++;
  });

  // 3) Susun output sesuai bentuk yang dipakai dashboard
  var out = {
    updated: Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Jakarta', 'd MMM yyyy, HH:mm'),
    totalMasuk: totalMasuk,
    totalUnik: totalUnik,
    duplikat: dupOlder,
    onepogi: pogi,
    kepegawaian: [
      { label: 'SWASTA', value: kepeg['SWASTA'], cls: '' },
      { label: 'PNS', value: kepeg['PNS'], cls: 'teal' },
      { label: 'PNS dan SWASTA', value: kepeg['PNS dan SWASTA'], cls: 'info' }
    ],
    jenjang: [
      { label: 'Spesialis Obgyn', value: jenjang['Spesialis Obgyn'], cls: '' },
      { label: 'Subspesialis', value: jenjang['Subspesialis'], cls: 'teal' }
    ],
    subspesialis: [
      { label: 'FER — Fertilitas & Endokrinologi Reproduksi', value: subsp['FER'], cls: '' },
      { label: 'Obginsos — Obstetri Ginekologi Sosial', value: subsp['Obginsos'], cls: 'teal' },
      { label: 'KFm — Kedokteran Fetomaternal', value: subsp['KFm'], cls: 'info' },
      { label: 'Onk — Onkologi Ginekologi', value: subsp['Onk'], cls: 'warn' },
      { label: 'Urogin-RE — Uroginekologi Rekonstruksi', value: subsp['Urogin-RE'], cls: 'warn' }
    ].concat(subsp['Lainnya'] ? [{ label: 'Subspesialis lain', value: subsp['Lainnya'], cls: 'warn' }] : []),
    subspesialisTotal: jenjang['Subspesialis'],
    agama: toSortedArr_(agama),
    nikah: [
      { label: 'Menikah', value: nikah['Menikah'], cls: '' },
      { label: 'Belum menikah', value: nikah['Belum menikah'], cls: 'teal' },
      { label: 'Tidak terisi', value: nikah['Tidak terisi'], cls: 'warn' }
    ],
    asuransi: toSortedArr_(asuransi).slice(0, 6),
    asuransiMax: totalUnik,
    sebaran: Object.keys(sebaran).map(function (k) { return { n: k, c: sebaran[k] }; }),
    multiKab: [
      { label: 'Praktik di 1 kab/kota', value: mk[1], cls: '' },
      { label: 'Praktik di 2 kab/kota', value: mk[2], cls: 'teal' },
      { label: 'Praktik di 3 kab/kota', value: mk[3], cls: 'info' }
    ],
    multiKabLintas: mkLintas
  };
  if (unclassified) out.sebaranTakTerklasifikasi = unclassified;
  return out;
}

/* ====== HELPER KATEGORISASI ====== */
function subspKategori_(s) {
  s = String(s).toLowerCase();
  if (/onk|onko|onkogin/.test(s)) return 'Onk';
  if (/urogin/.test(s)) return 'Urogin-RE';
  if (/k\.?\s?fm|kfm|feto\s?maternal|fetomaternal/.test(s)) return 'KFm';
  if (/fer\b|f\.?\s?e\.?\s?r|fertilitas|endokrinologi/.test(s)) return 'FER';
  if (/obginsos|obgynsos|sosial/.test(s)) return 'Obginsos';
  return 'Lainnya';
}

function agamaKategori_(v) {
  var s = String(v || '').toLowerCase().trim();
  if (s.indexOf('islam') === 0) return 'Islam';
  if (/protestan|kristen/.test(s)) return 'Kristen / Protestan';
  if (/katolik|katholik/.test(s)) return 'Katolik';
  if (/hindu/.test(s)) return 'Hindu';
  if (/budha|buddha/.test(s)) return 'Buddha';
  if (/konghucu|khonghucu/.test(s)) return 'Konghucu';
  return s ? cap_(s) : 'Tidak terisi';
}

function nikahKategori_(v) {
  var s = String(v || '').toLowerCase().trim();
  if (!s) return 'Tidak terisi';
  if (/belum|single|singel|lajang/.test(s)) return 'Belum menikah';
  if (/nikah/.test(s)) return 'Menikah';
  return 'Menikah';
}

function asuransiProvider_(v) {
  var s = String(v || '').toLowerCase();
  if (/bumida|bunida/.test(s)) return 'Bumida';
  if (/allianz|alianz|allians/.test(s)) return 'Allianz';
  if (/axa/.test(s)) return 'AXA Mandiri';
  if (/prudential/.test(s)) return 'Prudential';
  if (/bni\s?life/.test(s)) return 'BNI Life';
  if (/manulife/.test(s)) return 'Manulife';
  return null; // "tidak"/"-"/kosong → tidak dihitung
}

/* Klasifikasi kabupaten/kota Lampung dari teks bebas (best-effort).
   Urutan: kabupaten/kota spesifik dulu, Bandar Lampung paling akhir. */
var GEO_RULES = [
  ['Mesuji',              /mesuji|brabasan|simpang pematang|wiralaga|\brbc\b/],
  ['Tulang Bawang Barat', /tulang bawang barat|tubaba|tumijajar|panaragan/],
  ['Tulang Bawang',       /tulang bawang|menggala|\bmgl\b|banjar agung|unit 2|rawajitu/],
  ['Way Kanan',           /way kanan|blambangan umpu|baradatu|banjit|\bzapa\b|zainal abidin pagar ?alam|haji kamino/],
  ['Lampung Utara',       /lampung utara|kotabumi|ryacudu|prokimal|abung|medika insani lampung utara|handayani/],
  ['Lampung Barat',       /lampung barat|\bliwa\b|alimuddin umar|balik bukit/],
  ['Pesisir Barat',       /pesisir barat|\bkrui\b|pugung tampak/],
  ['Tanggamus',           /tanggamus|kota agung|batin mangunang|gisting|wonosobo|talang padang/],
  ['Pringsewu',           /pringsewu|gadingrejo|gading rejo|wisma ?rini|wismarini|mitra husada/],
  ['Pesawaran',           /pesawaran|gedong tataan|gedung tataan|kedondong|negeri katon|\bgmc\b/],
  ['Lampung Timur',       /lampung timur|lamtim|sukadana|way jepara|mataram baru|sribhawono|pekalongan|ahmad hanafiah|mawar lamtim/],
  ['Lampung Selatan',     /lampung selatan|lamsel|kalianda|\bnatar\b|bob bazar|jati agung|way hui|airan raya|sidomulyo|bandar negara husada/],
  ['Lampung Tengah',      /lampung tengah|lamteng|bandar jaya|gunung sugih|terbanggi|seputih|demang sepulau|yukum|punggur|bandar surabaya|\bkalirejo\b|mitra mulia|puri adhya|puti bungsu|kartini kalirejo|artha bunda/],
  ['Kota Metro',          /\bmetro\b|mardi waluyo|muhammadiyah metro|muhamadiyah metro|ahmad yani metro|a\.? yani metro|imopuro|amc kota metro|amc metro|asih metro|azizah metro/],
  ['Kota Bandar Lampung', /bandar ?lampung|tanjung ?karang|tanjungkarang|teluk ?betung|telukbetung|kedaton|rajabasa|sukarame|kemiling|labuhan ratu|way halim|enggal|pahoman|gunung terang|tirtayasa|abdul moeloek|moeloek|\brsam\b|urip sumohar|graha husada|bumi waras|imanuel|advent|bintang amin|belleza|budi medika|tjokrodipo|restu bunda|hermina|bhayangkara|\bdkt\b|puri betik hati|surya asih|bunda asyifa|asyifa by aulia|tk iv|santa anna|barokah medika/]
];

function geoRegion_(text) {
  var s = String(text || '').toLowerCase();
  if (!s.trim()) return null;
  for (var i = 0; i < GEO_RULES.length; i++) {
    if (GEO_RULES[i][1].test(s)) return GEO_RULES[i][0];
  }
  return null;
}

/* ====== UTIL ====== */
function pickSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(SHEET_NAME);
  if (s) return s;
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    if (/respons|data pogi/i.test(all[i].getName())) return all[i];
  }
  return all[0];
}

function indexByHeader_(header) {
  function find(re) { for (var i = 0; i < header.length; i++) if (re.test(header[i])) return i; return -1; }
  return {
    ts: 0,
    nama: find(/^nama/i),
    agama: find(/agama/i),
    email: find(/email/i),
    domisili: find(/alamat rumah|domisili/i),
    kepeg: find(/status kepegawaian/i),
    instansi: find(/instansi|tempat tugas/i),
    jenjang: find(/jenjang/i),
    subUniv: find(/jenis subspesialis/i),
    sip1: find(/sip 1/i),
    sip2: find(/sip 2/i),
    sip3: find(/sip 3/i),
    pogi: find(/sudah mengikuti one pogi/i),
    asuransi: find(/asuransi profesi/i),
    nikah: find(/status pernikahan/i)
  };
}

function toSortedArr_(obj) {
  var palette = ['', 'teal', 'info', 'warn', 'warn', 'warn'];
  return Object.keys(obj)
    .map(function (k) { return { label: k, value: obj[k] }; })
    .sort(function (a, b) { return b.value - a.value; })
    .map(function (it, i) { it.cls = palette[i] || 'warn'; return it; });
}

function isEmptyRow_(row) { return row.join('').trim() === ''; }
function norm_(v) { return String(v == null ? '' : v).trim().toLowerCase(); }
function cap_(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function toTime_(v) {
  if (v instanceof Date) return v.getTime();
  var t = new Date(v).getTime();
  return isNaN(t) ? 0 : t;
}

/* Uji cepat dari editor (lihat Logs) tanpa deploy */
function _test() { Logger.log(JSON.stringify(buildAggregate(), null, 2)); }
