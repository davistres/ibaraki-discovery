/**
 * Générateur d'outil de traduction HTML
 * Usage: node generate-translation-tool.js
 * Génère: translation-tool.html (à ouvrir dans le navigateur)
 */
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
const require = createRequire(import.meta.url);

const fs = { readFileSync, writeFileSync };

const places = JSON.parse(fs.readFileSync('./src/data/places.json', 'utf-8'));
const placeDesc = JSON.parse(fs.readFileSync('./src/locales/places-descriptions.json', 'utf-8'));

// Construire les entrées manquantes ou incomplètes par lieu
const entries = places.map(place => {
    const existing = placeDesc.places?.[place.id] || {};
    return {
        id: place.id,
        nomFr: place.nom,
        descFr: place.description,
        adresseFr: place.adresse,
        accesFr: place.acces,
        existingNomEn: existing.nom?.en || '',
        existingNomJa: existing.nom?.ja || '',
        existingDescEn: existing.en || '',
        existingDescJa: existing.ja || '',
    };
});

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const cardsHtml = entries.map((e, i) => {
    const hasName = e.existingNomEn || e.existingNomJa;
    const hasDesc = e.existingDescEn || e.existingDescJa;
    const statusClass = (hasName && hasDesc) ? 'done' : 'todo';
    const statusLabel = (hasName && hasDesc) ? '✅ Traduit' : '⚠️ À traduire';

    return `
  <div class="card ${statusClass}" id="card-${i}" data-id="${escapeHtml(e.id)}">
    <div class="card-header">
      <div class="card-title">${escapeHtml(e.nomFr)}</div>
      <div class="card-id">${escapeHtml(e.id)}</div>
      <span class="status-badge ${statusClass}">${statusLabel}</span>
    </div>

    <div class="source-block">
      <div class="source-row"><span class="label">📍 Adresse :</span> <span>${escapeHtml(e.adresseFr)}</span></div>
      <div class="source-row"><span class="label">📝 Description :</span> <span>${escapeHtml(e.descFr)}</span></div>
      <div class="source-row"><span class="label">🚌 Accès :</span> <span>${escapeHtml(e.accesFr)}</span></div>
    </div>

    <div class="fields-grid">
      <div class="lang-col">
        <div class="lang-header">🇬🇧 Anglais</div>
        <label>Nom EN</label>
        <input type="text" data-field="nomEn" data-idx="${i}" value="${escapeHtml(e.existingNomEn)}" placeholder="Nom en anglais...">
        <label>Description EN</label>
        <textarea data-field="descEn" data-idx="${i}" placeholder="Description en anglais...">${escapeHtml(e.existingDescEn)}</textarea>
        <label>Adresse EN</label>
        <input type="text" data-field="adresseEn" data-idx="${i}" value="" placeholder="Adresse / localisation en anglais...">
        <label>Accès EN</label>
        <textarea data-field="accesEn" data-idx="${i}" placeholder="Accès en anglais...">${''}</textarea>
      </div>
      <div class="lang-col">
        <div class="lang-header">🇯🇵 Japonais</div>
        <label>Nom JA</label>
        <input type="text" data-field="nomJa" data-idx="${i}" value="${escapeHtml(e.existingNomJa)}" placeholder="名前（日本語）...">
        <label>Description JA</label>
        <textarea data-field="descJa" data-idx="${i}" placeholder="説明（日本語）...">${escapeHtml(e.existingDescJa)}</textarea>
        <label>Adresse JA</label>
        <input type="text" data-field="adresseJa" data-idx="${i}" value="" placeholder="住所（日本語）...">
        <label>Accès JA</label>
        <textarea data-field="accesJa" data-idx="${i}" placeholder="アクセス（日本語）...">${''}</textarea>
      </div>
    </div>
  </div>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Outil de Traduction — Ibaraki Discovery</title>
<style>
  :root {
    --red: #dc2626;
    --green: #16a34a;
    --orange: #ea580c;
    --bg: #f8fafc;
    --card-bg: #fff;
    --border: #e2e8f0;
    --text: #1e293b;
    --muted: #64748b;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); }
  header { background: var(--red); color: white; padding: 1.5rem 2rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,.2); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  header h1 { font-size: 1.4rem; font-weight: 700; }
  header p { font-size: .85rem; opacity: .85; margin-top: .2rem; }
  .toolbar { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
  .btn { padding: .5rem 1.2rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: .9rem; transition: opacity .2s; }
  .btn:hover { opacity: .85; }
  .btn-export { background: #fff; color: var(--red); }
  .btn-filter { background: rgba(255,255,255,.2); color: #fff; border: 1px solid rgba(255,255,255,.4); }
  .btn-filter.active { background: #fff; color: var(--red); }
  .progress-bar { height: 4px; background: rgba(255,255,255,.3); }
  .progress-fill { height: 100%; background: #4ade80; transition: width .3s; }
  .stats { background: white; border-bottom: 1px solid var(--border); padding: .75rem 2rem; display: flex; gap: 2rem; font-size: .9rem; color: var(--muted); }
  .stats span { font-weight: 700; color: var(--text); }
  main { max-width: 1200px; margin: 0 auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .card { background: var(--card-bg); border-radius: 12px; border: 2px solid var(--border); overflow: hidden; transition: border-color .2s; }
  .card.todo { border-left: 4px solid var(--orange); }
  .card.done { border-left: 4px solid var(--green); }
  .card-header { padding: 1rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; background: #f8fafc; border-bottom: 1px solid var(--border); }
  .card-title { font-weight: 700; font-size: 1.05rem; flex: 1; min-width: 200px; }
  .card-id { font-size: .75rem; color: var(--muted); font-family: monospace; background: #e2e8f0; padding: .2rem .5rem; border-radius: 4px; }
  .status-badge { font-size: .75rem; padding: .2rem .6rem; border-radius: 12px; font-weight: 600; }
  .status-badge.todo { background: #fff7ed; color: var(--orange); }
  .status-badge.done { background: #f0fdf4; color: var(--green); }
  .source-block { padding: .75rem 1.25rem; background: #f1f5f9; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: .4rem; }
  .source-row { font-size: .85rem; color: var(--text); display: flex; gap: .5rem; }
  .source-row .label { font-weight: 600; color: var(--muted); white-space: nowrap; }
  .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .lang-col { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
  .lang-col:first-child { border-right: 1px solid var(--border); }
  .lang-header { font-weight: 700; font-size: .95rem; margin-bottom: .25rem; }
  label { font-size: .78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
  input[type="text"], textarea { width: 100%; padding: .5rem .65rem; border: 1px solid var(--border); border-radius: 6px; font-size: .9rem; font-family: inherit; color: var(--text); transition: border-color .2s; background: #fff; }
  input[type="text"]:focus, textarea:focus { outline: none; border-color: var(--red); }
  textarea { min-height: 70px; resize: vertical; }
  input[type="text"]:not(:placeholder-shown), textarea:not(:placeholder-shown) { background: #fefce8; border-color: #ca8a04; }
  .hidden { display: none !important; }
  @media (max-width: 768px) { .fields-grid { grid-template-columns: 1fr; } .lang-col:first-child { border-right: none; border-bottom: 1px solid var(--border); } }
</style>
</head>
<body>

<header>
  <div>
    <h1>🗾 Outil de Traduction — Ibaraki Discovery</h1>
    <p>Saisissez les traductions manquantes, puis exportez le fichier JSON mis à jour.</p>
  </div>
  <div class="toolbar">
    <button class="btn btn-filter active" id="filter-all" onclick="filterCards('all')">Tous (${entries.length})</button>
    <button class="btn btn-filter" id="filter-todo" onclick="filterCards('todo')">À traduire</button>
    <button class="btn btn-filter" id="filter-done" onclick="filterCards('done')">Traduits</button>
    <button class="btn btn-export" onclick="exportJSON()">⬇ Exporter places-descriptions.json</button>
  </div>
</header>
<div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
<div class="stats">
  Complétés : <span id="stat-done">0</span> / ${entries.length} &nbsp;|&nbsp;
  Restants : <span id="stat-todo">${entries.length}</span>
</div>

<main id="cards-container">
${cardsHtml}
</main>

<script>
// Données sources embarquées
const ENTRIES = ${JSON.stringify(entries.map(e => ({ id: e.id, nomFr: e.nomFr })))};

function collectData() {
  const result = {};
  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const idx = card.querySelector('[data-idx]').dataset.idx;
    const get = f => card.querySelector('[data-field="' + f + '"][data-idx="' + idx + '"]')?.value?.trim() || '';
    result[id] = {
      nomEn: get('nomEn'),
      nomJa: get('nomJa'),
      descEn: get('descEn'),
      descJa: get('descJa'),
      adresseEn: get('adresseEn'),
      adresseJa: get('adresseJa'),
      accesEn: get('accesEn'),
      accesJa: get('accesJa'),
    };
  });
  return result;
}

function exportJSON() {
  const data = collectData();
  const output = { places: {} };
  for (const [id, vals] of Object.entries(data)) {
    output.places[id] = {};
    if (vals.nomEn || vals.nomJa) {
      output.places[id].nom = {};
      if (vals.nomEn) output.places[id].nom.en = vals.nomEn;
      if (vals.nomJa) output.places[id].nom.ja = vals.nomJa;
    }
    if (vals.descEn) output.places[id].en = vals.descEn;
    if (vals.descJa) output.places[id].ja = vals.descJa;
    if (vals.adresseEn || vals.adresseJa) {
      output.places[id].adresse = {};
      if (vals.adresseEn) output.places[id].adresse.en = vals.adresseEn;
      if (vals.adresseJa) output.places[id].adresse.ja = vals.adresseJa;
    }
    if (vals.accesEn || vals.accesJa) {
      output.places[id].acces = {};
      if (vals.accesEn) output.places[id].acces.en = vals.accesEn;
      if (vals.accesJa) output.places[id].acces.ja = vals.accesJa;
    }
  }
  const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'places-descriptions-updated.json';
  a.click();
  alert('Fichier exporté ! Placez-le dans src/locales/ pour remplacer places-descriptions.json.');
}

function updateStats() {
  let done = 0;
  document.querySelectorAll('.card').forEach(card => {
    const idx = card.querySelector('[data-idx]')?.dataset?.idx;
    if (!idx) return;
    const nomEn = card.querySelector('[data-field="nomEn"][data-idx="' + idx + '"]')?.value?.trim();
    const descEn = card.querySelector('[data-field="descEn"][data-idx="' + idx + '"]')?.value?.trim();
    const nomJa = card.querySelector('[data-field="nomJa"][data-idx="' + idx + '"]')?.value?.trim();
    const descJa = card.querySelector('[data-field="descJa"][data-idx="' + idx + '"]')?.value?.trim();
    if (nomEn && descEn && nomJa && descJa) {
      card.classList.remove('todo');
      card.classList.add('done');
      done++;
    } else {
      card.classList.remove('done');
      card.classList.add('todo');
    }
  });
  const total = ${entries.length};
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-todo').textContent = total - done;
  document.getElementById('progress-fill').style.width = (done / total * 100) + '%';
}

function filterCards(type) {
  document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
  document.getElementById('filter-' + type).classList.add('active');
  document.querySelectorAll('.card').forEach(card => {
    if (type === 'all') { card.classList.remove('hidden'); return; }
    if (type === 'todo') { card.classList.toggle('hidden', card.classList.contains('done')); return; }
    if (type === 'done') { card.classList.toggle('hidden', card.classList.contains('todo')); }
  });
}

// Sauvegarde locale automatique
function saveLocal() {
  const data = collectData();
  try { localStorage.setItem('ibaraki-translations', JSON.stringify(data)); } catch(e) {}
}
function loadLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem('ibaraki-translations') || '{}');
    for (const [id, vals] of Object.entries(saved)) {
      const card = document.querySelector('[data-id="' + id + '"]');
      if (!card) continue;
      const idx = card.querySelector('[data-idx]')?.dataset?.idx;
      if (!idx) continue;
      const set = (f, v) => { const el = card.querySelector('[data-field="' + f + '"][data-idx="' + idx + '"]'); if (el && v) el.value = v; };
      set('nomEn', vals.nomEn); set('nomJa', vals.nomJa);
      set('descEn', vals.descEn); set('descJa', vals.descJa);
      set('adresseEn', vals.adresseEn); set('adresseJa', vals.adresseJa);
      set('accesEn', vals.accesEn); set('accesJa', vals.accesJa);
    }
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  loadLocal();
  updateStats();
  document.getElementById('cards-container').addEventListener('input', () => {
    updateStats();
    saveLocal();
  });
});
</script>
</body>
</html>`;

fs.writeFileSync('./translation-tool.html', html, 'utf-8');
console.log('✅ translation-tool.html généré avec succès !');
console.log('👉 Ouvrez translation-tool.html dans votre navigateur pour commencer.');
