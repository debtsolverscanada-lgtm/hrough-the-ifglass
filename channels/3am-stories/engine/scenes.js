// 3 AM Stories scene library. Every scene is drawn in a 1920x1920 world centred on (960,960);
// the long video shows the middle 1920x1080 band, Shorts show the middle 1080x1920 column.
// S[name](t, d, p) returns SVG for time t (seconds into the scene) of a scene lasting d seconds.
const INK = '#120d0a';
let VW = 1920;  // width of the visible window (1080 for Shorts); text is sized to fit it
const fit = (txt, size, frac = 0.88) => Math.min(size, VW * frac / (0.62 * String(txt).length));
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const noise = (t, k = 1) => Math.sin(t * 12.9898 * k) * 43758.5453 % 1;
const flick = (t, rate = 1) => (Math.abs(noise(Math.floor(t * 18 * rate))) > 0.86 ? 0.35 : 1);

const DEFS = `<defs>
  <radialGradient id="skin" cx="45%" cy="38%" r="70%"><stop offset="0" stop-color="#f3e7da"/><stop offset=".65" stop-color="#d9c6b2"/><stop offset="1" stop-color="#9c8672"/></radialGradient>
  <radialGradient id="skinOld" cx="45%" cy="38%" r="70%"><stop offset="0" stop-color="#f0dcc8"/><stop offset="1" stop-color="#a78a70"/></radialGradient>
  <radialGradient id="phoneGlow" r="50%"><stop offset="0" stop-color="#bfe3ff" stop-opacity=".7"/><stop offset=".5" stop-color="#4a90e0" stop-opacity=".2"/><stop offset="1" stop-color="#0a2a55" stop-opacity="0"/></radialGradient>
  <radialGradient id="warm" r="50%"><stop offset="0" stop-color="#ffe2a6" stop-opacity=".75"/><stop offset=".5" stop-color="#ffb04d" stop-opacity=".22"/><stop offset="1" stop-color="#ff8a00" stop-opacity="0"/></radialGradient>
  <radialGradient id="cold" r="50%"><stop offset="0" stop-color="#e8f4ff" stop-opacity=".8"/><stop offset=".5" stop-color="#9cc8ff" stop-opacity=".2"/><stop offset="1" stop-color="#2a4a7a" stop-opacity="0"/></radialGradient>
  <radialGradient id="eyeGlow" r="50%"><stop offset="0" stop-color="#fff2f2"/><stop offset=".25" stop-color="#ff3b3b"/><stop offset=".6" stop-color="#b00000" stop-opacity=".45"/><stop offset="1" stop-color="#600" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></radialGradient>
  <linearGradient id="blanket" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3550"/><stop offset="1" stop-color="#0b0f1c"/></linearGradient>
  <linearGradient id="hoodie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2f3d"/><stop offset="1" stop-color="#0e1016"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14110f"/><stop offset="1" stop-color="#050404"/></linearGradient>
  <filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="SEED"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
</defs>`;

// ---------- characters ----------
// STYLE 'sketch' (story.json "style": "sketch") swaps the round cartoon heads for drawn people: hair, ears, nose,
// almond eyes, lips, inked shading, and a "line boil" wobble so it reads as hand-drawn animation.
let STYLE = 'cartoon';
const SK = { ink: '#16100c', skin: '#e6cdb4', skinD: '#b8977a', hair: '#1d1510', iris: '#4a2f1e' };
const skHatch = (x, y, w, h, n, sl = 0.35) => [...Array(n)].map((_, k) => `<path d="M${x + k * w / n} ${y} l${sl * h} ${h}" stroke="${SK.ink}" stroke-width="2.5" opacity=".35"/>`).join('');
function skHead(o) {
  const look = o.look || 0, eyes = o.eyes || 'normal', ink = SK.ink;
  const skin = o.skin === 'url(#skinOld)' ? '#e3cbb6' : SK.skin;
  const open = o.blink || eyes === 'closed' ? 0 : eyes === 'wide' ? 1.45 : eyes === 'tired' ? 0.55 : 1;
  const face = 'M-108 -40 Q-114 85 -52 132 Q0 158 52 132 Q114 85 108 -40 Q104 -142 0 -146 Q-104 -142 -108 -40Z';
  if (o.back) return `<path d="M-110 120 L-60 150 h120 L110 120" fill="${skin}" stroke="${ink}" stroke-width="5"/>
    <ellipse cx="-112" cy="0" rx="16" ry="28" fill="${skin}" stroke="${ink}" stroke-width="5"/><ellipse cx="112" cy="0" rx="16" ry="28" fill="${skin}" stroke="${ink}" stroke-width="5"/>
    <path d="M-120 40 Q-140 -160 0 -165 Q140 -160 120 40 Q110 120 60 135 Q0 120 -60 135 Q-110 120 -120 40Z" fill="${SK.hair}" stroke="${ink}" stroke-width="5"/>
    ${[...Array(12)].map((_, k) => `<path d="M${-90 + k * 16} -140 q${k % 2 ? 10 : -8} 120 ${k % 3 - 1} 260" stroke="#3a2c22" stroke-width="3" fill="none"/>`).join('')}`;
  const eye = (ex, side) => {
    if (!open) return `<path d="M${ex - 30} -6 q30 12 60 0" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${ex - 26} 8 q26 8 52 0" stroke="${SK.skinD}" stroke-width="3" fill="none"/>`;
    const h = 15 * open;
    return `<g transform="translate(${ex},-8)">
      <path d="M-32 0 Q0 ${-h * 1.5} 32 0 Q0 ${h * 1.1} -32 0Z" fill="${o.black ? '#050505' : '#f8f3ea'}" stroke="${ink}" stroke-width="4"/>
      ${o.black ? `<circle cx="${look * 8}" r="3.5" fill="#fff" opacity=".8"/>` : `<clipPath id="ec${side}"><path d="M-32 0 Q0 ${-h * 1.5} 32 0 Q0 ${h * 1.1} -32 0Z"/></clipPath>
        <g clip-path="url(#ec${side})"><circle cx="${look * 12}" cy="-1" r="${eyes === 'wide' ? 9 : 12}" fill="${SK.iris}" stroke="${ink}" stroke-width="2"/><circle cx="${look * 12}" cy="-1" r="${eyes === 'wide' ? 3.5 : 5.5}" fill="#050302"/><circle cx="${look * 12 + 4}" cy="-5" r="2.6" fill="#fff"/></g>`}
      <path d="M-34 ${-2} Q0 ${-h * 1.5 - 4} 34 -2" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M-24 ${h + 8} q24 ${eyes === 'tired' ? 12 : 7} 48 0" stroke="${SK.skinD}" stroke-width="3" fill="none"/>
    </g>`;
  };
  const browY = eyes === 'wide' ? -62 : -52, browT = eyes === 'wide' ? -14 : eyes === 'tired' ? 6 : -4;
  const mouth = o.smile
    ? `<path d="M-62 56 Q0 ${56 + 70 * o.smile} 62 56 Q0 ${70 + 20 * o.smile} -62 56Z" fill="#2a0707" stroke="${ink}" stroke-width="4"/>${[...Array(9)].map((_, k) => `<path d="M${-48 + k * 12} ${60 + 3 * Math.sin(k)} l6 12 l6 -12" fill="#efe6d4" stroke="${ink}" stroke-width="1.5"/>`).join('')}`
    : o.mouth === 'o' ? `<ellipse cx="0" cy="74" rx="15" ry="20" fill="#2a0707" stroke="${ink}" stroke-width="4"/><path d="M-20 98 q20 8 40 0" stroke="${SK.skinD}" stroke-width="3" fill="none"/>`
    : eyes === 'wide' ? `<path d="M-26 70 Q0 62 26 70 Q0 84 -26 70Z" fill="#3a1010" stroke="${ink}" stroke-width="4"/><path d="M-18 92 q18 6 36 0" stroke="${SK.skinD}" stroke-width="3" fill="none"/>`
    : `<path d="M-28 70 Q-8 64 0 67 Q8 64 28 70" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-18 86 q18 7 36 0" stroke="#b07a6a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const hair = o.hair || `<path d="M-122 -10 Q-142 -158 -10 -172 Q128 -176 126 -20 L112 -70 L100 -52 L90 -98 L66 -72 L52 -112 L28 -80 L4 -118 L-20 -84 L-46 -114 L-62 -78 L-88 -104 L-98 -64 L-112 -80Z" fill="${SK.hair}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
    ${[...Array(9)].map((_, k) => `<path d="M${-96 + k * 22} -150 q${8 - k % 3 * 6} 30 ${-4 + k % 2 * 8} 64" stroke="#3d2e24" stroke-width="3" fill="none"/>`).join('')}`;
  return `<path d="M-46 100 L-50 190 L50 190 L46 100Z" fill="${SK.skinD}" stroke="${ink}" stroke-width="5"/>
    <ellipse cx="-110" cy="0" rx="17" ry="30" fill="${skin}" stroke="${ink}" stroke-width="5"/><ellipse cx="110" cy="0" rx="17" ry="30" fill="${skin}" stroke="${ink}" stroke-width="5"/>
    <path d="${face}" fill="${skin}" stroke="${ink}" stroke-width="6"/>
    <path d="M-104 -10 Q-100 90 -46 128 Q-80 80 -84 -10Z" fill="${SK.skinD}" opacity=".55"/>${skHatch(-100, 10, 40, 90, 6)}
    ${o.light ? `<path d="${face}" fill="${o.light}" opacity=".2"/>` : ''}
    ${hair}
    <path d="M-80 ${browY} q30 ${browT - 10} 62 ${-browT / 2} M80 ${browY} q-30 ${browT - 10} -62 ${-browT / 2}" stroke="${SK.hair}" stroke-width="9" fill="none" stroke-linecap="round"/>
    ${eye(-44, 'L' + Math.round(Math.random() * 1e6))}${eye(44, 'R' + Math.round(Math.random() * 1e6))}
    <path d="M-2 -4 Q-14 34 -12 42 Q-2 52 14 44" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-10 46 q-6 -4 -12 2 M14 44 q6 -4 12 2" stroke="${SK.skinD}" stroke-width="3" fill="none"/>
    ${mouth}`;
}

// "You": bald round head, huge round eyes. eyes: 'normal' | 'wide' | 'closed' | 'tired'. look: pupil offset (-1..1).
function head(x, y, s, o = {}) {
  const look = o.look || 0, eyes = o.eyes || 'normal', skin = o.skin || 'url(#skin)';
  const blink = o.blink ? 1 : 0;
  const ew = eyes === 'wide' ? 42 : 34, eh = eyes === 'wide' ? 46 : eyes === 'tired' ? 22 : 38;
  const eye = (ex) => blink || eyes === 'closed'
    ? `<path d="M${ex - 30} -6 q30 14 60 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`
    : `<g transform="translate(${ex},-6)">
        <ellipse rx="${ew + 6}" ry="${eh + 8}" fill="#1b0f0c" opacity=".3" transform="translate(0,12)"/>
        <ellipse rx="${ew}" ry="${eh}" fill="${o.black ? '#050505' : '#fffdf8'}" stroke="${INK}" stroke-width="5"/>
        ${o.black ? `<circle cx="${look * 8}" r="5" fill="#fff" opacity=".8"/>` : `<circle cx="${look * 12}" cy="2" r="${eyes === 'wide' ? 6.5 : 8}" fill="#120a08"/><circle cx="${look * 12 + 2}" cy="-1" r="2.4" fill="#fff"/>`}
      </g>`;
  const mouth = o.smile
    ? `<path d="M-70 52 Q0 ${52 + 60 * o.smile} 70 52" stroke="${INK}" stroke-width="6" fill="#2a0a0a"/>`
    : o.mouth === 'o' ? `<ellipse cx="0" cy="66" rx="13" ry="17" fill="#2a0a0a" stroke="${INK}" stroke-width="5"/>`
    : `<path d="M-14 62 q14 ${eyes === 'wide' ? -12 : 0} 28 0" stroke="${INK}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  if (STYLE === 'sketch') return `<g transform="translate(${x},${y}) scale(${s})">${o.glow ? `<circle cy="60" r="260" fill="url(#${o.glow})"/>` : ''}${skHead(o)}${o.sweat ? '<path d="M118 -40 c10 16 12 30 0 38 c-12 -8 -10 -22 0 -38z" fill="#bfe6ff" stroke="#120d0a" stroke-width="3"/>' : ''}</g>`;
  if (o.back) return `<g transform="translate(${x},${y}) scale(${s})"><circle r="130" fill="url(#skin)" stroke="${INK}" stroke-width="7"/><ellipse cx="-128" cy="10" rx="18" ry="30" fill="#cdb9a5" stroke="${INK}" stroke-width="5"/><ellipse cx="128" cy="10" rx="18" ry="30" fill="#cdb9a5" stroke="${INK}" stroke-width="5"/><path d="M-60 90 q60 20 120 0" stroke="#9c8672" stroke-width="6" fill="none" opacity=".5"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${o.glow ? `<circle cy="60" r="260" fill="url(#${o.glow})"/>` : ''}
    <circle r="130" fill="${skin}" stroke="${INK}" stroke-width="7"/>
    ${o.hair || ''}
    ${o.light ? `<circle r="130" fill="${o.light}" opacity=".18"/>` : ''}
    <path d="M-96 -70 q20 ${eyes === 'wide' ? -22 : -14} 46 -8 M96 -70 q-20 ${eyes === 'wide' ? -22 : -14} -46 -8" stroke="${INK}" stroke-width="7" stroke-linecap="round" fill="none"/>
    ${eye(-46)}${eye(46)}${mouth}
    ${o.sweat ? '<path d="M118 -40 c10 16 12 30 0 38 c-12 -8 -10 -22 0 -38z" fill="#bfe6ff" stroke="#120d0a" stroke-width="3"/>' : ''}
  </g>`;
}
// standing figure: head on a dark hoodie body. walk: phase (radians) for a gentle bob.
function person(x, y, s, o = {}) {
  const bob = o.walk ? Math.sin(o.walk) * 6 : (o.breathe ? Math.sin(o.breathe) * 3 : 0);
  if (STYLE === 'sketch') {
    const col = o.body && !o.body.startsWith('url') ? o.body : '#2b3142', ink = SK.ink, rx = o.reach ? 230 : 150, ry = o.reach ? 300 : 430;
    const hand = (hx, hy) => `<g transform="translate(${hx},${hy})"><ellipse rx="26" ry="30" fill="${SK.skin}" stroke="${ink}" stroke-width="5"/>${[-14, -4, 6, 15].map((f) => `<path d="M${f} 18 v22" stroke="${ink}" stroke-width="13" stroke-linecap="round"/><path d="M${f} 18 v22" stroke="${SK.skin}" stroke-width="7" stroke-linecap="round"/>`).join('')}</g>`;
    return `<g transform="translate(${x},${y + bob}) scale(${s})">
      <path d="M-100 60 Q0 0 100 60 L60 110 Q0 80 -60 110Z" fill="${col}" stroke="${ink}" stroke-width="6" opacity=".9"/>
      <path d="M-128 150 Q-134 50 -40 40 L40 40 Q134 50 128 150 L146 520 L-146 520Z" fill="${col}" stroke="${ink}" stroke-width="7"/>
      <path d="M-40 40 Q0 120 40 40" fill="none" stroke="${ink}" stroke-width="5"/><path d="M-14 90 v90 M14 90 v80" stroke="#d8d4cc" stroke-width="5"/>
      <path d="M-70 330 h140 v110 h-140z" fill="none" stroke="${ink}" stroke-width="4" opacity=".6"/>
      ${skHatch(-140, 200, 70, 300, 8)}${skHatch(80, 200, 60, 300, 7, -0.2)}
      <path d="M-122 160 Q-176 300 -150 430" stroke="${ink}" stroke-width="66" stroke-linecap="round" fill="none"/><path d="M-122 160 Q-176 300 -150 430" stroke="${col}" stroke-width="54" stroke-linecap="round" fill="none"/>
      <path d="M122 160 Q176 300 ${rx} ${ry}" stroke="${ink}" stroke-width="66" stroke-linecap="round" fill="none"/><path d="M122 160 Q176 300 ${rx} ${ry}" stroke="${col}" stroke-width="54" stroke-linecap="round" fill="none"/>
      <path d="M-160 300 q14 10 28 2 M150 300 q14 10 28 2" stroke="${ink}" stroke-width="3" fill="none" opacity=".6"/>
      ${hand(-150, 450)}${hand(rx, ry + 20)}
      ${head(0, -110, 1, o)}
    </g>`;
  }
  return `<g transform="translate(${x},${y + bob}) scale(${s})">
    <path d="M-120 140 Q-130 40 0 30 Q130 40 120 140 L140 520 L-140 520Z" fill="${o.body || 'url(#hoodie)'}" stroke="#000" stroke-width="6"/>
    <path d="M-120 160 Q-170 300 -150 430" stroke="${o.arm || '#1d212c'}" stroke-width="56" stroke-linecap="round" fill="none"/>
    <path d="M120 160 Q170 300 ${o.reach ? 230 : 150} ${o.reach ? 300 : 430}" stroke="${o.arm || '#1d212c'}" stroke-width="56" stroke-linecap="round" fill="none"/>
    ${head(0, -110, 1, o)}
  </g>`;
}
function nan(x, y, s, t = 0, o = {}) {
  const bun = `<circle cx="0" cy="-138" r="44" fill="#d9d6d2" stroke="${INK}" stroke-width="6"/><path d="M-128 -20 Q-140 -140 0 -140 Q140 -140 128 -20 Q100 -110 0 -112 Q-100 -110 -128 -20Z" fill="#cfcac4" stroke="${INK}" stroke-width="6"/>`;
  const glasses = `<g fill="none" stroke="#3a2a1a" stroke-width="6"><circle cx="-46" cy="-6" r="40"/><circle cx="46" cy="-6" r="40"/><path d="M-6 -6 h12"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-150 150 Q-160 40 0 30 Q160 40 150 150 L170 520 L-170 520Z" fill="#5a2b3a" stroke="#000" stroke-width="6"/>
    <path d="M-150 150 Q0 230 150 150 L160 260 Q0 330 -160 260Z" fill="#7a4a3a" opacity=".85"/>
    <path d="M140 170 Q220 ${120 - 30 * Math.abs(Math.sin(t * 2))} 210 ${30 - 20 * Math.abs(Math.sin(t * 2))}" stroke="#5a2b3a" stroke-width="54" stroke-linecap="round" fill="none"/>
    <circle cx="210" cy="${10 - 20 * Math.abs(Math.sin(t * 2))}" r="26" fill="url(#skinOld)" stroke="${INK}" stroke-width="5"/>
    ${head(0, -110, 1, { skin: 'url(#skinOld)', eyes: 'normal', hair: bun + glasses, ...o })}
  </g>`;
}
function kid(x, y, s, o = {}) {
  const tuft = `<path d="M-40 -126 q20 -50 40 -6 q14 -40 40 4" fill="#2a1d14" stroke="${INK}" stroke-width="5"/>`;
  return person(x, y, s, { ...o, hair: tuft, body: o.body || '#3a4a6a', arm: '#2e3c58' });
}
function watcher(x, y, s, a = 1, o = {}) {
  const h = o.tall || 1;
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${a}">
    <path d="M-80 -40 Q-90 -170 0 -180 Q90 -170 80 -40 L${110 * h} ${520 * h} L${-110 * h} ${520 * h}Z" fill="#030303"/>
    ${STYLE === 'sketch' ? [...Array(16)].map((_, k) => `<path d="M${-80 + k * 10.6} -150 q${(k % 3 - 1) * 16} 160 ${(k % 4 - 1.5) * 18} ${300 + (k * 37 % 120)}" stroke="#0a0807" stroke-width="${6 + k % 3 * 3}" fill="none" stroke-linecap="round"/>`).join('') + '<path d="M-100 140 q-50 160 -40 330 M100 140 q50 160 40 330" stroke="#050404" stroke-width="30" fill="none" stroke-linecap="round"/>' + [-1, 1].map((sd) => [0, 1, 2, 3].map((f) => `<path d="M${sd * (140 + f * 6)} 460 q${sd * 6} 50 ${sd * (f * 8 - 10)} 100" stroke="#050404" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')).join('') : ''}
    ${o.fingers ? '<path d="M80 60 q60 10 90 -20 M80 80 q70 20 100 -6 M80 100 q60 26 96 10" stroke="#030303" stroke-width="12" fill="none" stroke-linecap="round"/>' : ''}
    ${o.noeyes ? '' : `<circle cx="-30" cy="-90" r="42" fill="url(#eyeGlow)"/><circle cx="30" cy="-90" r="42" fill="url(#eyeGlow)"/>
    <ellipse cx="-30" cy="-90" rx="10" ry="${o.blink ? 1 : 7}" fill="#fff"/><ellipse cx="30" cy="-90" rx="10" ry="${o.blink ? 1 : 7}" fill="#fff"/>`}
  </g>`;
}
function clock(x, y, s, txt) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-130" y="-60" width="260" height="120" rx="18" fill="#0b0b0b" stroke="#2a2a2a" stroke-width="6"/>
    <text x="0" y="32" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="96" fill="#ff2a2a" style="filter:drop-shadow(0 0 12px #ff0000)">${txt}</text>
  </g>`;
}
const room = (c = '#0a0908') => `<rect width="1920" height="1920" fill="${c}"/>`;
const floor = (y) => `<rect y="${y}" width="1920" height="${1920 - y}" fill="url(#floor)"/>`;

// ---------- scenes ----------
const S = {};
// in bed at night, phone or clock glow. p: time, eyes, phone, watcher (0..1), watcherX, sweat
S.bed = (t, d, p) => {
  const breathe = t * 2;
  const w = p.watcher ? `${watcher(p.watcherX || 1420, 760, 1.2, (p.watcher === 'fade' ? ease(t / d) : p.watcher) * 0.95, { blink: (t % 3.1) > 3 })}` : '';
  return `${room('#06070b')}
    <rect x="200" y="420" width="1520" height="760" fill="#0b0d14"/>
    <rect x="1240" y="520" width="240" height="420" fill="#101522" stroke="#1c2233" stroke-width="10"/>
    <path d="M1250 530 h220 v400 h-220z" fill="#1b2a44" opacity=".35"/>
    ${w}
    ${floor(1180)}
    <rect x="420" y="1040" width="1080" height="70" rx="20" fill="#2a1d14"/>
    <rect x="460" y="980" width="320" height="110" rx="40" fill="#cfd6e4"/>
    ${head(720, 960 + Math.sin(breathe) * 4, 1.15, { eyes: p.eyes || 'wide', look: p.look ?? 0.6, glow: p.phone ? 'phoneGlow' : null, light: p.phone ? '#9fd2ff' : null, sweat: p.sweat })}
    <path d="M300 1060 Q700 980 1000 1010 Q1300 990 1620 1060 L1660 1500 L260 1500Z" fill="url(#blanket)" stroke="#000" stroke-width="7"/>
    <path d="M420 1100 q160 -40 300 -10 M1050 1090 q170 -30 330 10" stroke="#465578" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>
    ${p.phone ? `<g transform="translate(720,1050)"><rect x="-60" y="-20" width="120" height="70" rx="12" fill="#0c0c0c" stroke="#d8eeff" stroke-width="5"/><rect x="-50" y="-12" width="100" height="54" rx="6" fill="#dff1ff"/>${[-76, -54, 54, 76].map((fx) => `<ellipse cx="${fx}" cy="14" rx="19" ry="25" fill="url(#skin)" stroke="${INK}" stroke-width="6"/>`).join('')}</g>` : ''}
    ${p.time ? clock(1150, 1000, .9, p.time) : ''}
    ${p.time ? `<circle cx="1150" cy="1000" r="260" fill="#ff2020" opacity=".07" filter="url(#blur)"/>` : ''}`;
};
// dark hallway, light spilling from a door at the end. p: light ('bathroom'|'kitchen'|'none'), walk (0..1 progress), watcher, kid
S.hall = (t, d, p) => {
  const prog = p.walk ? ease(t / d) * p.walk : 0, sc = 1.1 - prog * 0.35;
  const L = p.light === 'none' ? '' : `<rect x="880" y="560" width="160" height="420" fill="${p.light === 'kitchen' ? '#cfe6ff' : '#ffd88a'}" opacity="${0.75 * flick(t, p.flicker ? 1 : 0)}"/>
      <path d="M880 980 L1040 980 L1500 1920 L420 1920Z" fill="${p.light === 'kitchen' ? '#9cc8ff' : '#ffcc66'}" opacity=".10"/>`;
  return `${room('#050505')}
    <path d="M0 0 L760 500 L760 1040 L0 1920Z" fill="#0d0c0b"/><path d="M1920 0 L1160 500 L1160 1040 L1920 1920Z" fill="#0b0a09"/>
    <rect x="760" y="500" width="400" height="540" fill="#070707"/>
    ${[[300, 'L'], [1560, 'R']].map(([x, side]) => `<path d="${side === 'L' ? 'M340 420 L560 600 L560 1180 L340 1440Z' : 'M1580 420 L1360 600 L1360 1180 L1580 1440Z'}" fill="#0f0e0c" stroke="#1d1a16" stroke-width="6"/>`).join('')}
    ${L}${floor(1040)}
    <path d="M760 1040 L1160 1040 L1920 1920 L0 1920Z" fill="#0a0908"/>
    ${p.watcher ? watcher(960, 760, .55, p.watcher, {}) : ''}
    ${p.kid ? kid(960 + 40 * Math.sin(t), 820 - prog * 40, 0.5, { eyes: 'closed', walk: t * 3 }) : ''}
    ${p.you !== false ? `<g opacity=".97">${person(960, 1500 - prog * 380, sc, { eyes: p.eyes || 'tired', walk: p.walk ? t * 4 : 0, look: 0 })}</g>` : ''}`;
};
// bathroom door pushed open. p: open (0..1 over the scene)
S.door = (t, d, p) => {
  const o = ease(t / d) * (p.open ?? 1);
  return `${room('#060505')}
    <rect x="640" y="300" width="640" height="1360" fill="#ffd88a" opacity="${0.85 * flick(t, 1)}"/>
    <path d="M640 300 L${640 + 640 * (1 - o)} ${300 + 60 * o} L${640 + 640 * (1 - o)} ${1660 - 60 * o} L640 1660Z" fill="#2a1f14" stroke="#120c06" stroke-width="10"/>
    <circle cx="${640 + 600 * (1 - o)}" cy="980" r="18" fill="#c9a24a"/>
    <path d="M640 1660 L1280 1660 L1700 1920 L240 1920Z" fill="#ffcc66" opacity="${0.18 * o}"/>
    ${person(560, 1300, 1.15, { eyes: 'tired', reach: true, look: 1 })}`;
};
// at the sink, side-ish, mirror above. p: reflect ('copy'|'lag'|'smile'), flicker
S.sink = (t, d, p) => {
  const fl = p.flicker ? flick(t, 1.4) : 1;
  const r = p.reflect || 'copy';
  const meBlink = r === 'lag' && t > d * 0.35 && t < d * 0.55;
  return `${room('#0b0906')}
    <rect width="1920" height="1920" fill="#ffe0a0" opacity="${0.10 * fl}"/>
    <rect x="610" y="300" width="700" height="760" rx="12" fill="#1a1712" stroke="#8a7a5a" stroke-width="16"/>
    <rect x="630" y="320" width="660" height="720" fill="#2a2620" opacity="${0.8 * fl + 0.2}"/>
    ${head(960, 720, 1.25, { eyes: r === 'smile' ? 'normal' : 'tired', blink: meBlink && r !== 'lag', smile: r === 'smile' ? ease((t - d * 0.3) / (d * 0.6)) : 0, look: 0 })}
    <rect x="560" y="1120" width="800" height="90" rx="20" fill="#d9d6cf"/><path d="M860 1080 h200 v60 h-200z" fill="#9a9a9a"/>
    <circle cx="960" cy="420" r="300" fill="#fff4cc" opacity="${0.08 * fl}" filter="url(#blur)"/>
    ${person(960, 1600, 1.35, { back: true, body: '#1a1e29' })}`;
};
// close-up of the mirror. p: state ('tired'|'lag'|'stare'|'smile'), crack
S.mirror = (t, d, p) => {
  const st = p.state || 'tired';
  const smile = st === 'smile' ? ease(t / (d * 0.8)) : 0;
  const myBlink = st === 'lag' && t > 0.3 && t < 0.9;  // you blink, the reflection keeps its eyes open
  const zoom = 1 + 0.12 * ease(t / d);
  return `${room('#080706')}
    <g transform="translate(960,960) scale(${zoom}) translate(-960,-960)">
      <rect x="260" y="160" width="1400" height="1600" rx="20" fill="#2c2820" stroke="#8a7a5a" stroke-width="26"/>
      <rect x="290" y="190" width="1340" height="1540" fill="#3a352b"/>
      <circle cx="960" cy="700" r="700" fill="#fff0c8" opacity="${0.12 * flick(t, 0.6)}" filter="url(#blur)"/>
      ${head(960, 960, 3.1, { eyes: st === 'tired' ? 'tired' : 'normal', blink: false, smile, look: 0, black: st === 'smile' && t > d * 0.55 })}
      ${myBlink ? '<rect x="0" y="0" width="1920" height="1920" fill="#000" opacity=".0"/>' : ''}
    </g>
    ${myBlink ? `<rect width="1920" height="1920" fill="#000" opacity=".92"/>` : ''}`;
};
// grandmother flashback, warm lamp, sepia. p: none
S.nan = (t, d, p) => `${room('#140d06')}
    <circle cx="1300" cy="700" r="700" fill="url(#warm)"/>
    <rect x="1240" y="560" width="120" height="160" fill="#f2c27a" opacity=".9"/><rect x="1290" y="720" width="20" height="360" fill="#3a2a1a"/>
    ${floor(1300)}
    <rect x="560" y="1160" width="800" height="300" rx="60" fill="#4a2a1e"/>
    ${nan(960, 1040, 1.15, t)}
    <rect width="1920" height="1920" fill="#c48a3a" opacity=".12"/>`;
// dark kitchen doorway seen from the stairs. p: fridge (open light), watcher, kid
S.kitchen = (t, d, p) => `${room('#040405')}
    <rect x="520" y="500" width="880" height="900" fill="#08090b" stroke="#16181c" stroke-width="12"/>
    ${p.fridge !== false ? `<rect x="1020" y="620" width="300" height="680" fill="#e8f4ff" opacity="${0.75 * flick(t, 0.3)}"/><path d="M1020 1300 L1320 1300 L1600 1920 L700 1920Z" fill="#cfe6ff" opacity=".12"/><path d="M1020 620 L900 660 L900 1340 L1020 1300Z" fill="#cfd8e0" stroke="#000" stroke-width="6"/>` : ''}
    ${p.watcher ? watcher(780, 900, .9, p.watcher, { tall: 1.05, fingers: true, blink: (t % 2.7) > 2.6 }) : ''}
    ${p.kid ? kid(960, 1420 - ease(t / d) * 260, 0.7 - ease(t / d) * 0.15, { eyes: 'closed', walk: t * 3 }) : ''}
    ${[0, 1, 2, 3].map((i) => `<rect x="${420 + i * 40}" y="${1500 + i * 110}" width="${1080 - i * 80}" height="22" fill="#0d0d0d"/>`).join('')}`;
// inside your room, looking at the closed door: light strip underneath, two shadow feet. p: feet (bool), knock
S.bedroomdoor = (t, d, p) => {
  const k = p.knock ? (Math.floor(t * 2.2) % 3 === 0 && (t % (1 / 2.2)) < 0.12 ? 6 : 0) : 0;
  return `${room('#07070a')}
    <rect x="660" y="430" width="600" height="1000" fill="#241c14" stroke="#3a2e20" stroke-width="16" transform="translate(${k},0)"/>
    <rect x="700" y="480" width="520" height="420" fill="none" stroke="#33281b" stroke-width="8"/><rect x="700" y="950" width="520" height="420" fill="none" stroke="#33281b" stroke-width="8"/>
    <circle cx="1190" cy="940" r="20" fill="#9a8a5a"/>
    <rect x="660" y="1430" width="600" height="18" fill="#ffd88a" opacity=".95"/>
    ${p.feet ? '<rect x="840" y="1430" width="90" height="18" fill="#050505"/><rect x="990" y="1430" width="90" height="18" fill="#050505"/>' : ''}
    <path d="M660 1448 L1260 1448 L1700 1920 L220 1920Z" fill="#ffcc66" opacity=".07"/>`;
};
// phone close-up with messages. p: msgs [[from, text, at]] (at = seconds into scene when it appears)
S.phone = (t, d, p) => {
  const msgs = (p.msgs || []).filter((m) => t >= (m[2] || 0));
  return `${room('#020203')}
    <circle cx="960" cy="960" r="900" fill="url(#cold)" opacity=".5"/>
    <rect x="610" y="260" width="700" height="1400" rx="80" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="14"/>
    <rect x="640" y="300" width="640" height="1320" rx="56" fill="#0f141c"/>
    <text x="960" y="420" text-anchor="middle" font-family="Inter, sans-serif" font-size="58" font-weight="700" fill="#e8eef8">${p.time || '3:00'}</text>
    ${msgs.map((m, i) => `<g transform="translate(680,${560 + i * 260})"><rect width="560" height="220" rx="36" fill="#1e2a3a"/>
      <text x="30" y="58" font-family="Inter, sans-serif" font-size="34" font-weight="700" fill="#8fb4e8">${m[0]}</text>
      ${String(m[1]).match(/.{1,26}(\s|$)/g).map((ln, j) => `<text x="30" y="${110 + j * 44}" font-family="Inter, sans-serif" font-size="36" fill="#f2f6fb">${ln.trim()}</text>`).join('')}</g>`).join('')}`;
};
// grey morning in the kitchen. p: kid (at the table), you
S.morning = (t, d, p) => `${room('#2a2e33')}
    <rect x="0" y="0" width="1920" height="1920" fill="#9fb0c0" opacity=".12"/>
    <rect x="300" y="380" width="520" height="460" fill="#c9d4de" opacity=".55"/>
    ${floor(1250)}
    <rect x="420" y="1180" width="1080" height="60" rx="16" fill="#5a4636"/>
    ${p.kid ? kid(1220, 1010, 0.9, { eyes: 'normal', look: -0.5, smile: 0 }) : ''}
    ${p.you !== false ? person(700, 1060, 0.95, { eyes: p.eyes || 'tired', look: 0.7 }) : ''}`;
// your little brother standing in a dark doorway. p: eyes ('closed'|'normal'|'black'), whisper
S.brother = (t, d, p) => {
  const z = 1 + 0.15 * ease(t / d);
  return `${room('#030304')}
    <g transform="translate(960,960) scale(${z}) translate(-960,-960)">
      <rect x="600" y="300" width="720" height="1400" fill="#0a0b0e" stroke="#1a1c22" stroke-width="16"/>
      ${kid(960, 1080, 1.35, { eyes: p.eyes === 'black' ? 'normal' : (p.eyes || 'normal'), black: p.eyes === 'black', smile: p.eyes === 'black' ? 0.6 : 0 })}
    </g>
    <rect width="1920" height="1920" fill="#000" opacity="${0.25 + 0.1 * Math.sin(t * 3)}"/>`;
};
// hand-drawn words on black (Day One style). p: text, sub, color
S.text = (t, d, p) => {
  const a = ease(t / 0.6);
  const lines = String(p.text).split('|');
  return `${room('#000')}
    ${lines.map((ln, i) => `<text x="960" y="${900 + (i - (lines.length - 1) / 2) * 190}" text-anchor="middle" font-family="Marker" font-size="${fit(ln, p.size || 150)}" fill="${p.color || '#fff'}" opacity="${a}" style="filter:drop-shadow(0 6px 0 #000) drop-shadow(0 0 28px rgba(255,40,40,.35))">${ln}</text>`).join('')}
    ${p.sub ? `<text x="960" y="${1120 + (lines.length - 1) * 95}" text-anchor="middle" font-family="Marker" font-size="${fit(p.sub, 60)}" fill="#c9c2bb" opacity="${a}">${p.sub}</text>` : ''}
    ${p.eyes ? watcher(960, 1500, 0.8, ease((t - 0.8) / 1.2), { noeyes: false }) : ''}`;
};
// Shared "creature face" defs: bloodshot glowing eyes and shaded teeth.
const BEAST_DEFS = `<defs>
  <radialGradient id="bloodEye2" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#fff2c8"/><stop offset=".35" stop-color="#ffea6a"/><stop offset=".75" stop-color="#ff2a00"/><stop offset="1" stop-color="#5a0000"/></radialGradient>
  <linearGradient id="tooth2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#b8a27a"/></linearGradient>
</defs>`;
function beastFace(open = 1) {
  const teeth = (n, y0, h, dir) => [...Array(n)].map((_, k) => {
    const x = -150 + k * (300 / (n - 1)), w = 20 + (k * 37 % 11), hh = h * (0.7 + (k * 53 % 7) / 10);
    return `<path d="M${x - w / 2} ${y0} L${x} ${y0 + dir * hh} L${x + w / 2} ${y0}Z" fill="url(#tooth2)" stroke="#2a1a10" stroke-width="2"/>`; }).join('');
  const eye = (cx) => `<g transform="translate(${cx},-150)"><circle r="150" fill="url(#eyeGlow)"/><ellipse rx="58" ry="${40 * open}" fill="url(#bloodEye2)"/>
      <ellipse rx="14" ry="${30 * open}" fill="#000"/><ellipse cx="-18" cy="-14" rx="10" ry="6" fill="#fff" opacity=".85"/></g>`;
  return `${BEAST_DEFS}<path d="M-420 700 Q-470 -170 -90 -380 Q0 -420 90 -380 Q470 -170 420 700Z" fill="#030004"/>
    ${eye(-120)}${eye(120)}
    <g transform="translate(0,-10) scale(1.3)"><path d="M-185 0 Q0 ${175 * open} 185 0 Q0 80 -185 0Z" fill="#160004"/>${teeth(11, 14, 46 * open, 1)}${teeth(10, 14 + 104 * open, 40 * open, -1)}</g>`;
}
// your phone screen gone black: in the glass, your reflection... and the face behind your shoulder. p: face (0..1 fade-in, or 'grow')
S.reflection = (t, d, p) => {
  const a = p.face === 'grow' ? ease(t / d) : (p.face ?? 0);
  return `${room('#000')}
    <rect x="560" y="140" width="800" height="1640" rx="90" fill="#050506" stroke="#1c1c22" stroke-width="18"/>
    <g transform="translate(${1120 - 30 * a},${820 - 30 * a}) scale(${0.5 + 0.12 * a})" opacity="${0.85 * a}">${beastFace(1)}</g>
    <g opacity=".5">${head(860, 1060, 1.7, { eyes: 'wide', look: 0, mouth: 'o', skin: '#8a8a90' })}</g>
    <path d="M610 1500 Q860 1300 1110 1500 L1150 1760 L570 1760Z" fill="#141418" opacity=".9"/>
    <path d="M600 180 L1000 180 L640 1100Z" fill="#fff" opacity=".05"/>
    <rect x="560" y="140" width="800" height="1640" rx="90" fill="#0a0a10" opacity=".25"/>`;
};
// jump scare: the creature's face fills the frame, shaking, with a white flash on the cut
S.face = (t, d, p) => {
  const sh = (k) => (Math.sin(t * 91 + k) + Math.sin(t * 57 + k * 2)) * 14;
  const z = 2.1 + 0.25 * ease(t / 0.4);
  return `${room('#0a0004')}
    <rect width="1920" height="1920" fill="#ff0022" opacity="${0.18 + 0.1 * Math.sin(t * 30)}"/>
    <g transform="translate(${960 + sh(1)},${1080 + sh(2)}) scale(${z})">${beastFace(1)}</g>
    <rect width="1920" height="1920" fill="#fff" opacity="${Math.max(0, 1 - t / 0.12)}"/>`;
};
// near-black screen (the viewer sees their own reflection), with an optional small line of text
S.black = (t, d, p) => `${room('#000')}
    ${p.text ? String(p.text).split('|').map((ln, i, all) => `<text x="960" y="${(p.y || 1700) + (i - (all.length - 1) / 2) * (p.size || 70) * 1.25}" text-anchor="middle" font-family="Marker" font-size="${fit(ln, p.size || 70)}" fill="${p.color || '#6a6a6a'}" opacity="${ease((t - (p.at || 0)) / 0.5)}">${ln}</text>`).join('') : ''}`;

// Thumbnail, "3D" look: sphere-shaded head with specular highlight and cast shadow, glossy veined eyes,
// a solid rim-lit creature looming close (bloodshot glowing eyes, jagged shaded grin), fog + light rays for depth,
// extruded lettering. tint/tint2 set the colour of the scene.
S.thumb = (t, d, p) => {
  const tint = p.tint || '#ff1a3c', tint2 = p.tint2 || '#5a00ff';
  const txt = p.text || "DON'T LOOK.";
  const size = fit(txt, p.size || 250, 0.94);
  // grin: dark mouth, two rows of shaded uneven teeth
  const teeth = (n, y0, h, dir) => [...Array(n)].map((_, k) => {
    const x = -150 + k * (300 / (n - 1)), w = 20 + (k * 37 % 11), hh = h * (0.7 + (k * 53 % 7) / 10);
    return `<path d="M${x - w / 2} ${y0} L${x} ${y0 + dir * hh} L${x + w / 2} ${y0}Z" fill="url(#tooth)" stroke="#2a1a10" stroke-width="2"/>`; }).join('');
  const mouth = `<path d="M-185 0 Q0 175 185 0 Q0 80 -185 0Z" fill="#160004"/>${teeth(11, 14, 46, 1)}${teeth(10, 118, 40, -1)}
    <path d="M-185 0 Q0 175 185 0" fill="none" stroke="${tint}" stroke-width="3" opacity=".5"/>`;
  const eye3d = (cx, cy) => `<g transform="translate(${cx},${cy})">
      <circle r="150" fill="url(#eyeGlow)"/>
      <ellipse rx="58" ry="40" fill="url(#bloodEye)"/>
      ${[0, 1, 2, 3, 4].map((k) => `<path d="M${-56 + k * 6} ${-12 + k * 6} q${18 + k * 4} ${-8 + k * 3} ${30} ${4}" stroke="#7a0010" stroke-width="2.5" fill="none"/>`).join('')}
      <ellipse rx="14" ry="30" fill="#000"/><ellipse cx="-18" cy="-14" rx="10" ry="6" fill="#fff" opacity=".85"/>
    </g>`;
  const rays = [...Array(7)].map((_, k) => `<path d="M${1330 + (k - 3) * 40} 0 L${980 + (k - 3) * 260} 1920 L${1060 + (k - 3) * 260} 1920Z" fill="${tint}" opacity=".05"/>`).join('');
  return `
    <defs>
      <radialGradient id="bgA" cx="70%" cy="42%" r="58%"><stop offset="0" stop-color="${tint}" stop-opacity=".95"/><stop offset=".5" stop-color="${tint2}" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="head3d" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#fffaf2"/><stop offset=".18" stop-color="#f1e2d0"/><stop offset=".55" stop-color="#c9ae94"/><stop offset=".85" stop-color="#6f5644"/><stop offset="1" stop-color="#2a1d14"/></radialGradient>
      <radialGradient id="spec" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="eyeball" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f0e6dc"/><stop offset="1" stop-color="#b89c8a"/></radialGradient>
      <radialGradient id="bloodEye" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#fff2c8"/><stop offset=".35" stop-color="#ffea6a"/><stop offset=".75" stop-color="#ff2a00"/><stop offset="1" stop-color="#5a0000"/></radialGradient>
      <linearGradient id="beast" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".7" stop-color="#0a0410"/><stop offset=".93" stop-color="#2a0a2e"/><stop offset="1" stop-color="${tint}"/></linearGradient>
      <linearGradient id="tooth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#b8a27a"/></linearGradient>
      <linearGradient id="finger" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a0c1c"/><stop offset="1" stop-color="#000"/></linearGradient>
      <radialGradient id="cyan3d" r="50%"><stop offset="0" stop-color="#00f6ff" stop-opacity=".65"/><stop offset=".55" stop-color="#0090ff" stop-opacity=".18"/><stop offset="1" stop-color="#001a40" stop-opacity="0"/></radialGradient>
      <radialGradient id="aoShadow" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <filter id="fog"><feTurbulence type="fractalNoise" baseFrequency=".004 .012" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .4  0 0 0 0 .8  0 0 0 .55 -.1"/></filter>
    </defs>
    <rect width="1920" height="1920" fill="#05000a"/>
    <rect width="1920" height="1920" fill="url(#bgA)"/>${rays}
    <g transform="translate(1340,930)">
      <path d="M-420 700 Q-470 -170 -90 -380 Q0 -420 90 -380 Q470 -170 420 700Z" fill="url(#beast)"/>
      <path d="M380 -120 Q470 200 420 700" stroke="${tint}" stroke-width="10" fill="none" opacity=".75" style="filter:drop-shadow(0 0 12px ${tint})"/>
      <path d="M-60 -372 Q-200 -330 -300 -200" stroke="${tint}" stroke-width="5" fill="none" opacity=".35"/>
      ${eye3d(-120, -150)}${eye3d(120, -150)}
      <g transform="translate(0,-10) scale(1.3)">${mouth}</g>
    </g>
    <rect width="1920" height="1920" filter="url(#fog)" opacity=".55"/>
    <circle cx="760" cy="1260" r="760" fill="url(#cyan3d)"/>
    <ellipse cx="800" cy="1420" rx="380" ry="80" fill="url(#aoShadow)"/>
    <g transform="translate(760,1080) scale(2.35)">
      <circle r="130" fill="url(#head3d)" stroke="#000" stroke-width="6"/>
      <circle r="130" fill="#00e1ff" opacity=".12"/>
      <path d="M-128 20 A130 130 0 0 0 60 116" stroke="#00f0ff" stroke-width="7" fill="none" opacity=".6"/>
      <path d="M86 -97 A130 130 0 0 1 127 28" stroke="${tint}" stroke-width="7" fill="none" style="filter:drop-shadow(0 0 7px ${tint})"/>
      <ellipse cx="-52" cy="-70" rx="40" ry="24" fill="url(#spec)" transform="rotate(-25 -52 -70)"/>
      <path d="M-100 -80 q22 -30 52 -12 M100 -80 q-22 -30 -52 -12" stroke="#000" stroke-width="9" stroke-linecap="round" fill="none"/>
      ${[-46, 46].map((ex) => `<g transform="translate(${ex},-6)">
          <ellipse rx="52" ry="58" fill="#3a1218" opacity=".55" transform="translate(0,10)"/>
          <ellipse rx="44" ry="50" fill="url(#eyeball)" stroke="#000" stroke-width="5"/>
          ${[[-40, -10, -18, -2], [-36, 18, -16, 8], [38, -14, 18, -4], [34, 20, 16, 8]].map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 - 6} ${x1} ${y1}" stroke="#d0303a" stroke-width="1.8" fill="none" opacity=".8"/>`).join('')}
          <circle cx="${ex < 0 ? 15 : 11}" cy="0" r="6" fill="#000"/><circle cx="${ex < 0 ? 12 : 8}" cy="-4" r="2.2" fill="#fff"/>
          <ellipse cx="-14" cy="-24" rx="12" ry="7" fill="#fff" opacity=".7"/>
        </g>`).join('')}
      <ellipse cx="0" cy="76" rx="24" ry="38" fill="#2a0006" stroke="#000" stroke-width="6"/><ellipse cx="0" cy="96" rx="12" ry="10" fill="#6a1020"/>
      <path d="M-46 46 q-4 30 -10 56" stroke="#9fe8ff" stroke-width="5" fill="none" opacity=".7"/>
      <path d="M118 -40 c10 16 12 30 0 38 c-12 -8 -10 -22 0 -38z" fill="#c8f6ff" stroke="#000" stroke-width="3"/>
    </g>
    <path d="M150 1460 Q760 1330 1400 1480 L1500 1920 L60 1920Z" fill="#0d1030" stroke="#000" stroke-width="8"/>
    <path d="M300 1500 Q760 1400 1250 1510" stroke="#2a3a7a" stroke-width="10" fill="none" opacity=".6"/>
    <g transform="translate(1180,1360)">
      <path d="M-40 -60 Q120 -90 220 40 L130 170 Q-20 60 -60 20Z" fill="#000"/>
      ${[[-60, -50, -160, -80, -250, -20, -275, 50], [-60, -10, -175, -15, -250, 50, -262, 120], [-50, 20, -150, 55, -215, 120, -215, 190], [-30, 50, -105, 110, -150, 175, -138, 235]].map(([x0, y0, x1, y1, x2, y2, x3, y3]) =>
        `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="#000" stroke-width="36" stroke-linecap="round"/>
         <path d="M${x1} ${y1} L${x2} ${y2}" stroke="#000" stroke-width="29" stroke-linecap="round"/>
         <path d="M${x2} ${y2} L${x3} ${y3}" stroke="#000" stroke-width="22" stroke-linecap="round"/>
         <path d="M${x0} ${y0 - 10} L${x1} ${y1 - 10}" stroke="${tint}" stroke-width="4" opacity=".55" stroke-linecap="round"/>
         <circle cx="${x1}" cy="${y1}" r="20" fill="#000"/><circle cx="${x2}" cy="${y2}" r="16" fill="#000"/>
         <path d="M${x3} ${y3} l${(x3 - x2) * 0.55} ${(y3 - y2) * 0.65}" stroke="#efe4d2" stroke-width="11" stroke-linecap="round"/>`).join('')}
    </g>
    <rect width="1920" height="1920" fill="url(#vig)"/>
    ${[14, 11, 8, 5, 2].map((o) => `<text x="${960 + o}" y="${(p.textY || 650) + o}" text-anchor="middle" font-family="Marker" font-size="${size}" fill="${o > 3 ? '#3a0008' : '#7a0014'}">${txt}</text>`).join('')}
    <text x="960" y="${p.textY || 650}" text-anchor="middle" font-family="Marker" font-size="${size}" fill="#fff" stroke="#000" stroke-width="10" paint-order="stroke" style="filter:drop-shadow(0 0 34px ${tint})">${txt}</text>`;
};

// Second thumbnail layout ("phone"): a giant tilted phone whose black screen reflects your terrified face and the
// grinning thing behind you, a text bubble from your own number, glitch-red background, stacked headline on the left.
S.thumbPhone = (t, d, p) => {
  const tint = p.tint || '#ff0030';
  const lines = String(p.text || "IT'S|BEHIND|YOU.").split('|');
  const scan = [...Array(48)].map((_, k) => `<rect y="${k * 40}" width="1920" height="3" fill="#000" opacity=".25"/>`).join('');
  const glitch = [[300, 560, 380], [1180, 1340, 220], [760, 900, 640]].map(([y, h, x]) => `<rect x="${x}" y="${y}" width="${560}" height="${h / 30}" fill="${tint}" opacity=".35"/>`).join('');
  return `
    <defs>
      <radialGradient id="bgP" cx="62%" cy="48%" r="60%"><stop offset="0" stop-color="${tint}" stop-opacity=".95"/><stop offset=".45" stop-color="#5a0018" stop-opacity=".8"/><stop offset="1" stop-color="#000"/></radialGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1a22"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#0d0d12"/></linearGradient>
      <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a5a66"/><stop offset=".5" stop-color="#1c1c22"/><stop offset="1" stop-color="#8a8a96"/></linearGradient>
      <radialGradient id="skinCold" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#e8f4ff"/><stop offset=".6" stop-color="#8fa6bd"/><stop offset="1" stop-color="#2a3a4a"/></radialGradient>
    </defs>
    <rect width="1920" height="1920" fill="url(#bgP)"/>${scan}${glitch}
    <g transform="translate(1240,1000) rotate(-8)">
      <rect x="-430" y="-760" width="860" height="1520" rx="110" fill="#000" opacity=".55" transform="translate(40,50)"/>
      <rect x="-430" y="-760" width="860" height="1520" rx="110" fill="url(#bezel)"/>
      <rect x="-400" y="-730" width="800" height="1460" rx="86" fill="url(#glass)"/>
      <clipPath id="scr"><rect x="-400" y="-730" width="800" height="1460" rx="86"/></clipPath>
      <g clip-path="url(#scr)">
        <g transform="translate(150,-230) scale(.62)" opacity=".95">${beastFace(1)}</g>
        <g transform="translate(-60,90) scale(1.9)">
          <circle r="130" fill="url(#skinCold)" stroke="#000" stroke-width="6" opacity=".9"/>
          <path d="M-96 -80 q20 -28 48 -12 M96 -80 q-20 -28 -48 -12" stroke="#000" stroke-width="8" stroke-linecap="round" fill="none"/>
          ${[-46, 46].map((ex) => `<g transform="translate(${ex},-6)"><ellipse rx="44" ry="50" fill="#f4f8ff" stroke="#000" stroke-width="5"/><circle cx="${ex < 0 ? -10 : -14}" r="5" fill="#000"/></g>`).join('')}
          <ellipse cx="0" cy="74" rx="22" ry="36" fill="#1a0006" stroke="#000" stroke-width="6"/>
        </g>
        <path d="M-400 -730 L60 -730 L-400 300Z" fill="#fff" opacity=".07"/>
      </g>
      <g transform="translate(-330,-560)">
        <rect width="520" height="150" rx="40" fill="#1e2a3a" stroke="#000" stroke-width="5"/>
        <text x="34" y="56" font-family="Inter, sans-serif" font-size="38" font-weight="800" fill="#8fb4e8">Me</text>
        <text x="34" y="116" font-family="Inter, sans-serif" font-size="50" font-weight="700" fill="#fff">don't look up.</text>
      </g>
      <rect x="-90" y="-712" width="180" height="34" rx="17" fill="#000"/>
    </g>
    <rect width="1920" height="1920" fill="url(#vig)" opacity=".7"/>
    ${lines.map((ln, i) => { const y = 690 + i * 240, sz = 230;
      return [12, 8, 4].map((o) => `<text x="${110 + o}" y="${y + o}" font-family="Marker" font-size="${sz}" fill="#2a0006">${ln}</text>`).join('') +
        `<text x="110" y="${y}" font-family="Marker" font-size="${sz}" fill="${i === lines.length - 1 ? tint : '#fff'}" stroke="#000" stroke-width="10" paint-order="stroke" style="filter:drop-shadow(0 0 26px ${tint})">${ln}</text>`; }).join('')}`;
};

// Third thumbnail layout ("sketch"): hand-inked horror-illustration look. Muted, grimy background; a gaunt pale figure
// drawn in wobbly ink with cross-hatched shadows, hollow black eyes and a too-wide grin; a tall thin hand-lettered title
// with a letter-spaced line under it. p: title, sub, pose ('shh' | 'phone' | 'reach'), wall (colour), accent (title colour)
S.thumbSketch = (t, d, p) => {
  const wall = p.wall || '#3f4a44', acc = p.accent || '#ff6a4a', ink = '#0e0c0b';
  const skin = '#d9d2c3', skinD = '#a99f8c';
  const hair = [...Array(34)].map((_, k) => { const a = -1.25 + k * 0.075, r = 300 + (k * 37 % 60);
    const x0 = Math.cos(a - Math.PI / 2) * 250, y0 = -40 + Math.sin(a - Math.PI / 2) * 290;
    return `<path d="M${x0} ${y0} C${x0 * 1.25} ${y0 + 160} ${x0 * 1.45 + (k % 3 - 1) * 30} ${y0 + 420} ${x0 * 1.3 + (k % 5 - 2) * 40} ${y0 + 700 + (k * 53 % 120)}" stroke="${ink}" stroke-width="${10 + k % 4 * 3}" fill="none" stroke-linecap="round"/>`; }).join('');
  const hatch = (x, y, w, h, n, ang = 1) => [...Array(n)].map((_, k) => `<path d="M${x + k * w / n} ${y} l${ang * h * 0.4} ${h}" stroke="${ink}" stroke-width="3" opacity=".55"/>`).join('');
  const teeth = [...Array(15)].map((_, k) => `<path d="M${-170 + k * 24} 0 l12 ${k % 2 ? 46 : 38} l12 ${k % 2 ? -46 : -38}" fill="#efe9d8" stroke="${ink}" stroke-width="3"/>`).join('');
  const finger = (x, y, ang, len) => `<g transform="translate(${x},${y}) rotate(${ang})"><path d="M0 0 C10 ${-len * .35} -6 ${-len * .7} 4 ${-len}" stroke="${ink}" stroke-width="34" stroke-linecap="round" fill="none"/>
     <path d="M0 0 C10 ${-len * .35} -6 ${-len * .7} 4 ${-len}" stroke="${skin}" stroke-width="24" stroke-linecap="round" fill="none"/>
     <path d="M-10 ${-len * .38} h20 M-8 ${-len * .7} h18" stroke="${ink}" stroke-width="3"/><path d="M-2 ${-len - 6} l8 -26" stroke="#6a1010" stroke-width="12" stroke-linecap="round"/></g>`;
  const pose = p.pose || 'shh';
  const hand = pose === 'phone'
    ? `<g transform="translate(-60,560)"><rect x="-150" y="-260" width="300" height="520" rx="40" fill="#111" stroke="${ink}" stroke-width="8"/><rect x="-128" y="-236" width="256" height="470" rx="26" fill="#cfe8ff"/>
         <rect x="-110" y="-170" width="220" height="70" rx="18" fill="#2a3a52"/><text x="-96" y="-124" font-family="Inter, sans-serif" font-size="30" font-weight="800" fill="#fff">don't look up.</text>
         ${[-110, -40, 30, 100].map((fx, i) => finger(fx, 220, -10 + i * 4, 210)).join('')}</g>`
    : pose === 'shh'
    ? `<g transform="translate(40,330)">${finger(0, 120, -4, 330)}${[60, 110, 150].map((fx, i) => `<path d="M${fx} 120 q30 -70 -10 -110" stroke="${ink}" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M${fx} 120 q30 -70 -10 -110" stroke="${skin}" stroke-width="20" stroke-linecap="round" fill="none"/>`).join('')}
         <path d="M-60 130 Q60 250 190 140 L230 420 L-70 420Z" fill="${skin}" stroke="${ink}" stroke-width="7"/>${hatch(-40, 230, 220, 160, 14)}</g>`
    : `<g transform="translate(-260,420)">${[-60, -10, 40, 90].map((fx, i) => finger(fx, 0, -30 + i * 9, 260)).join('')}</g>`;
  const T = String(p.title || 'DON\'T ANSWER');
  const titleSize = Math.min(560, 1150 / (0.42 * T.length));
  return `
    <defs>
      <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
      <filter id="grime"><feTurbulence type="fractalNoise" baseFrequency=".9 .02" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 -.12"/></filter>
      <radialGradient id="sketchLight" cx="72%" cy="40%" r="55%"><stop offset="0" stop-color="#fff3d0" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1920" height="1920" fill="${wall}"/>
    <rect width="1920" height="1920" filter="url(#grime)"/>
    <rect width="1920" height="1920" fill="url(#sketchLight)"/>
    <rect x="0" y="1360" width="1920" height="560" fill="#1a1712" opacity=".6"/>
    <g filter="url(#ink)" transform="translate(1430,960)">
      <path d="M-330 470 Q-300 260 -150 230 L150 230 Q300 260 330 470 L360 760 L-360 760Z" fill="#7a2230" stroke="${ink}" stroke-width="8"/>
      ${hatch(-330, 300, 200, 420, 12)}${hatch(140, 300, 200, 420, 12, -1)}
      <g>${hair}</g>
      <path d="M-200 -90 Q-210 -330 0 -350 Q210 -330 200 -90 Q190 120 110 230 Q0 300 -110 230 Q-190 120 -200 -90Z" fill="${skin}" stroke="${ink}" stroke-width="9"/>
      <path d="M-170 0 Q-150 150 -80 220 M170 0 Q150 150 80 220" stroke="${skinD}" stroke-width="26" fill="none" opacity=".8"/>
      ${hatch(-180, -20, 70, 200, 7)}${hatch(115, -20, 70, 200, 7, -1)}
      <path d="M-150 -200 q60 -40 120 -10 M150 -200 q-60 -40 -120 -10" stroke="${ink}" stroke-width="7" fill="none"/>
      ${[-80, 80].map((ex) => `<ellipse cx="${ex}" cy="-110" rx="66" ry="82" fill="#050404" stroke="${ink}" stroke-width="6"/><ellipse cx="${ex}" cy="-110" rx="86" ry="100" fill="none" stroke="${skinD}" stroke-width="16" opacity=".7"/>
        <circle cx="${ex + 8}" cy="-104" r="9" fill="#ff2a2a"/><circle cx="${ex + 8}" cy="-104" r="20" fill="#ff2a2a" opacity=".25"/>`).join('')}
      <path d="M-14 -40 l-14 70 q14 10 28 0" stroke="${ink}" stroke-width="5" fill="none"/>
      <g transform="translate(0,90)"><path d="M-190 0 Q0 150 190 0 Q0 60 -190 0Z" fill="#1a0505" stroke="${ink}" stroke-width="7"/>${teeth}
        <path d="M-190 0 q-30 -10 -40 -40 M190 0 q30 -10 40 -40" stroke="${ink}" stroke-width="6" fill="none"/></g>
      ${hand}
    </g>
    <g transform="rotate(-2 520 900)">
      <text x="${p.titleX || 500}" y="${p.titleY || 900}" text-anchor="middle" font-family="Hand" font-size="${titleSize}" fill="${acc}" stroke="#1a0d08" stroke-width="10" paint-order="stroke" letter-spacing="4" ${T.length > 6 ? 'textLength="860" lengthAdjust="spacingAndGlyphs"' : ''}>${T}</text>
      <text x="${p.titleX || 500}" y="${(p.titleY || 900) + 230}" text-anchor="middle" font-family="Hand" font-size="170" fill="#f2ede2" stroke="#1a0d08" stroke-width="8" paint-order="stroke" textLength="760" lengthAdjust="spacing">${p.sub || 'STORIES'}</text>
    </g>
    <rect width="1920" height="1920" fill="url(#vig)" opacity=".55"/>`;
};

// wrap: camera drift, vignette, film grain (seed changes per frame so the grain moves)
// Where the action is in each scene (world x). Vertical Shorts/TikToks centre their narrow window on it.
const FOCUS = { bed: 790, reflection: 960, face: 960, door: 800, nan: 1040, kitchen: 1000, morning: 960 };
function frameSVG(name, t, d, p, view, frameNo) {
  if (view[2] < view[3]) {  // vertical: slide the window so the subject sits in the middle
    const fx = p.focus ?? FOCUS[name] ?? 960;
    view = [Math.max(0, Math.min(1920 - view[2], fx - view[2] / 2)), view[1], view[2], view[3]];
  }
  VW = view[2];
  STYLE = p.style || 'cartoon';
  const drift = p.still ? 1 : 1 + 0.04 * (t / Math.max(d, 1));
  const body = (S[name] || S.text)(t, d, p);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${view[2]}" height="${view[3]}" viewBox="${view.join(' ')}">${DEFS.replace('SEED', frameNo % 7)}
    ${STYLE === 'sketch' ? `<defs><filter id="boil" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="${Math.floor(frameNo / 3) % 6 + 1}"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
      <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".6 .015" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .9  0 0 0 0 .85  0 0 0 0 .75  0 0 0 .18 -.04"/></filter></defs>` : ''}
    <g transform="translate(960,960) scale(${drift}) translate(-960,-960)" ${STYLE === 'sketch' ? 'filter="url(#boil)"' : ''}>${body}</g>
    ${STYLE === 'sketch' ? '<rect width="1920" height="1920" filter="url(#paper)"/>' : ''}
    <rect width="1920" height="1920" fill="url(#vig)"/>
    <rect width="1920" height="1920" fill="#fff" filter="url(#grain)" opacity=".55"/>
  </svg>`;
}
