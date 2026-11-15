/* ============================================================
   radar.js — the five-axis chart, drawn as plain SVG.

   normalized_score is already a SIMILARITY score (1 = identical
   to the target), so there is one shape, not two: the location's
   score per criterion, read against a reference ring at 100%.
   Criteria the API marks unavailable are drawn as gaps.
   ============================================================ */

import { CRITERIA } from './data.js';

const SIZE = 380, C = SIZE / 2, R = 132;

const pt = (i, n, r) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const poly = (pts) => pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');

export function radarSVG(analysis) {
  const n = CRITERIA.length;
  const rings = [0.25, 0.5, 0.75, 1];

  const grid = rings.map(f => `
    <polygon points="${poly(CRITERIA.map((_, i) => pt(i, n, R * f)))}"
             class="radar-ring"/>`).join('');

  const spokes = CRITERIA.map((_, i) => {
    const [x, y] = pt(i, n, R);
    return `<line x1="${C}" y1="${C}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="radar-spoke"/>`;
  }).join('');

  // the reference shape: a perfect match to the target
  const target = `<polygon points="${poly(CRITERIA.map((_, i) => pt(i, n, R)))}"
                           class="radar-target"/>`;

  // the location's shape; unavailable criteria collapse to the centre
  const vals = CRITERIA.map(c => {
    const out = analysis.criteria[c.key];
    return out && out.available ? Math.max(0, Math.min(1, out.normalized_score)) : null;
  });
  const shape = poly(vals.map((v, i) => pt(i, n, R * (v == null ? 0 : v))));

  const dots = vals.map((v, i) => {
    const [x, y] = pt(i, n, R * (v == null ? 0 : v));
    return v == null
      ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" class="radar-dot missing"/>`
      : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" class="radar-dot"/>`;
  }).join('');

  const labels = CRITERIA.map((c, i) => {
    const [x, y] = pt(i, n, R + 32);
    const anchor = x > C + 6 ? 'start' : x < C - 6 ? 'end' : 'middle';
    const dy = y < C - 40 ? -2 : y > C + 40 ? 12 : 4;
    const v = vals[i];
    return `
      <text x="${x.toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}"
            class="radar-label ${v == null ? 'is-missing' : ''}">${c.short}</text>
      <text x="${x.toFixed(1)}" y="${(y + dy + 15).toFixed(1)}" text-anchor="${anchor}"
            class="radar-value">${v == null ? 'no data' : Math.round(v * 100) + '%'}</text>`;
  }).join('');

  return `
  <svg class="radar" viewBox="0 0 ${SIZE} ${SIZE}" role="img"
       aria-label="Similarity across five criteria">
    ${grid}${spokes}${target}
    <polygon points="${shape}" class="radar-shape"/>
    ${dots}${labels}
  </svg>`;
}
