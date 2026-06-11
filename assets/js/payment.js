/*
 * payment.js — Integrasi pembayaran Scalev (https://scalev.id)
 *
 * Cara pakai (untuk pemilik aplikasi):
 * 1. Buat 3 produk/checkout di dashboard Scalev (Bulanan, Tahunan, Seumur Hidup).
 * 2. Salin URL checkout masing-masing ke CONFIG.checkout di bawah.
 * 3. Di pengaturan Scalev, set "Redirect setelah pembayaran berhasil" ke:
 *      https://DOMAIN-ANDA/index.html?aktivasi={PAKET}&order={ORDER_ID}
 *    (ganti {PAKET} = bulanan|tahunan|seumur-hidup). Scalev akan mengganti
 *    {ORDER_ID} dengan nomor order asli sebagai bukti pembayaran.
 *
 * Saat pembeli kembali membawa ?aktivasi=...&order=..., Premium otomatis aktif.
 */
const Payment = {
  CONFIG: {
    // Ganti dengan URL checkout Scalev Anda yang sebenarnya:
    checkout: {
      'Bulanan':       'https://scalev.id/CHECKOUT-BULANAN',
      'Tahunan':       'https://scalev.id/CHECKOUT-TAHUNAN',
      'Seumur Hidup':  'https://scalev.id/CHECKOUT-SEUMUR-HIDUP',
    },
    slug: {
      'bulanan': 'Bulanan',
      'tahunan': 'Tahunan',
      'seumur-hidup': 'Seumur Hidup',
    },
  },

  terkonfigurasi(paket) {
    const url = this.CONFIG.checkout[paket] || '';
    return url && !/CHECKOUT-/.test(url);
  },

  checkout(paket) {
    const url = this.CONFIG.checkout[paket];
    if (this.terkonfigurasi(paket)) {
      window.open(url, '_blank', 'noopener');
      return true;
    }
    return false; // belum dikonfigurasi -> pemanggil tangani fallback
  },

  cekRedirect() {
    const p = new URLSearchParams(window.location.search);
    const slug = p.get('aktivasi');
    const order = p.get('order');
    if (slug && this.CONFIG.slug[slug]) {
      return { paket: this.CONFIG.slug[slug], order: order || '-' };
    }
    return null;
  },

  bersihkanURL() {
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
};
window.Payment = Payment;
