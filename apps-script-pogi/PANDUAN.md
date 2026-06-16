# Panduan Deploy Dashboard POGI (Live, Auto-Update)

Dashboard ini membaca **langsung** dari Google Sheet "DATA POGI (Responses)".
Setiap kali halaman dibuka atau tombol **↻ Refresh** ditekan, angkanya ikut data terbaru
di sheet (yang otomatis terisi dari Google Form). Tidak perlu generate ulang apa pun.

## Yang Anda butuhkan
- Akun Google yang sama / punya akses ke sheet `DATA POGI (Responses)`
  (ID: `17BRb0ETBkemGimzTaCqroOdZkftXd7tTFxpcBkaf1xo`).

## Langkah-langkah (±5 menit)

1. Buka **https://script.google.com** → klik **New project / Proyek baru**.
2. Ganti isi file `Code.gs` bawaan dengan isi file **`Code.gs`** dari folder ini (copy-paste semua).
3. Tambah file HTML: klik **+** di samping "Files" → **HTML** → beri nama persis **`Index`**
   (tanpa `.html`). Hapus isi default, paste seluruh isi **`Index.html`** dari folder ini.
4. Simpan (Ctrl/Cmd + S).
5. Klik **Deploy** (kanan atas) → **New deployment**.
   - Klik ikon gear ⚙ → pilih tipe **Web app**.
   - **Description**: `Dashboard POGI`.
   - **Execute as**: **Me** (akun Anda) — agar dashboard bisa baca sheet.
   - **Who has access**:
     - **Only myself** → hanya Anda (paling aman), atau
     - **Anyone with Google account** → siapa pun yang Anda beri link & login Google bisa lihat.
     - ⚠ Jangan pilih **Anyone** (tanpa login) karena data berisi info pribadi.
   - Klik **Deploy**.
6. Pertama kali akan diminta **Authorize access** → pilih akun → "Advanced" →
   "Go to project (unsafe)" → **Allow**. (Wajar; itu izin agar skrip baca sheet Anda.)
7. Salin **Web app URL** yang muncul. Buka URL itu → dashboard tampil.
   Bookmark URL tsb; itulah dashboard live Anda.

## Update data
- Saat ada respons baru di Form → otomatis masuk sheet → buka/refresh dashboard → angka ikut berubah.
- Tidak ada langkah manual lain.

## Mengganti sumber sheet
Di `Code.gs` paling atas:
- `SHEET_ID` — ID Google Sheet.
- `SHEET_NAME` — kosongkan (`''`) untuk pakai tab pertama, atau isi nama tab spesifik
  (mis. `'Form Responses 1'`).

## Catatan
- Logika (dedup, hitung usia, pemetaan wilayah, tempat praktek, kualitas data) berjalan di server
  Apps Script — sama persis dengan rekap yang sudah disepakati.
- Pemetaan wilayah & "tempat praktek" diambil dari teks bebas (alamat/instansi/SIP), jadi bersifat
  estimasi; baris yang tidak terdeteksi masuk "Lainnya / tidak jelas".
- Privasi: dashboard hanya menampilkan agregat + nama. No HP, email, dan alamat **tidak** ditampilkan.
- Mau ubah desain/penambahan chart? Cukup edit `Index.html` (tampilan) atau `Code.gs` (perhitungan),
  simpan, lalu **Deploy → Manage deployments → Edit (pensil) → Version: New version → Deploy**.
