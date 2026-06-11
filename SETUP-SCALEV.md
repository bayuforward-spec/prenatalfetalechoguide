# 💳 Cara Menyambungkan Pembayaran Scalev (Panduan Mudah)

Setelah ini, tombol paket di aplikasi akan membuka pembayaran Scalev sungguhan,
dan pembeli otomatis dapat akses Premium begitu selesai bayar.

> Prasyarat: aplikasi sudah online (mis. `https://bayuforward-spec.github.io/thequranlens/`).

---

## TAHAP 1 — Buat 3 produk di Scalev
Di dashboard **Scalev**, buat 3 produk/checkout:

| Produk | Harga | "Slug" (dipakai nanti) |
|--------|-------|------------------------|
| Bulanan | Rp 39.000 | `bulanan` |
| Tahunan | Rp 299.000 | `tahunan` |
| Seumur Hidup | Rp 749.000 | `seumur-hidup` |

Setelah dibuat, **salin link checkout** masing-masing produk. Contoh bentuknya:
`https://scalev.id/xxxxxxx`

---

## TAHAP 2 — Atur "Redirect setelah bayar sukses" (per produk)
Untuk **tiap** produk, di pengaturan Scalev cari opsi *redirect/thank-you URL
setelah pembayaran berhasil*, lalu isi dengan alamat aplikasimu + penanda paket:

**Produk Bulanan:**
```
https://bayuforward-spec.github.io/thequranlens/index.html?aktivasi=bulanan&order={ORDER_ID}
```
**Produk Tahunan:**
```
https://bayuforward-spec.github.io/thequranlens/index.html?aktivasi=tahunan&order={ORDER_ID}
```
**Produk Seumur Hidup:**
```
https://bayuforward-spec.github.io/thequranlens/index.html?aktivasi=seumur-hidup&order={ORDER_ID}
```

> - Ganti bagian `bayuforward-spec.github.io/thequranlens` bila domain/alamatmu berbeda.
> - `{ORDER_ID}` **biarkan apa adanya** — Scalev otomatis menggantinya dengan
>   nomor order asli. (Kalau Scalev memakai format lain seperti `{{order_id}}`,
>   pakai format yang Scalev sediakan.)

---

## TAHAP 3 — Tempel link checkout ke kode (edit di GitHub web)
1. Buka repo `thequranlens` di GitHub
2. Masuk folder **`assets`** → **`js`** → klik file **`payment.js`**
3. Klik ikon **pensil ✏️** (Edit) di kanan atas
4. Cari bagian ini (di awal file):

   ```js
   checkout: {
     'Bulanan':       'https://scalev.id/CHECKOUT-BULANAN',
     'Tahunan':       'https://scalev.id/CHECKOUT-TAHUNAN',
     'Seumur Hidup':  'https://scalev.id/CHECKOUT-SEUMUR-HIDUP',
   },
   ```

5. **Ganti** ketiga link placeholder dengan link checkout Scalев aslimu, contoh:

   ```js
   checkout: {
     'Bulanan':       'https://scalev.id/abc111',
     'Tahunan':       'https://scalev.id/abc222',
     'Seumur Hidup':  'https://scalev.id/abc333',
   },
   ```
   ⚠️ Jangan hapus tanda kutip `'` dan koma `,`.

6. Scroll ke bawah → klik **Commit changes** (hijau)
7. Tunggu ~1 menit (situs otomatis ter-update)

---

## TAHAP 4 — Uji coba
1. Buka aplikasi → klik salah satu paket
2. Harusnya **pindah ke halaman bayar Scalev** (bukan lagi langsung kebuka)
3. (Opsional) lakukan 1 transaksi uji bila Scalev punya mode tes / harga kecil
4. Setelah "bayar", kamu dipantulkan balik & Premium terbuka ✅

---

## 🆘 Kalau pembeli bilang "sudah bayar tapi akses hilang"
Karena cara sekarang belum pakai login, akses melekat di browser tempat membeli.
Solusi cepat yang **sudah tersedia** di aplikasi:
1. Pembeli buka aplikasi → klik **Premium** → menu **"Sudah bayar? Aktivasi dengan Order ID"**
2. Pilih paket + masukkan **Order ID** dari Scalev (ada di email/struk Scalev)
3. Premium terbuka

> Order ID bisa pembeli temukan di email konfirmasi Scalev atau kamu cek di
> dashboard Scalev lalu kirimkan ke pembeli.

---

## Catatan
- Selama link Scalev masih `CHECKOUT-...` (placeholder), aplikasi berjalan
  **mode demo** (paket langsung kebuka tanpa bayar) — berguna untuk uji tampilan.
- Cara ini murni sisi-aplikasi (tanpa server). Untuk perlindungan anti-curang
  & login lintas perangkat, lihat fase berikutnya di `STRATEGI.md` & `server/`.
