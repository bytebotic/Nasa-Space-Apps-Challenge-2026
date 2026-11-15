/* ============================================================
   team.js — the Team page (three scroll sections)
   ============================================================ */


export const TEAM = {
  name: 'X Astronomy Team',
  tagline: 'Exploring. Learning. Innovating.',
  mission: 'A passionate team united by one mission: to bridge the gap between Earth and the cosmos.',

  members: [
    { name: 'Ali Sarhan',    role: 'Team Lead',    badge: 'founder',
      blurb: 'Leading our journey toward the stars.',
      photo: 'assets/team/founder.jpg' },

    { name: 'Mariam Bahjat', role: 'UI/UX', badge: 'cofounder',
      blurb: 'Charting our course.',
      photo: 'assets/team/cofounder.jpg' },

    { name: 'Mohammed Ali',    role: 'Backend Development',   blurb: 'Bridging Earth and data.',
      photo: 'assets/team/research.jpg' },

    { name: 'Mohammed Khudair',    role: 'Backend Development',       blurb: 'Keeping the engines running.',
      photo: 'assets/team/data.jpg' },

    { name: 'Mustaffa Mohammed',    role: 'Frontend Development',     blurb: 'Building the view from Earth.',
      photo: 'assets/team/design.jpg' },

    { name: 'Ruqayah Baqer',    role: 'UI/UX',   blurb: 'Telling the story visually.',
      photo: 'assets/team/outreach.jpg' }
  ],

  /* Behind the scenes. type: 'video' | 'photo' */
  gallery: [
    { type: 'video', src: 'assets/team/bts-clip.mp4', poster: 'assets/team/bts-clip-poster.jpg',
      caption: 'Building Earth-to-Space between coffees' },
    { type: 'photo', src: 'assets/team/bts-3.jpg', caption: 'The team, mid-build' },
    { type: 'photo', src: 'assets/team/bts-2.jpg', caption: 'Heads down at the café' },
    { type: 'photo', src: 'assets/team/bts-1.jpg', caption: 'Workstation of the day' }
  ]
};

/* ---------- the backlit Earth + silhouettes in the hero ---------- */
function person(cx, baseY, h, w) {
  const shoulderY = baseY - h * 0.70;
  const headR = w * 0.62;
  const headY = shoulderY - w * 0.72 - headR * 0.75;
  return `
    <path d="M ${cx - w} ${baseY}
             L ${cx - w} ${shoulderY}
             Q ${cx - w} ${shoulderY - w * 0.95}, ${cx} ${shoulderY - w * 0.95}
             Q ${cx + w} ${shoulderY - w * 0.95}, ${cx + w} ${shoulderY}
             L ${cx + w} ${baseY} Z"/>
    <circle cx="${cx}" cy="${headY}" r="${headR}"/>`;
}

function heroArt() {
  const base = 300;
  const people = [
    [168, 150, 26], [248, 182, 29], [330, 206, 31],
    [412, 200, 31], [492, 176, 28], [572, 146, 26]
  ].map(([cx, h, w]) => person(cx, base, h, w)).join('');

  return `
  <svg class="team-hero-art" viewBox="0 0 740 320" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="tEarth" cx="42%" cy="34%" r="72%">
        <stop offset="0%"  stop-color="var(--team-earth-1)"/>
        <stop offset="62%" stop-color="var(--team-earth-2)"/>
        <stop offset="100%" stop-color="var(--team-earth-3)"/>
      </radialGradient>
      <linearGradient id="tFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="55%" stop-color="var(--team-silhouette)" stop-opacity="1"/>
        <stop offset="100%" stop-color="var(--team-silhouette)" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="tClip"><rect x="0" y="0" width="740" height="300"/></clipPath>
    </defs>

    <circle cx="370" cy="268" r="212" fill="url(#tEarth)"/>
    <circle cx="370" cy="268" r="212" fill="none"
            stroke="var(--team-rim)" stroke-width="2" opacity=".65"/>

    <g clip-path="url(#tClip)" fill="url(#tFade)">${people}</g>
    <g clip-path="url(#tClip)" fill="none" stroke="var(--team-rim)"
       stroke-width="1.5" opacity=".42">${people}</g>

    <ellipse cx="370" cy="214" rx="330" ry="76" fill="none"
             stroke="var(--orbit)" stroke-width="1.6"
             transform="rotate(-7 370 214)"/>
    <circle cx="48"  cy="236" r="6.5" fill="var(--accent)"/>
    <circle cx="692" cy="190" r="6.5" fill="var(--accent)"/>
  </svg>`;
}

const AVATAR = `
<svg class="avatar-art" viewBox="0 0 120 120" fill="none" aria-hidden="true">
  <circle cx="60" cy="60" r="56" fill="var(--panel-hi)" stroke="var(--border)" stroke-width="1.5"/>
  <g fill="var(--team-silhouette)">
    <circle cx="60" cy="47" r="19"/>
    <path d="M24 108c0-21 16-34 36-34s36 13 36 34z"/>
  </g>
  <ellipse cx="60" cy="62" rx="54" ry="20" fill="none"
           stroke="var(--border-strong)" stroke-width="1.6" transform="rotate(-18 60 62)"/>
  <circle cx="106" cy="52" r="4.5" fill="var(--accent)"/>
</svg>`;

const BADGE = {
  founder: `<span class="member-badge">♛ Founder</span>`,
  cofounder: `<span class="member-badge">★ Co-Founder</span>`
};

const CHEVRON = `<svg width="20" height="12" viewBox="0 0 22 12" fill="none">
  <path d="M1 1l10 9 10-9" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const eyebrow = (t) => `<div class="eyebrow-row"><span class="eyebrow">${t}</span></div>`;

/* ---------- the page ---------- */
export function teamHTML() {
  const leads = TEAM.members.filter(m => m.badge);
  const rest = TEAM.members.filter(m => !m.badge);

  const card = (m, lead) => `
    <article class="member-card ${lead ? 'is-lead' : ''}">
      ${m.badge ? BADGE[m.badge] || '' : ''}
      <div class="member-avatar">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}">` : AVATAR}
      </div>
      <h3 class="member-name">${m.name}</h3>
      ${m.role ? `<span class="member-role">${m.role}</span>` : ''}
      ${m.blurb ? `<p class="member-blurb">${m.blurb}</p>` : ''}
    </article>`;

  const tiles = TEAM.gallery.map((g, i) => `
    <button class="bts-tile tile-${i}" data-tile="${i}">
      ${g.type === 'video'
        ? `<img src="${g.poster}" alt="${g.caption}">
           <span class="play-badge">
             <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor">
               <path d="M3 2.2v17.6L18.5 11z"/></svg>
           </span>`
        : `<img src="${g.src}" alt="${g.caption}" loading="lazy">`}
      <span class="bts-caption">${g.caption}</span>
    </button>`).join('');

  return `
  <div class="team-page">

    <section class="team-section team-hero">
      ${eyebrow('Our Team')}
      <h1 class="title team-title">${TEAM.name}</h1>
      <p class="subtitle team-tagline">${TEAM.tagline}</p>
      ${heroArt()}
      <p class="team-mission">${TEAM.mission}</p>
      <button class="scroll-dot" data-to="teamMembers" aria-label="Meet the team">${CHEVRON}</button>
    </section>

    <section class="team-section" id="teamMembers">
      ${eyebrow('Our Team')}
      <h2 class="title">Meet Our Team</h2>
      <p class="subtitle">${TEAM.mission}</p>
      <div class="member-grid">
        <div class="lead-group">${leads.map(m => card(m, true)).join('')}</div>
        ${leads.length && rest.length ? '<span class="member-divider"></span>' : ''}
        <div class="rest-group">${rest.map(m => card(m, false)).join('')}</div>
      </div>
      <button class="scroll-dot" data-to="teamBts" aria-label="Behind the scenes">${CHEVRON}</button>
    </section>

    <section class="team-section" id="teamBts">
      ${eyebrow('Our Team')}
      <h2 class="title">Behind the Scenes</h2>
      <p class="subtitle">A glimpse into our journey, activities, and special moments.</p>
      <div class="bts-mosaic">${tiles}</div>
    </section>

  </div>

  <div class="lightbox" id="lightbox" hidden>
    <button class="lb-close" id="lbClose" aria-label="Close">&times;</button>
    <div class="lb-stage" id="lbStage"></div>
  </div>`;
}

export function wireTeam() {
  document.querySelectorAll('.scroll-dot').forEach(b =>
    b.addEventListener('click', () => {
      const t = document.getElementById(b.dataset.to);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

  const box = document.getElementById('lightbox');
  const stage = document.getElementById('lbStage');
  if (!box) return;

  const close = () => {
    box.hidden = true;
    stage.innerHTML = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-tile]').forEach(b =>
    b.addEventListener('click', () => {
      const g = TEAM.gallery[+b.dataset.tile];
      stage.innerHTML = g.type === 'video'
        ? `<video src="${g.src}" poster="${g.poster}" controls autoplay playsinline></video>
           <p class="lb-caption">${g.caption}</p>`
        : `<img src="${g.src}" alt="${g.caption}">
           <p class="lb-caption">${g.caption}</p>`;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
    }));

  document.getElementById('lbClose').addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' && !box.hidden) close();
  });
}
