/**
 * Skrip bantu: jalankan `npm run auth` untuk menghubungkan akun YouTube dari terminal.
 * Akan membuka URL persetujuan, lalu menerima redirect di /oauth2callback.
 *
 * Catatan: cara termudah adalah lewat tombol "Hubungkan YouTube" di UI web.
 * Skrip ini hanya alternatif berbasis terminal.
 */
import http from 'node:http';
import { URL } from 'node:url';
import { config, isYouTubeConfigured } from './config.js';
import { getAuthUrl, exchangeCodeAndSave } from './youtube.js';

if (!isYouTubeConfigured()) {
  console.error('❌ Isi dulu GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET di file .env');
  process.exit(1);
}

const redirect = new URL(config.google.redirectUri);
const port = Number(redirect.port || config.port);

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${port}`);
  if (u.pathname !== redirect.pathname) {
    res.writeHead(404); res.end(); return;
  }
  const code = u.searchParams.get('code');
  if (!code) {
    res.writeHead(400); res.end('Tidak ada kode otorisasi.'); return;
  }
  try {
    await exchangeCodeAndSave(code);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>✅ Berhasil terhubung ke YouTube. Tutup tab ini.</h2>');
    console.log('✅ Token tersimpan di token.json');
    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500); res.end('Gagal menukar kode: ' + e.message);
    console.error(e);
    process.exit(1);
  }
});

server.listen(port, () => {
  console.log('\n🔗 Buka URL ini di browser untuk menghubungkan akun YouTube:\n');
  console.log(getAuthUrl());
  console.log(`\nMenunggu redirect di ${config.google.redirectUri} ...`);
});
