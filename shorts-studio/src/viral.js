/**
 * Optimasi metadata untuk peluang viral di YouTube Shorts.
 * Bukan sihir — tapi menerapkan praktik yang terbukti membantu jangkauan:
 * judul ber-hook, #Shorts, hashtag relevan, deskripsi rapi, dan tag.
 */

const HOOK_PREFIXES = [
  'POV:',
  'Ternyata',
  'Jangan skip!',
  'Wajib tahu:',
  'Ini alasannya',
];

const GENERIC_HASHTAGS = ['#shorts', '#viral', '#fyp', '#trending', '#reels'];

/** Ambil kata kunci sederhana dari teks caption (untuk tags & hashtag). */
function extractKeywords(text, max = 8) {
  const stop = new Set(
    ('yang di ke dari dan atau ini itu untuk dengan pada adalah akan saya kamu kita ' +
      'the a an of to in on for and or is are with you we this that it as be').split(' ')
  );
  const freq = new Map();
  for (const raw of String(text || '').toLowerCase().split(/[^a-z0-9áéíóúñ]+/i)) {
    const w = raw.trim();
    if (w.length < 4 || stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([w]) => w);
}

/**
 * Bangun metadata final yang dioptimasi.
 * @param {{title?:string, description?:string, captionText?:string, hashtags?:string}} input
 */
export function buildViralMetadata(input = {}) {
  const baseTitle = (input.title || '').trim();
  const captionText = (input.captionText || '').trim();
  const keywords = extractKeywords(`${baseTitle} ${captionText}`);

  // Judul: pakai judul user, tambahkan hook bila terlalu pendek, pastikan ada #Shorts.
  let title = baseTitle || (captionText ? captionText.split(/[.!?\n]/)[0].slice(0, 70) : 'Video Baru');
  if (title.length < 15 && HOOK_PREFIXES.length) {
    title = `${HOOK_PREFIXES[Math.floor(Math.random() * HOOK_PREFIXES.length)]} ${title}`;
  }
  if (!/#shorts/i.test(title)) title = `${title} #Shorts`.slice(0, 100);

  // Hashtags: gabungan dari input user + keyword + generik, unik, maksimal 15.
  const userTags = (input.hashtags || '')
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((t) => (t.startsWith('#') ? t : `#${t}`));
  const kwTags = keywords.slice(0, 5).map((k) => `#${k.replace(/[^a-z0-9]/gi, '')}`);
  const hashtags = [...new Set([...userTags, ...kwTags, ...GENERIC_HASHTAGS])]
    .filter((t) => t.length > 1)
    .slice(0, 15);

  // Deskripsi: caption asli + baris hashtag.
  const descParts = [];
  if (input.description?.trim()) descParts.push(input.description.trim());
  else if (captionText) descParts.push(captionText);
  descParts.push('');
  descParts.push(hashtags.join(' '));
  const description = descParts.join('\n').slice(0, 4900);

  // Tags (kata kunci, tanpa '#').
  const tags = [...new Set([...keywords, 'shorts', 'viral', 'fyp'])].slice(0, 30);

  return { title, description, tags, hashtags };
}
