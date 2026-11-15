/* ============================================================
   state.js — what the visitor has chosen so far.
   Survives a page refresh so the URL stays truthful.
   ============================================================ */

const KEY = 'ets.journey';

const blank = { body: null, profile: null, site: null, coords: null };

function load() {
  try { return { ...blank, ...JSON.parse(sessionStorage.getItem(KEY) || '{}') }; }
  catch { return { ...blank }; }
}

export const State = {
  data: load(),

  get body()    { return this.data.body; },      // 'mars' | 'moon'
  get profile() { return this.data.profile; },   // TargetProfileKey
  get site()    { return this.data.site; },      // CandidateSite | null
  get coords()  { return this.data.coords; },    // { lat, lon } | null

  set(patch) {
    this.data = { ...this.data, ...patch };
    try { sessionStorage.setItem(KEY, JSON.stringify(this.data)); } catch {}
    return this.data;
  },

  reset() {
    this.data = { ...blank };
    try { sessionStorage.removeItem(KEY); } catch {}
  }
};
