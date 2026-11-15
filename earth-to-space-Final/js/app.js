/* ============================================================
   app.js — router + view rendering
   The whole journey lives on one page so the planet transition
   can run as one continuous motion.
   ============================================================ */

import { PLANETS, CRITERIA, profilesFor } from './data.js';
import { State } from './state.js';
import { Api, ApiError } from './api.js';
import { ICONS, globePin } from './icons.js';
import { radarSVG } from './radar.js';
import { buildInsights, headlineNote } from './insights.js';
import { brandHTML, buildStars, buildOrbits, applyTheme, ARROW, ARROW_BACK } from './ui.js';
import { teamHTML, wireTeam } from './team.js';

const host = document.getElementById('viewHost');
const shell = document.getElementById('shell');

/* ---------------- boot ---------------- */
document.getElementById('brand').innerHTML = brandHTML();
document.getElementById('brand').addEventListener('click', () => go('#home'));
buildStars(document.getElementById('bgStars'));
buildOrbits(document.getElementById('bgOrbits'));

document.querySelectorAll('[data-route]').forEach(b =>
  b.addEventListener('click', () => go(b.dataset.route)));

function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', render);

/* ---------------- router ---------------- */
function render() {
  const route = (location.hash || '#home').split('?')[0];

  if (route !== '#home' && route !== '#team' && !State.body) return go('#home');
  if (route === '#compare' && !State.coords) return go('#search');

  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('is-active', l.dataset.route === route));

  switch (route) {
    case '#planet':  return viewPlanet();
    case '#search':  return viewSearch();
    case '#compare': return viewCompare();
    case '#team':    return viewTeam();
    default:         return viewHome();
  }
}

function mount(html, { card = false } = {}) {
  shell.classList.toggle('as-card', card);
  host.innerHTML = html;
}

const esc = (s) => String(s).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* The backend's profile names are long and already start with the body,
   e.g. "Mars — Dry Basaltic Regolith & Rover Mobility". The body is shown
   separately, so drop the prefix when displaying the profile on its own. */
const shortTarget = (name) =>
  String(name || '').replace(/^\s*(Mars|Moon)\s*[—–-]\s*/i, '');

/* A quiet note when the live service couldn't be reached and the bundled
   sample data is standing in — so nobody mistakes samples for real results. */
function modeBadge() {
  if (Api.live !== false) return '';
  return `<p class="data-mode">Showing bundled sample data — the live
          analysis service could not be reached from here.</p>`;
}

/* =========================================================
   HOME + TARGET SELECT + DESTINATION
   ========================================================= */
function viewHome() {
  applyTheme('space', { animate: document.documentElement.dataset.theme !== 'space' });
  State.set({ body: null, profile: null, site: null, coords: null });

  mount(`
  <div class="scroller" id="scroller">

    <section class="home-hero">
      <div class="home-copy view-fade">
        <h1 class="display">EARTH-TO-SPACE</h1>
        <p class="subtitle">Find the best Earth locations that resemble the Moon or Mars.</p>
        <button class="btn btn-primary" id="startBtn">Start ${ARROW}</button>
      </div>
      <button class="scroll-cue" id="scrollCue">
        Choose a planet
        <svg class="chev" width="22" height="12" viewBox="0 0 22 12" fill="none">
          <path d="M1 1l10 9 10-9" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </section>

    <section class="space-stage" id="spaceStage">
      <div class="stage-head">
        <div class="head-state" id="headChoose">
          <h2 class="title ruled-title">Choose a Target Planet</h2>
          <p class="subtitle">Select whether you want to find Earth locations similar to the Moon or Mars.</p>
        </div>
        <div class="head-state hidden" id="headDest">
          <h2 class="title ruled-title" id="destTitle">Destination</h2>
          <p class="subtitle" id="destSub"></p>
        </div>
      </div>

      <div class="sphere-wrap" id="sphereWrap">
        <div class="sphere-glow"></div>
        <div class="split-sphere" id="splitSphere">
          <div class="half left"><img src="assets/moon.png" alt="The Moon"></div>
          <div class="half right"><img src="assets/mars.png" alt="Mars"></div>
        </div>
      </div>

      <div class="action-slot">
        <div class="choice-row" id="choiceRow">
          <button class="choice choice-moon" data-planet="moon">Moon</button>
          <button class="choice choice-mars" data-planet="mars">Mars</button>
        </div>
        <div class="continue-row hidden" id="continueRow">
          <button class="btn btn-primary" id="continueBtn">Continue ${ARROW}</button>
        </div>
      </div>
    </section>

  </div>`);

  const stage = document.getElementById('spaceStage');
  const toStage = () => stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('startBtn').addEventListener('click', toStage);
  document.getElementById('scrollCue').addEventListener('click', toStage);

  document.querySelectorAll('[data-planet]').forEach(btn =>
    btn.addEventListener('click', () => choosePlanet(btn.dataset.planet)));
}

function choosePlanet(id) {
  const planet = PLANETS[id];
  State.set({ body: id, profile: profilesFor(planet.body)[0].key });

  document.getElementById('spaceStage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  applyTheme(planet.theme, { animate: true });

  document.getElementById('splitSphere').classList.add(id === 'mars' ? 'to-mars' : 'to-moon');
  document.getElementById('sphereWrap').classList.add('grown');
  document.getElementById('choiceRow').classList.add('hidden');
  document.getElementById('headChoose').classList.add('hidden');
  document.getElementById('destTitle').textContent = planet.destTitle;
  document.getElementById('destSub').textContent = planet.destSub;
  document.getElementById('headDest').classList.remove('hidden');

  const btn = document.getElementById('continueBtn');
  btn.innerHTML = `${planet.continueLabel} ${ARROW}`;
  btn.addEventListener('click', () => go('#planet'));
  setTimeout(() => document.getElementById('continueRow').classList.remove('hidden'), 900);
}

/* =========================================================
   PLANET BRIEF
   ========================================================= */
function viewPlanet() {
  const planet = PLANETS[State.body];
  applyTheme(planet.theme, { animate: document.documentElement.dataset.theme !== planet.theme });

  const chips = planet.chips.map(c => `
    <div class="chip">
      <span class="chip-icon">${ICONS[c.icon] || ''}</span>
      <span class="chip-label">${c.label}</span>
      <span class="chip-value">${c.value}</span>
    </div>`).join('');

  mount(`
  <section class="planet-view view-fade">
    <div class="planet-copy">
      <div class="title-pill">
        <img src="${planet.orb}" alt="">
        <span class="divider"></span>
        <span class="pill-text">${planet.name}</span>
      </div>
      <h2>${planet.headline}</h2>
      <p>${planet.blurb}</p>
      <div class="chips">${chips}</div>
      <div class="planet-actions">
        <button class="btn btn-primary" id="nextBtn">Next ${ARROW}</button>
        <button class="btn btn-ghost" id="backBtn">${ARROW_BACK} Back to planets</button>
      </div>
    </div>

    <div class="planet-art">
      <svg class="ring" viewBox="0 0 400 400">
        <ellipse cx="200" cy="200" rx="196" ry="92" transform="rotate(-18 200 200)"/>
        <circle cx="12" cy="236" r="6"/>
        <circle cx="388" cy="164" r="6"/>
      </svg>
      <img class="orb" src="${planet.orb}" alt="${planet.name}">
    </div>
  </section>`, { card: true });

  document.getElementById('nextBtn').addEventListener('click', () => go('#search'));
  document.getElementById('backBtn').addEventListener('click', () => go('#home'));
}

/* =========================================================
   SEARCH
   ========================================================= */
const COORD_RE = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*[,/ ]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

function parseCoords(q) {
  const m = q.match(COORD_RE);
  if (!m) return null;
  const lat = parseFloat(m[1]), lon = parseFloat(m[2]);
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

function viewSearch() {
  const planet = PLANETS[State.body];
  applyTheme(planet.theme, { animate: document.documentElement.dataset.theme !== planet.theme });

  const profileChips = `
    <span class="sk-box" style="width:300px;height:76px"></span>
    <span class="sk-box" style="width:300px;height:76px"></span>`;

  mount(`
  <section class="search-view view-fade">
    <h2 class="title ruled-title">Find a place on Earth</h2>
    <p class="subtitle">Search for a location, or type coordinates like <code>-24.5, -69.25</code>.</p>

    <div class="profile-picker">
      <span class="picker-label">Target profile</span>
      <div class="profile-chips">${profileChips}</div>
    </div>

    <div class="search-box" id="searchBox">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8.6" cy="8.6" r="6.2" stroke="currentColor" stroke-width="2"/>
        <path d="M13.2 13.2 18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input id="searchInput" type="text" autocomplete="off" spellcheck="false"
             placeholder="Atacama, Antarctica, 19.8, -155.5…"
             aria-label="Search for an Earth location">
      <button class="search-clear" id="searchClear" hidden aria-label="Clear">&times;</button>
      <div class="suggestions" id="suggestions" hidden></div>
    </div>

    <p class="search-hint" id="searchHint">Start typing — suggestions come from the site database.</p>

    <button class="btn btn-ghost back-link" id="backBtn">${ARROW_BACK} Back to ${planet.name}</button>
  </section>`);

  document.getElementById('backBtn').addEventListener('click', () => go('#planet'));
  wireSearch();
  loadProfiles(planet.body);
}

/* profiles come from GET /targets; the local list stands in when offline */
async function loadProfiles(body) {
  let profiles;
  try { profiles = await Api.getProfiles(body); }
  catch { profiles = profilesFor(body); }
  if (!profiles || !profiles.length) profiles = profilesFor(body);

  const host = document.querySelector('.profile-chips');
  if (!host) return;                       // the visitor moved on while we loaded

  if (!State.profile || !profiles.some(p => p.key === State.profile)) {
    State.set({ profile: profiles[0].key });
  }

  host.innerHTML = profiles.map(p => `
    <button class="profile-chip ${p.key === State.profile ? 'is-on' : ''}" data-profile="${p.key}">
      <span class="pc-name">${esc(shortTarget(p.name))}</span>
      <span class="pc-desc">${esc(p.description)}</span>
    </button>`).join('');

  host.querySelectorAll('[data-profile]').forEach(b =>
    b.addEventListener('click', () => {
      State.set({ profile: b.dataset.profile });
      host.querySelectorAll('[data-profile]').forEach(x => x.classList.toggle('is-on', x === b));
    }));
}

function wireSearch() {
  const input = document.getElementById('searchInput');
  const list = document.getElementById('suggestions');
  const clear = document.getElementById('searchClear');
  const hint = document.getElementById('searchHint');
  let items = [], active = -1, timer = null;

  const close = () => { list.hidden = true; active = -1; };

  const paint = () => {
    if (!items.length) { close(); return; }
    list.innerHTML = items.map((s, i) => `
      <button class="suggestion ${i === active ? 'is-active' : ''}" data-i="${i}">
        <span class="sug-name">${esc(s.name)}</span>
        <span class="sug-meta">${esc(s.country)} · ${s.lat.toFixed(2)}, ${s.lon.toFixed(2)}</span>
      </button>`).join('');
    list.hidden = false;
    list.querySelectorAll('.suggestion').forEach(b =>
      b.addEventListener('mousedown', e => { e.preventDefault(); pick(items[+b.dataset.i]); }));
  };

  const pick = (site) => {
    State.set({ site, coords: { lat: site.lat, lon: site.lon } });
    go('#compare');
  };

  const run = async (q) => {
    const coords = parseCoords(q);
    if (coords) {
      items = [{
        id: 'coords', name: `${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)}`,
        country: 'Coordinates', lat: coords.lat, lon: coords.lon
      }];
      hint.textContent = 'Press Enter to analyse this point.';
      paint(); active = 0; paint();
      return;
    }
    try {
      items = await Api.searchSites(q, 6);
      hint.textContent = items.length
        ? ''
        : 'No locations match that. Try a different name, or type coordinates.';
      paint();
    } catch {
      items = [];
      hint.textContent = 'Could not reach the location service.';
      close();
    }
  };

  input.addEventListener('input', () => {
    const q = input.value;
    clear.hidden = !q;
    clearTimeout(timer);
    if (q.trim().length < 2) { items = []; close(); hint.textContent = 'Start typing — suggestions come from the site database.'; return; }
    timer = setTimeout(() => run(q), 250);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!items.length) return;
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
      paint();
    } else if (e.key === 'Enter') {
      if (items[active]) pick(items[active]);
      else if (items[0]) pick(items[0]);
    } else if (e.key === 'Escape') { close(); }
  });

  clear.addEventListener('click', () => {
    input.value = ''; clear.hidden = true; items = []; close(); input.focus();
  });
  input.addEventListener('blur', () => setTimeout(close, 120));
  setTimeout(() => input.focus(), 240);
}

/* =========================================================
   COMPARISON
   ========================================================= */
async function viewCompare() {
  const planet = PLANETS[State.body];
  applyTheme(planet.theme, { animate: document.documentElement.dataset.theme !== planet.theme });

  mount(compareSkeleton(), { card: false });

  // the backend sleeps when idle, so say something rather than just spin
  const slow = setTimeout(() => {
    const n = document.getElementById('waking');
    if (n) n.textContent = 'Waking the analysis service — the first request after ' +
                           'a quiet spell can take up to a minute.';
  }, 4500);

  let data;
  try {
    data = await Api.analyze({
      lat: State.coords.lat, lon: State.coords.lon, target: State.profile
    });
  } catch (err) {
    clearTimeout(slow);
    return viewError(err);
  }
  clearTimeout(slow);
  paintCompare(data);
}

function compareSkeleton() {
  return `
  <section class="compare-view">
    <div class="versus-bar sk"><span class="sk-box" style="width:220px;height:54px"></span>
      <span class="sk-box" style="width:150px;height:62px"></span>
      <span class="sk-box" style="width:220px;height:54px"></span></div>
    <div class="compare-grid">
      <div class="panel"><span class="sk-box" style="width:100%;height:380px"></span></div>
      <div class="panel"><span class="sk-box" style="width:100%;height:80px"></span>
        <span class="sk-box" style="width:100%;height:80px"></span>
        <span class="sk-box" style="width:100%;height:80px"></span></div>
    </div>
    <p class="waking" id="waking"></p>
  </section>`;
}

function paintCompare(d) {
  const site = State.site || {};
  const name = site.name || `${d.coordinates.lat.toFixed(3)}, ${d.coordinates.lon.toFixed(3)}`;
  const place = site.country && site.country !== 'Coordinates'
    ? site.country : `${d.coordinates.lat.toFixed(2)}, ${d.coordinates.lon.toFixed(2)}`;

  const chips = CRITERIA.map(c => {
    const o = d.criteria[c.key];
    const ok = o && o.available;
    return `
    <div class="score-chip ${ok ? '' : 'is-missing'}">
      <span class="sc-label">${c.short}</span>
      <span class="sc-value">${ok ? Math.round(o.normalized_score * 100) + '%' : 'n/a'}</span>
      <span class="sc-weight">${ok ? 'weight ' + Math.round(o.effective_weight * 100) + '%' : 'no data'}</span>
    </div>`;
  }).join('');

  const insights = buildInsights(d).map(i => `
    <article class="insight ${i.score == null ? 'is-missing' : ''}">
      <span class="insight-icon">${i.icon}</span>
      <div>
        <h4>${i.title}
          <span class="insight-score">${i.score == null ? 'no data' : Math.round(i.score * 100) + '%'}</span>
        </h4>
        <p>${i.text}</p>
      </div>
    </article>`).join('');

  const cov = d.data_coverage;
  const covNote = cov.missing_criteria.length
    ? `<p class="coverage warn">${cov.available_criteria} of ${cov.total_criteria} criteria had data.
       Missing: ${cov.missing_criteria.map(k =>
         (CRITERIA.find(c => c.key === k) || {}).full || k).join(', ')}.
       The remaining weights were rebalanced.</p>`
    : `<p class="coverage">All ${cov.total_criteria} criteria had data.</p>`;

  const sources = CRITERIA.map(c => {
    const o = d.criteria[c.key];
    if (!o || !o.evidence) return '';
    return `<li><strong>${c.full}</strong> — ${esc(o.evidence.source)}
            <span class="src-res">${esc(o.evidence.spatial_resolution)}</span></li>`;
  }).join('');

  mount(`
  <section class="compare-view view-fade">

    <div class="versus-bar">
      <div class="vs-side">
        ${globePin(d.coordinates.lat, d.coordinates.lon, 74)}
        <div class="vs-text">
          <span class="vs-name">${esc(name)}</span>
          <span class="vs-meta">${esc(place)}</span>
        </div>
      </div>

      <div class="vs-score">
        <span class="vs-pct">${Math.round(d.illustrative_score_pct)}%</span>
        <span class="vs-word">match</span>
      </div>

      <div class="vs-side vs-target">
        <img class="vs-orb" src="${PLANETS[State.body].orb}" alt="">
        <div class="vs-text">
          <span class="vs-name">${esc(shortTarget(d.target_name))}</span>
          <span class="vs-meta">${esc(d.planetary_body)}</span>
        </div>
      </div>
    </div>

    <p class="headline-note">${headlineNote(d)}</p>
    ${modeBadge()}

    <div class="compare-grid">
      <div class="panel panel-radar">
        <div class="radar-wrap">${radarSVG(d)}</div>
        <div class="radar-key">
          <span><i class="key-swatch key-earth"></i> ${esc(name)}</span>
          <span><i class="key-swatch key-target"></i> ${esc(shortTarget(d.target_name))} (perfect match)</span>
        </div>
        <div class="score-chips">${chips}</div>
        ${covNote}
      </div>

      <div class="panel panel-insights">
        <h3 class="panel-title">Key insights</h3>
        ${insights}
      </div>
    </div>

    <details class="sources">
      <summary>Where this data comes from</summary>
      <ul>${sources}</ul>
    </details>

    <p class="disclaimer">${esc(d.scientific_disclaimer)}</p>

    <div class="compare-actions">
      <button class="btn btn-primary" id="againBtn">Compare another location ${ARROW}</button>
      <button class="btn btn-ghost" id="planetBtn">${ARROW_BACK} Change planet</button>
    </div>
  </section>`);

  document.getElementById('againBtn').addEventListener('click', () => go('#search'));
  document.getElementById('planetBtn').addEventListener('click', () => go('#home'));
}

/* =========================================================
   ERROR
   ========================================================= */
function viewError(err) {
  const msg = err instanceof ApiError ? err.message : 'Something went wrong on the way out.';
  mount(`
  <section class="error-view view-fade">
    <div class="rocket-wrap">${ICONS.rocket}</div>
    <h2 class="title">Engine trouble</h2>
    <p class="subtitle">${esc(msg)}</p>
    <div class="error-actions">
      <button class="btn btn-primary" id="retryBtn">Try again ${ARROW}</button>
      <button class="btn btn-ghost" id="errBack">${ARROW_BACK} Back to search</button>
    </div>
  </section>`);
  document.getElementById('retryBtn').addEventListener('click', () => viewCompare());
  document.getElementById('errBack').addEventListener('click', () => go('#search'));
}

/* =========================================================
   TEAM
   ========================================================= */
function viewTeam() {
  // the Team page keeps the project's own identity whatever planet
  // you came from, so it always reads in the navy space theme
  applyTheme('space', { animate: document.documentElement.dataset.theme !== 'space' });
  mount(teamHTML(), { card: false });
  wireTeam();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* =========================================================
   PLACEHOLDER
   ========================================================= */
function viewStub(title, note) {
  mount(`
  <section class="placeholder view-fade">
    <div>
      <h2 class="title">${title}</h2>
      <p class="subtitle">${note}</p>
    </div>
  </section>`, { card: false });
}

render();
