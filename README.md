# Repositori prenatalfetalechoguide

Berisi **dua aplikasi web statis yang terpisah**:

| Aplikasi | Folder | Untuk |
|---|---|---|
| 🩺 **FetoGuard** — Surveilans IUGR/FGR & risiko IUFD | [`fgr/`](fgr/) | **alat kerja klinis** tenaga medis (Doppler, staging, waktu persalinan) |
| 🌸 **Bidanara** — Sahabat Kesehatan Wanita | `/` (root) | aplikasi konsumen kesehatan wanita |

➡️ Dokumentasi FetoGuard: **[`fgr/README.md`](fgr/README.md)** · buka di `http://localhost:8000/fgr/`.

---

# 🌸 Bidanara — Sahabat Kesehatan Wanita

Aplikasi web **all-in-one** kesehatan wanita berbahasa Indonesia dengan **hasil instan**.
Dirancang dengan acuan klinis kebidanan & kandungan, siap dijual dengan model **Gratis + Premium + Langganan**.

> ⚠️ Alat bantu edukasi & pemantauan mandiri — **bukan** pengganti diagnosis tenaga medis.

## ✨ Fitur

### Gratis
- **Kalkulator Kehamilan** — usia kehamilan & HPL (Naegele's rule + koreksi siklus), perkembangan janin per minggu.
- **Estimasi Berat Janin** — rumus Johnson dari Tinggi Fundus Uteri (TFU).
- **Kalkulator Masa Subur** — prediksi ovulasi & jendela subur.
- **IMT (cut-off Asia-Pasifik)**, **Skrining Anemia** (WHO), **Skrining PCOS** (kriteria Rotterdam).

### Premium ✦
- Kalender kesuburan **6 siklus** ke depan.
- **Skrining Risiko Kanker** serviks & payudara (kesadaran faktor risiko).
- **Risiko Preeklampsia** (adaptasi pedoman NICE).
- **Riwayat tersimpan** otomatis + **ekspor laporan**.

## 💰 Model Monetisasi
| Paket | Harga | Catatan |
|------|-------|---------|
| Bulanan | Rp 29.000 | Batal kapan saja |
| Tahunan | Rp 189.000 | Hemat ~45% (≈ Rp 15.750/bln) |
| Seumur Hidup | Rp 499.000 | Bayar sekali |

## 🚀 Menjalankan
Aplikasi **statis** (tanpa build, tanpa dependensi). Cukup buka `index.html`, atau jalankan server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

Bisa di-_install_ sebagai aplikasi (PWA) lewat menu browser di HP.

## 📁 Struktur
```
index.html               # Antarmuka & navigasi
assets/css/styles.css    # Tema visual
assets/js/calculators.js # Mesin perhitungan medis (akurasi klinis)
assets/js/storage.js     # Status Premium & riwayat (localStorage)
assets/js/app.js         # Navigasi, render, gating Premium
manifest.webmanifest     # Konfigurasi PWA
```

## 💳 Pembayaran via Scalev
Premium dijual lewat **[Scalev](https://scalev.id)**. Cara mengaktifkan:

1. Buat 3 produk/checkout di dashboard Scalev (Bulanan, Tahunan, Seumur Hidup).
2. Salin URL checkout ke `assets/js/payment.js` → `Payment.CONFIG.checkout`.
3. Di Scalev, set **redirect setelah pembayaran berhasil** ke:
   ```
   https://DOMAIN-ANDA/index.html?aktivasi={PAKET}&order={ORDER_ID}
   ```
   `{PAKET}` = `bulanan` | `tahunan` | `seumur-hidup`. Pembeli yang kembali
   membawa parameter ini akan **otomatis** mendapat akses Premium.
4. Cadangan: pembeli bisa memasukkan **Order ID** manual lewat menu
   "Sudah bayar? Aktivasi dengan Order ID" di modal upgrade.

> Selama URL Scalev masih placeholder, tombol paket berjalan dalam **mode demo**
> (langsung membuka Premium tanpa bayar) untuk keperluan pengujian.

### Catatan keamanan komersial
Gating Premium ini **sisi-klien**. Untuk verifikasi anti-bypass yang kuat,
tambahkan webhook Scalev → server Anda untuk memvalidasi Order ID & status
langganan, serta autentikasi pengguna agar riwayat tersinkron lintas perangkat.

## 📚 Acuan Klinis
Naegele's rule · WHO (anemia kehamilan) · Kriteria Rotterdam (PCOS) · Pedoman NICE (preeklampsia) ·
Rumus Johnson (TBJ) · Cut-off IMT Asia-Pasifik (WHO).

---
© 2026 Bidanara · Dibuat dengan ❤️ untuk perempuan Indonesia.
