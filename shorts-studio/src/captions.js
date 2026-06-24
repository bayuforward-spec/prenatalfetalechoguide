/**
 * Caption auto-timing + generator subtitle ASS bergaya viral.
 *
 * Alur: teks mentah -> dipecah jadi potongan pendek (3-5 kata) ->
 * dibagi rata sepanjang durasi video berdasar bobot jumlah kata ->
 * dirender jadi file .ass dengan gaya besar, tebal, outline tebal (gaya CapCut/Shorts).
 */

const WORDS_PER_CHUNK = 4; // potongan caption dibuat pendek agar mudah dibaca di layar HP

/** Pecah teks menjadi potongan pendek, menghormati tanda baca dulu lalu jumlah kata. */
export function splitIntoChunks(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  // Pisah dulu berdasarkan tanda baca kuat (kalimat), lalu pecah lagi per ~WORDS_PER_CHUNK kata.
  const sentences = clean.split(/(?<=[.!?…])\s+/);
  const chunks = [];
  for (const sentence of sentences) {
    const words = sentence.split(' ').filter(Boolean);
    for (let i = 0; i < words.length; i += WORDS_PER_CHUNK) {
      const chunk = words.slice(i, i + WORDS_PER_CHUNK).join(' ').trim();
      if (chunk) chunks.push(chunk);
    }
  }
  return chunks;
}

/** Bagi durasi total ke setiap potongan, berbobot jumlah kata (potongan lebih panjang = tampil lebih lama). */
export function timeChunks(chunks, totalDurationSec) {
  if (!chunks.length) return [];
  const minPerChunk = 0.7; // jangan terlalu cepat
  const weights = chunks.map((c) => Math.max(1, c.split(' ').length));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let cursor = 0;
  const segments = [];
  for (let i = 0; i < chunks.length; i++) {
    let dur = (weights[i] / totalWeight) * totalDurationSec;
    if (dur < minPerChunk) dur = minPerChunk;
    const start = cursor;
    let end = cursor + dur;
    if (i === chunks.length - 1 || end > totalDurationSec) end = totalDurationSec;
    segments.push({ start, end, text: chunks[i] });
    cursor = end;
    if (cursor >= totalDurationSec) break;
  }
  return segments;
}

function fmtTime(sec) {
  if (sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const cs = Math.round((sec - Math.floor(sec)) * 100);
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  return `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`;
}

function escapeAssText(text) {
  return text.replace(/\\/g, '\\\\').replace(/\{/g, '(').replace(/\}/g, ')').replace(/\n/g, '\\N');
}

const STYLE_PRESETS = {
  // Putih tebal + outline hitam tebal — paling aman & terbaca di mana saja.
  bold: { primary: '&H00FFFFFF', outline: '&H00000000', fontsize: 84, outlineW: 6, shadow: 3 },
  // Kuning cerah (gaya MrBeast/clickbait positif).
  kuning: { primary: '&H0000F0FF', outline: '&H00000000', fontsize: 86, outlineW: 7, shadow: 3 },
  // Hijau neon.
  neon: { primary: '&H0000FF66', outline: '&H00000000', fontsize: 86, outlineW: 7, shadow: 3 },
};

/**
 * Bangun isi file ASS.
 * @param {{width:number,height:number}} dims
 * @param {Array<{start:number,end:number,text:string}>} segments
 * @param {{style?:string, uppercase?:boolean}} opts
 */
export function buildAss(dims, segments, opts = {}) {
  const preset = STYLE_PRESETS[opts.style] || STYLE_PRESETS.bold;
  const marginV = Math.round(dims.height * 0.22); // posisi sepertiga bawah
  const hookMarginV = Math.round(dims.height * 0.16); // hook di sepertiga atas
  const hookFont = Math.round(dims.width * 0.075);
  const sideMargin = Math.round(dims.width * 0.10); // margin kiri/kanan aman (~108px)

  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: ${dims.width}
PlayResY: ${dims.height}
ScaledBorderAndShadow: yes
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Viral,Arial,${preset.fontsize},${preset.primary},&H000000FF,${preset.outline},&H64000000,-1,0,0,0,100,100,0,0,1,${preset.outlineW},${preset.shadow},2,${sideMargin},${sideMargin},${marginV},1
Style: Hook,Arial,${hookFont},&H0000F0FF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,8,4,8,${sideMargin},${sideMargin},${hookMarginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // Efek "pop in": skala 80% -> 100% di 120ms pertama tiap caption.
  const popIn = '{\\fad(80,60)\\t(0,120,\\fscx100\\fscy100)\\fscx80\\fscy80}';

  const lines = segments.map((seg) => {
    let t = escapeAssText(seg.text);
    if (opts.uppercase !== false) t = t.toUpperCase();
    return `Dialogue: 0,${fmtTime(seg.start)},${fmtTime(seg.end)},Viral,,0,0,0,,${popIn}${t}`;
  });

  // Hook teks animasi di detik-detik awal (layer 1 agar di atas caption).
  const hookText = (opts.hookText || '').trim();
  if (hookText) {
    const hookSec = Math.max(1, Number(opts.hookSeconds) || 3);
    const ht = escapeAssText(hookText).toUpperCase();
    // Animasi: pop masuk (skala 60->110->100) + denyut halus + fade keluar.
    const anim = '{\\fad(150,300)\\t(0,180,\\fscx110\\fscy110)\\t(180,360,\\fscx100\\fscy100)\\t(1000,1400,\\fscx104\\fscy104)\\t(1400,1800,\\fscx100\\fscy100)}';
    lines.unshift(`Dialogue: 1,${fmtTime(0)},${fmtTime(hookSec)},Hook,,0,0,0,,${anim}${ht}`);
  }

  return header + lines.join('\n') + '\n';
}

/** Helper gabungan: dari teks + durasi -> isi file ASS. */
export function captionTextToAss(text, durationSec, dims, opts = {}) {
  const chunks = splitIntoChunks(text);
  const segments = timeChunks(chunks, durationSec);
  return { ass: buildAss(dims, segments, opts), segments };
}
