/**
 * Integrasi Google Drive (baca-saja): daftar file video/audio & unduh otomatis
 * ke folder sementara untuk diproses. Memakai OAuth & token yang sama dengan YouTube.
 */
import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';
import { authedClient } from './youtube.js';

function driveClient() {
  return google.drive({ version: 'v3', auth: authedClient() });
}

/** Ekstrak fileId dari link Google Drive atau kembalikan apa adanya bila sudah ID. */
export function parseFileId(input) {
  const s = String(input || '').trim();
  if (!s) return '';
  // Format umum: /file/d/<id>/...  atau  ?id=<id>  atau  /d/<id>
  const m = s.match(/\/d\/([a-zA-Z0-9_-]+)/) || s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // Kalau bukan URL, anggap sudah berupa ID.
  if (/^[a-zA-Z0-9_-]{10,}$/.test(s)) return s;
  return '';
}

/**
 * Daftar file di Drive berdasarkan tipe.
 * @param {'video'|'audio'} type
 */
export async function listFiles(type = 'video') {
  const drive = driveClient();
  const mime = type === 'audio' ? "mimeType contains 'audio/'" : "mimeType contains 'video/'";
  const res = await drive.files.list({
    q: `${mime} and trashed = false`,
    fields: 'files(id, name, mimeType, size, modifiedTime)',
    orderBy: 'modifiedTime desc',
    pageSize: 50,
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return (res.data.files || []).map((f) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: Number(f.size || 0),
  }));
}

/**
 * Jelajah folder Drive: kembalikan subfolder + file media di dalam sebuah folder.
 * folderId kosong = tampilkan folder tingkat atas (milik sendiri + "Shared with me").
 * @param {string} folderId
 * @param {'video'|'audio'} type
 */
export async function browse(folderId = '', type = 'video') {
  const drive = driveClient();
  const FOLDER = "mimeType = 'application/vnd.google-apps.folder'";
  const media = type === 'audio' ? "mimeType contains 'audio/'" : "mimeType contains 'video/'";

  const common = {
    fields: 'files(id, name, mimeType, size)',
    orderBy: 'folder,name',
    pageSize: 500,
    spaces: 'drive',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  };

  let rawFiles = [];
  if (folderId) {
    const res = await drive.files.list({
      ...common,
      q: `'${folderId}' in parents and trashed = false and (${FOLDER} or ${media})`,
    });
    rawFiles = res.data.files || [];
  } else {
    // Tingkat atas: tampilkan SEMUA folder yang bisa diakses (umum) + file media
    // yang ada di "Shared with me" / root, supaya tidak perlu masuk folder induk dulu.
    const [folders, mediaShared, mediaRoot] = await Promise.all([
      drive.files.list({ ...common, q: `${FOLDER} and trashed = false` }),
      drive.files.list({ ...common, q: `sharedWithMe = true and trashed = false and ${media}` }),
      drive.files.list({ ...common, q: `'root' in parents and trashed = false and ${media}` }),
    ]);
    const seen = new Set();
    rawFiles = [
      ...(folders.data.files || []),
      ...(mediaShared.data.files || []),
      ...(mediaRoot.data.files || []),
    ].filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
  }

  const isFolder = (f) => f.mimeType === 'application/vnd.google-apps.folder';
  return {
    folders: rawFiles.filter(isFolder).map((f) => ({ id: f.id, name: f.name })),
    files: rawFiles.filter((f) => !isFolder(f)).map((f) => ({
      id: f.id, name: f.name, mimeType: f.mimeType, size: Number(f.size || 0),
    })),
  };
}

/** Ambil metadata satu file (untuk nama & ekstensi). */
export async function getFileMeta(fileId) {
  const drive = driveClient();
  const res = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size',
    supportsAllDrives: true,
  });
  return res.data;
}

/**
 * Unduh file dari Drive ke destDir. Mengembalikan path file lokal.
 * @param {string} fileId
 * @param {string} destDir
 * @param {(percent:number)=>void} [onProgress]
 */
export async function downloadFile(fileId, destDir, onProgress = () => {}) {
  const drive = driveClient();
  const meta = await getFileMeta(fileId);
  const total = Number(meta.size || 0);
  const safeName = String(meta.name || fileId).replace(/[^\w.\-]+/g, '_');
  const destPath = path.join(destDir, `${fileId}-${safeName}`);

  const res = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'stream' }
  );

  await new Promise((resolve, reject) => {
    let downloaded = 0;
    const out = fs.createWriteStream(destPath);
    res.data
      .on('data', (chunk) => {
        downloaded += chunk.length;
        if (total > 0) onProgress(Math.min(99, Math.round((downloaded / total) * 100)));
      })
      .on('error', reject)
      .pipe(out)
      .on('finish', () => { onProgress(100); resolve(); })
      .on('error', reject);
  });

  return { path: destPath, name: meta.name, mimeType: meta.mimeType };
}
