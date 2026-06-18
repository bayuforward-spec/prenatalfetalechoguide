/*
 * store.js — Penyimpanan pasien & kunjungan (localStorage, sisi-klien).
 * Struktur: { pasien:{...}, kunjungan:[{...}] }.
 * Tidak ada data terkirim ke server — privasi pasien tetap di perangkat.
 */
(function () {
'use strict';
const KEY = 'fetoguard.v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { pasien: {}, kunjungan: [] }; }
  catch { return { pasien: {}, kunjungan: [] }; }
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

const Store = {
  db: load(),
  _commit() { save(this.db); },

  pasien() { return this.db.pasien; },
  setPasien(p) { this.db.pasien = p; this._commit(); },

  kunjungan() { return this.db.kunjungan.slice().sort((a, b) => (a.tanggal < b.tanggal ? -1 : 1)); },
  tambahKunjungan(v) {
    v.id = v.id || ('k' + Date.now());
    const i = this.db.kunjungan.findIndex(x => x.id === v.id);
    if (i >= 0) this.db.kunjungan[i] = v; else this.db.kunjungan.push(v);
    this._commit();
    return v.id;
  },
  hapusKunjungan(id) {
    this.db.kunjungan = this.db.kunjungan.filter(x => x.id !== id);
    this._commit();
  },
  reset() { this.db = { pasien: {}, kunjungan: [] }; this._commit(); },
};

window.Store = Store;
})();
