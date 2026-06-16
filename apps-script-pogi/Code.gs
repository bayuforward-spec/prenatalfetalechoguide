/**
 * Dashboard Anggota POGI Lampung — Google Apps Script Web App
 * Membaca sheet "DATA POGI (Responses)" secara live, dedup + agregasi,
 * lalu menyajikan dashboard HTML. Update otomatis tiap halaman dibuka/refresh.
 *
 * Cara pakai: lihat PANDUAN.md. Cukup deploy sebagai Web App.
 */

// ID Google Sheet "DATA POGI (Responses)".
var SHEET_ID = '17BRb0ETBkemGimzTaCqroOdZkftXd7tTFxpcBkaf1xo';
// Kosongkan SHEET_NAME untuk pakai sheet pertama, atau isi nama tab spesifik.
var SHEET_NAME = '';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Dashboard Anggota POGI Lampung')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Dipanggil dari client (google.script.run) untuk ambil data agregat live. */
function getDashboardData() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) throw new Error('Sheet kosong / tidak ada data.');

  // Kolom mengikuti urutan form (0-based).
  var C = { ts:0, nama:1, lahir:3, agama:4, hp:5, email:6, alamat:7,
            kepeg:9, instansi:10, jenjang:11, sip1:17, sip2:18, sip3:19,
            onepogi:21, sejak:22, alasan:23, asuransi:24, nikah:25, anak:27 };

  var rows = values.slice(1).filter(function(r){
    return String(r[C.nama]).trim() !== '' || String(r[C.hp]).trim() !== '';
  });
  var total = rows.length;

  // --- Dedup: kunci utama No HP (digit), fallback email; simpan timestamp terbaru ---
  var byKey = {};
  rows.forEach(function(r){
    var phone = String(r[C.hp]).replace(/\D/g,'');
    var email = String(r[C.email]).trim().toLowerCase();
    var key = phone || email || ('row_' + Math.random());
    var t = new Date(r[C.ts]).getTime() || 0;
    if (!byKey[key] || t > byKey[key]._t) { r._t = t; byKey[key] = r; }
  });
  var uniq = Object.keys(byKey).map(function(k){ return byKey[k]; });
  var unique = uniq.length;

  var today = new Date();
  var thisYear = today.getFullYear();

  // ---------- helpers ----------
  function add(o,k){ o[k]=(o[k]||0)+1; }
  function ageOf(v){
    if (!v) return null;
    var y,m,d;
    if (Object.prototype.toString.call(v)==='[object Date]'){ y=v.getFullYear(); m=v.getMonth()+1; d=v.getDate(); }
    else { var p=String(v).split('/'); if(p.length<3) return null; m=+p[0]; d=+p[1]; y=+p[2]; }
    if (!y || y<1940 || y>thisYear) return null; // invalid
    var a = thisYear - y - ((today.getMonth()+1 < m || (today.getMonth()+1===m && today.getDate()<d)) ? 1:0);
    return a;
  }
  function kepegNorm(v){
    var s=String(v).toLowerCase();
    var pns=s.indexOf('pns')>-1, sw=s.indexOf('swasta')>-1;
    if (pns&&sw) return 'PNS dan SWASTA';
    if (pns) return 'PNS';
    if (sw) return 'SWASTA';
    return 'Lainnya';
  }
  function jenjangNorm(v){
    var s=String(v).toLowerCase();
    if (s.indexOf('subspesialis')>-1 || s.indexOf('subsp')>-1) return 'Subspesialis';
    if (s.indexOf('spesialis obgyn')>-1 || s.indexOf('spesialis')>-1) return 'Spesialis Obgyn';
    return 'S1/profesi dokter';
  }
  function agamaNorm(v){
    var s=String(v).toLowerCase();
    if (s.indexOf('islam')>-1) return 'Islam';
    if (s.indexOf('kristen')>-1||s.indexOf('protestan')>-1||s.indexOf('katolik')>-1) return 'Kristen/Katolik';
    if (s.indexOf('hindu')>-1) return 'Hindu';
    if (s.indexOf('buddha')>-1||s.indexOf('budha')>-1) return 'Buddha';
    return s? v : 'Tidak diisi';
  }
  function nikahNorm(v){
    var s=String(v).toLowerCase();
    if (s.indexOf('belum')>-1||s.indexOf('single')>-1||s.indexOf('singel')>-1) return 'Belum menikah';
    if (s.indexOf('nikah')>-1) return 'Menikah';
    return 'Tidak diisi';
  }
  function pogiNorm(v){
    var s=String(v).trim().toLowerCase();
    if (s.indexOf('ya')===0) return 'Ya';
    if (s.indexOf('tidak')===0) return 'Tidak';
    return 'Tidak diisi';
  }
  function asuransiNorm(v){
    var s=String(v).toLowerCase();
    if (s.indexOf('bumida')>-1||s.indexOf('bunida')>-1) return 'Bumida';
    if (s.indexOf('allianz')>-1||s.indexOf('alianz')>-1||s.indexOf('allians')>-1) return 'Allianz';
    if (s.trim()==='ya'||s.indexOf('ya asuransi')>-1) return 'Ya (tak disebut)';
    return 'Tidak / tidak ada';
  }
  function sinceYear(v){ var m=String(v).match(/20\d\d/); return m?m[0]:'Tahun tidak jelas'; }

  var REGIONS = [
    ['Metro', ['metro']],
    ['Pringsewu', ['pringsewu','gadingrejo','gading rejo']],
    ['Lampung Utara', ['kotabumi','lampung utara','baros']],
    ['Lampung Selatan', ['kalianda','lampung selatan','natar']],
    ['Way Kanan', ['way kanan','baradatu','zapa']],
    ['Tanggamus', ['tanggamus','kota agung','batin mangunang']],
    ['Tulang Bawang', ['tulang bawang','menggala','unit 2']],
    ['Lampung Timur', ['lampung timur','lamtim','sekampung','way jepara']],
    ['Lampung Tengah', ['lampung tengah','bandar jaya','gunung sugih','seputih','candi','terbanggi','demang sepulau']],
    ['Bandar Lampung', ['bandar lampung','bandarlampung','b. lampung','kedaton','kemiling','rajabasa','sukarame','way halim',
       'tanjung karang','tanjungkarang','teluk betung','telukbetung','pahoman','enggal','sukabumi','gunung terang',
       'segala mider','labuhan ratu','sumur putri','kedamaian','citraland','sultan agung','tj. senang','tj senang','korpri']]
  ];
  function regionOf(r){
    var hay = (String(r[C.alamat])+' '+String(r[C.instansi])+' '+String(r[C.sip1])).toLowerCase();
    for (var i=0;i<REGIONS.length;i++){
      var kws=REGIONS[i][1];
      for (var j=0;j<kws.length;j++){ if (hay.indexOf(kws[j])>-1) return REGIONS[i][0]; }
    }
    return 'Lainnya / tidak jelas';
  }

  var HOSP = [
    ['RSUD Abdul Moeloek (RSAM)', ['abdul moeloek','abdul muluk','rsam']],
    ['RS Urip Sumoharjo', ['urip sumoharjo','urip sumohardjo']],
    ['RS Hermina', ['hermina']],
    ['RS Bintang Amin', ['bintang amin']],
    ['RS Belleza', ['belleza']],
    ['RS Mitra Husada Pringsewu', ['mitra husada']],
    ['RSUD Menggala', ['menggala','rsud mgl']],
    ['RSD A. Dadi Tjokrodipo', ['tjokrodipo','tjokro dipo']],
    ['RS Graha Husada', ['graha husada']],
    ['RS Airan Raya', ['airan raya']],
    ['Grup RSIA Mutiara/Restu Bunda', ['mutiara putri','mutiara bunda','restu bunda','mutiara hati']],
    ['RS Surya Asih', ['surya asih']]
  ];

  // ---------- agregasi ----------
  var kepeg={}, jenjang={}, agama={}, nikah={}, asur={}, region={}, pogi={}, since={}, ageb={};
  var ages=[], invalidAge=0, roster=[], reasonsRaw=[];
  var hospCount = HOSP.map(function(h){ return [h[0],0]; });

  uniq.forEach(function(r){
    var kp=kepegNorm(r[C.kepeg]); add(kepeg,kp);
    var jj=jenjangNorm(r[C.jenjang]); add(jenjang,jj);
    add(agama, agamaNorm(r[C.agama]));
    add(nikah, nikahNorm(r[C.nikah]));
    add(asur, asuransiNorm(r[C.asuransi]));
    var rg=regionOf(r); add(region,rg);
    var pg=pogiNorm(r[C.onepogi]); add(pogi,pg);
    if (pg==='Ya') add(since, sinceYear(r[C.sejak]));
    if (pg==='Tidak') reasonsRaw.push(String(r[C.alasan]).toLowerCase());

    var a=ageOf(r[C.lahir]);
    if (a===null) invalidAge++; else { ages.push(a); add(ageb, ageBucket(a)); }

    var hay=(String(r[C.instansi])+' '+String(r[C.sip1])+' '+String(r[C.sip2])+' '+String(r[C.sip3])).toLowerCase();
    HOSP.forEach(function(h,idx){ for(var j=0;j<h[1].length;j++){ if(hay.indexOf(h[1][j])>-1){ hospCount[idx][1]++; break; } } });

    roster.push([String(r[C.nama]), (a===null?'—':a), rg, jj, kp, pg==='Ya']);
  });

  function ageBucket(a){ return a<35?'< 35':a<40?'35–39':a<45?'40–44':a<50?'45–49':a<55?'50–54':'55+'; }

  var avgAge = ages.length? Math.round(ages.reduce(function(s,x){return s+x;},0)/ages.length*10)/10 : 0;

  var REASONS=[
    ['Belum / belum sempat mendaftar',['belum','belum sempat','belum mendaftar','belum menelaah','kurang paham','males']],
    ['Biaya mahal / akumulasi',['mahal','tinggi','double','akumulasi']],
    ['Kesulitan / ribet proses',['kesulitan','kurang paham','ribet']],
    ['Sudah punya asuransi lain',['masih mengikuti asuransi','sudah ikut asuransi','asuransi lain']],
    ['Faktor usia',['usia']]
  ];
  var reasons = REASONS.map(function(rs){
    var c=0; reasonsRaw.forEach(function(t){ for(var j=0;j<rs[1].length;j++){ if(t.indexOf(rs[1][j])>-1){c++;break;} } });
    return [rs[0],c];
  }).filter(function(x){return x[1]>0;});

  // ---------- kualitas data ----------
  var dupGroups={};
  rows.forEach(function(r){
    var phone=String(r[C.hp]).replace(/\D/g,'');
    if(!phone) return;
    (dupGroups[phone]=dupGroups[phone]||[]).push(String(r[C.nama])+' ('+fmtTs(r[C.ts])+')');
  });
  var duplicates=[];
  Object.keys(dupGroups).forEach(function(k){ if(dupGroups[k].length>1) duplicates.push(dupGroups[k].join('  ↔  ')); });

  var shifted=[], invalidBirth=[], emptyInstansi=[], s1only=[];
  rows.forEach(function(r){
    var nm=String(r[C.nama]), em=String(r[C.email]);
    if (nm.indexOf('@')>-1 || (em && em.indexOf('@')===-1)) shifted.push(nm+' — '+fmtTs(r[C.ts]));
  });
  uniq.forEach(function(r){
    if (ageOf(r[C.lahir])===null && String(r[C.lahir]).trim()!=='') invalidBirth.push(String(r[C.nama])+' (lahir: '+r[C.lahir]+')');
    if (String(r[C.instansi]).trim()==='' ) emptyInstansi.push(String(r[C.nama]));
    if (jenjangNorm(r[C.jenjang])==='S1/profesi dokter') s1only.push(String(r[C.nama]));
  });

  // pasangan / alamat sama (info, bukan error)
  var addrGroups={};
  uniq.forEach(function(r){
    var a=String(r[C.alamat]).trim().toLowerCase().replace(/\s+/g,' ');
    if(a.length<15) return;
    (addrGroups[a]=addrGroups[a]||[]).push(String(r[C.nama]));
  });
  var couples=[];
  Object.keys(addrGroups).forEach(function(k){
    var names=addrGroups[k]; if(names.length>1) couples.push(names.join(' & '));
  });

  function fmtTs(v){ try{ return Utilities.formatDate(new Date(v), Session.getScriptTimeZone(), 'd/M HH:mm'); }catch(e){ return String(v); } }

  // urutan tetap untuk beberapa chart
  function ordered(obj, order){ return order.filter(function(k){return obj[k]!==undefined;}).map(function(k){return [k,obj[k]];}); }

  return {
    total: total, unique: unique,
    ya: pogi['Ya']||0, tidak: pogi['Tidak']||0,
    pctYa: unique? Math.round((pogi['Ya']||0)/unique*100):0,
    subspesialis: jenjang['Subspesialis']||0,
    avgAge: avgAge, minAge: ages.length?Math.min.apply(null,ages):0, maxAge: ages.length?Math.max.apply(null,ages):0,
    invalidAge: invalidAge,
    region: Object.keys(region).map(function(k){return [k,region[k]];}).sort(function(a,b){return b[1]-a[1];}),
    pogi: pogi,
    ageBuckets: ordered(ageb,['< 35','35–39','40–44','45–49','50–54','55+']),
    since: ordered(since,['2022','2023','2024','2025','2026','Tahun tidak jelas']),
    hosp: hospCount.filter(function(h){return h[1]>0;}).sort(function(a,b){return b[1]-a[1];}),
    kepeg: kepeg, jenjang: jenjang, agama: agama, nikah: nikah, asuransi: asur,
    reasons: reasons,
    roster: roster.sort(function(a,b){ return (a[2]+a[0]).localeCompare(b[2]+b[0]); }),
    quality: { duplicates:duplicates, shifted:dedupeArr(shifted), invalidBirth:invalidBirth,
               emptyInstansi:emptyInstansi, s1only:s1only, couples:couples },
    updated: Utilities.formatDate(today, Session.getScriptTimeZone(), 'd MMM yyyy HH:mm')
  };
}

function dedupeArr(a){ var s={},o=[]; a.forEach(function(x){ if(!s[x]){s[x]=1;o.push(x);} }); return o; }
