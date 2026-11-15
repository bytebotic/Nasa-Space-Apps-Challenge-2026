/* ============================================================
   ui.js — shared pieces: logo, starfield, orbit arcs,
   theme switching with cross-fades
   ============================================================ */

export const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

/* ---------- brand mark, drawn as SVG so it stays crisp
     and recolours itself with the theme ---------- */
export const LOGO_SVG = `
<svg class="mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
  <g stroke="var(--logo-blue)" stroke-width="7.5" stroke-linecap="round">
    <circle cx="41" cy="58" r="30"/>
    <ellipse cx="41" cy="58" rx="13.5" ry="30"/>
    <line x1="11" y1="58" x2="71" y2="58"/>
    <line x1="41" y1="28" x2="41" y2="88"/>
  </g>
  <circle cx="79" cy="24" r="11" fill="none" stroke="var(--logo-grey)" stroke-width="7.5"/>
</svg>`;

export function brandHTML() {
  return `${LOGO_SVG}
    <span class="rule"></span>
    <span class="words">
      <span class="name">EARTH-TO-SPACE</span>
      <span class="tag">Test space from Earth</span>
    </span>`;
}

export const ARROW = `<svg class="arrow" width="20" height="14" viewBox="0 0 20 14" fill="none">
  <path d="M1 7h17M12 1l6 6-6 6" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const ARROW_BACK = `<svg class="arrow-back" width="18" height="12" viewBox="0 0 20 14" fill="none">
  <path d="M19 7H2M8 1L2 7l6 6" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------- starfield ---------- */
const SPARK = 'M12 0c.4 5.6 6 11.2 11.6 11.6C18 12 12.4 17.6 12 23.2 11.6 17.6 6 12 .4 11.6 6 11.2 11.6 5.6 12 0Z';

export function buildStars(host, count = 68) {
  host.innerHTML = '';
  const rnd = mulberry(20261115);
  for (let i = 0; i < count; i++) {
    const big = rnd() > 0.62;
    const size = big ? 9 + rnd() * 13 : 2 + rnd() * 3;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'star');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size); svg.setAttribute('height', size);
    if (big) {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', SPARK); svg.appendChild(p);
    } else {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', 12); c.setAttribute('cy', 12); c.setAttribute('r', 9);
      svg.appendChild(c);
    }
    svg.style.left = (rnd() * 100).toFixed(2) + '%';
    svg.style.top = (rnd() * 100).toFixed(2) + '%';
    svg.style.setProperty('--op', (0.25 + rnd() * 0.6).toFixed(2));
    svg.style.setProperty('--dur', (3.4 + rnd() * 5).toFixed(1) + 's');
    svg.style.setProperty('--delay', (rnd() * 5).toFixed(1) + 's');
    host.appendChild(svg);
  }
}

/* small deterministic RNG so the sky looks the same on every load */
function mulberry(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function buildOrbits(host) {
  host.innerHTML = `
  <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
    <ellipse cx="190" cy="430" rx="420" ry="640"/>
    <ellipse cx="1250" cy="430" rx="420" ry="640"/>
    <ellipse cx="720" cy="300" rx="700" ry="240"/>
  </svg>`;
}

/* ---------- theme switching with a proper cross-fade ----------
   Gradients and background images can't be CSS-transitioned, so we
   keep a second layer holding the OLD look and fade it out. */
export function applyTheme(theme, { animate = false } = {}) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;

  if (!animate) { root.dataset.theme = theme; return; }

  const grad = document.getElementById('bgGrad');
  const gradPrev = document.getElementById('bgGradPrev');
  const ground = document.getElementById('ground');
  const groundPrev = document.getElementById('groundPrev');

  const gs = getComputedStyle(grad);
  gradPrev.style.transition = 'none';
  gradPrev.style.backgroundImage = gs.backgroundImage;
  gradPrev.style.opacity = '1';

  const es = getComputedStyle(ground);
  groundPrev.style.transition = 'none';
  groundPrev.style.backgroundImage = es.backgroundImage;
  groundPrev.style.height = es.height;
  groundPrev.style.opacity = '1';

  root.dataset.theme = theme;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    gradPrev.style.transition = 'opacity 1500ms cubic-bezier(.45,0,.2,1)';
    groundPrev.style.transition = 'opacity 1500ms cubic-bezier(.45,0,.2,1)';
    gradPrev.style.opacity = '0';
    groundPrev.style.opacity = '0';
  }));
}
