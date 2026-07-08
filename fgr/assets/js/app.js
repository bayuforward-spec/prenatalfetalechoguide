/*
 * app.js — Antarmuka FetoGuard: input, render hasil, riwayat, ekspor.
 */
const App = {
  standar: 'hadlock', // standar persentil EFW (Hadlock / INTERGROWTH)
  editId: null,
  lastVisit: null,

  gantiStandar(v) {
    this.standar = v;
    if (this.lastVisit) {
      const r = Engine.nilaiKunjungan(this.lastVisit, { edd: this.edd(), standar: this.standar });
      this.renderHasil(r, this.lastVisit);
    }
    this.renderRiwayat();
    this.toast('Standar persentil: ' + (v === 'intergrowth' ? 'INTERGROWTH-21st' : 'Hadlock'));
  },

  init() {
    const today = new Date().toISOString().slice(0, 10);
    const vtgl = document.getElementById('v-tgl');
    vtgl.value = today;

    // toggle metode penanggalan
    document.querySelectorAll('input[name="metode"]').forEach(r =>
      r.addEventListener('change', () => this.toggleMetode()));
    // hitung ulang UK kunjungan saat tanggal / penanggalan berubah
    vtgl.addEventListener('change', () => this.refreshGA());
    ['p-hpht', 'p-siklus', 'p-usgtgl', 'p-usgw', 'p-usgd'].forEach(id =>
      document.getElementById(id).addEventListener('change', () => { this.refreshGA(); this.redateNote(); }));

    // bagian "aliran kualitatif" buka/tutup otomatis sesuai UA-PI
    ['v-ua', 'v-ovr_ua'].forEach(id => {
      const e = document.getElementById(id);
      if (e) e.addEventListener('input', () => this.checkQual());
    });
    const qb = document.getElementById('qual-body');
    if (qb) qb.addEventListener('change', () => this.checkQual());

    this.muatPasien();
    this.toggleMetode();
    this.refreshGA();
    this.renderRiwayat();
    this.checkQual();
  },

  /* ---------- aliran kualitatif: buka/tutup ---------- */
  qualManual: false,
  setQual(open) {
    document.getElementById('qual-body').style.display = open ? 'block' : 'none';
    const t = document.getElementById('qual-toggle');
    t.textContent = open ? 'tutup ▴' : 'opsional ▾';
    t.className = 'tag';
  },
  toggleQual() {
    const open = document.getElementById('qual-body').style.display === 'none';
    this.qualManual = true;
    this.setQual(open);
  },
  // true bila ada isian (bukan "belum dinilai") di bagian kualitatif
  qualTerisi() {
    return this.radio('edf') !== 'unknown' || this.radio('dvwave') !== 'unknown' ||
           this.radio('aorta') !== 'unknown' || this.radio('ctg') !== 'unknown' || this.chk('v-decel');
  },
  checkQual() {
    const hint = document.getElementById('qual-hint');
    const edd = this.edd();
    const v = this.kunjunganDariForm();
    let berisiko = false, lengkap = true;
    if (edd && v.tanggal) {
      const r = Engine.nilaiKunjungan(v, { edd, standar: this.standar });
      if (r.ga != null && r.wellbeing) { berisiko = r.wellbeing.berisiko; lengkap = r.wellbeing.lengkap; }
    }
    if (berisiko && !lengkap) {
      this.setQual(true);
      const t = document.getElementById('qual-toggle');
      t.textContent = '⚠ WAJIB diisi ▴'; t.className = 'tag bad';
      hint.innerHTML = `<div class="advice bad" style="margin:0 0 6px">⚠️ <b>Ada tanda risiko (FGR / EFW &lt; P10 / Doppler abnormal) tetapi kesejahteraan janin belum dinilai.</b>
        Wajib nilai <b>EDF, duktus venosus & CTG</b> — penentu utama stadium & risiko IUFD. Tanpa ini, hasil <b>tidak menyingkirkan</b> risiko tinggi.</div>`;
    } else {
      hint.innerHTML = '';
      if (this.qualTerisi() || this.qualManual) this.setQual(true);
      else this.setQual(false);
    }
  },

  /* ---------- util ---------- */
  val(id) { const e = document.getElementById(id); return e ? e.value.trim() : ''; },
  num(id) { const v = this.val(id); return v === '' ? null : Number(v); },
  chk(id) { const e = document.getElementById(id); return e && e.checked; },
  radio(name) { const e = document.querySelector(`input[name="${name}"]:checked`); return e ? e.value : null; },
  fmt(d) { return Engine.fmtID(d); },
  toast(m) {
    const t = document.getElementById('toast');
    t.textContent = m; t.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 3200);
  },

  toggleMetode() {
    const m = this.radio('metode');
    document.getElementById('blok-hpht').style.display = m === 'usg' ? 'none' : 'block';
    document.getElementById('blok-usg').style.display = m === 'usg' ? 'block' : 'none';
  },

  /* ---------- data ibu ---------- */
  pasienDariForm() {
    const usgw = this.num('p-usgw'), usgd = this.num('p-usgd') || 0;
    return {
      nama: this.val('p-nama'), rm: this.val('p-rm'), usia: this.val('p-usia'), gpa: this.val('p-gpa'),
      metode: this.radio('metode'),
      hpht: this.val('p-hpht'), siklus: this.num('p-siklus') || 28,
      usgTanggal: this.val('p-usgtgl'), usgGAhari: usgw != null ? usgw * 7 + usgd : null,
      risk: { pe: this.chk('r-pe'), fgr: this.chk('r-fgr'), rokok: this.chk('r-rokok'), lain: this.chk('r-lain') },
    };
  },
  edd() { return Engine.hitungEDD(this.pasienDariForm()); },

  simpanPasien() {
    const p = this.pasienDariForm();
    if (!this.edd()) return this.toast('Lengkapi HPHT atau data USG dating dulu.');
    Store.setPasien(p);
    this.updateBar();
    this.refreshGA();
    this.toast('✅ Data ibu tersimpan.');
  },

  muatPasien() {
    const p = Store.pasien();
    if (!p || !Object.keys(p).length) return;
    const set = (id, v) => { const e = document.getElementById(id); if (e && v != null) e.value = v; };
    set('p-nama', p.nama); set('p-rm', p.rm); set('p-usia', p.usia); set('p-gpa', p.gpa);
    set('p-hpht', p.hpht); set('p-siklus', p.siklus);
    set('p-usgtgl', p.usgTanggal);
    if (p.usgGAhari != null) { set('p-usgw', Math.floor(p.usgGAhari / 7)); set('p-usgd', p.usgGAhari % 7); }
    if (p.metode) { const r = document.querySelector(`input[name="metode"][value="${p.metode}"]`); if (r) r.checked = true; }
    if (p.risk) { ['pe', 'fgr', 'rokok', 'lain'].forEach(k => { const e = document.getElementById('r-' + k); if (e) e.checked = !!p.risk[k]; }); }
    this.updateBar();
  },

  updateBar() {
    const p = this.pasienDariForm();
    const edd = this.edd();
    document.getElementById('pbar-nama').textContent =
      (p.nama || 'Pasien') + (p.rm ? ` · RM ${p.rm}` : '') + (p.gpa ? ` · ${p.gpa}` : '');
    if (edd) {
      const gaNow = Engine.gaPada(edd, new Date().toISOString().slice(0, 10));
      document.getElementById('pbar-ga').textContent = Engine.gaText(gaNow);
      document.getElementById('pbar-hpl').textContent = 'HPL ' + this.fmt(edd);
      document.getElementById('pbar-info').textContent =
        `${p.metode === 'usg' ? 'Penanggalan USG' : 'Penanggalan HPHT'} · ${p.usia ? p.usia + ' th' : ''}`;
    } else {
      document.getElementById('pbar-ga').textContent = '—';
      document.getElementById('pbar-hpl').textContent = 'HPL —';
    }
  },

  refreshGA() {
    const edd = this.edd();
    const tgl = this.val('v-tgl');
    const out = document.getElementById('v-ga');
    if (edd && tgl) out.value = Engine.gaText(Engine.gaPada(edd, tgl));
    else out.value = '';
    this.updateBar();
    this.checkQual();
  },

  redateNote() {
    const box = document.getElementById('redate-note');
    const p = this.pasienDariForm();
    if (p.metode === 'usg' || !p.hpht || !p.usgTanggal || p.usgGAhari == null) { box.innerHTML = ''; return; }
    const eddHpht = Engine.hitungEDD({ metode: 'hpht', hpht: p.hpht, siklus: p.siklus });
    const r = Engine.cekRedating(eddHpht, p.usgTanggal, p.usgGAhari);
    if (!r) { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="advice ${r.redate ? 'warn' : ''}" style="margin-top:10px">
      Selisih HPL HPHT vs USG: <b>${r.selisih} hari</b> (ambang ${r.ambang} hari).
      ${r.redate ? '➜ <b>Disarankan redating ke USG</b> (selisih melebihi ambang ACOG/ISUOG).' : '➜ Pertahankan HPHT (sesuai ambang).'}</div>`;
  },

  /* ---------- kunjungan ---------- */
  kunjunganDariForm() {
    return {
      id: this.editId, tanggal: this.val('v-tgl'),
      td: this.val('v-td'), tfu: this.num('v-tfu'),
      bpd: this.num('v-bpd'), hc: this.num('v-hc'), ac: this.num('v-ac'), fl: this.num('v-fl'),
      ac10: this.chk('v-ac10'), ac3: this.chk('v-ac3'), crossing: this.chk('v-crossing') ? 'on' : '',
      afi: this.num('v-afi'), dvp: this.num('v-dvp'),
      uaPi: this.num('v-ua'), mcaPi: this.num('v-mca'), utaPi: this.num('v-uta'), dvPi: this.num('v-dv'),
      ovr_ua: this.chk('v-ovr_ua') ? 'on' : '', ovr_mca: this.chk('v-ovr_mca') ? 'on' : '',
      ovr_uta: this.chk('v-ovr_uta') ? 'on' : '', ovr_dv: this.chk('v-ovr_dv') ? 'on' : '',
      edf: this.radio('edf'), dvWave: this.radio('dvwave'), aorta: this.radio('aorta'),
      ctg: this.radio('ctg'), decel: this.chk('v-decel') ? 'on' : '',
    };
  },

  nilaiKunjungan() {
    const edd = this.edd();
    if (!edd) return this.toast('Isi & simpan data ibu (penanggalan) lebih dulu.');
    const v = this.kunjunganDariForm();
    if (!v.tanggal) return this.toast('Tanggal pemeriksaan wajib diisi.');
    const r = Engine.nilaiKunjungan(v, { edd, standar: this.standar });
    if (r.ga == null) return this.toast('Usia kehamilan tidak valid pada tanggal tersebut.');
    this.lastVisit = v;
    this.renderHasil(r, v);
    // simpan
    if (!Store.pasien() || !Object.keys(Store.pasien()).length) Store.setPasien(this.pasienDariForm());
    const id = Store.tambahKunjungan(v);
    this.editId = id;
    this.renderRiwayat();
    this.toast('✅ Kunjungan dinilai & tersimpan.');
  },

  formBaru() {
    this.editId = null;
    ['v-td', 'v-tfu', 'v-bpd', 'v-hc', 'v-ac', 'v-fl', 'v-afi', 'v-dvp', 'v-ua', 'v-mca', 'v-uta', 'v-dv'].forEach(id => document.getElementById(id).value = '');
    ['v-ac10', 'v-ac3', 'v-crossing', 'v-ovr_ua', 'v-ovr_mca', 'v-ovr_uta', 'v-ovr_dv', 'v-decel'].forEach(id => document.getElementById(id).checked = false);
    ['edf', 'dvwave', 'aorta', 'ctg'].forEach(n => { const e = document.querySelector(`input[name="${n}"]`); if (e) e.checked = true; });
    document.getElementById('v-tgl').value = new Date().toISOString().slice(0, 10);
    this.qualManual = false;
    this.refreshGA();
    this.toast('Form dikosongkan untuk kunjungan baru.');
  },

  muatKunjungan(id) {
    const v = Store.kunjungan().find(x => x.id === id);
    if (!v) return;
    this.editId = id;
    const set = (i, val) => { const e = document.getElementById(i); if (e) e.value = (val == null ? '' : val); };
    set('v-tgl', v.tanggal); set('v-td', v.td); set('v-tfu', v.tfu);
    set('v-bpd', v.bpd); set('v-hc', v.hc); set('v-ac', v.ac); set('v-fl', v.fl);
    set('v-afi', v.afi); set('v-dvp', v.dvp);
    set('v-ua', v.uaPi); set('v-mca', v.mcaPi); set('v-uta', v.utaPi); set('v-dv', v.dvPi);
    const ck = (i, b) => { const e = document.getElementById(i); if (e) e.checked = !!b; };
    ck('v-ac10', v.ac10); ck('v-ac3', v.ac3); ck('v-crossing', v.crossing === 'on');
    ck('v-ovr_ua', v.ovr_ua === 'on'); ck('v-ovr_mca', v.ovr_mca === 'on');
    ck('v-ovr_uta', v.ovr_uta === 'on'); ck('v-ovr_dv', v.ovr_dv === 'on');
    ck('v-decel', v.decel === 'on');
    const rad = (n, val) => { const e = document.querySelector(`input[name="${n}"][value="${val}"]`); if (e) e.checked = true; };
    rad('edf', v.edf || 'unknown'); rad('dvwave', v.dvWave || 'unknown');
    rad('aorta', v.aorta || 'unknown'); rad('ctg', v.ctg || 'unknown');
    this.refreshGA();
    this.checkQual();
    this.lastVisit = v;
    const r = Engine.nilaiKunjungan(v, { edd: this.edd(), standar: this.standar });
    this.renderHasil(r, v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  hapusKunjungan(id) {
    if (!confirm('Hapus kunjungan ini?')) return;
    Store.hapusKunjungan(id);
    if (this.editId === id) this.editId = null;
    this.renderRiwayat();
    this.toast('Kunjungan dihapus.');
  },

  /* ---------- render hasil ---------- */
  cell(d) {
    if (!d) return '<span style="color:var(--soft)">—</span>';
    const cls = d.abnormal ? 'cflag bad' : 'cflag ok';
    const tag = d.cakupan === 'est' ? ' <span class="tag warn">est</span>' : '';
    return `<b class="${cls}">${(+d.nilai).toFixed(2)}</b> <span style="color:var(--soft);font-size:.78rem">(P50≈${d.p50}, ${d.arah} @ ${d.ambang})${tag}</span>`;
  },

  renderHasil(r, v) {
    document.getElementById('hasil-kosong').style.display = 'none';
    const box = document.getElementById('hasil');
    box.classList.add('show');

    // EFW
    let efwHtml = '<span style="color:var(--soft)">Biometri belum lengkap</span>';
    if (r.efw) {
      const p = r.efwPct;
      const warna = p.pct < 3 ? 'bad' : (p.pct < 10 ? 'warn' : 'ok');
      efwHtml = `<div class="big">${r.efw.toLocaleString('id-ID')} g
        <span class="pill ${warna}" style="font-size:.8rem;vertical-align:middle">P${p.pct.toFixed(0)}</span></div>
        <div class="line"><span>Rumus</span><b>${r.efwRumus}</b></div>
        <div class="line"><span>P50 / P10 / P3 (≈ UK ini)</span><b>${p.median} / ${p.p10} / ${p.p3} g</b></div>`;
    }

    // Doppler
    const cpr = r.cpr ? `<div class="line"><span>CPR (MCA/UA)</span>${this.cell(r.cpr)}</div>` : '';
    const dopHtml = `
      <div class="line"><span>UA-PI</span>${this.cell(r.ua)}</div>
      <div class="line"><span>MCA-PI</span>${this.cell(r.mca)}</div>
      ${cpr}
      <div class="line"><span>UtA-PI</span>${this.cell(r.uta)}</div>
      <div class="line"><span>DV-PI</span>${this.cell(r.dv)}</div>
      <div class="line"><span>EDF / DV a-wave</span><b>${this.labelEDF(v.edf)} / ${v.dvWave === 'reversed' ? 'absent-reversed' : 'positif'}</b></div>`;

    // Diagnosis & staging
    const dx = r.dx, st = r.staging, iu = r.iufd;
    const dxTags = dx.alasan.length ? `<div style="margin-top:8px">${dx.alasan.map(a => `<span class="tag">${a}</span>`).join('')}</div>` : '';

    const st0 = st.stage === 0;
    const banner = `<div class="stage-banner ${st.warna}">
        <div class="st">${st0 ? 'Tanpa staging FGR' : 'STADIUM ' + this.roman(st.stage)} — ${st.label}</div>
        <div class="stsub">${st.kriteria.length ? st.kriteria.join(' · ') : 'Tidak ada kriteria insufisiensi plasenta terpenuhi'}</div>
      </div>`;

    // peringatan bila UK sudah melewati rekomendasi lahir
    let lahirNote = '';
    const lahirMin = this.mingguRekom(st.lahir);
    if (lahirMin != null && r.gw >= lahirMin && st.stage >= 1)
      lahirNote = `<div class="advice bad">⏰ UK saat ini (${r.gw.toFixed(1)} mg) sudah mencapai/melewati ambang persalinan stadium ini — <b>pertimbangkan terminasi sekarang</b> sesuai kondisi.</div>`;

    const takLengkap = r.wellbeing && r.wellbeing.berisiko && !r.wellbeing.lengkap;
    const safety = takLengkap ? `<div class="stage-banner crit" style="margin-bottom:12px">
        <div class="st">⚠️ PENILAIAN BELUM LENGKAP — jangan dijadikan dasar menunda persalinan</div>
        <div class="stsub">Ada tanda risiko, tetapi <b>EDF / duktus venosus / CTG belum dinilai</b>.
        Stadium & risiko IUFD sebenarnya bisa <b>lebih tinggi</b> dari yang tampil di bawah.
        Lengkapi Doppler vena & CTG, atau rujuk.</div></div>` : '';

    box.innerHTML = safety + `
      <span class="pill ${dx.warna}">${dx.dx}</span> <span class="vmeta" style="margin-left:6px">UK ${r.gaText}</span>
      ${dxTags}
      <h4 style="margin-top:14px">Estimasi Berat Janin</h4>${efwHtml}
      <h4>Doppler</h4>${dopHtml}
      <h4>Staging & Manajemen (Barcelona)</h4>
      ${banner}
      <div class="line"><span>Surveilans</span><b>${st.monitor}</b></div>
      <div class="line"><span>Rekomendasi persalinan</span><b>${st.lahir}</b></div>
      <div class="line"><span>Cara persalinan</span><b>${st.cara}</b></div>
      ${st.stage >= 1 ? '<div class="advice">💊 Steroid bila &lt; 34 mg · MgSO4 neuroproteksi bila &lt; 32 mg · rujuk pusat dengan NICU bila stadium II–IV.</div>' : ''}
      ${lahirNote}
      <h4>Stratifikasi Risiko IUFD</h4>
      <div class="stage-banner ${iu.warna}"><div class="st" style="font-size:1.05rem">${iu.tier}</div>
        <div class="stsub">${iu.or}</div></div>
      <div class="advice ${iu.warna === 'crit' || iu.warna === 'bad' ? 'bad' : ''}">${iu.ket}${iu.catatanGA ? '<br><br>⚠️ ' + iu.catatanGA : ''}</div>`;
  },

  labelEDF(e) { return e === 'aedf' ? 'AEDF (absent)' : e === 'redf' ? 'REDF (reversed)' : 'ada (normal)'; },
  roman(n) { return ['0', 'I', 'II', 'III', 'IV'][n] || n; },
  mingguRekom(txt) { const m = String(txt).match(/(\d{2})/); return m ? Number(m[1]) : null; },

  /* ---------- riwayat & tren ---------- */
  renderRiwayat() {
    const box = document.getElementById('riwayat');
    const edd = this.edd();
    const list = Store.kunjungan();
    if (!list.length) { box.innerHTML = `<p style="color:var(--soft);text-align:center;padding:14px 0">Belum ada kunjungan tersimpan.</p>`; return; }

    let rows = '';
    const items = list.map(v => {
      const r = edd ? Engine.nilaiKunjungan(v, { edd, standar: this.standar }) : null;
      return { v, r };
    });

    // tabel tren
    rows = items.map(({ v, r }) => {
      if (!r) return '';
      const efw = r.efw ? r.efw : '—';
      const p = r.efwPct ? 'P' + r.efwPct.pct.toFixed(0) : '—';
      const ua = r.ua ? (+r.ua.nilai).toFixed(2) : '—';
      const mca = r.mca ? (+r.mca.nilai).toFixed(2) : '—';
      const cpr = r.cpr ? r.cpr.nilai.toFixed(2) : '—';
      const stg = r.staging.stage ? this.roman(r.staging.stage) : '–';
      const fl = r.staging.stage >= 2 ? ' class="flag"' : '';
      return `<tr><td>${Engine.gaText(r.ga)}</td><td>${efw}</td><td>${p}</td><td>${ua}</td><td>${mca}</td><td>${cpr}</td><td${fl}>${stg}</td></tr>`;
    }).join('');

    const tabel = `<table class="trend"><thead><tr>
      <th>UK</th><th>EFW(g)</th><th>%ile</th><th>UA</th><th>MCA</th><th>CPR</th><th>Stg</th>
      </tr></thead><tbody>${rows}</tbody></table>`;

    const kartu = items.slice().reverse().map(({ v, r }) => {
      const dx = r ? r.dx.dx : '';
      const warna = r ? r.dx.warna : 'info';
      return `<div class="visit">
        <div class="vh"><b>${this.fmt(Engine.parseDate(v.tanggal))} · ${r ? Engine.gaText(r.ga) : ''}</b>
          <span><span class="del" onclick="App.muatKunjungan('${v.id}')">✎ buka</span> &nbsp; <span class="del" onclick="App.hapusKunjungan('${v.id}')">🗑</span></span></div>
        <div class="vmeta"><span class="pill ${warna}" style="font-size:.72rem">${dx}</span>
          ${r && r.staging.stage ? ' · Stadium ' + this.roman(r.staging.stage) : ''}</div>
      </div>`;
    }).join('');

    const chart = this.grafikTren(items);
    box.innerHTML = chart + tabel + '<h4>Daftar kunjungan</h4>' + kartu;
  },

  /* Grafik tren persentil EFW (SVG, tanpa pustaka). x=UK, y=persentil 0–100. */
  grafikTren(items) {
    const pts = items.filter(o => o.r && o.r.efwPct).map(o => ({
      gw: o.r.gw, p: Math.max(0, Math.min(100, o.r.efwPct.pct)), stage: o.r.staging.stage,
    }));
    if (pts.length < 1) return '';
    const W = 320, H = 150, ml = 30, mr = 8, mt = 10, mb = 22;
    const gws = pts.map(p => p.gw);
    let x0 = Math.min(...gws) - 1, x1 = Math.max(...gws) + 1;
    if (x1 - x0 < 4) { x0 -= 2; x1 += 2; }
    const X = gw => ml + (gw - x0) / (x1 - x0) * (W - ml - mr);
    const Y = p => mt + (1 - p / 100) * (H - mt - mb);
    const warna = { 0: '#22c55e', 1: '#38bdf8', 2: '#f59e0b', 3: '#ef4444', 4: '#dc2626' };

    // garis bantu P10 & P3
    const band = (p, col, lbl) => `<line x1="${ml}" y1="${Y(p)}" x2="${W - mr}" y2="${Y(p)}" stroke="${col}" stroke-width="1" stroke-dasharray="4 3" opacity=".6"/>
      <text x="${W - mr}" y="${Y(p) - 2}" fill="${col}" font-size="9" text-anchor="end">P${p}</text>`;
    // sumbu x label
    const xl = `<text x="${ml}" y="${H - 6}" fill="#7d93a8" font-size="9">${x0.toFixed(0)} mg</text>
      <text x="${W - mr}" y="${H - 6}" fill="#7d93a8" font-size="9" text-anchor="end">${x1.toFixed(0)} mg</text>`;
    // garis & titik
    let path = '', dots = '';
    pts.forEach((p, i) => {
      path += (i === 0 ? 'M' : 'L') + X(p.gw).toFixed(1) + ' ' + Y(p.p).toFixed(1) + ' ';
      dots += `<circle cx="${X(p.gw).toFixed(1)}" cy="${Y(p.p).toFixed(1)}" r="4" fill="${warna[p.stage] || '#1fb6a6'}" stroke="#0f1720" stroke-width="1.5"/>
        <text x="${X(p.gw).toFixed(1)}" y="${(Y(p.p) - 7).toFixed(1)}" fill="#e8eef4" font-size="9" text-anchor="middle">P${p.p.toFixed(0)}</text>`;
    });
    return `<h4>Tren persentil EFW</h4>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;background:var(--panel2);border:1px solid var(--line);border-radius:10px">
        ${band(10, '#f59e0b')}${band(3, '#ef4444')}
        <path d="${path}" fill="none" stroke="#1fb6a6" stroke-width="2"/>
        ${dots}${xl}
        <text x="4" y="${mt + 6}" fill="#7d93a8" font-size="9">100</text>
        <text x="10" y="${H - mb}" fill="#7d93a8" font-size="9">0</text>
      </svg>
      <p class="hint">Titik = kunjungan; warna sesuai stadium (hijau→merah). Garis putus = ambang P10 & P3.</p>`;
  },

  /* ---------- ekspor & reset ---------- */
  exportLaporan() {
    const edd = this.edd();
    const p = Store.pasien();
    const list = Store.kunjungan();
    if (!list.length) return this.toast('Belum ada kunjungan untuk diekspor.');
    let t = 'LAPORAN SURVEILANS FGR/IUGR — FetoGuard\n' + '='.repeat(52) + '\n';
    t += `Pasien : ${p.nama || '-'}   RM: ${p.rm || '-'}   ${p.gpa || ''}\n`;
    t += `Usia ibu: ${p.usia || '-'} th   Penanggalan: ${p.metode === 'usg' ? 'USG' : 'HPHT'}\n`;
    t += `HPL    : ${edd ? this.fmt(edd) : '-'}\n`;
    t += `Dibuat : ${this.fmt(new Date())}\n` + '='.repeat(52) + '\n\n';
    list.forEach(v => {
      const r = Engine.nilaiKunjungan(v, { edd, standar: this.standar });
      t += `[${this.fmt(Engine.parseDate(v.tanggal))}] UK ${Engine.gaText(r.ga)}\n`;
      if (r.efw) t += `  EFW ${r.efw} g (P${r.efwPct.pct.toFixed(0)}, ${r.efwRumus})\n`;
      t += `  Doppler: UA-PI ${v.uaPi ?? '-'} | MCA-PI ${v.mcaPi ?? '-'} | CPR ${r.cpr ? r.cpr.nilai.toFixed(2) : '-'} | UtA-PI ${v.utaPi ?? '-'} | DV-PI ${v.dvPi ?? '-'}\n`;
      t += `  EDF: ${this.labelEDF(v.edf)} | DV a-wave: ${v.dvWave === 'reversed' ? 'absent/reversed' : 'positif'} | CTG: ${v.ctg}\n`;
      t += `  Dx: ${r.dx.dx}\n`;
      if (r.wellbeing && r.wellbeing.berisiko && !r.wellbeing.lengkap)
        t += `  ⚠️ PENILAIAN BELUM LENGKAP: EDF/DV/CTG belum dinilai — stadium & risiko IUFD bisa lebih tinggi.\n`;
      t += `  Staging: ${r.staging.stage ? 'Stadium ' + this.roman(r.staging.stage) : 'tanpa staging'} — ${r.staging.label}\n`;
      t += `  Surveilans: ${r.staging.monitor} | Persalinan: ${r.staging.lahir} (${r.staging.cara})\n`;
      t += `  Risiko IUFD: ${r.iufd.tier} — ${r.iufd.or}\n\n`;
    });
    t += '-'.repeat(52) + '\nAcuan: Delphi 2016 · Barcelona (Figueras 2014) · ISUOG/SMFM 2020 · Caradeux 2018.\n';
    t += 'Alat bantu keputusan; bukan pengganti penilaian klinis.\n';
    const blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fetoguard-${(p.nama || 'pasien').replace(/\s+/g, '_')}.txt`;
    a.click();
    this.toast('Laporan diunduh ⬇️');
  },

  resetSemua() {
    if (!confirm('Hapus SEMUA data pasien & kunjungan dari perangkat ini?')) return;
    Store.reset();
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
