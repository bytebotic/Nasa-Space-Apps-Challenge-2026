/* ============================================================
   insights.js — the Key Insights text.
   The API doesn't write these, so we build them from raw_metrics
   plus the similarity score. Real numbers, plain sentences.
   ============================================================ */

import { CRITERIA } from './data.js';
import { ICONS } from './icons.js';

/* backend names read "Mars — Dry Basaltic Regolith & Rover Mobility"; the
   prefix is redundant inside a sentence */
const shortTarget = (name) =>
  String(name || '').replace(/^\s*(Mars|Moon)\s*[\u2014\u2013-]\s*/i, '');

const num = (v, d = 0) =>
  v == null ? '—' : Number(v).toLocaleString('en-US',
    { minimumFractionDigits: d, maximumFractionDigits: d });

function verdict(score, target) {
  if (score >= 0.85) return `An extremely close match to ${target}.`;
  if (score >= 0.70) return `A close match to ${target}.`;
  if (score >= 0.55) return `Broadly comparable to ${target}.`;
  if (score >= 0.35) return `Only partly comparable to ${target}.`;
  return `Clearly different from ${target}.`;
}

const ICON_FOR = {
  aridity_and_soil_moisture: 'droplet',
  elevation_and_slope: 'slope',
  geology_and_surface_material: 'layers',
  ice_and_water_indicators: 'snow',
  temperature: 'temp'
};

function sentence(key, m, score, target) {
  const v = verdict(score, target);
  switch (key) {
    case 'aridity_and_soil_moisture': {
      const ai = m.aridity_index_p_pet;
      const sm = m.soil_moisture_0_7cm_m3m3;
      return `${num(m.annual_precipitation_mm)} mm of rain a year against ` +
             `${num(m.annual_pet_mm)} mm of potential evaporation — an aridity index of ` +
             `${num(ai, 3)}${sm != null ? `, with topsoil moisture at ${num(sm, 3)} m³/m³` : ''}. ${v}`;
    }
    case 'elevation_and_slope':
      return `${num(m.elevation_m)} m above sea level on ground sloping about ` +
             `${num(m.slope_deg, 1)}°. ${v}`;
    case 'geology_and_surface_material': {
      const soil = (m.topsoil_sand_pct != null)
        ? ` Topsoil runs ${num(m.topsoil_sand_pct)}% sand to ${num(m.topsoil_clay_pct)}% clay.` : '';
      return `${m.lithology_assessment || m.lithology}. Bedrock is ${String(m.bedrock_unit).toLowerCase()}.${soil} ${v}`;
    }
    case 'ice_and_water_indicators': {
      const w = m.likely_open_water_body
        ? ' There is likely standing water nearby, which Mars and the Moon have none of.'
        : ' No standing water is expected.';
      return `${num(m.freezing_day_ratio * 100)}% of days fall below freezing and snowfall accounts for ` +
             `${num(m.snowfall_water_equiv_ratio * 100)}% of precipitation.${w} ${v}`;
    }
    case 'temperature':
      return `A mean annual ${num(m.annual_mean_temp_c, 1)}°C, swinging about ` +
             `${num(m.mean_diurnal_range_c, 1)}°C between day and night. ${v}`;
    default:
      return v;
  }
}

/** Best matches first. Flip the sort to lead with the biggest gaps. */
export function buildInsights(analysis) {
  const target = shortTarget(analysis.target_name);

  const items = CRITERIA.map(c => {
    const out = analysis.criteria[c.key];
    if (!out) return null;
    if (!out.available) {
      return {
        key: c.key, title: c.full, score: null, weight: out.assigned_weight,
        icon: ICONS[ICON_FOR[c.key]] || ICONS.layers,
        text: `No data was available here, so this criterion was left out and its ` +
              `weight shared across the others.`
      };
    }
    return {
      key: c.key, title: c.full, score: out.normalized_score,
      weight: out.effective_weight,
      icon: ICONS[ICON_FOR[c.key]] || ICONS.layers,
      text: sentence(c.key, out.raw_metrics || {}, out.normalized_score, target)
    };
  }).filter(Boolean);

  items.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  return items;
}

/** One line summing the whole thing up, for under the headline number. */
export function headlineNote(analysis) {
  const pct = analysis.illustrative_score_pct;
  const t = shortTarget(analysis.target_name);
  if (pct >= 80) return `An unusually strong analog for ${t}.`;
  if (pct >= 65) return `A good analog for ${t} on most measures.`;
  if (pct >= 50) return `A partial analog for ${t}.`;
  if (pct >= 35) return `A weak analog for ${t}.`;
  return `Not a close analog for ${t}.`;
}
