# Dashboard Anggota POGI Lampung (versi publik / GitHub Pages)

`index.html` di folder ini adalah dashboard mandiri (tanpa internet/koneksi eksternal).
**Hanya menampilkan data agregat** — tanpa nama, No HP, email, atau alamat — sehingga aman
diletakkan di repository.

## Cara melihat
- **Paling cepat:** unduh `index.html` lalu buka di browser (klik 2×).
- **Via GitHub Pages (punya URL publik):**
  1. Repo → **Settings** → **Pages**.
  2. **Build and deployment** → Source: **Deploy from a branch**.
  3. Branch: `claude/vigilant-euler-2gz7dy` (atau branch tempat file ini berada), Folder: **/(root)** → **Save**.
  4. Tunggu ±1 menit. URL: `https://bayuforward-spec.github.io/prenatalfetalechoguide/pogi-dashboard/`

## Memperbarui data
Dashboard ini **snapshot** (data dibekukan saat dibuat). Untuk versi yang ikut berubah
otomatis tiap ada respons Form baru, gunakan paket **Apps Script** / **Looker** di folder
`apps-script-pogi/` (lihat `PANDUAN.md` dan `LOOKER.md`).
