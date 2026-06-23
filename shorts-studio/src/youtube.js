/**
 * Integrasi YouTube Data API v3: OAuth2 + upload video (videos.insert).
 * Token refresh disimpan di token.json (di-gitignore).
 */
import fs from 'node:fs';
import { createReadStream, statSync } from 'node:fs';
import { google } from 'googleapis';
import { config, isYouTubeConfigured } from './config.js';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/drive.readonly', // baca file video/audio dari Drive
];

export function createOAuthClient() {
  const { clientId, clientSecret, redirectUri } = config.google;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl() {
  const oauth2 = createOAuthClient();
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // pastikan dapat refresh_token
    scope: SCOPES,
  });
}

export async function exchangeCodeAndSave(code) {
  const oauth2 = createOAuthClient();
  const { tokens } = await oauth2.getToken(code);
  // Gabung dengan token lama agar refresh_token tidak hilang bila tak dikirim ulang.
  let existing = {};
  if (fs.existsSync(config.tokenFile)) {
    try { existing = JSON.parse(fs.readFileSync(config.tokenFile, 'utf8')); } catch {}
  }
  const merged = { ...existing, ...tokens };
  fs.writeFileSync(config.tokenFile, JSON.stringify(merged, null, 2));
  return merged;
}

export function loadSavedTokens() {
  if (!fs.existsSync(config.tokenFile)) return null;
  try { return JSON.parse(fs.readFileSync(config.tokenFile, 'utf8')); } catch { return null; }
}

export function isConnected() {
  const t = loadSavedTokens();
  return Boolean(t && (t.refresh_token || t.access_token));
}

export function authedClient() {
  if (!isYouTubeConfigured()) {
    throw new Error('Kredensial Google belum diatur. Isi GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET di .env.');
  }
  const tokens = loadSavedTokens();
  if (!tokens) throw new Error('Belum terhubung ke YouTube. Buka /auth/youtube untuk menghubungkan akun.');
  const oauth2 = createOAuthClient();
  oauth2.setCredentials(tokens);
  // Simpan refresh token baru bila di-rotate.
  oauth2.on('tokens', (t) => {
    const merged = { ...tokens, ...t };
    fs.writeFileSync(config.tokenFile, JSON.stringify(merged, null, 2));
  });
  return oauth2;
}

/**
 * Upload video ke YouTube sebagai Short.
 * @param {object} opts
 * @param {string} opts.filePath
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string[]} [opts.tags]
 * @param {string} [opts.privacyStatus]  public | unlisted | private
 * @param {(percent:number)=>void} [onProgress]
 */
export async function uploadVideo(opts, onProgress = () => {}) {
  const auth = authedClient();
  const youtube = google.youtube({ version: 'v3', auth });

  const fileSize = statSync(opts.filePath).size;

  const res = await youtube.videos.insert(
    {
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: (opts.title || 'Short').slice(0, 100),
          description: opts.description || '',
          tags: (opts.tags || []).slice(0, 30),
          categoryId: '24', // Entertainment
        },
        status: {
          privacyStatus: opts.privacyStatus || config.defaultPrivacy,
          selfDeclaredMadeForKids: false,
        },
      },
      media: { body: createReadStream(opts.filePath) },
    },
    {
      onUploadProgress: (evt) => {
        const percent = Math.round((evt.bytesRead / fileSize) * 100);
        onProgress(Math.min(99, percent));
      },
    }
  );

  onProgress(100);
  const id = res.data.id;
  return { id, url: `https://youtube.com/shorts/${id}` };
}
