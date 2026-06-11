# ۞ The Quran Lens — Menyelami Keajaiban Al-Qur'an

Web-app **all-in-one** berbahasa Indonesia yang membedah setiap ayat Al-Qur'an
dalam **6 lapisan tadabbur**, agar pembaca *amazed* pada kemukjizatan Al-Qur'an.
Dijual dengan model **langganan bulanan** lewat **Scalev**.

> 📚 Konten edukatif. Untuk pendalaman, selalu rujuk ulama & guru terpercaya.

## ✨ Format Konten (per ayat)
Setiap ayat mengikuti **satu skema baku** — inilah produk inti & pembedanya:

1. **Teks** — Arab + transliterasi + terjemah
2. **Asbabun Nuzul** — sebab/latar turunnya ayat
3. **Tafsir Ringkas** — makna inti
4. **Hikmah Ayat** — pelajaran/ibrah *(lapisan gratis sebagai teaser)*
5. **Keajaiban Linguistik** ✨ — *kenapa Allah memilih kata itu* (i'jaz/balaghah) → **pembeda utama**
6. **Amalan & Kehidupan** — penerapan & contoh kasus keseharian
   - plus **Rujukan** tafsir agar kredibel

## 🧩 Fitur Aplikasi
- **Ayat Hari Ini** — satu ayat berputar otomatis tiap hari (ritme langganan)
- **Perpustakaan Ayat** — jelajah & buka detail per ayat
- **Bookmark** & **Streak harian** — pendorong retensi
- **Gratis vs Premium** — lapisan "wow" (asbabun nuzul, tafsir, linguistik, amalan)
  dikunci sebagai pemicu beli; *Hikmah* terbuka gratis sebagai cicipan
- **PWA** — bisa di-_install_ sebagai aplikasi di HP

## 💰 Model Monetisasi (Scalev)
| Paket | Harga | Catatan |
|------|-------|---------|
| **Bulanan** | Rp 39.000/bln | Batal kapan saja (produk utama) |
| **Tahunan** | Rp 299.000/thn | Hemat ~36% (≈ Rp 24.900/bln) |
| **Seumur Hidup** | Rp 749.000 | Bayar sekali |

> Lihat **[STRATEGI.md](STRATEGI.md)** untuk positioning, funnel marketing,
> rencana retensi, dan catatan penting soal kredibilitas syar'i.

## 🚀 Menjalankan
Aplikasi **statis** (tanpa build, tanpa dependensi):

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## ✍️ Menambah Ayat Baru
Cukup edit satu file: **`assets/js/content.js`**. Salin satu objek di array
`AYAT`, isi ke-6 lapisan + sumber, lalu tempel. Tidak perlu menyentuh kode lain.
Set `gratis: true` bila ingin ayat itu jadi etalase terbuka penuh.

## 📁 Struktur
```
index.html                # Landing + shell aplikasi (tab navigasi)
assets/css/styles.css     # Tema zamrud & emas
assets/js/content.js      # 🟢 Mesin konten — skema baku + ayat (edit di sini)
assets/js/app.js          # Render 6 lapisan, gating Premium, bookmark, streak
assets/js/storage.js      # Status Premium, bookmark, streak (localStorage)
assets/js/payment.js      # Integrasi checkout Scalev + verifikasi backend
manifest.webmanifest      # Konfigurasi PWA
server/                   # 🔐 Backend verifikasi langganan (anti-bypass)
  ├─ server.js            #    Webhook Scalev + endpoint /api/verify
  └─ README.md            #    Cara pasang & sesuaikan dengan Scalev
STRATEGI.md               # Strategi bisnis & konten
```

## 💳 Pembayaran via Scalev
1. Buat 3 produk/checkout di dashboard **[Scalev](https://scalev.id)** (Bulanan, Tahunan, Seumur Hidup).
2. Salin URL checkout ke `assets/js/payment.js` → `Payment.CONFIG.checkout`.
3. Set **redirect setelah pembayaran berhasil** ke:
   ```
   https://DOMAIN-ANDA/index.html?aktivasi={PAKET}&order={ORDER_ID}
   ```
   `{PAKET}` = `bulanan` | `tahunan` | `seumur-hidup`. Pembeli yang kembali
   membawa parameter ini **otomatis** mendapat akses Premium.
4. Cadangan: pembeli memasukkan **Order ID** manual lewat menu di modal upgrade.

> Selama URL Scalev masih placeholder, tombol paket berjalan dalam **mode demo**
> (langsung membuka Premium tanpa bayar) untuk pengujian.

### 🔐 Verifikasi anti-bypass (backend)
Gating sisi-klien mudah di-bypass. Karena itu tersedia **backend di `server/`**
yang memverifikasi pembayaran lewat **webhook Scalev bertanda tangan**, lalu
aplikasi mengecek Order ID ke `/api/verify` sebelum membuka Premium.

Aktifkan dengan mengisi `Payment.CONFIG.apiBase` di `assets/js/payment.js`.
Selama kosong, aplikasi berjalan dalam **mode demo** sisi-klien.
Lihat **[server/README.md](server/README.md)** untuk pemasangan & penyesuaian
field Scalev. Untuk sinkron lintas perangkat & melindungi teks tafsir agar tak
tersalin dari kode, tambahkan autentikasi pengguna + sajikan konten premium
dari server (tercatat di roadmap `STRATEGI.md`).

---
© 2026 The Quran Lens · Dibuat untuk mendekatkan hati pada Al-Qur'an 💚
