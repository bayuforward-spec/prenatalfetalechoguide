/*
 * app.js — Navigasi, render hasil, gating Premium, riwayat.
 */
const App = {
  /* ---------- Init ---------- */
  init() {
    // Tab navigasi
    document.getElementById('tabs').addEventListener('click', (e) => {
      const t = e.target.closest('.tab');
      if (!t) return;
      this.switchTab(t.dataset.tab);
    });
    // Aktivasi otomatis bila pembeli kembali dari checkout Scalev
    const redir = Payment.cekRedirect();
    if (redir) {
      Store.setPro(redir.paket, redir.order);
      Payment.bersihkanURL();
      setTimeout(() => this.toast(`🎉 Pembayaran berhasil! Premium ${redir.paket} aktif.`), 400);
    }

    this.refreshProUI();
    this.renderRiwayat();

    // Default tanggal hari ini untuk kemudahan
    const today = new Date().toISOString().slice(0, 10);
    ['k-hpht','s-haid','s6-haid'].forEach(id => {
      const el = document.getElementById(id); if (el) el.max = today;
    });
  },

  switchTab(name) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
    if (name === 'riwayat') this.renderRiwayat();
  },

  /* ---------- Premium ---------- */
  refreshProUI() {
    const pro = Store.isPro();
    const badge = document.getElementById('proBadge');
    if (pro) {
      badge.textContent = '✓ Premium ' + pro.paket;
      badge.classList.add('is-pro');
      badge.onclick = () => this.toast('Anda sudah Premium 💖');
    }
    // Buka kunci kartu premium
    document.querySelectorAll('[data-premium]').forEach(card => {
      const existing = card.querySelector('.lock-overlay');
      if (pro) { if (existing) existing.remove(); }
      else if (!existing) {
        const ov = document.createElement('div');
        ov.className = 'lock-overlay';
        ov.innerHTML = `<div><div class="lk">🔒</div><p>Fitur Premium</p>
          <button class="btn" style="width:auto;padding:8px 18px;margin-top:6px" onclick="App.openUpgrade()">Buka Akses</button></div>`;
        card.appendChild(ov);
      }
    });
  },
  openUpgrade() { document.getElementById('modalUpgrade').classList.add('show'); },
  closeUpgrade() { document.getElementById('modalUpgrade').classList.remove('show'); },

  // Klik paket -> arahkan ke checkout Scalev (atau aktivasi demo bila belum diset)
  beli(paket) {
    if (Payment.checkout(paket)) {
      this.toast('Mengarahkan ke pembayaran Scalev…');
    } else {
      // Mode demo: belum ada URL Scalev terpasang
      Store.setPro(paket, 'DEMO');
      this.closeUpgrade();
      this.refreshProUI();
      this.renderRiwayat();
      this.toast(`🎉 (Mode demo) Premium ${paket} aktif. Pasang URL Scalev untuk transaksi nyata.`);
    }
  },

  // Aktivasi manual dengan Order ID dari Scalev (cadangan bila redirect gagal)
  aktivasiManual() {
    const sel = document.getElementById('m-paket');
    const order = (document.getElementById('m-order').value || '').trim();
    if (!order) return this.toast('Masukkan Order ID dari Scalev terlebih dahulu.');
    Store.setPro(sel.value, order);
    this.closeUpgrade();
    this.refreshProUI();
    this.renderRiwayat();
    this.toast(`✅ Premium ${sel.value} aktif (Order ${order}).`);
  },

  /* ---------- Util render ---------- */
  show(id, html) {
    const el = document.getElementById(id);
    el.innerHTML = html;
    el.classList.add('show');
  },
  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(this._tt);
    this._tt = setTimeout(() => t.classList.remove('show'), 3200);
  },
  fmt(d) { return Calc.formatTanggalID(d); },

  /* ================= KEHAMILAN ================= */
  runKehamilan() {
    const hpht = document.getElementById('k-hpht').value;
    const siklus = document.getElementById('k-siklus').value;
    const r = Calc.hitungKehamilan(hpht, siklus);
    if (r.error) return this.show('res-kehamilan', `<span class="pill bad">${r.error}</span>`);
    if (!r.valid) return this.show('res-kehamilan',
      `<span class="pill warn">Tanggal di luar rentang kehamilan wajar. Periksa kembali HPHT.</span>`);

    const janin = Calc.infoJanin(r.usiaMinggu);
    this.show('res-kehamilan', `
      <div class="big">${r.usiaTeks}</div>
      <span class="pill info">Trimester ${r.trimester}</span>
      <div style="margin-top:12px">
        <div class="line"><span>Hari Perkiraan Lahir (HPL)</span><b>${this.fmt(r.hpl)}</b></div>
        <div class="line"><span>Perkiraan hari menuju HPL</span><b>${r.sisaKeHpl} hari</b></div>
        <div class="line"><span>Ukuran janin (≈ minggu ${janin.minggu})</span><b>${janin.ukuran}</b></div>
      </div>
      <div class="advice">🌱 <b>Minggu ${r.usiaMinggu}:</b> ${janin.info}</div>`);
    Store.tambahRiwayat('Kalkulator Kehamilan', `${r.usiaTeks} · HPL ${this.fmt(r.hpl)}`);
  },

  runTBJ() {
    const tfu = document.getElementById('k-tfu').value;
    const pap = document.getElementById('k-pap').checked;
    const r = Calc.estimasiBeratJanin(tfu, pap);
    if (r.error) return this.show('res-tbj', `<span class="pill bad">${r.error}</span>`);
    this.show('res-tbj', `
      <div class="big">${r.tbj.toLocaleString('id-ID')} gram</div>
      <div class="line"><span>Rentang estimasi (±10%)</span><b>${r.rentang}</b></div>
      <div class="advice">Estimasi via rumus Johnson bersifat kasar. Konfirmasi berat janin paling akurat melalui USG biometri.</div>`);
    Store.tambahRiwayat('Estimasi Berat Janin', `± ${r.tbj} gram (TFU ${tfu} cm)`);
  },

  /* ================= KESUBURAN ================= */
  runKesuburan() {
    const haid = document.getElementById('s-haid').value;
    const siklus = document.getElementById('s-siklus').value;
    const r = Calc.hitungKesuburan(haid, siklus);
    if (r.error) return this.show('res-kesuburan', `<span class="pill bad">${r.error}</span>`);
    this.show('res-kesuburan', `
      <span class="pill ok">Masa Subur</span>
      <div style="margin-top:10px">
        <div class="line"><span>🌟 Jendela subur</span><b>${this.fmt(r.suburMulai)} – ${this.fmt(r.suburAkhir)}</b></div>
        <div class="line"><span>🥚 Perkiraan ovulasi</span><b>${this.fmt(r.ovulasi)}</b></div>
        <div class="line"><span>🩸 Perkiraan haid berikutnya</span><b>${this.fmt(r.haidBerikut)}</b></div>
      </div>
      <div class="advice">${r.teratur
        ? 'Siklus Anda tergolong teratur. Hubungan di jendela subur meningkatkan peluang kehamilan; hindari bila ingin menunda.'
        : '⚠️ Siklus Anda kurang teratur sehingga prediksi bisa kurang tepat. Pertimbangkan tes ovulasi atau konsultasi dokter.'}</div>`);
    Store.tambahRiwayat('Masa Subur', `Ovulasi ${this.fmt(r.ovulasi)}`);
  },

  runKesuburan6() {
    if (!Store.isPro()) return this.openUpgrade();
    const haid = document.getElementById('s6-haid').value;
    const siklus = Number(document.getElementById('s6-siklus').value) || 28;
    const base = Calc.hitungKesuburan(haid, siklus);
    if (base.error) return this.show('res-kesuburan6', `<span class="pill bad">${base.error}</span>`);
    let rows = '';
    let mulai = haid;
    for (let i = 1; i <= 6; i++) {
      const r = Calc.hitungKesuburan(mulai, siklus);
      rows += `<div class="line"><span>Siklus ${i} · subur</span><b>${this.fmt(r.suburMulai)} – ${this.fmt(r.suburAkhir)}</b></div>`;
      mulai = r.haidBerikut.toISOString().slice(0, 10);
    }
    this.show('res-kesuburan6', `<span class="pill info">Kalender 6 Siklus</span><div style="margin-top:10px">${rows}</div>`);
    Store.tambahRiwayat('Kalender Kesuburan 6 Bulan', `Mulai ${this.fmt(Calc.hitungKesuburan(haid,siklus).suburMulai)}`);
  },

  /* ================= SKRINING ================= */
  runBMI() {
    const r = Calc.hitungBMI(document.getElementById('b-berat').value, document.getElementById('b-tinggi').value);
    if (r.error) return this.show('res-bmi', `<span class="pill bad">${r.error}</span>`);
    this.show('res-bmi', `
      <div class="big">${r.bmi}</div>
      <span class="pill ${r.warna}">${r.kategori}</span>
      <div class="advice">IMT ideal wanita Asia: 18,5–22,9. ${r.warna !== 'ok' ? 'Pertimbangkan pola makan seimbang & aktivitas fisik teratur.' : 'Pertahankan gaya hidup sehat Anda!'}</div>`);
    Store.tambahRiwayat('IMT', `${r.bmi} — ${r.kategori}`);
  },

  runAnemia() {
    const r = Calc.skriningAnemia(document.getElementById('a-hb').value, document.getElementById('a-tri').value);
    if (r.error) return this.show('res-anemia', `<span class="pill bad">${r.error}</span>`);
    this.show('res-anemia', `
      <span class="pill ${r.warna}">${r.kategori}</span>
      <div class="line" style="margin-top:8px"><span>Batas normal trimester ini</span><b>≥ ${r.batas} g/dL</b></div>
      <div class="advice">${r.saran}</div>`);
    Store.tambahRiwayat('Skrining Anemia', `${r.kategori}`);
  },

  runPCOS() {
    const r = Calc.skriningPCOS(
      document.getElementById('p-siklus').checked,
      document.getElementById('p-androgen').checked,
      document.getElementById('p-usg').checked);
    this.show('res-pcos', `<span class="pill ${r.warna}">${r.hasil}</span><div class="advice">${r.saran}</div>`);
    Store.tambahRiwayat('Skrining PCOS', r.hasil);
  },

  runKanker() {
    if (!Store.isPro()) return this.openUpgrade();
    const r = Calc.skriningKanker({
      usia: document.getElementById('c-usia').value,
      seksualDini: document.getElementById('c-dini').checked,
      multiPartner: document.getElementById('c-partner').checked,
      merokok: document.getElementById('c-rokok').checked,
      riwayatKeluarga: document.getElementById('c-keluarga').checked,
      belumPapsmear: document.getElementById('c-pap').checked,
      belumSadari: document.getElementById('c-sadari').checked,
    });
    const fl = r.faktor.length ? `<div class="advice"><b>Faktor teridentifikasi:</b><br>• ${r.faktor.join('<br>• ')}</div>` : '';
    this.show('res-kanker', `
      <div class="big">Skor ${r.skor}</div>
      <span class="pill ${r.warna}">${r.level}</span>
      ${fl}<div class="advice">${r.saran}</div>`);
    Store.tambahRiwayat('Skrining Risiko Kanker', `Skor ${r.skor} — ${r.level}`);
  },

  runPreeklampsia() {
    if (!Store.isPro()) return this.openUpgrade();
    const tinggi = [...document.querySelectorAll('[data-pe-h]')].map(c => c.checked);
    const sedang = [...document.querySelectorAll('[data-pe-m]')].map(c => c.checked);
    const r = Calc.risikoPreeklampsia(tinggi, sedang);
    this.show('res-pe', `
      <span class="pill ${r.warna}">${r.level}</span>
      <div class="line" style="margin-top:8px"><span>Faktor tinggi / sedang</span><b>${r.nTinggi} / ${r.nSedang}</b></div>
      <div class="advice">${r.saran}</div>`);
    Store.tambahRiwayat('Risiko Preeklampsia', r.level);
  },

  /* ================= RIWAYAT ================= */
  renderRiwayat() {
    const box = document.getElementById('riwayat-list');
    if (!box) return;
    const list = Store.riwayat();
    if (!list.length) {
      box.innerHTML = `<p style="color:var(--muted);text-align:center;padding:18px 0">Belum ada riwayat. Hasil perhitungan Anda akan muncul di sini.</p>`;
      return;
    }
    box.innerHTML = list.map(r => {
      const w = new Date(r.waktu);
      return `<div class="line"><span><b>${r.judul}</b><br><small style="color:var(--muted)">${this.fmt(w)} · ${r.ringkasan}</small></span></div>`;
    }).join('');
  },
  exportRiwayat() {
    if (!Store.isPro()) return this.openUpgrade();
    const list = Store.riwayat();
    if (!list.length) return this.toast('Belum ada riwayat untuk diekspor.');
    let txt = 'LAPORAN KESEHATAN — BIDANARA\n';
    txt += 'Dibuat: ' + this.fmt(new Date()) + '\n';
    txt += '='.repeat(46) + '\n\n';
    list.forEach(r => {
      txt += `[${this.fmt(new Date(r.waktu))}] ${r.judul}\n   ${r.ringkasan}\n\n`;
    });
    txt += '-'.repeat(46) + '\nCatatan: Hasil bersifat perkiraan & edukasi, bukan diagnosis medis.\nKonsultasikan dengan dokter/bidan Anda.\n';
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'laporan-bidanara.txt';
    a.click();
    this.toast('Laporan berhasil diunduh ⬇️');
  },
  clearRiwayat() {
    if (!confirm('Hapus semua riwayat? Tindakan ini tidak dapat dibatalkan.')) return;
    Store.hapusRiwayat();
    this.renderRiwayat();
    this.toast('Riwayat dihapus.');
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
