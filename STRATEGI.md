# 📈 Strategi Bisnis & Konten — The Quran Lens

Dokumen kerja untuk founder. Bukan dokumen final; revisi sambil jalan.

---

## 1. Positioning (1 kalimat)
> **The Quran Lens** = aplikasi harian yang membuatmu *jatuh cinta & takjub* pada
> Al-Qur'an, dengan membongkar **keajaiban di balik setiap kata** —
> bukan sekadar terjemah, tapi *kenapa* Allah memilih kata itu.

**Pembeda utama (moat):** lapisan **linguistik/balaghah (i'jaz)**. Hampir semua
app Qur'an gratis berhenti di terjemah + tafsir. Sisi "kenapa kata ini, bukan
kata lain" itu yang bikin orang merinding dan mau bayar.

---

## 2. Kenapa orang mau bayar (padahal banyak yang gratis)
Tantangan terbesar: Quran.com, Muslim Pro, tafsir gratis, YouTube ustadz.
Maka value The Quran Lens harus terasa **berbeda kategori**, bukan "tafsir berbayar":

1. **Kurasi & kepadatan** — 6 lapisan rapi dalam 1 layar, tanpa perlu buka 5 kitab.
2. **Keajaiban linguistik** — konten yang tidak tersedia gratis dalam bahasa Indonesia yang mudah.
3. **Ritme harian** — "Ayat Hari Ini" + streak = kebiasaan, bukan referensi sesekali.
4. **Pengalaman premium** — desain tenang, fokus, tanpa iklan.

> Aturan emas: **lapisan Hikmah dibuka gratis** sebagai cicipan; lapisan
> *asbabun nuzul, tafsir, linguistik, amalan* dikunci. Orang harus *merasakan*
> kualitas dulu sebelum diminta bayar.

---

## 3. Kredibilitas = hidup-mati produk ⚠️
Satu kesalahan tafsir yang viral bisa menghancurkan reputasi & nama baik.

**Aturan main konten:**
- **Jangan pakai AI mentah** untuk men-generate tafsir/asbabun nuzul lalu tayang langsung. Risiko salah fatal secara syar'i.
- Setiap ayat **wajib mencantumkan sumber** (sudah jadi field `sumber` di data).
- Idealnya: ada **ustadz/penuntut ilmu yang me-review** sebelum publish. Ini investasi kepercayaan, bukan biaya.
- Untuk asbabun nuzul: **jujur** bila tidak ada riwayat khusus (banyak ayat memang begitu). Kejujuran ini justru menambah kredibilitas.
- Hati-hati pada ranah khilafiyah; pilih pendapat jumhur / tafsir mu'tabar (Ibnu Katsir, As-Sa'di, Al-Qurthubi, Al-Baghawi).

---

## 4. Strategi konten (jangan kejar 6.236 ayat)
Mustahil & tak perlu menggarap semua ayat di awal.

**Fase 1 — Etalase (10–20 ayat):** ayat masyhur dengan asbabun nuzul & balaghah
kuat (sudah ada 6 contoh di `content.js`). Tujuan: bukti kualitas + bahan medsos.

**Fase 2 — Tematik (paket 30–40 ayat/tema):** "Ayat Penenang Hati", "Ayat
Rezeki", "Ayat Sabar", "Juz Amma". Tema = mudah dipasarkan & dirasakan relevan.

**Fase 3 — Perluasan bertahap:** tambah 2–3 ayat/pekan. Konsistensi > volume.
Ini juga alasan langganan tetap hidup (selalu ada yang baru).

---

## 5. Funnel marketing (validasi sebelum jualan besar)
```
Reels/TikTok "keajaiban 1 kata"  →  Profil/bio  →  Web The Quran Lens (ayat gratis)
        →  rasakan kualitas  →  modal upgrade  →  checkout Scalev  →  Premium
```
- **Konten medsos = potongan lapisan linguistik.** Contoh hook: "Kenapa Al-Qur'an
  bilang 'satu kesulitan, dua kemudahan'? Rahasianya di 1 huruf." → sangat shareable.
- Bangun audiens **dulu** lewat konten gratis; itu sekaligus validasi minat pasar
  tanpa modal besar.
- Tawarkan **harga pendukung awal** (early bird) untuk 100 pembeli pertama.

---

## 6. Pricing & langganan (Scalev)
| Paket | Harga | Peran |
|------|-------|------|
| Bulanan | Rp 39.000 | Produk utama, hambatan masuk rendah |
| Tahunan | Rp 299.000 | Pendorong arus kas + retensi (ARPU naik) |
| Seumur Hidup | Rp 749.000 | Suntikan kas awal dari pendukung loyal |

Catatan: angka ini hipotesis awal — **uji** dengan A/B sederhana. Banyak app
Islami Indonesia di kisaran Rp 20–50rb/bln. Mulai dari sini, naikkan bila value terbukti.

---

## 7. Retensi (langganan mati kalau orang berhenti buka)
- **Ayat Hari Ini + streak** (sudah ada) — bikin kebiasaan.
- **Notifikasi harian** (butuh backend/push) — "Ayat hari ini sudah menunggu 🌿".
- **Selalu ada konten baru** tiap pekan.
- **Personal**: bookmark (ada), nanti catatan pribadi & progress tema.
- Email/WhatsApp ayat harian sebagai pengingat balik ke app.

---

## 8. Risiko & mitigasi
| Risiko | Mitigasi |
|--------|----------|
| Kesalahan syar'i viral | Review ustadz + cantum sumber + pilih tafsir mu'tabar |
| Konten disalin gratis | Pindahkan teks premium ke API server (bukan di kode klien) |
| Gating mudah di-bypass | Autentikasi + verifikasi langganan via webhook Scalev |
| Sepi pembeli (gratis menang) | Validasi via funnel medsos dulu, perkuat moat linguistik |
| Founder kewalahan konten | Format baku + tim penulis + jadwal 2–3 ayat/pekan |

---

## 9. Roadmap teknis (dari prototype → produk komersial)
**Sekarang (sudah jalan):** web statis + PWA, 6 lapisan, gating sisi-klien, Scalev redirect, demo mode.

**Sudah dikerjakan:**
- ✅ **Webhook Scalev → server** + endpoint `/api/verify`: verifikasi pembayaran
  anti-bypass (lihat `server/`). Tinggal sesuaikan field payload Scalev & deploy.

**Berikutnya bila serius jualan:**
1. **Deploy backend** (Railway/Render/Fly/VPS) + isi `apiBase` di `payment.js`.
2. **Akun pengguna** (email/OTP) → langganan terikat akun, sinkron lintas perangkat.
3. **Teks premium via API** (bukan di `content.js`) agar tak tersalin gratis.
4. **Database** menggantikan file JSON saat skala bertambah.
5. **Push notification** untuk ayat harian.
6. **CMS sederhana** agar tim non-teknis bisa menambah ayat tanpa ngoding.

---

## 10. Langkah konkret pekan ini (saran)
- [ ] Pasang URL checkout Scalev asli di `payment.js` (3 paket).
- [ ] Deploy ke hosting gratis (GitHub Pages / Netlify / Vercel) + domain.
- [ ] Rekam 5 reels dari lapisan linguistik 5 ayat yang sudah ada.
- [ ] Ajak 1 ustadz/penuntut ilmu untuk review konten.
- [ ] Tambah 10 ayat tematik pertama ("Ayat Penenang Hati").

---
*Disusun sebagai bahan diskusi tim. Koreksi & arahkan sesuai visi founder.*
