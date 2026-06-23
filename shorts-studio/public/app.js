const $ = (s) => document.querySelector(s);

let status = {};

async function loadStatus() {
  try {
    status = await (await fetch('/api/status')).json();
  } catch { status = {}; }
  const el = $('#yt-status');
  const box = $('#yt-connect-box');
  if (!status.youtubeConfigured) {
    el.textContent = '⚠️ YouTube belum dikonfigurasi (.env)';
    box.hidden = true;
    $('#autoUpload').checked = false;
    $('#autoUpload').disabled = true;
  } else if (status.youtubeConnected) {
    el.textContent = '✅ YouTube terhubung';
    el.classList.add('ok');
    box.hidden = true;
  } else {
    el.textContent = '○ YouTube belum login';
    box.hidden = false;
  }
  if (status.defaultPrivacy) $('#privacy').value = status.defaultPrivacy;
}
loadStatus();
// Refresh status saat tab kembali fokus (setelah login di tab lain).
window.addEventListener('focus', loadStatus);

// ---------- File drop helpers ----------
function wireDrop(dropId, inputId, previewId, kind) {
  const drop = $(dropId), input = $(inputId), preview = $(previewId);
  const onFile = (file) => {
    if (!file) return;
    input.files = createFileList(file);
    drop.classList.add('filled');
    drop.querySelector('.drop-text').textContent = (kind === 'video' ? '📹 ' : '🎵 ') + file.name;
    const url = URL.createObjectURL(file);
    preview.src = url; preview.hidden = false;
  };
  input.addEventListener('change', () => onFile(input.files[0]));
  ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', (e) => onFile(e.dataTransfer.files[0]));
}
function createFileList(file) {
  const dt = new DataTransfer(); dt.items.add(file); return dt.files;
}
wireDrop('#drop-video', '#video', '#preview-video', 'video');
wireDrop('#drop-audio', '#audio', '#preview-audio', 'audio');

// Drop musik (opsional, tanpa preview).
(function wireMusic() {
  const drop = $('#drop-music'), input = $('#music');
  const set = (file) => {
    if (!file) return;
    input.files = createFileList(file);
    drop.classList.add('filled');
    drop.querySelector('.drop-text').textContent = '🎶 ' + file.name;
  };
  input.addEventListener('change', () => set(input.files[0]));
  ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', (e) => set(e.dataTransfer.files[0]));
})();

// ---------- Google Drive folder browser (modal) ----------
function fmtSize(b) {
  if (!b) return '';
  const mb = b / 1024 / 1024;
  return mb >= 1 ? ` · ${mb.toFixed(1)} MB` : ` · ${Math.round(b / 1024)} KB`;
}
const drive = {
  kind: 'video',          // video | audio | music
  apiType: 'video',       // video | audio
  stack: [],              // [{id, name}] breadcrumb
};
const modal = $('#drive-modal');
const driveList = $('#drive-list');

document.querySelectorAll('.btn-drive').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!status.youtubeConnected) {
      return alert('Hubungkan akun Google dulu (tombol "Hubungkan YouTube" di bagian 5) agar bisa baca Google Drive.');
    }
    drive.kind = btn.dataset.kind;
    drive.apiType = drive.kind === 'video' ? 'video' : 'audio';
    drive.stack = [];
    modal.hidden = false;
    browseDrive('', '');
  });
});
$('#drive-close').addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });

function renderCrumb() {
  const parts = ['<span data-go="-1">📁 Drive</span>']
    .concat(drive.stack.map((f, i) => `<span data-go="${i}">${escapeHtml(f.name)}</span>`));
  $('#drive-crumb').innerHTML = parts.join(' <i>›</i> ');
  $('#drive-crumb').querySelectorAll('[data-go]').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.go);
      drive.stack = idx < 0 ? [] : drive.stack.slice(0, idx + 1);
      const cur = drive.stack[drive.stack.length - 1];
      browseDrive(cur ? cur.id : '', '', true);
    });
  });
}

async function browseDrive(folderId, _name, fromCrumb) {
  driveList.innerHTML = '<div class="drive-loading">Memuat…</div>';
  renderCrumb();
  let data;
  try {
    data = await (await fetch(`/api/drive/browse?type=${drive.apiType}&folderId=${encodeURIComponent(folderId)}`)).json();
    if (data.error) throw new Error(data.error);
  } catch (e) {
    driveList.innerHTML = `<div class="drive-loading">Gagal: ${escapeHtml(e.message)}</div>`;
    return;
  }
  const rows = [];
  for (const f of data.folders) {
    rows.push(`<div class="drive-row folder" data-fid="${f.id}" data-fname="${escapeHtml(f.name)}">📁 ${escapeHtml(f.name)}</div>`);
  }
  for (const f of data.files) {
    const icon = drive.apiType === 'audio' ? '🎵' : '🎬';
    rows.push(`<div class="drive-row file" data-id="${f.id}" data-name="${escapeHtml(f.name)}">${icon} ${escapeHtml(f.name)}<small>${fmtSize(f.size)}</small></div>`);
  }
  if (!rows.length) rows.push('<div class="drive-loading">Folder ini kosong (tidak ada subfolder / file ' + drive.apiType + ').</div>');
  driveList.innerHTML = rows.join('');

  driveList.querySelectorAll('.drive-row.folder').forEach((el) => {
    el.addEventListener('click', () => {
      drive.stack.push({ id: el.dataset.fid, name: el.dataset.fname });
      browseDrive(el.dataset.fid, el.dataset.fname);
    });
  });
  driveList.querySelectorAll('.drive-row.file').forEach((el) => {
    el.addEventListener('click', () => selectDriveFile(el.dataset.id, el.dataset.name));
  });
}

function selectDriveFile(id, name) {
  $('#drive-' + drive.kind).value = id;
  const chosen = $('#chosen-' + drive.kind);
  chosen.textContent = '✅ Drive: ' + name;
  chosen.hidden = false;
  // Kosongkan file upload untuk input yang sama (hindari ganda).
  const input = $('#' + drive.kind);
  if (input) input.value = '';
  $('#drop-' + drive.kind)?.classList.remove('filled');
  modal.hidden = true;
}

// ---------- Submit ----------
let currentJob = null;

$('#form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = $('#form');
  const hasVideo = $('#video').files[0] || $('#drive-video').value;
  const hasAudio = $('#audio').files[0] || $('#drive-audio').value;
  if (!hasVideo) return alert('Pilih video dulu (upload atau dari Google Drive).');
  if (!hasAudio) return alert('Pilih audio dulu (upload atau dari Google Drive).');

  if ($('#autoUpload').checked && status.youtubeConfigured && !status.youtubeConnected) {
    return alert('Aktifkan auto-upload setelah menghubungkan YouTube. Klik "Hubungkan YouTube" dulu.');
  }

  // Jadwal: konversi waktu lokal -> ISO (RFC3339). Wajib di masa depan + auto-upload.
  const localDt = $('#scheduledAtLocal').value;
  if (localDt) {
    const when = new Date(localDt);
    if (isNaN(when) || when.getTime() <= Date.now()) {
      return alert('Waktu jadwal harus di masa depan.');
    }
    if (!$('#autoUpload').checked) {
      return alert('Untuk menjadwalkan publish, centang "Auto-upload setelah render" dulu.');
    }
    $('#scheduledAt').value = when.toISOString();
  } else {
    $('#scheduledAt').value = '';
  }

  const fd = new FormData(form);
  // Normalisasi checkbox jadi true/false.
  for (const name of ['uppercase', 'viralGrade', 'keepOriginalAudio', 'autoUpload']) {
    fd.set(name, form.elements[name].checked ? 'true' : 'false');
  }

  $('#go').disabled = true;
  $('#result').hidden = false;
  $('#result-actions').hidden = true;
  $('#yt-link').textContent = '';
  setBar(0, 'Mengunggah file…');
  $('#result').scrollIntoView({ behavior: 'smooth' });

  let resp;
  try {
    resp = await (await fetch('/api/render', { method: 'POST', body: fd })).json();
  } catch (err) {
    return fail('Gagal mengunggah: ' + err.message);
  }
  if (resp.error) return fail(resp.error);

  currentJob = resp.jobId;
  showMeta(resp.meta);
  poll(resp.jobId);
});

function setBar(p, stage) {
  $('#bar').style.width = (p || 0) + '%';
  if (stage) $('#stage').textContent = stage;
}
function fail(msg) {
  setBar(0, '❌ ' + msg);
  $('#go').disabled = false;
}
function showMeta(meta) {
  if (!meta) return;
  $('#meta-preview').innerHTML =
    `<b>Judul:</b> ${escapeHtml(meta.title)}\n\n<b>Deskripsi:</b>\n${escapeHtml(meta.description)}`;
}
function escapeHtml(s) {
  return String(s || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

async function poll(jobId) {
  let done = false;
  while (!done) {
    await new Promise((r) => setTimeout(r, 900));
    let j;
    try { j = await (await fetch('/api/job/' + jobId)).json(); }
    catch { continue; }
    if (j.error && j.status === 'error') return fail(j.error);

    if (j.status === 'rendering' || j.status === 'queued') {
      setBar(j.percent, `${j.stage || 'Memproses'} — ${j.percent || 0}%`);
    } else if (j.status === 'uploading') {
      setBar(100, `Upload ke YouTube — ${j.uploadPercent || 0}%`);
    } else if (j.status === 'rendered') {
      setBar(100, 'Render selesai ✅');
      finishRender(j);
      if (j.uploadError) $('#yt-link').textContent = 'ℹ️ ' + j.uploadError;
      done = true;
    } else if (j.status === 'done') {
      setBar(100, 'Selesai & terupload ✅');
      finishRender(j);
      if (j.youtube) {
        $('#yt-link').innerHTML = `🎉 Terupload: <a href="${j.youtube.url}" target="_blank">${j.youtube.url}</a>`;
      }
      done = true;
    }
  }
}

function renderAnalysis(a) {
  const box = $('#analysis');
  if (!a) { box.hidden = true; return; }
  box.hidden = false;
  const color = a.score >= 70 ? 'var(--ok)' : a.score >= 50 ? '#f4b400' : 'var(--acc)';
  const factorRows = a.factors.map((f) =>
    `<div class="factor ${f.ok ? 'ok' : 'no'}"><span>${f.ok ? '✓' : '✗'} ${escapeHtml(f.name)}</span><b>${f.points}/${f.max}</b></div>`
  ).join('');
  const tipRows = (a.tips || []).map((t) => `<li>${escapeHtml(t)}</li>`).join('');
  box.innerHTML = `
    <div class="score-head">
      <div class="score-ring" style="--c:${color}">${a.score}</div>
      <div><div class="score-grade" style="color:${color}">${escapeHtml(a.grade)}</div>
      <small>Skor potensi viral (heuristik)</small></div>
    </div>
    <div class="factors">${factorRows}</div>
    ${tipRows ? `<div class="tips"><b>💡 Saran perbaikan:</b><ul>${tipRows}</ul></div>` : ''}`;
}

function finishRender(j) {
  $('#go').disabled = false;
  $('#result-actions').hidden = false;
  renderAnalysis(j.analysis);
  if (j.meta) showMeta(j.meta);
  if (j.downloadUrl) {
    $('#result-video').src = j.downloadUrl;
    $('#download').href = j.downloadUrl;
  }
  const mu = $('#manual-upload');
  if (j.status === 'rendered' && status.youtubeConnected) {
    mu.hidden = false;
  } else {
    mu.hidden = true;
  }
}

$('#manual-upload').addEventListener('click', async () => {
  if (!currentJob) return;
  $('#manual-upload').disabled = true;
  setBar(100, 'Memulai upload…');
  await fetch('/api/upload/' + currentJob, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ privacy: $('#privacy').value }),
  });
  poll(currentJob);
});
