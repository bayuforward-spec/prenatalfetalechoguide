# Auto-update Dashboard DATA POGI (aman, tanpa PII)

Tujuan: setiap ada isian Google Form baru, **angka di dashboard ikut ter-update otomatis** —
tanpa data pribadi (No HP, email, alamat, nama) pernah keluar dari Google Sheet.

Cara kerjanya: sebuah Google Apps Script (`Code.gs`) membaca sheet, menghitung rekap,
lalu menyajikan **hanya angka agregat** lewat sebuah URL Web App. Dashboard menarik
URL itu saat dibuka (pakai JSONP, jadi tidak ada masalah CORS).

---

## Langkah pasang (sekali saja, ±5 menit)

1. **Buka Apps Script dari sheet**
   Buka Google Sheet "DATA POGI (Responses)" → menu **Extensions ▸ Apps Script**.

2. **Tempel kode**
   Hapus isi `Code.gs` bawaan, lalu tempel seluruh isi file `apps-script/Code.gs` dari repo ini.
   Cek baris `var SHEET_NAME = 'DATA POGI (Responses)';` — samakan dengan nama **tab** sheet Anda
   bila berbeda.

3. **(Opsional) uji dulu**
   Pilih fungsi `_test` ▸ klik **Run**. Saat diminta, **Review permissions ▸ Allow**.
   Lihat **Execution log** — harus muncul JSON berisi angka (totalUnik, kepegawaian, dst).

4. **Deploy sebagai Web App**
   Klik **Deploy ▸ New deployment** ▸ ikon gerigi pilih **Web app**. Isi:
   - **Description**: `POGI dashboard API`
   - **Execute as**: **Me** (akun Anda)
   - **Who has access**: **Anyone**  ← wajib, agar dashboard bisa baca
   Klik **Deploy** ▸ **Authorize access** ▸ pilih akun ▸ Allow.

5. **Salin URL Web App**
   Akan muncul URL berakhiran `/exec`, contoh:
   `https://script.google.com/macros/s/AKfycb....../exec`
   **Salin** URL ini.

6. **Pasang URL ke dashboard**
   Buka `dashboard-pogi.html`, cari bagian:
   ```js
   const CONFIG = {
     endpoint: ''   // contoh: 'https://script.google.com/macros/s/AKfycb..../exec'
   };
   ```
   Isi `endpoint` dengan URL `/exec` tadi (di dalam tanda kutip). Simpan & deploy ulang
   halaman (commit/push, atau buka file lokalnya).

Selesai. Indikator di pojok kanan atas dashboard akan berubah jadi **● Live** kalau berhasil,
dan tetap **● Snapshot** (angka bawaan) bila endpoint kosong / gagal diakses.

---

## Catatan penting

- **Update bersifat saat-dibuka.** Setiap kali dashboard dibuka/refresh, ia menghitung ulang
  dari sheet terkini. Jadi isian baru langsung ikut begitu halaman dimuat — tidak perlu trigger.
- **Privasi tetap terjaga.** Web App hanya mengembalikan hitungan agregat. Tidak ada kolom
  nama/HP/email/alamat yang dikirim.
- **Dedup otomatis.** Baris dengan email (atau nama) sama dianggap duplikat; yang dipakai adalah
  isian dengan **Timestamp terbaru**. Jumlah duplikat dilaporkan di KPI "duplikat".
- **Peta kabupaten = best-effort.** Lokasi praktik diklasifikasikan dari teks bebas
  (Instansi + SIP 1 + domisili) memakai daftar kata kunci di `GEO_RULES`. Entri yang tak
  dikenali tidak dipaksakan ke wilayah mana pun — jumlahnya dilaporkan di
  `sebaranTakTerklasifikasi`. Bila ada RS/lokasi baru yang sering muncul, tambahkan kata
  kuncinya ke `GEO_RULES` lalu **Deploy ▸ Manage deployments ▸ Edit ▸ New version**.
- **Mengubah script?** Setiap kali mengedit `Code.gs`, terbitkan versi baru via
  **Manage deployments ▸ Edit (pensil) ▸ Version: New version ▸ Deploy**. URL `/exec` tetap sama.

## Kalau indikator tetap "Snapshot"
- Pastikan **Who has access = Anyone** (bukan "Only myself").
- Pastikan URL yang dipakai berakhiran **`/exec`** (bukan `/dev`).
- Coba buka URL `/exec` langsung di browser — harus tampil JSON. Kalau diminta login berarti
  akses belum "Anyone".
