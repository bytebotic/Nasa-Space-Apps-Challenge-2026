/* ============================================================
   api.js — THE ONLY FILE THAT TALKS TO THE API.

   Wired to the live backend:
     GET /analyze?lat=&lon=&target=   -> AnalogAnalysisResponse
     GET /targets                     -> { key: TargetProfileSummary }
     GET /candidates                  -> { candidates: CandidateSite[] }

   If the network call can't be made at all (for example inside a
   sandboxed preview that blocks cross-origin requests), we fall back
   to the bundled sample data so the site still demonstrates. A real
   HTTP error from the server is NOT hidden — that shows the error page.
   ============================================================ */

import { CANDIDATE_SITES, profilesFor, mockAnalysis } from './data.js';

export const BASE_URL = 'https://earth-to-space-back-end.onrender.com';

const ROUTES = {
  targets: '/targets',
  candidates: '/candidates',
  analyze: '/analyze'
};

/* Render's free tier sleeps; a cold start can take the better part of a minute. */
const TIMEOUT_MS = 70000;

export class ApiError extends Error {
  constructor(message, status) { super(message); this.name = 'ApiError'; this.status = status; }
}
/** Thrown when the request never reached the server at all. */
class OfflineError extends Error {}

async function request(path, params) {
  const url = new URL(BASE_URL + path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' }, signal: ctrl.signal });
  } catch (e) {
    throw new OfflineError(e && e.name === 'AbortError' ? 'timeout' : 'unreachable');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = typeof body.detail === 'string' ? body.detail
             : Array.isArray(body.detail) ? body.detail.map(d => d.msg).join('; ')
             : '';
    } catch { /* body wasn't JSON */ }
    throw new ApiError(detail || `The analysis service responded with ${res.status}.`, res.status);
  }

  try {
    return await res.json();
  } catch {
    throw new ApiError('The service returned something that was not JSON.', res.status);
  }
}

export const Api = {
  /** null = not tried yet, true = live data, false = using bundled samples */
  live: null,
  onModeChange: null,

  _setLive(v) {
    if (this.live === v) return;
    this.live = v;
    if (typeof this.onModeChange === 'function') this.onModeChange(v);
  },

  /** TargetProfileSummary[] for one body ('Mars' | 'Moon') */
  async getProfiles(body) {
    try {
      const obj = await request(ROUTES.targets);
      this._setLive(true);
      return Object.entries(obj)
        .map(([key, v]) => ({ key, ...v }))
        .filter(p => p.body === body);
    } catch (e) {
      if (e instanceof OfflineError) { this._setLive(false); return profilesFor(body); }
      throw e;
    }
  },

  /** CandidateSite[] — fetched once, then filtered in the browser */
  async getSites() {
    if (this._sites) return this._sites;
    try {
      const body = await request(ROUTES.candidates);
      this._setLive(true);
      this._sites = Array.isArray(body) ? body : (body.candidates || []);
    } catch (e) {
      if (!(e instanceof OfflineError)) throw e;
      this._setLive(false);
      this._sites = CANDIDATE_SITES;
    }
    return this._sites;
  },

  /** Free-text search across the candidate sites */
  async searchSites(query, limit = 6) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const sites = await this.getSites();
    return sites
      .filter(s => `${s.name} ${s.country}`.toLowerCase().includes(q))
      .slice(0, limit);
  },

  /** AnalogAnalysisResponse for one point against one target profile */
  async analyze({ lat, lon, target }) {
    try {
      const data = await request(ROUTES.analyze, { lat, lon, target });
      this._setLive(true);
      return data;
    } catch (e) {
      if (e instanceof OfflineError) {
        this._setLive(false);
        return mockAnalysis(lat, lon, target);
      }
      throw e;
    }
  }
};
