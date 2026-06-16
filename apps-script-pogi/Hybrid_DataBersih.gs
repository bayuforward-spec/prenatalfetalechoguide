/**
 * HYBRID untuk Looker Studio.
 * Membuat / memperbarui tab "Data Bersih" pada spreadsheet DATA POGI:
 *  - dedup (No HP sama → ambil entri terbaru)
 *  - kolom matang: Usia, Kelompok Usia, Wilayah Domisili, Jenjang tertinggi,
 *    Kepegawaian, Agama, Pernikahan, ONE POGI, Sejak (tahun), Asuransi (rapi)
 *  - TANPA No HP / email / alamat rumah (privasi).
 * Looker Studio cukup connect ke tab "Data Bersih".
 *
 * Cara pakai:
 *  1) Bisa di project Apps Script yang sama dgn Code.gs, ATAU project baru.
 *  2) Jalankan buildDataBersih() sekali (menu Run) untuk membuat tab.
 *  3) Jalankan installCleanTriggers() sekali → tab auto-update saat ada respons baru
 *     + cadangan tiap jam.
 *  4) Di Looker Studio: Add data → Google Sheets → DATA POGI → worksheet "Data Bersih".
 */

var CFG = {
  SHEET_ID: '17BRb0ETBkemGimzTaCqroOdZkftXd7tTFxpcBkaf1xo',
  SRC_NAME: '',            // kosong = sheet pertama (Form Responses)
  OUT_NAME: 'Data Bersih'
};

function buildDataBersih() {
  var ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  var src = CFG.SRC_NAME ? ss.getSheetByName(CFG.SRC_NAME) : ss.getSheets()[0];
  var values = src.getDataRange().getValues();
  if (values.length < 2) return;

  var C = { ts:0, nama:1, lahir:3, agama:4, hp:5, email:6, alamat:7,
            kepeg:9, instansi:10, jenjang:11, sip1:17, sip2:18, sip3:19,
            onepogi:21, sejak:22, asuransi:24, nikah:25 };

  var rows = values.slice(1).filter(function(r){
    return String(r[C.nama]).trim() !== '' || String(r[C.hp]).trim() !== '';
  });

  // dedup by No HP (digit), simpan timestamp terbaru
  var byKey = {};
  rows.forEach(function(r){
    var phone = String(r[C.hp]).replace(/\D/g,'');
    var email = String(r[C.email]).trim().toLowerCase();
    var key = phone || email || ('r'+Math.random());
    var t = new Date(r[C.ts]).getTime() || 0;
    if (!byKey[key] || t > byKey[key]._t) { r._t = t; byKey[key] = r; }
  });
  var uniq = Object.keys(byKey).map(function(k){ return byKey[k]; });

  var today = new Date(), thisYear = today.getFullYear();

  function ageOf(v){
    if (!v) return '';
    var y,m,d;
    if (Object.prototype.toString.call(v)==='[object Date]'){ y=v.getFullYear(); m=v.getMonth()+1; d=v.getDate(); }
    else { var p=String(v).split('/'); if(p.length<3) return ''; m=+p[0]; d=+p[1]; y=+p[2]; }
    if (!y || y<1940 || y>thisYear) return ''; // invalid → kosong
    return thisYear - y - ((today.getMonth()+1<m || (today.getMonth()+1===m && today.getDate()<d))?1:0);
  }
  function ageGroup(a){ if(a==='') return 'Tidak diketahui';
    return a<35?'< 35':a<40?'35-39':a<45?'40-44':a<50?'45-49':a<55?'50-54':'55+'; }
  function kepeg(v){ var s=String(v).toLowerCase(),p=s.indexOf('pns')>-1,w=s.indexOf('swasta')>-1;
    return (p&&w)?'PNS dan SWASTA':p?'PNS':w?'SWASTA':'Lainnya'; }
  function jenjang(v){ var s=String(v).toLowerCase();
    return (s.indexOf('subsp')>-1)?'Subspesialis':(s.indexOf('spesialis')>-1)?'Spesialis Obgyn':'S1/profesi dokter'; }
  function agama(v){ var s=String(v).toLowerCase();
    return s.indexOf('islam')>-1?'Islam':(s.indexOf('kristen')>-1||s.indexOf('protestan')>-1||s.indexOf('katolik')>-1)?'Kristen/Katolik':
           s.indexOf('hindu')>-1?'Hindu':(s.indexOf('buddha')>-1||s.indexOf('budha')>-1)?'Buddha':(s?v:'Tidak diisi'); }
  function nikah(v){ var s=String(v).toLowerCase();
    return (s.indexOf('belum')>-1||s.indexOf('single')>-1||s.indexOf('singel')>-1)?'Belum menikah':(s.indexOf('nikah')>-1)?'Menikah':'Tidak diisi'; }
  function pogi(v){ var s=String(v).trim().toLowerCase(); return s.indexOf('ya')===0?'Ya':s.indexOf('tidak')===0?'Tidak':'Tidak diisi'; }
  function sejak(v){ var m=String(v).match(/20\d\d/); return m?m[0]:''; }
  function asuransi(v){ var s=String(v).toLowerCase();
    return (s.indexOf('bumida')>-1||s.indexOf('bunida')>-1)?'Bumida':
           (s.indexOf('allianz')>-1||s.indexOf('alianz')>-1||s.indexOf('allians')>-1)?'Allianz':
           (s.trim()==='ya'||s.indexOf('ya asuransi')>-1)?'Ya (tak disebut)':'Tidak / tidak ada'; }

  var REGIONS = [
    ['Metro',['metro']],['Pringsewu',['pringsewu','gadingrejo','gading rejo']],
    ['Lampung Utara',['kotabumi','lampung utara','baros']],
    ['Lampung Selatan',['kalianda','lampung selatan','natar']],
    ['Way Kanan',['way kanan','baradatu','zapa']],
    ['Tanggamus',['tanggamus','kota agung','batin mangunang']],
    ['Tulang Bawang',['tulang bawang','menggala','unit 2']],
    ['Lampung Timur',['lampung timur','lamtim','sekampung','way jepara']],
    ['Lampung Tengah',['lampung tengah','bandar jaya','gunung sugih','seputih','candi','terbanggi','demang sepulau']],
    ['Bandar Lampung',['bandar lampung','bandarlampung','b. lampung','kedaton','kemiling','rajabasa','sukarame','way halim',
      'tanjung karang','tanjungkarang','teluk betung','telukbetung','pahoman','enggal','sukabumi','gunung terang',
      'segala mider','labuhan ratu','sumur putri','kedamaian','citraland','sultan agung','tj. senang','tj senang','korpri']]
  ];
  function region(r){
    var hay=(String(r[C.alamat])+' '+String(r[C.instansi])+' '+String(r[C.sip1])).toLowerCase();
    for(var i=0;i<REGIONS.length;i++) for(var j=0;j<REGIONS[i][1].length;j++)
      if(hay.indexOf(REGIONS[i][1][j])>-1) return REGIONS[i][0];
    return 'Lainnya / tidak jelas';
  }

  var header = ['Nama','Wilayah Domisili','Tempat Lahir','Usia','Kelompok Usia',
    'Jenjang','Status Kepegawaian','Agama','Status Pernikahan',
    'ONE POGI','ONE POGI Sejak','Asuransi','Instansi Utama','Timestamp'];

  var out = uniq.map(function(r){
    var a = ageOf(r[C.lahir]);
    return [ String(r[C.nama]).trim(), region(r), String(r[2]).trim(), a, ageGroup(a),
      jenjang(r[C.jenjang]), kepeg(r[C.kepeg]), agama(r[C.agama]), nikah(r[C.nikah]),
      pogi(r[C.onepogi]), sejak(r[C.sejak]), asuransi(r[C.asuransi]),
      String(r[C.instansi]).trim(), r[C.ts] ];
  });

  var sh = ss.getSheetByName(CFG.OUT_NAME);
  if (!sh) sh = ss.insertSheet(CFG.OUT_NAME); else sh.clearContents();
  sh.getRange(1,1,1,header.length).setValues([header]).setFontWeight('bold');
  if (out.length) sh.getRange(2,1,out.length,header.length).setValues(out);
  sh.setFrozenRows(1);
}

/** Pasang trigger: tiap submit form + cadangan tiap jam. Jalankan sekali. */
function installCleanTriggers() {
  var ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  // hapus trigger lama untuk fungsi ini
  ScriptApp.getProjectTriggers().forEach(function(t){
    if (t.getHandlerFunction()==='buildDataBersih') ScriptApp.deleteTrigger(t);
  });
  try { ScriptApp.newTrigger('buildDataBersih').forSpreadsheet(ss).onFormSubmit().create(); } catch(e){}
  ScriptApp.newTrigger('buildDataBersih').timeBased().everyHours(1).create();
  buildDataBersih();
}
