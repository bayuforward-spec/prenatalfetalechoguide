# Panduan Singkat: Dashboard POGI di Looker Studio

Tanpa koding, langsung connect ke Google Sheet, auto-update tiap refresh.

## A. Hubungkan data (±3 menit)
1. Buka **https://lookerstudio.google.com** → **Create** → **Report**.
2. Pilih konektor **Google Sheets** → cari **DATA POGI (Responses)** → pilih worksheet
   (tab `Form Responses 1`) → **Add**.
3. Centang **"Use first row as headers"**. Klik **Add to report**.
4. Saat ada respons Form baru, klik **refresh data** (atau set di File → Report settings →
   Data freshness) → angka ikut ter-update.

## B. Chart yang disarankan (drag dari **Add a chart**)
| Metrik | Tipe chart | Dimension | Metric |
|---|---|---|---|
| Status ONE POGI | **Pie / Donut** | `Apakah sudah mengikuti ONE POGI (2026)` | Record Count |
| Status Kepegawaian | **Pie / Donut** | `Status Kepegawaian` | Record Count |
| Jenjang Pendidikan | **Bar** | `Jenjang Pendidikan` | Record Count |
| Agama | **Donut** | `Agama` | Record Count |
| Status Pernikahan | **Donut** | `Status Pernikahan` | Record Count |
| Asuransi | **Bar** | `Apakah mengikuti Asuransi Profesi lain?, Jika Ya Sebutkan` | Record Count |
| Pemetaan wilayah | **Bar / Geo (terbatas)** | `Tempat Lahir` atau field wilayah | Record Count |
| Mulai ikut ONE POGI | **Bar** | `Jika Ya, Sejak kapan mengikuti ONE POGI?` | Record Count |
| Scorecard | **Scorecard** | — | Record Count (total responden) |

Tambahkan **Filter control** (Add a control → Drop-down list) pada `Status Kepegawaian`
atau wilayah agar dashboard bisa difilter interaktif.

## C. Calculated field yang berguna (Resource → Manage added data sources → Edit → Add a field)
- **Usia** (dari Tanggal Lahir teks `m/d/yyyy`):
  ```
  DATE_DIFF(CURRENT_DATE(), PARSE_DATE("%m/%d/%Y", `Tanggal Lahir`)) / 365
  ```
  (baris dengan tanggal rusak spt `2/22/1054` akan error/null — saring lewat filter
  `Usia < 100`).
- **Kelompok Usia**:
  ```
  CASE WHEN Usia < 35 THEN "< 35" WHEN Usia < 40 THEN "35-39"
       WHEN Usia < 45 THEN "40-44" WHEN Usia < 50 THEN "45-49"
       WHEN Usia < 55 THEN "50-54" ELSE "55+" END
  ```
- **Asuransi (rapi)**:
  ```
  CASE
    WHEN LOWER(`Apakah mengikuti Asuransi Profesi lain?, Jika Ya Sebutkan`) LIKE "%bumida%" THEN "Bumida"
    WHEN LOWER(`Apakah mengikuti Asuransi Profesi lain?, Jika Ya Sebutkan`) LIKE "%allianz%" THEN "Allianz"
    ELSE "Lainnya/Tidak" END
  ```

## D. Sharing & privasi
- Klik **Share** → **Restricted** (hanya orang yang Anda undang). **Jangan** "Anyone on the
  internet can view" karena data berisi info pribadi (No HP, email, alamat).
- Sembunyikan kolom sensitif: cukup **jangan** masukkan No HP/Email/Alamat sebagai dimension chart.

## Keterbatasan dibanding versi Apps Script
- **Tidak ada dedup**: duplikat (mis. dr. Dika Oriputra) terhitung 2× → total tampil 46, bukan 45.
- **Pemetaan wilayah** dari alamat teks bebas tidak bisa otomatis; pakai `Tempat Lahir`
  atau buat calculated field CASE-WHEN manual.
- Tidak ada panel "kualitas data".

> Kalau nanti butuh angka yang sudah bersih (ter-dedup, usia & wilayah matang) tapi tetap
> tampil di Looker, minta saja versi **Hybrid** (Apps Script menulis tab `Data Bersih`,
> lalu Looker connect ke tab itu).
