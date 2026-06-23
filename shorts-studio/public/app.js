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

// ---------- Submit ----------
let currentJob = null;

$('#form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = $('#form');
  if (!$('#video').files[0]) return alert('Pilih file video dulu.');
  if (!$('#audio').files[0]) return alert('Pilih file audio dulu.');

  if ($('#autoUpload').checked && status.youtubeConfigured && !status.youtubeConnected) {
    return alert('Aktifkan auto-upload setelah menghubungkan YouTube. Klik "Hubungkan YouTube" dulu.');
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

function finishRender(j) {
  $('#go').disabled = false;
  $('#result-actions').hidden = false;
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
