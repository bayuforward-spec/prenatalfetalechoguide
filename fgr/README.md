# 🩺 FetoGuard — Surveilans IUGR/FGR & Risiko IUFD

Aplikasi web **klinis terpisah** (di folder `fgr/`, independen dari Bidanara) untuk
**pemantauan pertumbuhan janin terhambat (IUGR/FGR) berbasis Doppler** — dari input
data ibu sampai stratifikasi risiko **IUFD**. Dibuat sebagai alat kerja tenaga medis.

> ⚠️ **Alat bantu keputusan klinis** — bukan pengganti penilaian klinis, korelasi
> kondisi ibu, atau protokol institusi. Verifikasi tiap ambang pada pedoman sumber.

## Alur

1. **Data ibu & penanggalan** — identitas, HPHT (Naegele + koreksi siklus) atau
   **redating USG** (cek selisih ambang ACOG/ISUOG otomatis), faktor risiko.
2. **Pemeriksaan per kunjungan (trimester 1/2/3)** — UK dihitung otomatis dari tanggal:
   - TD, TFU, **biometri** BPD/HC/AC/FL → **EFW (Hadlock-4)** + **persentil**.
   - Cairan amnion (AFI/DVP).
   - **Doppler**: UA-PI, MCA-PI, **CPR otomatis**, UtA-PI, DV-PI (+ estimasi persentil).
   - Aliran kualitatif: **EDF** (ada/AEDF/REDF), **DV a-wave**, aortic isthmus, CTG/STV, deselerasi.
   - **Override manual** tiap indeks Doppler (sesuai grafik referensi lokal).
3. **Hasil otomatis**:
   - Diagnosis **SGA vs FGR** (konsensus Delphi) — dini vs lambat.
   - **Staging Barcelona I–IV** (Figueras & Gratacós) + kriteria.
   - **Surveilans, waktu & cara persalinan** (ISUOG/SMFM).
   - **Stratifikasi risiko IUFD** (OR Caradeux 2018) + peringatan bila UK sudah melewati ambang persalinan.
4. **Longitudinal** — simpan banyak kunjungan, **tabel tren** EFW & Doppler, **ekspor laporan** (.txt).

Semua data tersimpan **di perangkat** (localStorage) — tidak dikirim ke server.

## Menjalankan

Statis, tanpa build:

```bash
python3 -m http.server 8000
# buka http://localhost:8000/fgr/
```

## Acuan klinis

| Komponen | Sumber |
|---|---|
| EFW & persentil | Hadlock 1985/1991 · INTERGROWTH-21st (Stirnemann 2017) |
| Definisi SGA vs FGR | Konsensus Delphi — Gordijn et al. UOG 2016;48:333 |
| Staging I–IV & manajemen | Figueras & Gratacós, Fetal Diagn Ther 2014;36:86 (Barcelona) |
| Waktu persalinan | ISUOG Practice Guidelines 2020 (UOG 56:298) · SMFM Consult #52 (AJOG 2020;223:B2) |
| Risiko IUFD (OR) | Caradeux et al. AJOG 2018;218(2S):S774 (AEDF 3,6 · REDF 7,3 · DV 11,6) |
| Doppler reference | UtA-PI Gómez 2008 · UA/MCA/CPR Cohen 2019 · DV-PIV Nguyen 2020 |

**Catatan akurasi**: persentil Doppler bersifat **estimasi** (reference range bervariasi
antar populasi, dan koefisien FMF/Ciobanu 2019 tidak direplikasi karena ada koreksi
terbit DeVore 2021). Persentil **EFW** divalidasi terhadap contoh terbitan INTERGROWTH
(P3 @ 30 mg = 1106 g). Gunakan override manual + grafik lokal untuk keputusan akhir.
