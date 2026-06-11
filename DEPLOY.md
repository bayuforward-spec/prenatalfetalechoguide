# 🚀 Panduan Deploy — The Quran Lens

Dua bagian yang di-deploy terpisah:
- **Frontend** (situs statis di root repo) → **Netlify** (rekomendasi) / Vercel / GitHub Pages
- **Backend** (`server/`, verifikasi langganan) → **Render** (rekomendasi) / Railway

> Urutan yang disarankan: **(A) Frontend dulu** agar bisa langsung dipakai &
> dipasarkan (mode demo), lalu **(B) Backend** saat siap transaksi nyata, lalu
> **(C) sambungkan** keduanya + Scalev.

---

## A. Frontend → Netlify (rekomendasi)
1. Buka **app.netlify.com** → login pakai GitHub.
2. **Add new site → Import an existing project** → pilih repo
   `bayuforward-spec/prenatalfetalechoguide`.
3. Branch = branch produksi kamu (mis. `main`). Build command: **(kosong)**.
   Publish directory: **`.`** (sudah diatur otomatis oleh `netlify.toml`).
4. **Deploy**. Selesai — kamu dapat URL seperti `https://quran-lens.netlify.app`.
5. (Opsional) **Domain settings** → pasang domain sendiri.

> Aplikasi langsung jalan dalam **mode demo** (tombol paket membuka Premium tanpa
> bayar) sampai URL Scalev & backend dipasang. Cukup untuk uji & demo ke calon pembeli.

### Alternatif frontend
- **Vercel**: vercel.com → Import repo → framework **Other** → Deploy (`vercel.json` sudah ada).
- **GitHub Pages**: repo **Settings → Pages → Deploy from a branch** → pilih branch & `/ (root)`.
  Paling cepat karena repo sudah di GitHub.

---

## B. Backend → Render (rekomendasi)
1. Buka **dashboard.render.com** → login GitHub.
2. **New → Web Service** → pilih repo yang sama.
3. Render membaca `render.yaml` otomatis. Jika diminta manual:
   - **Root Directory**: `server`
   - **Runtime**: Node · **Build**: *(kosong)* · **Start**: `node server.js`
   - **Health Check Path**: `/api/health`
4. **Environment** → isi variabel:
   | Key | Nilai |
   |-----|-------|
   | `SCALEV_WEBHOOK_SECRET` | secret webhook dari dashboard Scalev |
   | `TOKEN_SECRET` | (Render bisa generate otomatis) |
   | `SCALEV_SIGNATURE_HEADER` | `x-scalev-signature` (sesuaikan dgn Scalev) |
   | `ALLOW_ORIGIN` | URL frontend kamu, mis. `https://quran-lens.netlify.app` |
5. **Create Web Service**. Kamu dapat URL seperti `https://quran-lens-api.onrender.com`.
6. Tes: buka `https://quran-lens-api.onrender.com/api/health` → harus `{"ok":true,...}`.

> ⚠️ **Penting (data persisten):** tier *free* Render & Railway punya filesystem
> **efemeral** — `data/subs.json` bisa **hilang** saat restart/deploy. Untuk uang
> sungguhan: pasang **Disk** persisten (berbayar) lalu set `DATA_FILE` ke path
> disk (mis. `/var/data/subs.json`), **atau** pindah ke database. Blok `disk:` di
> `render.yaml` sudah disiapkan tinggal di-uncomment.

### Alternatif backend
- **Railway**: railway.app → New Project → Deploy from repo → set **Root Directory** `server`
  (start otomatis dari `package.json`/`Procfile`). Tambah Volume untuk data persisten.

---

## C. Sambungkan Frontend ↔ Backend ↔ Scalev
1. **Pasang URL backend di frontend**: edit `assets/js/payment.js`:
   ```js
   apiBase: 'https://quran-lens-api.onrender.com',
   ```
   Commit & push → Netlify auto-redeploy. Sekarang aplikasi memverifikasi
   pembayaran ke server (bukan lagi mode demo).

2. **Pasang URL checkout Scalev** di `payment.js` → `CONFIG.checkout` (3 paket).

3. **Atur di dashboard Scalev:**
   - **Webhook URL** → `https://quran-lens-api.onrender.com/api/scalev/webhook`
   - **Redirect setelah bayar sukses** →
     `https://quran-lens.netlify.app/index.html?aktivasi={PAKET}&order={ORDER_ID}`
     (`{PAKET}` = `bulanan` | `tahunan` | `seumur-hidup`)
   - Salin **webhook secret** Scalev ke env `SCALEV_WEBHOOK_SECRET` di Render.

4. **Sesuaikan field Scalev** (WAJIB): cocokkan nama field payload & header tanda
   tangan di `server/server.js` → fungsi `normalizeEvent()` (cari `TODO(Scalev)`)
   dengan dokumentasi webhook resmi Scalev. Lihat `server/README.md`.

---

## D. Checklist go-live
- [ ] Frontend live di Netlify + domain
- [ ] Backend live di Render, `/api/health` OK
- [ ] `apiBase` terisi di `payment.js`
- [ ] 3 URL checkout Scalev terpasang
- [ ] Webhook URL & secret terpasang di Scalev + Render
- [ ] Field `normalizeEvent()` dicocokkan dgn payload Scalev
- [ ] Uji 1 transaksi nyata kecil → cek Premium aktif & tercatat di server
- [ ] Data store persisten (Disk/DB) sebelum jualan serius
- [ ] `ALLOW_ORIGIN` dibatasi ke domain frontend (bukan `*`)

---

## Uji lokal sebelum deploy
```bash
# Frontend
python3 -m http.server 8000          # http://localhost:8000

# Backend
cd server
SCALEV_WEBHOOK_SECRET=uji TOKEN_SECRET=uji node server.js
curl http://localhost:8787/api/health
```
