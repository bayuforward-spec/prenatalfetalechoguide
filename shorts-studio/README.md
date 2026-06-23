# 🎬 Shorts Studio

Aplikasi untuk **menggabungkan video + audio + caption** menjadi satu video vertikal
**9:16 gaya viral**, lalu **auto-upload ke YouTube Shorts**.

Alur sesuai keinginan:
1. Upload **video**
2. Upload **audio**
3. Masukkan **caption** (teks biasa — timing dibuat otomatis)
4. Sistem **menggabungkan & mengedit** otomatis (format 9:16, background blur, warna punchy, caption pop besar)
5. **Auto-upload** ke YouTube Shorts Anda

> Tidak perlu install FFmpeg manual — sudah memakai biner `ffmpeg-static`.

---

## 🚀 Cara menjalankan

### 1. Install Node.js
Butuh **Node.js 18+**. Cek: `node -v`. Belum punya? unduh di https://nodejs.org

### 2. Install dependensi
```bash
cd shorts-studio
npm install
```

### 3. (Opsional) Siapkan kredensial Google — untuk auto-upload YouTube & Google Drive
Tanpa langkah ini, aplikasi tetap bisa **menggabungkan & mengunduh** video dari file
di komputer — hanya auto-upload YouTube & sumber Google Drive yang nonaktif.

1. Buka https://console.cloud.google.com → buat / pilih sebuah **Project**.
2. **APIs & Services → Library** → **Enable** dua API ini:
   - **"YouTube Data API v3"** (untuk auto-upload)
   - **"Google Drive API"** (untuk ambil video/audio dari Drive)
3. **APIs & Services → OAuth consent screen**:
   - User type: **External**, isi nama app & email.
   - **Tambahkan email Anda sebagai "Test user"** (penting selama app belum diverifikasi).
   - Scope cukup biarkan default; tambah `youtube.upload` bila diminta.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized redirect URIs** → tambahkan: `http://localhost:8787/oauth2callback`
   - Klik Create, salin **Client ID** dan **Client secret**.
5. Salin file env & isi:
   ```bash
   cp .env.example .env
   ```
   Lalu isi `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env`.

### 4. Jalankan
```bash
npm start
```
Buka **http://localhost:8787**

### 5. Hubungkan Google (sekali saja)
Di aplikasi, klik **"Hubungkan YouTube"** → login → izinkan akses **YouTube + Drive**.
(Alternatif lewat terminal: `npm run auth`.)
Token tersimpan di `token.json` (sudah di-gitignore).

> Sudah pernah connect sebelum fitur Drive ada? Hapus `token.json` lalu hubungkan
> ulang agar izin Drive ikut diberikan.

### 📁 Memakai file dari Google Drive
Setelah terhubung, di bagian Video/Audio klik **"📁 atau pilih dari Google Drive"** →
pilih file dari daftar. Aplikasi akan **mengambilnya otomatis** saat render — Anda tidak
perlu download manual. (Secara teknis server tetap menarik byte file untuk diproses
FFmpeg, tapi prosesnya otomatis di latar belakang.)

---

## 🧠 Apa saja "edit otomatis"-nya?
- **Format 9:16** (1080×1920) — wajib untuk Shorts.
- **Background blur** dari video itu sendiri agar tidak ada bar hitam.
- **Caption gaya viral**: huruf besar tebal, outline tebal, animasi *pop-in*, posisi
  sepertiga bawah, timing otomatis dari teks Anda.
- **Hook teks animasi 3 detik pertama**: teks besar penarik perhatian (mis.
  "TUNGGU SAMPAI AKHIR!") muncul dengan animasi *pop* di sepertiga atas — bagian
  paling menentukan retensi Shorts.
- **Musik latar otomatis + ducking**: upload file musik (opsional), volume otomatis
  *mengecil* saat audio utama berbunyi (*sidechain compression*), lalu naik lagi.
- **Color grade punchy**: kontras & saturasi naik + sedikit *sharpen* (bisa dimatikan).
- **Durasi mengikuti audio** (maks 3 menit); video **diulang otomatis** jika lebih pendek.
  Musik juga diulang otomatis mengikuti durasi.
- **Metadata teroptimasi**: judul ber-hook + `#Shorts`, hashtag relevan, deskripsi rapi, tags.

## 📊 Prediksi virality
Setelah render, aplikasi menampilkan **skor potensi viral (0-100)** berbasis heuristik
*best-practice*: ada/tidaknya hook, durasi ideal, kepadatan caption, format, musik, dan
grade warna — lengkap dengan **saran perbaikan konkret**. Ini gratis & jalan lokal, tapi
**estimasi**, bukan kepastian.

### Analisis AI mendalam (opsional, Higgsfield)
Untuk penilaian AI sungguhan (kekuatan hook, risiko retensi, respon audiens), gunakan
**Higgsfield `virality_predictor`**. Tool ini berjalan lewat asisten (Claude) — bukan API
lokal — jadi tidak dibundel di aplikasi standalone. Cara pakai: bagikan video hasil render
ke asisten dan minta "analisa virality video ini" (butuh akun/kredit Higgsfield Anda).

> Catatan jujur: tidak ada jaminan viral — algoritma YouTube dipengaruhi banyak faktor
> (hook 3 detik pertama, retensi, konsistensi posting). Aplikasi ini menerapkan
> *best practice* format & metadata, sisanya soal konten & konsistensi.

---

## 📁 Struktur
```
shorts-studio/
├─ server.js            # Server Express + routing + job
├─ src/
│  ├─ config.js         # Konfigurasi & env
│  ├─ pipeline.js       # Mesin FFmpeg (gabung, 9:16, grade, burn caption)
│  ├─ captions.js       # Teks caption -> timing -> subtitle .ass gaya viral
│  ├─ viral.js          # Optimasi judul/deskripsi/hashtag/tags
│  ├─ analyzer.js       # Skor & saran potensi viral (heuristik lokal)
│  ├─ youtube.js        # OAuth2 + upload (YouTube Data API v3)
│  ├─ drive.js          # Ambil video/audio dari Google Drive (Drive API)
│  └─ auth.js           # Login YouTube via terminal (alternatif)
├─ public/              # Antarmuka web (HTML/CSS/JS)
├─ uploads/             # File mentah sementara (gitignored)
└─ output/              # Hasil render .mp4 (gitignored)
```

## ⚠️ Catatan
- **Kuota upload**: YouTube Data API memberi kuota harian (~6 upload/hari pada kuota default 10.000 unit; `videos.insert` ≈ 1600 unit). Untuk lebih banyak, ajukan kenaikan kuota di Google Cloud.
- File di `uploads/` dihapus otomatis setelah render. Hasil di `output/` tidak — bersihkan berkala.
- Jangan commit `.env` atau `token.json` (sudah diabaikan git).
