/* ============================================================
   icons.js — all icons drawn inline as SVG.
   Nothing is fetched, so nothing can fail to load, and every
   icon takes the theme's colour through currentColor.
   ============================================================ */

const wrap = (body, w = 26, h = 24) =>
  `<svg class="icon" viewBox="0 0 26 24" width="${w}" height="${h}" fill="none"
        stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  /* thermometer */
  temp: wrap(`
    <path d="M13 3.6a2.3 2.3 0 0 1 4.6 0v8.9a4.6 4.6 0 1 1-4.6 0V3.6Z"/>
    <path d="M15.3 9.4v6.3"/>
    <circle cx="15.3" cy="17.4" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M19.6 5.6h2.6M19.6 8.4h1.6M19.6 11.2h2.6"/>`),

  /* mountains — Mars terrain */
  mountains: wrap(`
    <path d="M2 19.4 9.1 7.6l4.4 7.1"/>
    <path d="M10.6 19.4 16.9 9.2l7.1 10.2Z"/>
    <path d="M2 19.4h22"/>
    <path d="M15.4 11.8h3"/>`),

  /* cratered plain — Moon terrain */
  craters: wrap(`
    <path d="M2 17.2c3.4-2.6 7-3.9 11-3.9s7.6 1.3 11 3.9"/>
    <path d="M2 17.2v2.2h22v-2.2"/>
    <ellipse cx="8" cy="15.6" rx="2.4" ry="1.1"/>
    <ellipse cx="17.4" cy="16.3" rx="1.7" ry=".8"/>
    <ellipse cx="12.8" cy="9.4" rx="3.1" ry="1.4"/>
    <ellipse cx="20.3" cy="11.4" rx="1.4" ry=".7"/>`),

  /* weight — gravity */
  gravity: wrap(`
    <path d="M10.4 7.6a2.6 2.6 0 1 1 5.2 0"/>
    <path d="M9.3 7.6h7.4l3.3 11.8H6L9.3 7.6Z"/>`),

  /* wind — Mars atmosphere */
  wind: wrap(`
    <path d="M2.4 9.6h12.2a2.9 2.9 0 1 0-2.9-2.9"/>
    <path d="M4.6 13.6h14.2a2.7 2.7 0 1 1-2.7 2.7"/>
    <path d="M2.4 17.8h6.9"/>`),

  /* drifting dust / nothing — Moon atmosphere */
  dust: wrap(`
    <path d="M4 7.4h5.6M14.6 7.4h2.4M4.6 12h3M11 12h6.8M6.4 16.6h4.6M15.6 16.6h3.6"/>
    <circle cx="20.6" cy="6.2" r="1" fill="currentColor" stroke="none"/>
    <circle cx="8.4" cy="20.2" r="1" fill="currentColor" stroke="none"/>
    <circle cx="21.4" cy="13.4" r="1" fill="currentColor" stroke="none"/>`),

  /* criterion icons for the Comparison insights */
  droplet: wrap(`<path d="M13 3.4s6.4 6.6 6.4 10.6A6.4 6.4 0 0 1 6.6 14C6.6 10 13 3.4 13 3.4Z"/>`),
  layers: wrap(`
    <path d="M13 3.6 23.4 8.8 13 14 2.6 8.8 13 3.6Z"/>
    <path d="M2.6 14.2 13 19.4l10.4-5.2"/>`),
  snow: wrap(`
    <path d="M13 3v18M5.2 7.5l15.6 9M20.8 7.5l-15.6 9"/>
    <path d="M10.2 5.2 13 7.9l2.8-2.7M10.2 18.8 13 16.1l2.8 2.7"/>`),
  slope: wrap(`<path d="M2.6 19.4h20.8M3.6 18.4 20.4 6.2"/><path d="M20.4 6.2v5.1"/>`),

  /* a rocket with engine trouble — the error state */
  rocket: `
  <svg class="rocket" viewBox="0 0 220 200" fill="none" aria-hidden="true">
    <g stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
      <g transform="rotate(24 110 96)">
        <path d="M110 24c17 16 26 38 26 62 0 13-3 24-8 33h-36c-5-9-8-20-8-33 0-24 9-46 26-62Z"/>
        <path d="M92 119c-9 5-15 12-18 21l16-4M128 119c9 5 15 12 18 21l-16-4"/>
        <circle cx="110" cy="76" r="12"/>
        <path d="M100 119h20l-4 14h-12l-4-14Z"/>
      </g>
      <path d="M150 150c6-3 9-9 7-15M160 134c7-1 11-6 11-13" opacity=".75"/>
      <path d="M44 56c-7 2-11 8-10 15M30 76c-7 3-10 9-8 16" opacity=".55"/>
    </g>
    <g fill="currentColor" opacity=".5">
      <circle cx="163" cy="163" r="5"/><circle cx="178" cy="152" r="3.4"/>
      <circle cx="152" cy="176" r="3"/>
    </g>
  </svg>`
};

/* tiny globe with a pin at the given coordinates — stands in for
   the location photo we don't get from the API */
export function globePin(lat, lon, size = 86) {
  const R = 38, cx = 48, cy = 48;
  const rad = Math.PI / 180, lat0 = 15 * rad, dLon = 28 * rad, la = lat * rad;
  const x = cx + R * Math.cos(la) * Math.sin(dLon);
  const y = cy - R * (Math.cos(lat0) * Math.sin(la) - Math.sin(lat0) * Math.cos(la) * Math.cos(dLon));
  return `
  <svg class="globe-pin" viewBox="0 0 96 96" width="${size}" height="${size}" fill="none" aria-hidden="true">
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--panel-hi)"
            stroke="currentColor" stroke-width="2" opacity=".9"/>
    <g stroke="currentColor" stroke-width="1.3" opacity=".42">
      <ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="15"/>
      <ellipse cx="${cx}" cy="${cy}" rx="15" ry="${R}"/>
      <line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}"/>
    </g>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="var(--earth)" opacity=".22"/>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.2" fill="var(--earth)"/>
  </svg>`;
}
