/* ============================================================
   data.js
   1. Static content for the Moon / Mars briefs (not from the API)
   2. Target profiles + mock API data, shaped to match the real
      TypeScript contract exactly, so swapping in the live API
      only means flipping API.useMock to false in api.js
   ============================================================ */

/* ---------- static planet content ---------- */
export const PLANETS = {
  mars: {
    id: 'mars',
    body: 'Mars',
    theme: 'mars',
    name: 'Mars',
    headline: 'The Red Planet',
    blurb: 'Mars is a cold, dry world with rugged terrain, dust storms and polar ice caps. ' +
           'Its environment offers valuable insights for future exploration.',
    orb: 'assets/mars.png',
    destTitle: 'Destination: Mars',
    destSub: "We'll find places on Earth that test like the Martian surface.",
    continueLabel: 'Continue to Mars',
    chips: [
      { icon: 'temp',    label: 'Avg. Temp.',  value: '−63°C' },
      { icon: 'mountains', label: 'Terrain',     value: 'Rocky & Desert' },
      { icon: 'gravity', label: 'Gravity',     value: '0.38 g' },
      { icon: 'wind',    label: 'Atmosphere',  value: 'Thin CO₂' }
    ]
  },
  moon: {
    id: 'moon',
    body: 'Moon',
    theme: 'moon',
    name: 'Moon',
    headline: "Earth's Natural Satellite",
    blurb: 'The Moon is a rocky body with no atmosphere, featuring extreme temperatures and ' +
           'abundant craters. It serves as a valuable analog for testing exploration ' +
           'technologies and procedures.',
    orb: 'assets/moon.png',
    destTitle: 'Destination: The Moon',
    destSub: "We'll find places on Earth that test like the lunar surface.",
    continueLabel: 'Continue to the Moon',
    chips: [
      { icon: 'temp',    label: 'Avg. Temp.', value: '−173 to 127°C' },
      { icon: 'craters', label: 'Terrain',    value: 'Cratered' },
      { icon: 'gravity', label: 'Gravity',    value: '0.16 g' },
      { icon: 'dust',    label: 'Atmosphere', value: 'None' }
    ]
  }
};

/* ---------- the five criteria, with short labels for the radar ---------- */
export const CRITERIA = [
  { key: 'aridity_and_soil_moisture',    short: 'Aridity',     full: 'Aridity & soil moisture' },
  { key: 'elevation_and_slope',          short: 'Elevation',   full: 'Elevation & slope' },
  { key: 'geology_and_surface_material', short: 'Geology',     full: 'Geology & surface material' },
  { key: 'ice_and_water_indicators',     short: 'Ice & Water', full: 'Ice & water indicators' },
  { key: 'temperature',                  short: 'Temperature', full: 'Temperature' }
];

/* ---------- TargetProfileSummary[] — mirrors the API type ---------- */
export const TARGET_PROFILES = {
  mars_regolith: {
    key: 'mars_regolith', name: 'Mars — Dry Basaltic Regolith & Rover Mobility', body: 'Mars',
    description: 'Hyper-arid, cold basaltic plains and craters (e.g., Jezero/Gale analog).',
    default_weights: {
      aridity_and_soil_moisture: 0.25, elevation_and_slope: 0.20,
      geology_and_surface_material: 0.25, ice_and_water_indicators: 0.10, temperature: 0.20
    }
  },
  mars_polar: {
    key: 'mars_polar', name: 'Mars — Polar & Permafrost Ice Operations', body: 'Mars',
    description: 'Cold, dry periglacial terrain for subsurface ice drilling and ISRU.',
    default_weights: {
      aridity_and_soil_moisture: 0.15, elevation_and_slope: 0.15,
      geology_and_surface_material: 0.15, ice_and_water_indicators: 0.35, temperature: 0.20
    }
  },
  lunar_basalt: {
    key: 'lunar_basalt', name: 'Moon — Lunar Maria Basaltic Terrain', body: 'Moon',
    description: 'Dry, rocky basaltic lava fields and pyroclastic regolith for EVA & mobility.',
    default_weights: {
      aridity_and_soil_moisture: 0.20, elevation_and_slope: 0.25,
      geology_and_surface_material: 0.30, ice_and_water_indicators: 0.10, temperature: 0.15
    }
  },
  lunar_polar: {
    key: 'lunar_polar', name: 'Moon — South Pole Cryogenic & Crater Rim Analog', body: 'Moon',
    description: 'Steep crater-like relief with extreme cold and volatile ice indicators.',
    default_weights: {
      aridity_and_soil_moisture: 0.15, elevation_and_slope: 0.25,
      geology_and_surface_material: 0.15, ice_and_water_indicators: 0.25, temperature: 0.20
    }
  }
};

export const profilesFor = (body) =>
  Object.values(TARGET_PROFILES).filter(p => p.body === body);

/* ---------- CandidateSite[] — mock until the API lands ---------- */
export const CANDIDATE_SITES = [
  { id: 'atacama',   name: 'Atacama Desert',                          country: 'Chile',                 lat: -24.5000, lon:  -69.2500, recommended_target: 'mars_regolith' },
  { id: 'dallol',    name: 'Dallol / Danakil Depression',             country: 'Ethiopia',              lat:  14.2417, lon:   40.3000, recommended_target: 'mars_regolith' },
  { id: 'iceland',   name: 'Icelandic Volcanic & Glacial Terrain',    country: 'Iceland',               lat:  64.9631, lon:  -19.0208, recommended_target: 'mars_polar' },
  { id: 'oman',      name: 'Oman Desert Landscapes (Wahiba / Dhofar)',country: 'Oman',                  lat:  21.5000, lon:   57.0000, recommended_target: 'mars_regolith' },
  { id: 'mauna_kea', name: 'Mauna Kea Volcanic Fields',               country: 'Hawaii, USA',           lat:  19.8207, lon: -155.4681, recommended_target: 'lunar_basalt' },
  { id: 'lanzarote', name: 'Lanzarote Volcanic Fields',               country: 'Canary Islands, Spain', lat:  29.0469, lon:  -13.5899, recommended_target: 'lunar_basalt' },
  { id: 'mcmurdo',   name: 'McMurdo Dry Valleys',                     country: 'Antarctica',            lat: -77.4667, lon:  162.5167, recommended_target: 'mars_polar' }
];

/* ---------- deterministic mock AnalogAnalysisResponse ----------
   Shaped field-for-field like the real contract. Values are
   plausible, not real: this is placeholder data only.          */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}
const jitter = (seed, lo, hi) => lo + hash(seed) * (hi - lo);

export function mockAnalysis(lat, lon, profileKey) {
  const profile = TARGET_PROFILES[profileKey] || TARGET_PROFILES.mars_regolith;
  const seed = `${lat.toFixed(2)},${lon.toFixed(2)},${profileKey}`;
  const cold = Math.abs(lat) > 60;

  const scores = {
    aridity_and_soil_moisture:    jitter(seed + 'a', cold ? .55 : .70, cold ? .80 : .97),
    elevation_and_slope:          jitter(seed + 'e', .35, .88),
    geology_and_surface_material: jitter(seed + 'g', .45, .92),
    ice_and_water_indicators:     jitter(seed + 'i', cold ? .60 : .05, cold ? .95 : .40),
    temperature:                  jitter(seed + 't', cold ? .70 : .40, cold ? .95 : .80)
  };

  // one criterion occasionally unavailable, so the UI must cope with gaps
  const missing = hash(seed + 'm') > 0.82 ? ['geology_and_surface_material'] : [];
  missing.forEach(k => { scores[k] = null; });

  const availableKeys = CRITERIA.map(c => c.key).filter(k => scores[k] !== null);
  const weightSum = availableKeys.reduce((s, k) => s + profile.default_weights[k], 0);

  const build = (key, raw, target, evidence) => {
    const available = scores[key] !== null;
    const eff = available ? profile.default_weights[key] / weightSum : 0;
    return {
      criterion: key,
      available,
      normalized_score: available ? +scores[key].toFixed(3) : null,
      assigned_weight: profile.default_weights[key],
      effective_weight: +eff.toFixed(3),
      weighted_score: available ? +(scores[key] * eff).toFixed(4) : null,
      raw_metrics: raw,
      target_reference: target,
      evidence
    };
  };

  const meanTemp = +(28 - Math.abs(lat) * 0.62 + jitter(seed + 'mt', -4, 4)).toFixed(1);
  const precip = Math.round(jitter(seed + 'p', 1, 240));
  const pet = Math.round(jitter(seed + 'pe', 700, 2100));

  const criteria = {
    aridity_and_soil_moisture: build('aridity_and_soil_moisture', {
      aridity_index_p_pet: +(precip / pet).toFixed(4),
      annual_precipitation_mm: precip,
      annual_pet_mm: pet,
      soil_moisture_0_7cm_m3m3: +jitter(seed + 'sm', 0.01, 0.18).toFixed(3)
    }, { aridity_index_p_pet: 0.0, soil_moisture_0_7cm_m3m3: 0.0 }, {
      source: 'ERA5-Land reanalysis (placeholder)',
      spatial_resolution: '~9 km',
      limitations: 'Mock values until the live API is connected.'
    }),
    elevation_and_slope: build('elevation_and_slope', {
      elevation_m: Math.round(jitter(seed + 'el', 20, 4200)),
      slope_deg: +jitter(seed + 'sl', 0.2, 14).toFixed(1)
    }, { elevation_m: 0, slope_deg: 2.5 }, {
      source: 'Copernicus DEM (placeholder)',
      spatial_resolution: '30 m',
      limitations: 'Mock values until the live API is connected.'
    }),
    geology_and_surface_material: build('geology_and_surface_material', {
      bedrock_unit: 'Basaltic volcanic sequence',
      lithology: 'Basalt, andesite, volcaniclastic sediment',
      lithology_assessment: 'Strong match to basaltic regolith',
      topsoil_sand_pct: Math.round(jitter(seed + 'sa', 55, 92)),
      topsoil_clay_pct: Math.round(jitter(seed + 'cl', 2, 18))
    }, { lithology: 'Basaltic regolith', topsoil_sand_pct: 95 }, {
      source: 'GLiM lithological map (placeholder)',
      spatial_resolution: '~1 km',
      limitations: 'Mock values until the live API is connected.'
    }),
    ice_and_water_indicators: build('ice_and_water_indicators', {
      freezing_day_ratio: +jitter(seed + 'fd', cold ? .55 : .0, cold ? .99 : .25).toFixed(3),
      snowfall_water_equiv_ratio: +jitter(seed + 'sw', 0, cold ? .6 : .08).toFixed(3),
      likely_open_water_body: hash(seed + 'ow') > 0.75
    }, { freezing_day_ratio: 1.0, likely_open_water_body: false }, {
      source: 'ERA5-Land snow & temperature (placeholder)',
      spatial_resolution: '~9 km',
      limitations: 'Mock values until the live API is connected.'
    }),
    temperature: build('temperature', {
      annual_mean_temp_c: meanTemp,
      mean_diurnal_range_c: +jitter(seed + 'dr', 6, 26).toFixed(1)
    }, { annual_mean_temp_c: -63, mean_diurnal_range_c: 70 }, {
      source: 'WorldClim v2 (placeholder)',
      spatial_resolution: '~1 km',
      limitations: 'Mock values until the live API is connected.'
    })
  };

  const weighted = CRITERIA.reduce((s, c) => s + (criteria[c.key].weighted_score || 0), 0);

  return {
    coordinates: { lat, lon },
    target_profile: profile.key,
    target_name: profile.name,
    planetary_body: profile.body,
    illustrative_weighted_score: +weighted.toFixed(4),
    illustrative_score_pct: Math.round(weighted * 100),
    data_coverage: {
      available_criteria: availableKeys.length,
      total_criteria: CRITERIA.length,
      coverage_ratio: +(availableKeys.length / CRITERIA.length).toFixed(2),
      missing_criteria: missing
    },
    criteria,
    scientific_disclaimer:
      'This score is illustrative only. It compares a small set of environmental indicators ' +
      'and is not a formal planetary analog assessment.'
  };
}
