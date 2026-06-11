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

## 🔐 Catatan Komersial
Gating Premium saat ini **sisi-klien** (demo). Untuk rilis komersial, integrasikan:
1. Gerbang pembayaran (mis. Midtrans/Xendit/Stripe).
2. Verifikasi lisensi/langganan di server.
3. Autentikasi pengguna untuk sinkronisasi riwayat lintas perangkat.

## 📚 Acuan Klinis
Naegele's rule · WHO (anemia kehamilan) · Kriteria Rotterdam (PCOS) · Pedoman NICE (preeklampsia) ·
Rumus Johnson (TBJ) · Cut-off IMT Asia-Pasifik (WHO).

---
© 2026 Bidanara · Dibuat dengan ❤️ untuk perempuan Indonesia.
