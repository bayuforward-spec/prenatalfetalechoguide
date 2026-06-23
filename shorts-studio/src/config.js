import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

export const config = {
  port: Number(process.env.PORT || 8787),
  uploadsDir: path.join(ROOT, 'uploads'),
  outputDir: path.join(ROOT, 'output'),
  tokenFile: path.join(ROOT, 'token.json'),

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 8787}/oauth2callback`,
  },

  defaultPrivacy: process.env.DEFAULT_PRIVACY || 'unlisted',

  // Batas durasi Shorts (detik). YouTube Shorts saat ini hingga 3 menit.
  maxDurationSec: 180,

  // Resolusi render vertikal 9:16
  width: 1080,
  height: 1920,
  fps: 30,
};

export function isYouTubeConfigured() {
  return Boolean(config.google.clientId && config.google.clientSecret);
}
