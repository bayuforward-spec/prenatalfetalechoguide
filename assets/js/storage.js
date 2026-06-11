/*
 * storage.js — Status Premium & riwayat hasil (localStorage, tanpa backend).
 *
 * Catatan: Gating Premium di sini bersifat sisi-klien untuk demo produk.
 * Untuk produksi/komersial, validasi langganan harus dilakukan di server
 * (mis. via penyedia pembayaran + verifikasi lisensi).
 */
const Store = {
  KEY_PRO: 'bidanara_pro',
  KEY_HIST: 'bidanara_riwayat',

  isPro() { return localStorage.getItem(this.KEY_PRO) ? JSON.parse(localStorage.getItem(this.KEY_PRO)) : null; },
  setPro(paket, order) {
    const data = { paket, order: order || '-', aktifSejak: new Date().toISOString() };
    localStorage.setItem(this.KEY_PRO, JSON.stringify(data));
    return data;
  },

  riwayat() {
    try { return JSON.parse(localStorage.getItem(this.KEY_HIST)) || []; }
    catch { return []; }
  },
  tambahRiwayat(judul, ringkasan) {
    const list = this.riwayat();
    list.unshift({ judul, ringkasan, waktu: new Date().toISOString() });
    localStorage.setItem(this.KEY_HIST, JSON.stringify(list.slice(0, 100)));
  },
  hapusRiwayat() { localStorage.removeItem(this.KEY_HIST); },
};
