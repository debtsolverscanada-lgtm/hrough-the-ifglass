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
// STYLE '3d': Pixar-ish cartoon people. Gradient-shaded skin, big glossy eyes, chunky shaded hair, soft shadows.
const D3 = `<defs>
  <radialGradient id="k3skin" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#ffe3cc"/><stop offset=".55" stop-color="#f2b896"/><stop offset=".85" stop-color="#d48d6c"/><stop offset="1" stop-color="#a8624a"/></radialGradient>
  <radialGradient id="k3old" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#ffe9da"/><stop offset=".6" stop-color="#e8bea6"/><stop offset="1" stop-color="#a87a66"/></radialGradient>
  <radialGradient id="k3tan" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#e8b48c"/><stop offset=".55" stop-color="#c88a60"/><stop offset=".85" stop-color="#a06842"/><stop offset="1" stop-color="#744628"/></radialGradient>
  <radialGradient id="k3earTan" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#c88a60"/><stop offset="1" stop-color="#7a4a2c"/></radialGradient>
  <radialGradient id="k3fair" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#fff0e4"/><stop offset=".55" stop-color="#f8d4bc"/><stop offset=".85" stop-color="#e2ae92"/><stop offset="1" stop-color="#bc8268"/></radialGradient>
  <radialGradient id="k3ear" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#f6c0a0"/><stop offset="1" stop-color="#b86c52"/></radialGradient>
  <linearGradient id="k3hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a24"/><stop offset=".6" stop-color="#2e1c10"/><stop offset="1" stop-color="#160c06"/></linearGradient>
  <radialGradient id="k3sclera" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f1ece8"/><stop offset="1" stop-color="#c9bcb6"/></radialGradient>
  <radialGradient id="k3iris" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#c88a4a"/><stop offset=".55" stop-color="#7a4622"/><stop offset="1" stop-color="#2a140a"/></radialGradient>
  <radialGradient id="k3black" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#2a2a30"/><stop offset="1" stop-color="#000"/></radialGradient>
  <radialGradient id="k3hood" cx="40%" cy="25%" r="85%"><stop offset="0" stop-color="#6a7cb4"/><stop offset=".6" stop-color="#3a4870"/><stop offset="1" stop-color="#1a2038"/></radialGradient>
  <radialGradient id="k3mouth" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#7a2020"/><stop offset="1" stop-color="#2a0505"/></radialGradient>
  <radialGradient id="k3shadow" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <radialGradient id="k3creature" cx="40%" cy="20%" r="90%"><stop offset="0" stop-color="#2a2630"/><stop offset=".5" stop-color="#0c0a0e"/><stop offset="1" stop-color="#000"/></radialGradient>
  <filter id="k3blur"><feGaussianBlur stdDeviation="8"/></filter>
</defs>`;
let K3ID = 0;
function k3Head(o) {
  const look = o.look || 0, eyes = o.eyes || 'normal', ink = '#3a1a10';
  const skin = o.skin === 'url(#skinOld)' ? 'url(#k3old)' : o.skin && (o.skin.startsWith('#') || o.skin.startsWith('url(#k3') || o.skin.startsWith('url(#me')) ? o.skin : 'url(#k3skin)';
  const open = o.blink || eyes === 'closed' ? 0 : eyes === 'wide' ? 1.25 : eyes === 'tired' ? 0.5 : 1;
  const face = 'M-122 -20 Q-128 -150 0 -152 Q128 -150 122 -20 Q124 70 86 118 Q44 160 0 160 Q-44 160 -86 118 Q-124 70 -122 -20Z';
  if (o.back) return `<ellipse cy="175" rx="120" ry="26" fill="url(#k3shadow)"/>
    <ellipse cx="-122" cy="10" rx="22" ry="34" fill="url(#k3ear)"/><ellipse cx="122" cy="10" rx="22" ry="34" fill="url(#k3ear)"/>
    <path d="M-132 30 Q-150 -170 0 -172 Q150 -170 132 30 Q120 140 0 150 Q-120 140 -132 30Z" fill="url(#k3hair)"/>
    <path d="M-70 -130 Q0 -160 70 -130" stroke="#8a6040" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>`;
  const id = ++K3ID;
  const eye = (ex) => {
    const ry = 40 * Math.max(open, 0.08), rx = 36;
    if (!open) return `<path d="M${ex - 34} -6 q34 18 68 0" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${ex - 30} -10 q30 -6 60 0" stroke="#d48d6c" stroke-width="5" fill="none" opacity=".6"/>`;
    const lid = eyes === 'tired' ? ry * 0.8 : eyes === 'wide' ? -ry * 0.2 : ry * 0.02;
    return `<g transform="translate(${ex},-10)">
      <ellipse cy="4" rx="${rx + 8}" ry="${ry + 8}" fill="#b86c52" opacity=".1" filter="url(#k3blur)"/>
      <clipPath id="k3e${id}${ex > 0 ? 'r' : 'l'}"><ellipse rx="${rx}" ry="${ry}"/></clipPath>
      <g clip-path="url(#k3e${id}${ex > 0 ? 'r' : 'l'})">
        <ellipse rx="${rx}" ry="${ry}" fill="${o.black ? 'url(#k3black)' : 'url(#k3sclera)'}"/>
        ${o.black ? '' : `<circle cx="${look * 13}" cy="4" r="${eyes === 'wide' ? 16 : 21}" fill="url(#k3iris)"/><circle cx="${look * 13}" cy="4" r="${eyes === 'wide' ? 6 : 10}" fill="#0a0503"/>`}
        <path d="M${-rx} ${-ry} H${rx} V${-ry + lid + ry * 0.4} Q0 ${-ry + lid + ry * 0.9} ${-rx} ${-ry + lid + ry * 0.4}Z" fill="${skin}" ${lid > 0 ? '' : 'opacity="0"'}/>
        <ellipse cy="${-ry * 0.7}" rx="${rx}" ry="${ry * 0.35}" fill="#000" opacity=".12"/>
      </g>
      <ellipse rx="${rx}" ry="${ry}" fill="none" stroke="#7a3a26" stroke-width="2.5" opacity=".6"/>
      <circle cx="${look * 13 + 8}" cy="-6" r="${o.black ? 5 : 7}" fill="#fff"/><circle cx="${look * 13 - 6}" cy="12" r="3" fill="#fff" opacity=".8"/>
      <path d="M${-rx - 4} ${-ry + Math.max(lid, 0) + 2} Q0 ${-ry - 10 + Math.max(lid, 0)} ${rx + 4} ${-ry + Math.max(lid, 0) + 2}" stroke="#2e1408" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
    </g>`;
  };
  const browY = eyes === 'wide' ? -78 : -64, bt = eyes === 'wide' ? -12 : eyes === 'tired' ? 4 : -4;
  const mouth = o.happy
    ? `<path d="M-44 70 Q0 ${70 + 60 * o.happy} 44 70 Q0 82 -44 70Z" fill="url(#k3mouth)" stroke="${ink}" stroke-width="4"/><path d="M-36 73 Q0 80 36 73" stroke="#fff" stroke-width="8" fill="none"/><ellipse cy="${78 + 34 * o.happy}" rx="18" ry="8" fill="#e06a6a"/>`
    : o.smile
    ? `<path d="M-70 58 Q0 ${58 + 80 * o.smile} 70 58 Q0 ${74 + 20 * o.smile} -70 58Z" fill="url(#k3mouth)" stroke="${ink}" stroke-width="4"/>${[...Array(10)].map((_, k) => `<path d="M${-55 + k * 12} ${63 + 2 * Math.sin(k)} l6 13 l6 -13" fill="#fff8ec" stroke="#5a3a2a" stroke-width="1.5"/>`).join('')}`
    : o.mouth === 'pout' ? `<path d="M-46 80 Q-22 66 0 74 Q22 66 46 80 Q0 88 -46 80Z" fill="#7a3e3a" stroke="${ink}" stroke-width="3"/><path d="M-44 81 Q0 112 44 81 Q0 90 -44 81Z" fill="#a8605a" stroke="${ink}" stroke-width="3"/><ellipse cx="-6" cy="94" rx="16" ry="4" fill="#fff" opacity=".35"/>`
    : o.mouth === 'talk' ? `<path d="M-44 78 Q-20 66 0 72 Q20 66 44 78 Q24 ${84 + 16 * (o.open ?? 1)} 0 ${86 + 22 * (o.open ?? 1)} Q-24 ${84 + 16 * (o.open ?? 1)} -44 78Z" fill="#3a0e0e" stroke="${ink}" stroke-width="4"/><path d="M-30 76 Q0 72 30 76 L28 82 Q0 79 -28 82Z" fill="#fff8ec"/><path d="M-40 80 Q-20 68 0 74 Q20 68 40 80" stroke="#7a3e3a" stroke-width="8" fill="none"/><path d="M-36 ${84 + 18 * (o.open ?? 1)} Q0 ${100 + 28 * (o.open ?? 1)} 36 ${84 + 18 * (o.open ?? 1)}" stroke="#a8605a" stroke-width="10" fill="none" stroke-linecap="round"/>`
    : o.mouth === 'o' ? `<ellipse cx="0" cy="84" rx="20" ry="26" fill="url(#k3mouth)" stroke="${ink}" stroke-width="4"/><ellipse cx="0" cy="98" rx="10" ry="6" fill="#d05050" opacity=".7"/>`
    : eyes === 'wide' ? `<path d="M-30 80 Q0 68 30 80 Q0 98 -30 80Z" fill="url(#k3mouth)" stroke="${ink}" stroke-width="4"/>`
    : `<path d="M-30 80 Q0 ${eyes === 'tired' ? 76 : 88} 30 80" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-16 96 q16 6 32 0" stroke="#c97a62" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const hair = o.hair ? `<g transform="scale(1.04)">${o.hair}</g>` : `
    <path d="M-132 0 Q-158 -150 -40 -178 Q60 -196 120 -140 Q150 -100 134 0 L118 -56 Q100 -40 104 -90 Q80 -70 70 -112 Q40 -84 20 -122 Q-4 -84 -34 -116 Q-52 -78 -80 -104 Q-92 -64 -112 -80 Q-112 -40 -132 0Z" fill="url(#k3hair)"/>
    <path d="M-80 -150 Q-20 -176 50 -160" stroke="#9a6a44" stroke-width="12" fill="none" stroke-linecap="round" opacity=".55"/>
    <path d="M-40 -164 Q10 -176 40 -168" stroke="#d8a878" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
  return `<ellipse cy="182" rx="130" ry="26" fill="url(#k3shadow)"/>
    <path d="M-52 110 L-56 200 L56 200 L52 110Z" fill="${o.neck || '#c07a5c'}"/><ellipse cy="130" rx="60" ry="20" fill="#7a3a28" opacity=".5" filter="url(#k3blur)"/>
    <ellipse cx="-124" cy="10" rx="22" ry="34" fill="${o.ear || 'url(#k3ear)'}"/><ellipse cx="124" cy="10" rx="22" ry="34" fill="${o.ear || 'url(#k3ear)'}"/>
    <path d="M-126 12 q8 -14 0 -26 M126 12 q-8 -14 0 -26" stroke="#9a5440" stroke-width="5" fill="none"/>
    <path d="${face}" fill="${skin}"/>
    ${o.light ? `<path d="${face}" fill="${o.light}" opacity=".22"/><path d="M-118 -10 Q-118 80 -60 135" stroke="${o.light}" stroke-width="10" fill="none" opacity=".5" stroke-linecap="round"/>` : ''}
    <ellipse cx="-74" cy="46" rx="30" ry="16" fill="#ff7a7a" opacity=".35" filter="url(#k3blur)"/><ellipse cx="74" cy="46" rx="30" ry="16" fill="#ff7a7a" opacity=".35" filter="url(#k3blur)"/>
    ${hair}
    <path d="M-90 ${browY + (eyes === 'wide' ? 6 : 0)} q26 ${eyes === 'wide' ? -4 : bt - 12} 58 ${eyes === 'wide' ? -22 : -bt / 2} M90 ${browY + (eyes === 'wide' ? 6 : 0)} q-26 ${eyes === 'wide' ? -4 : bt - 12} -58 ${eyes === 'wide' ? -22 : -bt / 2}" stroke="#2e1c10" stroke-width="12" fill="none" stroke-linecap="round"/>
    ${eye(-48)}${eye(48)}
    <ellipse cx="0" cy="44" rx="20" ry="15" fill="#c97a5e" opacity=".55" filter="url(#k3blur)"/><path d="M-14 40 Q0 58 14 40" stroke="#a85c44" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-4" cy="30" rx="7" ry="5" fill="#fff" opacity=".55"/>
    ${mouth}`;
}
// STYLE 'anime': dark shonen look. Cel shading (hard two-tone shadows), thick outlines, spiky hair, sharp jaw,
// tall glossy anime eyes; scared = tiny shaking pupils + blue gloom lines over the eyes.
const AN = { ink: '#0a0a12', skin: '#fbe2cf', skinS: '#e2a98c', hair: '#161827', hairH: '#34406e', rim: '#7fa2ff' };
let ANID = 0;
function anHead(o) {
  if (!o.blink && !o.back && o.eyes !== 'closed' && !o.black && CUR_T != null && ((CUR_T + (o.seed || 0)) % 3.3) < 0.11) o = { ...o, blink: true };
  const look = o.look || 0, eyes = o.eyes || 'normal', ink = AN.ink;
  const skin = o.skin && o.skin.startsWith('#') ? o.skin : AN.skin;
  const face = 'M-112 -30 Q-116 -150 0 -152 Q116 -150 112 -30 L106 34 Q94 92 44 138 L0 164 L-44 138 Q-94 92 -106 34Z';
  const id = ++ANID;
  if (o.back) return `<path d="M-50 110 L-54 200 L54 200 L50 110Z" fill="${AN.skinS}" stroke="${ink}" stroke-width="6"/>
    <path d="M-128 40 Q-150 -170 0 -176 Q150 -170 128 40 L110 20 L96 110 L70 60 L40 130 L10 70 L-20 132 L-48 66 L-76 116 L-96 40 L-114 90Z" fill="${AN.hair}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-70 -140 Q0 -170 80 -130" stroke="${AN.hairH}" stroke-width="16" fill="none" stroke-linecap="round"/>
    ${o.hero !== false && HERO.hairStyle === 'bun' ? `<circle cx="0" cy="-196" r="52" fill="${AN.hair}" stroke="${ink}" stroke-width="7"/>` : ''}`;
  const shocked = eyes === 'wide';
  const eye = (ex) => {
    const m = ex < 0 ? 1 : -1;  // mirror so the outer corner sits outside
    if (o.blink || eyes === 'closed') return `<path d="M${ex - 36} -2 Q${ex} 14 ${ex + 36} -2" stroke="${ink}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    const top = eyes === 'tired' ? -6 : shocked ? -40 : -30, bot = shocked ? 30 : 24;
    const shape = `M${-40 * m} ${-4} Q${-24 * m} ${top - 4} ${30 * m} ${top + 4} L${42 * m} ${top + 12} Q${38 * m} ${bot} 0 ${bot} Q${-34 * m} ${bot - 2} ${-40 * m} -4Z`;
    const ir = shocked ? 10 : 21, sh = shocked ? (Math.sin(Date.now() / 30 + ex) * 2) : 0;
    return `<g transform="translate(${ex},-2)">
      <clipPath id="an${id}${ex > 0 ? 'r' : 'l'}"><path d="${shape}"/></clipPath>
      <path d="${shape}" fill="${o.black ? '#050508' : '#fffefa'}"/>
      <g clip-path="url(#an${id}${ex > 0 ? 'r' : 'l'})">
        ${o.black ? '<circle cx="0" cy="0" r="5" fill="#ff2a2a"/>' : `
        <ellipse cx="${look * 12 + sh}" cy="${shocked ? 0 : 2}" rx="${ir}" ry="${ir * 1.35}" fill="${shocked ? '#2a3a6a' : 'url(#anIris)'}" stroke="${ink}" stroke-width="3"/>
        <ellipse cx="${look * 12 + sh}" cy="${shocked ? 0 : 4}" rx="${ir * 0.45}" ry="${ir * 0.7}" fill="${ink}"/>
        ${shocked ? '' : `<ellipse cx="${look * 12 - 7}" cy="-10" rx="7" ry="9" fill="#fff"/><circle cx="${look * 12 + 8}" cy="14" r="3.5" fill="#fff"/>`}`}
        <path d="M-50 ${top - 30} H50 V${top + 10} Q0 ${top + 2} -50 ${top + 10}Z" fill="#000" opacity=".18"/>
      </g>
      <path d="M${-44 * m} ${-2} Q${-26 * m} ${top - 8} ${30 * m} ${top} L${50 * m} ${top + 14}" stroke="${ink}" stroke-width="${eyes === 'tired' ? 12 : 9}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${-20 * m} ${bot + 2} Q${4 * m} ${bot + 6} ${26 * m} ${bot - 4}" stroke="${ink}" stroke-width="3" fill="none"/>
    </g>`;
  };
  const browY = shocked ? -78 : -62;
  const brows = shocked
    ? `<path d="M-92 ${browY + 8} L-30 ${browY - 14} M92 ${browY + 8} L30 ${browY - 14}" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`
    : `<path d="M-94 ${browY - 6} L-32 ${browY + 6} M94 ${browY - 6} L32 ${browY + 6}" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`;
  const mouth = o.smile
    ? `<path d="M-64 66 Q0 ${66 + 70 * o.smile} 64 66 Z" fill="#3a0606" stroke="${ink}" stroke-width="5"/><path d="M-56 70 Q0 ${80 + 10 * o.smile} 56 70" stroke="#fff" stroke-width="10" fill="none"/>`
    : o.mouth === 'o' ? `<path d="M-14 82 L14 82 L10 106 L-10 106Z" fill="#3a0606" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>`
    : shocked ? `<path d="M-22 88 Q0 80 22 88 L16 100 Q0 104 -16 100Z" fill="#3a0606" stroke="${ink}" stroke-width="5"/><path d="M-16 90 h32" stroke="#fff" stroke-width="4"/>`
    : `<path d="M-18 ${eyes === 'tired' ? 92 : 90} h36" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  const hs = o.hero !== false && HERO.hairStyle ? HAIRS[HERO.hairStyle] : null;
  const hair = o.hair || (hs ? hs(ink) : null) || `
    <path d="M-130 30 Q-160 -120 -70 -170 L-90 -210 L-30 -178 L-10 -236 L30 -180 L80 -220 L84 -164 Q150 -130 132 30 L118 -20 L108 50 L92 -40 L72 -60 L52 10 L36 -76 L8 -12 L-12 -84 L-34 -10 L-56 -70 L-84 6 L-96 -44 L-112 60Z" fill="${AN.hair}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
    ${[[-92, -112, -64, -134], [-48, -142, -14, -150], [8, -151, 42, -146], [62, -136, 90, -114]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 10} ${x2} ${y2}" stroke="${AN.hairH}" stroke-width="13" fill="none" stroke-linecap="round"/>`).join('')}
    <path d="M118 -20 Q140 -90 100 -150" stroke="${AN.rim}" stroke-width="6" fill="none" opacity=".75"/>`;
  return `<path d="M-48 110 L-52 200 L52 200 L48 110Z" fill="${skin}" stroke="${ink}" stroke-width="6"/><path d="M-48 120 L48 120 L48 160 Q0 140 -48 170Z" fill="${AN.skinS}"/>
    <path d="M-110 -10 q-30 10 -14 50 q10 14 18 6 M110 -10 q30 10 14 50 q-10 14 -18 6" fill="${skin}" stroke="${ink}" stroke-width="6"/>
    <path d="${face}" fill="${skin}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
    <clipPath id="anf${id}"><path d="${face}"/></clipPath>
    <g clip-path="url(#anf${id})"><path d="M40 -160 L130 -160 L130 80 Q90 120 30 170 Q70 90 64 10Z" fill="${AN.skinS}"/>
      ${o.light ? `<path d="M-130 -100 Q-90 40 -30 170 L-130 170Z" fill="${o.light}" opacity=".35"/>` : ''}
      ${shocked ? [...Array(9)].map((_, k) => `<path d="M${-90 + k * 22} -150 V${-40 + (k % 2) * 14}" stroke="#2a3a9a" stroke-width="5" opacity=".55"/>`).join('') + '<rect x="-130" y="-160" width="260" height="110" fill="#3040a0" opacity=".22"/>' : ''}</g>
    ${hair}
    ${brows}${eye(-50)}${eye(50)}
    <path d="M4 30 L-6 52 L8 54" stroke="${ink}" stroke-width="4" fill="none" stroke-linejoin="round"/>
    ${o.hero !== false ? heroFace(ink) : ''}
    ${mouth}`;
}
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
  if (STYLE === 'anime') return `<g transform="translate(${x},${y}) scale(${s})">${o.glow ? `<circle cy="60" r="260" fill="url(#${o.glow})"/>` : ''}${anHead(o)}${o.sweat ? '<path d="M126 -50 c14 20 16 38 0 50 c-16 -12 -14 -30 0 -50z" fill="#dff4ff" stroke="#0a0a12" stroke-width="4"/><path d="M-130 -60 c10 14 12 26 0 34 c-12 -8 -10 -20 0 -34z" fill="#dff4ff" stroke="#0a0a12" stroke-width="4"/>' : ''}</g>`;
  if (STYLE === '3d') return `<g transform="translate(${x},${y}) scale(${s})">${o.glow ? `<circle cy="60" r="260" fill="url(#${o.glow})"/>` : ''}${k3Head(o)}${o.sweat ? '<path d="M128 -40 c12 18 14 34 0 44 c-14 -10 -12 -26 0 -44z" fill="#cfefff" stroke="#3a6a8a" stroke-width="3"/><ellipse cx="125" cy="-4" rx="3" ry="6" fill="#fff"/>' : ''}</g>`;
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
  if (STYLE === 'anime') {
    const base = o.body && !o.body.startsWith('url') ? o.body : (HERO_BODY || '#23273d'), shd = mix(base.length === 7 ? base : '#23273d', '#000', 0.45), ink = AN.ink, rx = o.reach ? 230 : 150, ry = o.reach ? 300 : 430;
    const hand = (hx, hy) => `<g transform="translate(${hx},${hy})"><path d="M-24 -20 Q-30 20 -14 34 L20 34 Q32 10 24 -20Z" fill="${AN.skin}" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><path d="M-8 0 v26 M6 0 v28" stroke="${ink}" stroke-width="3"/></g>`;
    return `<g transform="translate(${x},${y + bob}) scale(${s})">
      <path d="M-130 150 Q-136 46 -44 36 L44 36 Q136 46 130 150 L148 520 L-148 520Z" fill="${base}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M40 40 Q136 46 130 150 L148 520 L50 520 Q90 300 40 40Z" fill="${shd}"/>
      <path d="M-44 36 L0 120 L44 36" fill="#e8e6f0" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><path d="M0 120 V520" stroke="${ink}" stroke-width="5"/>
      <path d="M-130 150 Q-110 120 -60 110" stroke="${AN.rim}" stroke-width="6" fill="none" opacity=".6"/>
      <path d="M-124 160 Q-180 300 -150 430" stroke="${ink}" stroke-width="72" stroke-linecap="round" fill="none"/><path d="M-124 160 Q-180 300 -150 430" stroke="${base}" stroke-width="58" stroke-linecap="round" fill="none"/>
      <path d="M124 160 Q180 300 ${rx} ${ry}" stroke="${ink}" stroke-width="72" stroke-linecap="round" fill="none"/><path d="M124 160 Q180 300 ${rx} ${ry}" stroke="${shd}" stroke-width="58" stroke-linecap="round" fill="none"/>
      ${o.hero !== false ? outfit(ink) : ''}
      ${hand(-150, 452)}${hand(rx, ry + 22)}
      ${head(0, -110, 1, o)}
    </g>`;
  }
  if (STYLE === '3d') {
    const tint = o.body && !o.body.startsWith('url') ? o.body : null, rx = o.reach ? 230 : 150, ry = o.reach ? 300 : 430;
    const fill = tint || 'url(#k3hood)', sl = tint || '#2e3a5e';
    const hand = (hx, hy) => `<g transform="translate(${hx},${hy})"><ellipse rx="32" ry="36" fill="${o.skin && (o.skin.startsWith('url(#k3') || o.skin.startsWith('url(#me')) ? o.skin : 'url(#k3skin)'}"/><path d="M-20 -6 q-4 24 6 30 M-4 -4 q-2 26 6 32 M12 -4 q0 26 6 28" stroke="#a8624a" stroke-width="4" fill="none" opacity=".7"/><ellipse cx="-8" cy="-14" rx="10" ry="6" fill="#fff" opacity=".35"/></g>`;
    return `<g transform="translate(${x},${y + bob}) scale(${s})">
      <ellipse cy="530" rx="200" ry="40" fill="url(#k3shadow)"/>
      <path d="M-110 70 Q0 -10 110 70 L70 120 Q0 90 -70 120Z" fill="${sl}"/>
      <path d="M-134 150 Q-140 46 -40 38 L40 38 Q140 46 134 150 L150 520 L-150 520Z" fill="${fill}"/>
      ${tint ? '<path d="M-134 150 Q-140 46 -40 38 L40 38 Q140 46 134 150 L150 520 L-150 520Z" fill="url(#k3shadow)" opacity=".0"/>' : ''}
      <path d="M-150 480 L150 480 L150 520 L-150 520Z" fill="#000" opacity=".25"/>
      <path d="M-40 38 Q0 120 40 38" fill="none" stroke="#000" stroke-width="6" opacity=".35"/>
      <path d="M-16 92 v90 M16 92 v80" stroke="#f0ece4" stroke-width="7" stroke-linecap="round"/><circle cx="-16" cy="184" r="7" fill="#d8d0c4"/><circle cx="16" cy="174" r="7" fill="#d8d0c4"/>
      <path d="M-76 330 h152 q8 0 8 10 v90 h-168 v-90 q0 -10 8 -10z" fill="#000" opacity=".18"/>
      <path d="M-120 70 Q-60 50 -30 60" stroke="#fff" stroke-width="10" opacity=".18" fill="none" stroke-linecap="round"/>
      <path d="M-124 160 Q-180 300 -150 430" stroke="${sl}" stroke-width="62" stroke-linecap="round" fill="none"/><path d="M-130 180 Q-176 300 -156 410" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".12"/>
      <path d="M124 160 Q180 300 ${rx} ${ry}" stroke="${sl}" stroke-width="62" stroke-linecap="round" fill="none"/>
      ${hand(-150, 456)}${hand(rx, ry + 26)}
      ${head(0, -110, 1, o)}
    </g>`;
  }
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
  return person(x, y, s, { ...o, hair: STYLE === '3d' || STYLE === 'anime' ? undefined : tuft, body: o.body || '#3a4a6a', arm: '#2e3c58' });
}
function watcher(x, y, s, a = 1, o = {}) {
  const h = o.tall || 1;
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${a}">
    <path d="M-80 -40 Q-90 -170 0 -180 Q90 -170 80 -40 L${110 * h} ${520 * h} L${-110 * h} ${520 * h}Z" fill="#030303"/>
    ${STYLE === 'anime' ? `<path d="M-80 -40 Q-90 -170 0 -180 Q90 -170 80 -40 L${110 * h} ${520 * h} L${-110 * h} ${520 * h}Z" fill="#020204" stroke="#c0202a" stroke-width="5" opacity=".95"/>` : ''}
    ${STYLE === '3d' ? `<path d="M-80 -40 Q-90 -170 0 -180 Q90 -170 80 -40 L${110 * h} ${520 * h} L${-110 * h} ${520 * h}Z" fill="url(#k3creature)"/><path d="M-70 -120 Q-40 -170 20 -172" stroke="#6a5a7a" stroke-width="6" fill="none" opacity=".5" stroke-linecap="round"/>` : ''}
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
// Depth rooms (anime / 3d styles): a real perspective box instead of a flat colour. Back wall, side walls, ceiling and a
// plank floor all run to one vanishing point; corners get soft shadow, moonlight comes through a side window with a
// beam and drifting dust, and the whole room is slightly out of focus and zooms slower than the people (parallax).
let CUR_T = 0, CUR_DRIFT = 1, CUR_SCENE = '';
const FLAT_SCENES = ['phone', 'face', 'reflection', 'black', 'text'];  // close-ups stay plain dark
const DEPTH = () => (STYLE === 'anime' || STYLE === '3d') && !FLAT_SCENES.includes(CUR_SCENE);
const mix = (a, b, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.substr(i, 2), 16) * (1 - k) + parseInt(b.substr(i, 2), 16) * k).toString(16).padStart(2, '0')).join('');
function room3d(c) {
  const base = mix(c.length === 7 ? c : '#0a0908', '#2e3866', 0.7), wall = mix(base, '#000', 0.1), side = mix(base, '#000', 0.4), far = mix(base, '#9fb4ff', 0.08);
  const ceil = mix(base, '#000', 0.6), flo = mix(base, '#3a2a1e', 0.45);
  const BX0 = 520, BX1 = 1400, BY0 = 380, BY1 = 1180;
  const planks = [...Array(15)].map((_, k) => { const fx = BX0 + (BX1 - BX0) * k / 14, bx = -900 + 3720 * k / 14;
    return `<path d="M${fx} ${BY1} L${bx} 1920" stroke="#000" stroke-width="3" opacity=".35"/>`; }).join('')
    + [1235, 1310, 1420, 1590, 1850].map((y) => `<path d="M0 ${y} H1920" stroke="#000" stroke-width="2" opacity=".18"/>`).join('');
  const dust = [...Array(18)].map((_, k) => { const ph = (CUR_T * 0.05 + k * 0.137) % 1;
    return `<circle cx="${250 + k * 23 + 60 * Math.sin(CUR_T * 0.4 + k)}" cy="${500 + ph * 900}" r="${2 + k % 3}" fill="#dfe8ff" opacity="${0.35 * Math.sin(ph * Math.PI)}"/>`; }).join('');
  const z = 1 / Math.pow(CUR_DRIFT, 0.65), pan = 18 * Math.sin(CUR_T * 0.15);
  return `<defs>
      <linearGradient id="rmL" x1="0" x2="1"><stop offset="0" stop-color="${mix(side, '#000', 0.5)}"/><stop offset="1" stop-color="${side}"/></linearGradient>
      <linearGradient id="rmR" x1="1" x2="0"><stop offset="0" stop-color="${mix(side, '#000', 0.55)}"/><stop offset="1" stop-color="${side}"/></linearGradient>
      <linearGradient id="rmF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${flo}"/><stop offset="1" stop-color="${mix(flo, '#000', 0.6)}"/></linearGradient>
      <linearGradient id="rmC" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${ceil}"/><stop offset="1" stop-color="#000"/></linearGradient>
      <radialGradient id="rmB" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="${far}"/><stop offset="1" stop-color="${wall}"/></radialGradient>
      <linearGradient id="rmBeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bcd0ff" stop-opacity=".3"/><stop offset="1" stop-color="#bcd0ff" stop-opacity="0"/></linearGradient>
      <filter id="rmDof"><feGaussianBlur stdDeviation="1.6"/></filter><filter id="rmAO"><feGaussianBlur stdDeviation="22"/></filter>
    </defs>
    <rect width="1920" height="1920" fill="#000"/>
    <g transform="translate(${960 + pan},820) scale(${z}) translate(-960,-820)" filter="url(#rmDof)">
      <path d="M-200 -200 L2120 -200 L${BX1} ${BY0} L${BX0} ${BY0}Z" fill="url(#rmC)"/>
      <path d="M-200 -200 L${BX0} ${BY0} L${BX0} ${BY1} L-200 2120Z" fill="url(#rmL)"/>
      <path d="M2120 -200 L${BX1} ${BY0} L${BX1} ${BY1} L2120 2120Z" fill="url(#rmR)"/>
      <rect x="${BX0}" y="${BY0}" width="${BX1 - BX0}" height="${BY1 - BY0}" fill="url(#rmB)"/>
      <path d="M${BX0} ${BY1} L${BX1} ${BY1} L2600 1920 L-680 1920Z" fill="url(#rmF)"/>${planks}
      <path d="M${BX0} ${BY1 - 26} H${BX1} V${BY1} H${BX0}Z M${BX0} ${BY1 - 26} L-200 ${2120 - 120} V2120 L${BX0} ${BY1}Z M${BX1} ${BY1 - 26} L2120 ${2120 - 120} V2120 L${BX1} ${BY1}Z" fill="#000" opacity=".25"/>
      <path d="M${BX0} ${BY0} V${BY1} M${BX1} ${BY0} V${BY1} M${BX0} ${BY0} H${BX1} M${BX0} ${BY1} H${BX1}" stroke="#000" stroke-width="40" opacity=".55" filter="url(#rmAO)"/>
      <g ${[...CUR_SCENE].reduce((h, ch) => h + ch.charCodeAt(0), 0) % 2 ? 'transform="translate(1920,0) scale(-1,1)"' : ''}>
      <path d="M120 360 L360 470 L360 900 L120 960Z" fill="#0c1426" stroke="#05070c" stroke-width="16"/>
      <path d="M140 380 L340 474 L340 890 L140 940Z" fill="#7f9ad8" opacity=".55"/><path d="M240 420 V915 M140 660 L340 682" stroke="#05070c" stroke-width="10"/>
      <circle cx="210" cy="520" r="38" fill="#eef3ff" opacity=".85"/>
      <path d="M140 380 L340 474 L1500 1920 L300 1920Z" fill="url(#rmBeam)"/>
            </g>
      ${dust}
      <rect x="0" y="0" width="1920" height="1920" fill="${c}" opacity=".18"/>
    </g>`;
}
const room = (c = '#0a0908') => DEPTH() ? room3d(c) : `<rect width="1920" height="1920" fill="${c}"/>`;
const floor = (y) => DEPTH() ? '' : `<rect y="${y}" width="1920" height="${1920 - y}" fill="url(#floor)"/>`;

// ---------- scenes ----------
const S = {};
// in bed at night, phone or clock glow. p: time, eyes, phone, watcher (0..1), watcherX, sweat
S.bed = (t, d, p) => {
  const breathe = t * 2;
  const w = p.watcher ? `${watcher(p.watcherX || 1420, 760, 1.2, (p.watcher === 'fade' ? ease(t / d) : p.watcher) * 0.95, { blink: (t % 3.1) > 3 })}` : '';
  return `${room('#06070b')}
    ${DEPTH() ? '' : '<rect x="200" y="420" width="1520" height="760" fill="#0b0d14"/>'}
    <rect x="1240" y="520" width="240" height="420" fill="#101522" stroke="#1c2233" stroke-width="10"/>
    <path d="M1250 530 h220 v400 h-220z" fill="#1b2a44" opacity=".35"/>
    ${w}
    ${floor(1180)}
    <rect x="420" y="1040" width="1080" height="70" rx="20" fill="#2a1d14"/>
    <rect x="460" y="980" width="320" height="110" rx="40" fill="#cfd6e4"/>
    ${head(720, 960, 1.15, { eyes: p.eyes || 'wide', look: p.look ?? 0.6, glow: p.phone ? 'phoneGlow' : null, light: p.phone ? '#9fd2ff' : null, sweat: p.sweat })}
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
S.kitchenDoor = (t, d, p) => `${room('#040405')}
    <rect x="520" y="500" width="880" height="900" fill="#08090b" stroke="#16181c" stroke-width="12"/>
    ${p.fridge !== false ? `<rect x="1020" y="620" width="300" height="680" fill="#e8f4ff" opacity="${0.75 * flick(t, 0.3)}"/><path d="M1020 1300 L1320 1300 L1600 1920 L700 1920Z" fill="#cfe6ff" opacity=".12"/><path d="M1020 620 L900 660 L900 1340 L1020 1300Z" fill="#cfd8e0" stroke="#000" stroke-width="6"/>` : ''}
    ${p.watcher ? watcher(780, 900, .9, p.watcher, { tall: 1.05, fingers: true, blink: (t % 2.7) > 2.6 }) : ''}
    ${p.kid ? kid(960, 1420 - ease(t / d) * 260, 0.7 - ease(t / d) * 0.15, { eyes: 'closed', walk: t * 3 }) : ''}
    ${[0, 1, 2, 3].map((i) => `<rect x="${420 + i * 40}" y="${1500 + i * 110}" width="${1080 - i * 80}" height="22" fill="#0d0d0d"/>`).join('')}`;
// a real kitchen at night: upper and lower cabinets, counter with sink and faucet under a moonlit window, a stove,
// a wall clock and a tall fridge. p: fridge (door swings open, lit shelves, light spills on the floor), food (0..1 how
// full the shelves are), time (clock text), cam (a security camera on the wall, red light blinking), watcher (0..1 a figure by the fridge), kid, lights (warm ceiling light on)
S.kitchen = (t, d, p) => {
  const fl = flick(t, 0.25), open = p.fridge ? ease(Math.min(1, t / 0.8 + 0.6)) : 0, food = p.food ?? 1, warm = p.lights;
  const ink = '#0a0a0e', cab = warm ? '#5a4632' : '#2a2f3e', cabD = warm ? '#3e3020' : '#1c202c', top = warm ? '#c9c2b4' : '#5d6478';
  const FX = 1190, FY = 520, FW = 210, FH = 650;   // fridge box
  const doors = (x0, x1, y0, y1, n) => [...Array(n)].map((_, k) => { const w = (x1 - x0) / n, x = x0 + k * w;
    return `<rect x="${x + 8}" y="${y0 + 8}" width="${w - 16}" height="${y1 - y0 - 16}" rx="6" fill="${cab}" stroke="${ink}" stroke-width="6"/>
      <rect x="${x + (k % 2 ? 22 : w - 34)}" y="${y0 + (y1 - y0) * 0.42}" width="12" height="${(y1 - y0) * 0.16}" rx="5" fill="#a9a08a" stroke="${ink}" stroke-width="3"/>`; }).join('');
  const items = [];
  const shelf = (y, list) => list.forEach(([dx, w, h, c], k) => { if (k / list.length < food) items.push(`<rect x="${FX + dx}" y="${y - h}" width="${w}" height="${h}" rx="4" fill="${c}" stroke="#1a1a1a" stroke-width="3"/>`); });
  shelf(700, [[20, 40, 60, '#f2f2f2'], [66, 40, 60, '#f2f2f2'], [112, 40, 60, '#ffd9e0'], [158, 34, 80, '#9fd3ff']]);
  shelf(860, [[20, 90, 46, '#ffffff'], [118, 70, 70, '#e6c27a']]);
  shelf(1020, [[24, 50, 110, '#7fc96b'], [84, 28, 120, '#e8e8e8'], [120, 60, 50, '#d97a4a']]);
  const lightOn = open > 0.05;
  return `${room(warm ? '#2a1e12' : '#06070b')}
    ${warm ? '<rect width="1920" height="1920" fill="#ffcf8a" opacity=".10"/>' : ''}
    <rect x="520" y="420" width="880" height="16" fill="${ink}" opacity=".6"/>
    ${doors(540, 820, 440, 650, 2)}${doors(1080, 1180, 440, 650, 1)}
    <rect x="850" y="470" width="200" height="230" fill="#0c1430" stroke="${ink}" stroke-width="12"/>
    <rect x="862" y="482" width="176" height="206" fill="${warm ? '#1a2240' : '#3a5aa8'}" opacity=".75"/>
    <path d="M950 470 V700 M850 585 H1050" stroke="${ink}" stroke-width="8"/>
    <circle cx="1000" cy="530" r="22" fill="#eef3ff" opacity="${warm ? 0.3 : 0.9}"/>
    <path d="M862 688 L1038 688 L1160 1180 L780 1180Z" fill="#a8c0ff" opacity="${warm ? 0 : 0.07}"/>
    <g transform="translate(700,560)"><circle r="44" fill="#e8e2d2" stroke="${ink}" stroke-width="7"/>
      <path d="M0 0 L0 -30 M0 0 L22 10" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
      ${p.time ? `<rect x="-62" y="56" width="124" height="44" rx="8" fill="#0b0b10"/><text x="0" y="88" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="32" fill="#ff3a3a">${p.time}</text>` : ''}</g>
    <rect x="530" y="880" width="660" height="34" rx="6" fill="${top}" stroke="${ink}" stroke-width="7"/>
    ${doors(540, 1180, 914, 1170, 4)}
    <rect x="540" y="1160" width="640" height="20" fill="#000" opacity=".5"/>
    <rect x="820" y="884" width="250" height="20" rx="8" fill="#20242e" stroke="${ink}" stroke-width="5"/>
    <path d="M945 884 V820 Q945 795 975 795 H1005" stroke="#c8ccd6" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M1005 795 v18" stroke="#c8ccd6" stroke-width="10" stroke-linecap="round"/>
    <rect x="560" y="860" width="210" height="22" rx="4" fill="#15171c" stroke="${ink}" stroke-width="4"/>
    ${[600, 700].map((x) => `<ellipse cx="${x}" cy="866" rx="34" ry="8" fill="#0a0a0a" stroke="#3a3a42" stroke-width="4"/>`).join('')}
    ${[580, 630, 680, 730].map((x) => `<circle cx="${x}" cy="1000" r="9" fill="#bbb" stroke="${ink}" stroke-width="3"/>`).join('')}
    <rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="14" fill="${warm ? '#e9e6df' : '#9aa3b6'}" stroke="${ink}" stroke-width="9"/>
    <path d="M${FX} ${FY + 230} H${FX + FW}" stroke="${ink}" stroke-width="6"/>
    ${lightOn ? `<rect x="${FX + 8}" y="${FY + 8}" width="${FW - 16}" height="${FH - 16}" rx="8" fill="#f4fbff" opacity="${0.95 * fl}"/>
      ${[700, 860, 1020].map((y) => `<rect x="${FX + 10}" y="${y}" width="${FW - 20}" height="8" fill="#b8c8d8"/>`).join('')}
      <rect x="${FX + 10}" y="${FY + 20}" width="${FW - 20}" height="150" fill="#dfeaf4"/>
      ${items.join('')}
      <path d="M${FX} ${FY + FH} L${FX + FW} ${FY + FH} L${FX + FW + 420} 1920 L${FX - 520} 1920Z" fill="#dff0ff" opacity="${0.16 * open * fl}"/>
      <circle cx="${FX + FW / 2}" cy="${FY + FH / 2}" r="520" fill="#dff0ff" opacity="${0.10 * open}" filter="url(#blur)"/>
      <path d="M${FX} ${FY} L${FX - 150 * open} ${FY + 40 * open} L${FX - 150 * open} ${FY + FH - 40 * open} L${FX} ${FY + FH}Z" fill="#c9d2de" stroke="${ink}" stroke-width="8"/>
      <path d="M${FX - 40 * open} ${FY + 140} v60" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`
    : `<rect x="${FX + FW - 30}" y="${FY + 80}" width="12" height="110" rx="5" fill="#d8dce4" stroke="${ink}" stroke-width="3"/><rect x="${FX + FW - 30}" y="${FY + 270}" width="12" height="160" rx="5" fill="#d8dce4" stroke="${ink}" stroke-width="3"/>`}
    ${p.cam ? `<g transform="translate(1110,600)"><rect x="-10" y="-60" width="20" height="40" fill="#cfd3dc" stroke="${ink}" stroke-width="4"/><path d="M-50 -24 h100 l-20 60 h-60z" fill="#e8ebf2" stroke="${ink}" stroke-width="6"/><circle cx="0" cy="22" r="20" fill="#14161c" stroke="${ink}" stroke-width="5"/><circle cx="34" cy="-8" r="7" fill="#ff2a2a" opacity="${Math.sin(t * 6) > 0 ? 1 : 0.2}"/></g>` : ''}
    ${p.cook ? `${[0, 1, 2].map((k) => `<path d="M${620 + k * 24} ${840 - ((t * 60 + k * 40) % 120)} q-14 -30 0 -60 q14 -30 0 -60" stroke="#e8eef4" stroke-width="8" fill="none" opacity="${0.35 - k * 0.08}"/>`).join('')}
      <ellipse cx="650" cy="852" rx="60" ry="14" fill="#2a2a30" stroke="${ink}" stroke-width="5"/>
      <g transform="translate(640,820) scale(0.55)">${person(0, 0, 1, { back: true, body: p.cookBody || HERO.body, hero: true })}</g>` : ''}
    ${p.dinner ? `<g transform="translate(960,1330)"><path d="M-420 0 L420 0 L470 70 L-470 70Z" fill="#6a4a30" stroke="${ink}" stroke-width="8"/>
      ${[-200, 200].map((x) => `<ellipse cx="${x}" cy="20" rx="120" ry="34" fill="#f2f2ee" stroke="${ink}" stroke-width="6"/><ellipse cx="${x}" cy="14" rx="70" ry="18" fill="#c87a3a"/>
        ${[0, 1].map((k) => `<path d="M${x - 20 + k * 40} ${-10 - ((t * 50 + k * 30) % 90)} q-12 -24 0 -48 q12 -24 0 -48" stroke="#fff" stroke-width="6" fill="none" opacity=".35"/>`).join('')}`).join('')}</g>` : ''}
    ${p.watcher ? watcher(FX - 230, 880, .85, p.watcher, { tall: 1.0, fingers: true, blink: (t % 2.7) > 2.6 }) : ''}
    ${p.kid ? kid(960, 1420 - ease(t / d) * 260, 0.7 - ease(t / d) * 0.15, { eyes: 'closed', walk: t * 3 }) : ''}
    <rect width="1920" height="1920" fill="#203060" opacity="${warm ? 0 : 0.14}"/>`;
};
// inside your room, looking at the closed door: light strip underneath, two shadow feet. p: feet (bool), knock
S.bedroomdoor = (t, d, p) => {
  const k = p.knock ? (Math.floor(t * 2.2) % 3 === 0 && (t % (1 / 2.2)) < 0.12 ? 6 : 0) : 0;
  return `${room('#07070a')}
    <rect x="660" y="430" width="600" height="1000" fill="#241c14" stroke="#3a2e20" stroke-width="16" transform="translate(${k},0)"/>
    <rect x="700" y="480" width="520" height="420" fill="none" stroke="#33281b" stroke-width="8"/><rect x="700" y="950" width="520" height="420" fill="none" stroke="#33281b" stroke-width="8"/>
    <circle cx="1190" cy="940" r="20" fill="#9a8a5a"/>
    <rect x="660" y="1430" width="600" height="18" fill="#ffd88a" opacity=".95"/>
    ${p.feet === 'many' ? [690, 770, 860, 945, 1035, 1120, 1190].map((fx, k) => `<rect x="${fx + 6 * Math.sin(t * 1.7 + k)}" y="1430" width="${50 + k * 7 % 20}" height="18" fill="#050505"/>`).join('')
      : p.feet ? '<rect x="840" y="1430" width="90" height="18" fill="#050505"/><rect x="990" y="1430" width="90" height="18" fill="#050505"/>' : ''}
    ${p.marks ? [...Array(p.marks)].map((_, k) => k === 4 ? '<path d="M760 560 L1010 700" stroke="#d8c8a8" stroke-width="9" stroke-linecap="round" opacity=".85"/>' : `<path d="M${780 + k * 60} 540 l${(k % 2) * 8 - 4} 190" stroke="#d8c8a8" stroke-width="9" stroke-linecap="round" opacity=".85"/>`).join('') : ''}
    ${p.handle ? `<g transform="rotate(${-40 * ease(t / d)} 1190 940)"><rect x="1100" y="928" width="96" height="24" rx="12" fill="#b8a46a" stroke="#3a2e14" stroke-width="5"/></g>` : ''}
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
const FOCUS = { clown: 1240, bed: 790, reflection: 960, face: 960, door: 800, nan: 1040, kitchen: 1080, kitchenDoor: 1000, morning: 960 };
// ---------- camera (anime / 3d styles) ----------
// Every scene whips in sideways with motion blur instead of a dip to black, the frame breathes like a handheld shot,
// and a scene can snap-zoom onto something: p.snap = { at: seconds, to: [x, y], z: 2.2, back: seconds (optional) }.
// p.shake: extra handheld shake (0..1). p.whip === false turns the whip-in off for that scene.
const WHIP = 0.3, SNAP = 0.22;
const eio = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
function camAt(name, t, d, p, vc, drift) {
  let cx = vc[0], cy = vc[1], z = drift;
  const moving = (STYLE === 'anime' || STYLE === '3d') && !p.still && !['text', 'black'].includes(name);
  if (!moving) return { cx, cy, z };
  if (p.whip === true && t < WHIP) cx += ((p._i || 0) % 2 ? -1 : 1) * 900 * Math.pow(1 - clamp(t / WHIP), 3);
  if (p.snap) {
    const sn = p.snap, k = eio((t - sn.at) / SNAP) - (sn.back != null ? eio((t - sn.back) / SNAP) : 0);
    cx += (sn.to[0] - cx) * k; cy += (sn.to[1] - cy) * k; z += ((sn.z || 2.2) - z) * k;
  }
  if (p.shake) {  // no idle handheld drift (holds stay still, the camera only creeps); jitter only on shake moments
    const hs = 1 + 3 * p.shake;
    cx += hs * 5 * noise(Math.floor(t * 24)); cy += hs * 5 * noise(Math.floor(t * 24) + 7);
  }
  return { cx, cy, z };
}

function camWrap(body, name, t, d, p, view, drift) {
  const vc = [view[0] + view[2] / 2, view[1] + view[3] / 2];
  const a = camAt(name, t, d, p, vc, drift), b = camAt(name, Math.max(0, t - 1 / 30), d, p, vc, drift);
  const bx = Math.min(40, Math.abs(a.cx - b.cx) * a.z * 0.45), by = Math.min(40, Math.abs(a.cy - b.cy) * a.z * 0.45);
  const bz = Math.min(10, Math.abs(a.z - b.z) * 60), blur = Math.max(bx, by, bz) > 0.6;
  return `${blur ? `<defs><filter id="camBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${(bx + bz).toFixed(1)} ${(by + bz).toFixed(1)}"/></filter></defs>` : ''}
    <g ${blur ? 'filter="url(#camBlur)"' : ''}><g transform="translate(${vc[0]},${vc[1]}) scale(${a.z}) translate(${-a.cx},${-a.cy})" ${STYLE === 'sketch' ? 'filter="url(#boil)"' : ''}>${body}</g></g>`;
}

function frameSVG(name, t, d, p, view, frameNo) {
  if (view[2] < view[3]) {  // vertical: slide the window so the subject sits in the middle
    const fx = p.focus ?? FOCUS[name] ?? 960;
    view = [Math.max(0, Math.min(1920 - view[2], fx - view[2] / 2)), view[1], view[2], view[3]];
  }
  VW = view[2];
  STYLE = p.style || 'cartoon';
  // p.push: zoom speed per second (e.g. 0.035 = the fast story-TikTok push-in of 3.5%/s); p.push = 0 holds still.
  const drift = p.still ? 1 : p.push != null ? 1 + p.push * t : DEPTH() ? 1 + Math.min(0.05 * t, 0.2 * t / Math.max(d, 1)) : 1 + 0.04 * (t / Math.max(d, 1));
  CUR_T = t; CUR_DRIFT = drift; CUR_SCENE = name;
  setHero(p.hero);
  const body = (S[name] || S.text)(t, d, p);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${view[2]}" height="${view[3]}" viewBox="${view.join(' ')}">${DEFS.replace('SEED', frameNo % 7)}
    ${STYLE === '3d' ? D3 : ''}
    ${STYLE === 'anime' ? '<defs><linearGradient id="anIris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1430"/><stop offset=".55" stop-color="#2a4aa8"/><stop offset="1" stop-color="#8ab4ff"/></linearGradient></defs>' : ''}
    ${STYLE === 'sketch' ? `<defs><filter id="boil" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="${Math.floor(frameNo / 3) % 6 + 1}"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
      <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".6 .015" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .9  0 0 0 0 .85  0 0 0 0 .75  0 0 0 .18 -.04"/></filter></defs>` : ''}
    ${gradeDefs(p.grade)}<g ${p.grade ? 'filter="url(#gradeF)"' : ''}>${camWrap(body, name, t, d, p, view, drift)}</g>
    ${STYLE === 'sketch' ? '<rect width="1920" height="1920" filter="url(#paper)"/>' : ''}
    ${STYLE === 'anime' && !p.grade && !p.noVig ? '<rect width="1920" height="1920" fill="#2030a0" opacity=".08"/>' : ''}
    ${p.grade && p.grade.wash ? `<rect width="1920" height="1920" fill="${p.grade.wash}" opacity="${p.grade.washA ?? 0.08}"/>` : ''}
    ${p.noVig ? '' : '<rect width="1920" height="1920" fill="url(#vig)"/>'}
    <rect width="1920" height="1920" fill="#fff" filter="url(#grain)" opacity=".55"/>
    ${p.torch ? `<defs><radialGradient id="torchG" cx="${p.torch[0] / 1920}" cy="${p.torch[1] / 1920}" r="${(p.torch[2] || 380) / 1920}"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".93"/></radialGradient></defs><rect width="1920" height="1920" fill="url(#torchG)"/>` : ''}
    ${p.flash != null && t >= p.flash && t < p.flash + 1 / 30 ? '<rect width="1920" height="1920" fill="#fff"/>' : ''}
    ${pops(t, p, view)}
  </svg>`;
}

// True-story pop-ups drawn on top of the frame (screen space, not affected by the camera), like real-story TikToks:
// p.torch = [x, y, r]: everything dark except a flashlight circle; p.flash = seconds: a single white frame (the shock).
// p.pops = [{ at: seconds, type: 'label' | 'num' | 'pin' | 'date', text, x: 0..1, y: 0..1 (position in the frame) }]
// label: a name in huge outlined letters with a curved purple arrow pointing down at the person; num: a big number;
// pin: a map pin with a place name; date: a typewriter-style date stamp. Each one pops in with a quick overshoot.
function pops(t, p, view) {
  if (!p.pops) return '';
  return p.pops.map((o) => {
    const k = clamp((t - (o.at || 0)) / 0.18); if (k <= 0) return '';
    const sc = k < 1 ? 0.6 + 0.55 * Math.sin(k * Math.PI * 0.75) : 1;
    const x = view[0] + view[2] * (o.x ?? 0.5), y = view[1] + view[3] * (o.y ?? 0.2);
    const T = esc3(String(o.text || '')), fs = Math.min(150, view[2] * (o.type === 'pin' ? 0.62 : 0.9) / (0.55 * Math.max(4, T.length)));
    const txt = (sz, col) => `<text x="0" y="0" text-anchor="middle" font-family="Anton" font-size="${sz}" fill="${col}" stroke="#000" stroke-width="${sz / 9}" paint-order="stroke" letter-spacing="2">${T}</text>`;
    let g = '';
    if (o.type === 'num') g = txt(Math.min(220, fs * 1.4), '#fff');
    else if (o.type === 'pin') g = `<rect x="${-fs * 0.55 * T.length / 2 - 110}" y="-${fs * 0.95}" width="${fs * 0.55 * T.length + 160}" height="${fs * 1.3}" rx="${fs * 0.3}" fill="#0b0b10" opacity=".85" stroke="#a020f0" stroke-width="6"/>
        <g transform="translate(${-fs * 0.55 * T.length / 2 - 55},-${fs * 0.3})"><path d="M0 ${fs * 0.45} C-${fs * 0.42} 0 -${fs * 0.42} -${fs * 0.5} 0 -${fs * 0.5} C${fs * 0.42} -${fs * 0.5} ${fs * 0.42} 0 0 ${fs * 0.45}Z" fill="#ff2a3a"/><circle cx="0" cy="-${fs * 0.18}" r="${fs * 0.13}" fill="#fff"/></g>
        <g transform="translate(40,0)">${txt(fs * 0.8, '#fff')}</g>`;
    else if (o.type === 'date') g = `<g transform="rotate(-4)"><rect x="${-fs * 0.3 * T.length - 30}" y="-${fs * 0.85}" width="${fs * 0.6 * T.length + 60}" height="${fs * 1.15}" fill="none" stroke="#e8e0cc" stroke-width="8"/><text x="0" y="0" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="${fs * 0.8}" fill="#e8e0cc">${T}</text></g>`;
    else g = `${txt(fs, '#fff')}<path d="M${-fs * 1.6} ${fs * 0.35} q-${fs * 0.15} ${fs * 0.7} ${fs * 0.55} ${fs * 1.0}" stroke="#a020f0" stroke-width="${fs * 0.16}" fill="none" stroke-linecap="round"/>
        <path d="M${-fs * 1.05} ${fs * 1.35} l-${fs * 0.42} -${fs * 0.08} l${fs * 0.18} -${fs * 0.36}Z" fill="#a020f0" stroke="#a020f0" stroke-width="${fs * 0.08}" stroke-linejoin="round"/>`;
    return `<g transform="translate(${x},${y}) scale(${sc})" style="filter:drop-shadow(0 8px 0 rgba(0,0,0,.6))">${g}</g>`;
  }).join('');
}

// Thumbnail built from a real frame of the story: any scene underneath (p.base with p.bp), then huge outlined words
// (p.lines: [[text, colour], ...]), an optional red circle (p.circle: [x, y, r]) and arrow (p.arrow: [x1, y1, x2, y2]).
// Each Short gets its own frame, colour and layout so the channel page doesn't look like one thumbnail repeated.
S.thumbOver = (t, d, p) => {
  const base = (S[p.base] || S.black)(p.bt ?? 1.5, 3, { ...(p.bp || {}), style: STYLE });
  const zb = p.zoom ? `<g transform="translate(${p.zoom[0]},${p.zoom[1]}) scale(${p.zoom[2]}) translate(${-p.zoom[0]},${-p.zoom[1]})">${base}</g>` : base;
  const lines = p.lines || [];
  const y0 = p.y ?? 560, step = p.step ?? 190;
  return `${zb}
    ${p.tint ? `<rect width="1920" height="1920" fill="${p.tint}" opacity=".22"/>` : ''}
    <rect x="0" y="${y0 - 200}" width="1920" height="${lines.length * step + 120}" fill="url(#thVig)" opacity="${p.band ?? 0.6}"/>
    <defs><linearGradient id="thVig" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
    ${p.circle ? `<circle cx="${p.circle[0]}" cy="${p.circle[1]}" r="${p.circle[2]}" fill="none" stroke="#ff1a1a" stroke-width="22" style="filter:drop-shadow(0 0 18px #ff0000)"/>` : ''}
    ${p.arrow ? `<g stroke="#ff1a1a" stroke-width="30" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 6px 0 #000)"><path d="M${p.arrow[0]} ${p.arrow[1]} L${p.arrow[2]} ${p.arrow[3]}"/>
      <path d="M${p.arrow[2]} ${p.arrow[3]} l${-70 * Math.cos(Math.atan2(p.arrow[3] - p.arrow[1], p.arrow[2] - p.arrow[0]) - 0.5)} ${-70 * Math.sin(Math.atan2(p.arrow[3] - p.arrow[1], p.arrow[2] - p.arrow[0]) - 0.5)} M${p.arrow[2]} ${p.arrow[3]} l${-70 * Math.cos(Math.atan2(p.arrow[3] - p.arrow[1], p.arrow[2] - p.arrow[0]) + 0.5)} ${-70 * Math.sin(Math.atan2(p.arrow[3] - p.arrow[1], p.arrow[2] - p.arrow[0]) + 0.5)}"/></g>` : ''}
    ${lines.map(([txt, col], i) => `<text x="${p.x ?? 960}" y="${y0 + i * step}" text-anchor="${p.anchor || 'middle'}" font-family="Anton" font-size="${p.size || 200}" fill="${col || '#fff'}" stroke="#000" stroke-width="16" paint-order="stroke" letter-spacing="3" transform="rotate(${p.rot ?? 0} ${p.x ?? 960} ${y0 + i * step})">${txt}</text>`).join('')}`;
};

// voice-memo app on your phone: waveform scrolling, a clock, a red REC dot. p: clock, label, spike (0..1 loudness), rec
S.memo = (t, d, p) => {
  const spike = p.spike ?? 0.1;
  const bars = [...Array(46)].map((_, i) => { const n = Math.abs(Math.sin(i * 1.7 + t * 9) * Math.sin(i * 0.37 + t * 3.1));
    const h = 8 + n * 40 + (i > 30 ? spike * 260 * Math.abs(Math.sin(i * 2.3 + t * 14)) : 0);
    return `<rect x="${672 + i * 13}" y="${960 - h / 2}" width="7" height="${h}" rx="3" fill="${i > 30 && spike > 0.3 ? '#ff3a3a' : '#e8eef8'}"/>`; }).join('');
  return `${room('#020203')}
    <circle cx="960" cy="960" r="900" fill="url(#cold)" opacity=".35"/>
    <rect x="610" y="260" width="700" height="1400" rx="80" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="14"/>
    <rect x="640" y="300" width="640" height="1320" rx="56" fill="#111318"/>
    <text x="960" y="490" text-anchor="middle" font-family="Inter, sans-serif" font-size="44" font-weight="800" fill="#e8eef8">${p.label || 'Recording 1'}</text>
    <text x="960" y="700" text-anchor="middle" font-family="Courier New, monospace" font-size="92" font-weight="700" fill="${spike > 0.3 ? '#ff3a3a' : '#e8eef8'}">${p.clock || '03:17:00'}</text>
    <path d="M660 960 H1260" stroke="#2a2e38" stroke-width="2"/>${bars}
    <rect x="1000" y="800" width="4" height="320" fill="#ff3a3a"/>
    ${p.rec !== false ? `<circle cx="960" cy="1400" r="70" fill="none" stroke="#e8eef8" stroke-width="8"/><circle cx="960" cy="1400" r="${50 - 6 * (Math.sin(t * 4) > 0)}" fill="#ff2a2a"/>` : `<path d="M935 1360 L1000 1400 L935 1440Z" fill="#e8eef8"/>`}
    ${p.note ? `<text x="960" y="1250" text-anchor="middle" font-family="Inter, sans-serif" font-size="36" font-weight="700" fill="#8a93a8">${p.note}</text>` : ''}`;
};

// Fourth thumbnail layout ("ceiling"): hand-inked bedroom seen from the doorway, someone asleep, and the thing crawling
// upside-down across the ceiling right above them, hair hanging down, jaw open. A phone on the nightstand is recording.
S.thumbCeiling = (t, d, p) => {
  const ink = '#0e0c0b', skin = '#d9d2c3', skinD = '#a99f8c';
  const limb = (x1, y1, x2, y2, x3, y3) => `<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}" stroke="${ink}" stroke-width="30" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}" stroke="${skin}" stroke-width="18" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    ${[-1, 0, 1].map((k) => `<path d="M${x3} ${y3} l${k * 26} -46" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>`).join('')}`;
  const hair = [...Array(26)].map((_, k) => { const x = 1180 + (k - 13) * 13, len = 260 + (k * 53 % 140);
    return `<path d="M${x} 640 q${(k % 3 - 1) * 24} ${len * 0.5} ${(k % 5 - 2) * 20} ${len}" stroke="${ink}" stroke-width="${7 + k % 3 * 3}" fill="none" stroke-linecap="round"/>`; }).join('');
  const T = p.title || 'I RECORDED|MYSELF SLEEPING';
  const lines = T.split('|');
  return `
    <defs><filter id="ink2"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="8"/></filter>
      <filter id="grime2"><feTurbulence type="fractalNoise" baseFrequency=".8 .03" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 -.12"/></filter>
      <radialGradient id="moon2" cx="30%" cy="60%" r="60%"><stop offset="0" stop-color="#9ab0e0" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <rect width="1920" height="1920" fill="${p.wall || '#1c2230'}"/>
    <g filter="url(#ink2)">
      <path d="M0 420 L1920 420 L1700 600 L220 600Z" fill="#141924" stroke="${ink}" stroke-width="8"/>
      <path d="M220 600 L1700 600 L1700 1240 L220 1240Z" fill="#232b3c" stroke="${ink}" stroke-width="8"/>
      <path d="M0 420 L220 600 L220 1240 L0 1500Z M1920 420 L1700 600 L1700 1240 L1920 1500Z" fill="#161b27" stroke="${ink}" stroke-width="8"/>
      <path d="M220 1240 L1700 1240 L1920 1500 L0 1500Z" fill="#1a1612" stroke="${ink}" stroke-width="8"/>
      <rect x="300" y="700" width="220" height="300" fill="#7f9ad8" opacity=".5" stroke="${ink}" stroke-width="10"/><path d="M410 700 V1000 M300 850 H520" stroke="${ink}" stroke-width="8"/>
      <path d="M520 1080 L1440 1080 L1520 1300 L440 1300Z" fill="#3a4258" stroke="${ink}" stroke-width="8"/>
      <path d="M560 1060 Q980 1000 1420 1060 L1500 1290 L460 1290Z" fill="#6a7390" stroke="${ink}" stroke-width="8"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<path d="M${520 + k * 110} 1090 l40 180" stroke="${ink}" stroke-width="3" opacity=".4"/>`).join('')}
      <ellipse cx="640" cy="1070" rx="110" ry="50" fill="#e8e2d4" stroke="${ink}" stroke-width="7"/>
      <ellipse cx="700" cy="1048" rx="56" ry="46" fill="${skin}" stroke="${ink}" stroke-width="7"/><path d="M676 1046 q10 6 20 0 M710 1046 q10 6 20 0" stroke="${ink}" stroke-width="5" fill="none"/>
      <path d="M650 1020 q50 -40 100 -4" stroke="#1d1510" stroke-width="22" fill="none" stroke-linecap="round"/>
      <rect x="1540" y="1100" width="150" height="160" fill="#2a2018" stroke="${ink}" stroke-width="7"/>
      <rect x="1575" y="1070" width="80" height="40" rx="8" fill="#0c0c0c" stroke="#d8eeff" stroke-width="4"/><circle cx="1615" cy="1090" r="9" fill="#ff2a2a"/>
      <circle cx="1615" cy="1090" r="34" fill="#ff2a2a" opacity=".25"/>
      <g transform="translate(1330,640) scale(1.3) translate(-1180,-560)">
        <path d="M940 470 Q1180 430 1400 480 Q1420 560 1180 600 Q980 580 940 470Z" fill="#2a2228" stroke="${ink}" stroke-width="9"/>
        ${limb(980, 500, 900, 430, 820, 470)}${limb(1040, 560, 960, 640, 880, 610)}${limb(1340, 500, 1460, 430, 1540, 470)}${limb(1320, 560, 1420, 640, 1520, 600)}
        ${hair}
        <g transform="translate(1180,700) rotate(180)">
          <path d="M-120 -40 Q-130 -190 0 -200 Q130 -190 120 -40 Q110 80 60 140 Q0 180 -60 140 Q-110 80 -120 -40Z" fill="${skin}" stroke="${ink}" stroke-width="9"/>
          ${[-1, 1].map((sd) => `<ellipse cx="${sd * 52}" cy="-80" rx="42" ry="54" fill="#050404" stroke="${ink}" stroke-width="5"/><circle cx="${sd * 52}" cy="-74" r="8" fill="#ff2a2a"/><circle cx="${sd * 52}" cy="-74" r="20" fill="#ff2a2a" opacity=".3"/>`).join('')}
          <path d="M-70 30 Q0 210 70 30 Q0 60 -70 30Z" fill="#160303" stroke="${ink}" stroke-width="7"/>
          ${[...Array(9)].map((_, k) => `<path d="M${-60 + k * 15} 36 l7 26 l7 -26" fill="#efe9d8" stroke="${ink}" stroke-width="2"/>`).join('')}
          <path d="M-100 -10 q20 60 50 110 M100 -10 q-20 60 -50 110" stroke="${skinD}" stroke-width="14" fill="none" opacity=".7"/>
        </g>
      </g>
    </g>
    <rect width="1920" height="1920" filter="url(#grime2)"/>
    <rect width="1920" height="1920" fill="url(#moon2)"/>
    <g transform="rotate(-3 560 560)">${lines.map((ln, i) => `<text x="${p.titleX || 520}" y="${(p.titleY || 660) + i * 170}" text-anchor="middle" font-family="Hand" font-size="${p.size || 190}" fill="${i ? '#ff3a3a' : '#f2ede2'}" stroke="#0a0606" stroke-width="12" paint-order="stroke" letter-spacing="3">${ln}</text>`).join('')}</g>
    ${p.badge !== false ? `<g transform="translate(1660,1370) rotate(6)"><rect x="-200" y="-62" width="400" height="124" rx="22" fill="#ff1a1a" stroke="#0a0606" stroke-width="8"/>
      <text y="26" text-anchor="middle" font-family="Anton" font-size="72" fill="#fff" letter-spacing="4">🎧 8D AUDIO</text></g>` : ''}
    <rect width="1920" height="1920" fill="url(#vig)" opacity=".6"/>`;
};

// your closet door from bed, open a crack. p.person (0..1): a real person (grey-haired, wide-eyed) hiding inside instead of a creature. The gap widens over the scene (p.gap -> p.gapTo, 0..1); inside is black.
// p.eyes (0..1) two eyes in the gap, p.fingers: long grey fingers curled round the door edge, p.knob shaking
S.closet = (t, d, p) => {
  const g = (p.gap ?? 0.08) + ((p.gapTo ?? p.gap ?? 0.08) - (p.gap ?? 0.08)) * ease(t / d);
  const X0 = 700, X1 = 1220, Y0 = 420, Y1 = 1500, edge = X1 - (X1 - X0) * g * 0.9;
  const shake = p.knob ? Math.sin(t * 40) * 4 : 0;
  const fingers = p.fingers ? [0, 1, 2, 3].map((k) => { const y = 840 + k * 58, L = 120 + (k % 2) * 30;
      return `<path d="M${edge + 10} ${y} q-${L * 0.5} -18 -${L * 0.75} 8 q-${L * 0.2} 12 -${L * 0.25} 34" stroke="#060404" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${edge + 10} ${y} q-${L * 0.5} -18 -${L * 0.75} 8 q-${L * 0.2} 12 -${L * 0.25} 34" stroke="#c9c3b6" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${edge - L * 0.75} ${y + 8} m-${L * 0.25} 34 l-4 10" stroke="#3a0808" stroke-width="10" stroke-linecap="round"/>
      <path d="M${edge - L * 0.35} ${y - 6} h10 M${edge - L * 0.6} ${y + 2} h8" stroke="#6a645a" stroke-width="3"/>`; }).join('') : '';
  const fx = edge + 100, fy = 780, blink = p.blink && t % 2 > 1.85;
  const eyes = p.eyes && p.eyesOnly ? `<g opacity="${p.eyes}">${[-34, 34].map((dx) => `<ellipse cx="${fx - 40 + dx}" cy="${fy}" rx="22" ry="${blink ? 2 : 13}" fill="#f4efe6"/><circle cx="${fx - 40 + dx}" cy="${fy + 2}" r="7" fill="#080404"/><circle cx="${fx - 40 + dx}" cy="${fy}" r="44" fill="#fff" opacity=".05"/>`).join('')}</g>`
    : p.eyes ? `<g opacity="${p.eyes}">
      ${[...Array(18)].map((_, k) => { const sx = k < 9 ? fx - 170 + k * 12 : fx + 70 + (k - 9) * 12;
        return `<path d="M${sx} ${fy - 200} q${(k % 3 - 1) * 16} 260 ${(k % 4 - 1.5) * 14} ${520 + (k * 37 % 140)}" stroke="#050404" stroke-width="${8 + k % 3 * 4}" fill="none" stroke-linecap="round"/>`; }).join('')}
      <path d="M${fx - 150} ${fy - 40} Q${fx - 160} ${fy - 230} ${fx} ${fy - 240} Q${fx + 160} ${fy - 230} ${fx + 150} ${fy - 40} Q${fx + 140} ${fy + 160} ${fx + 70} ${fy + 240} Q${fx} ${fy + 290} ${fx - 70} ${fy + 240} Q${fx - 140} ${fy + 160} ${fx - 150} ${fy - 40}Z" fill="#d8d2c6"/>
      <path d="M${fx - 150} ${fy - 40} Q${fx - 160} ${fy - 230} ${fx} ${fy - 240} Q${fx + 70} ${fy - 236} ${fx + 120} ${fy - 190} Q${fx + 20} ${fy - 210} ${fx - 40} ${fy - 150} Q${fx - 110} ${fy - 100} ${fx - 150} ${fy - 40}Z" fill="#050404"/>
      <path d="M${fx - 120} ${fy + 40} q30 120 100 190 M${fx + 120} ${fy + 40} q-30 120 -100 190" stroke="#8a8478" stroke-width="16" fill="none" opacity=".6"/>
      ${[-58, 58].map((dx) => `<ellipse cx="${fx + dx}" cy="${fy}" rx="46" ry="${blink ? 3 : 56}" fill="#050303"/>${blink ? '' : `<circle cx="${fx + dx}" cy="${fy + 6}" r="10" fill="#ff2a2a"/><circle cx="${fx + dx}" cy="${fy + 6}" r="28" fill="#ff2a2a" opacity=".3"/>`}`).join('')}
      ${p.grin ? `<path d="M${fx - 120} ${fy + 120} Q${fx} ${fy + 250} ${fx + 120} ${fy + 120} Q${fx} ${fy + 165} ${fx - 120} ${fy + 120}Z" fill="#1a0303"/>${[...Array(13)].map((_, k) => `<path d="M${fx - 108 + k * 18} ${fy + 128 + Math.abs(k - 6) * -2 + 12} l9 24 l9 -24" fill="#efe9d8"/>`).join('')}` : ''}
    </g>` : '';
  return `${room('#07080c')}
    <rect x="${X0 - 30}" y="${Y0 - 30}" width="${X1 - X0 + 60}" height="${Y1 - Y0 + 30}" fill="#1a1c24" stroke="#0a0b10" stroke-width="12"/>
    <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#000"/>
    ${eyes}
    ${p.person ? `<g opacity="${p.person}">${head(fx - 30, fy + 40, 0.95, { eyes: 'wide', look: -0.7, hero: false, hair: `<path d="M-132 130 Q-152 -172 0 -180 Q152 -172 132 130 L98 160 L102 -36 Q60 -108 0 -110 Q-60 -108 -102 -36 L-98 160Z" fill="#8d8780" stroke="#120d0a" stroke-width="7" stroke-linejoin="round"/>` })}</g>
      <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#05060a" opacity=".35"/>` : ''}
    <path d="M${X0} ${Y0} L${edge} ${Y0 - 20 * g} L${edge} ${Y1 + 20 * g} L${X0} ${Y1}Z" fill="#2c2620" stroke="#120e0a" stroke-width="10"/>
    <rect x="${X0 + 50}" y="${Y0 + 60}" width="${(edge - X0) - 100}" height="420" fill="none" stroke="#3a3228" stroke-width="8"/>
    <rect x="${X0 + 50}" y="${Y0 + 560}" width="${(edge - X0) - 100}" height="420" fill="none" stroke="#3a3228" stroke-width="8"/>
    <circle cx="${edge - 50 + shake}" cy="980" r="20" fill="#9a8a5a"/>
    ${fingers}
    <rect width="1920" height="1920" fill="#203060" opacity=".12"/>`;
};

// lonely farmhouse at night in snow, a dark forest behind, footprints coming out of the trees to the door, none going back.
// p.prints (0..1 how far the trail is drawn), p.smoke (chimney smoke), p.light (one window lit), p.figs (two figures in the lit window, one waving)
S.snow = (t, d, p) => {
  const n = 18, k = Math.round(n * (p.prints ?? 1) * (p.grow ? ease(t / d) : 1));
  const prints = [...Array(k)].map((_, i) => { const u = i / (n - 1), x = 280 + u * 720 + (i % 2 ? 18 : -18), y = 1120 + u * 260;
    return `<ellipse cx="${x}" cy="${y}" rx="${10 + u * 8}" ry="${5 + u * 4}" fill="#5a6a88" opacity=".85"/>`; }).join('');
  const flakes = [...Array(60)].map((_, i) => `<circle cx="${(i * 331 + t * 30 * (1 + i % 3)) % 1920}" cy="${420 + ((i * 197 + t * 80 * (1 + i % 2)) % 1080)}" r="${1.5 + i % 3}" fill="#fff" opacity=".7"/>`).join('');
  return `<rect width="1920" height="1920" fill="#0a0e1a"/>
    <circle cx="1500" cy="560" r="70" fill="#e8eef8" opacity=".85"/>
    ${[...Array(22)].map((_, i) => `<path d="M${i * 92} 1080 l46 -${220 + (i * 53 % 120)} l46 ${220 + (i * 53 % 120)}Z" fill="#05070c"/>`).join('')}
    <rect x="0" y="1060" width="1920" height="860" fill="#b8c4dc"/>
    <path d="M0 1060 Q960 1020 1920 1070 V1100 H0Z" fill="#cdd6ea"/>
    <g transform="translate(1180,980)">
      <path d="M-260 0 L0 -200 L260 0Z" fill="#1a1210" stroke="#05070c" stroke-width="8"/><path d="M-250 -6 L0 -196 L250 -6" stroke="#e8eef8" stroke-width="16" fill="none"/>
      <rect x="-230" y="0" width="460" height="300" fill="#2a2018" stroke="#05070c" stroke-width="8"/>
      <rect x="120" y="-170" width="40" height="90" fill="#1a1210"/>
      ${p.smoke ? [0, 1, 2].map((i) => `<circle cx="${140 + Math.sin(t + i) * 20}" cy="${-200 - i * 60 - (t * 30) % 60}" r="${24 + i * 10}" fill="#8a94a8" opacity="${0.35 - i * 0.1}"/>`).join('') : ''}
      <rect x="-170" y="70" width="90" height="80" fill="${p.light ? '#ffd88a' : '#0a0a0e'}" stroke="#05070c" stroke-width="6"/>
      ${p.figs ? `<g opacity="${ease(t / 1.2)}"><ellipse cx="-145" cy="104" rx="11" ry="13" fill="#05070c"/><path d="M-158 150 Q-160 118 -145 116 Q-130 118 -132 150Z" fill="#05070c"/>
        <ellipse cx="-106" cy="100" rx="11" ry="13" fill="#05070c"/><path d="M-119 150 Q-121 114 -106 112 Q-91 114 -93 150Z" fill="#05070c"/>
        <path d="M-95 124 L-86 ${96 + Math.sin(t * 5) * 8}" stroke="#05070c" stroke-width="7" stroke-linecap="round"/></g>` : ''}
      <rect x="80" y="70" width="90" height="80" fill="#0a0a0e" stroke="#05070c" stroke-width="6"/>
      <rect x="-40" y="140" width="80" height="160" fill="#140e0a" stroke="#05070c" stroke-width="6"/>
      <path d="M-230 0 h460" stroke="#e8eef8" stroke-width="10"/>
    </g>
    ${prints}${flakes}
    <rect width="1920" height="1920" fill="#203060" opacity=".15"/>`;
};

// ---------- the clown ----------
// Cel-shaded clown: chalk-white face, black diamond eyes with tiny red pupils, a painted grin far wider than the mouth
// under it, a red nose, wild orange hair, a striped suit. o.tilt (deg), o.shh (finger to lips), o.smile (real mouth
// opening under the paint, 0..1), o.wave (arm raised, slow), o.eyesGlow
function clown(x, y, s, o = {}) {
  const ink = '#0a0608', t = o.t || 0, tilt = o.tilt || 0;
  const hair = [...Array(14)].map((_, k) => { const a = -2.6 + k * 0.4, r = 150 + (k % 3) * 22;
    return `<circle cx="${Math.cos(a) * r}" cy="${-40 + Math.sin(a) * r * 0.8}" r="${58 - (k % 2) * 10}" fill="${k % 2 ? '#e2561a' : '#c23e0e'}" stroke="${ink}" stroke-width="6"/>`; }).join('');
  const arm = o.wave ? `<path d="M120 180 Q230 ${80 - 30 * Math.sin(t * 1.4)} 230 ${-60 - 30 * Math.sin(t * 1.4)}" stroke="${ink}" stroke-width="64" stroke-linecap="round" fill="none"/><path d="M120 180 Q230 ${80 - 30 * Math.sin(t * 1.4)} 230 ${-60 - 30 * Math.sin(t * 1.4)}" stroke="#f2f2f2" stroke-width="50" stroke-linecap="round" fill="none"/><circle cx="230" cy="${-80 - 30 * Math.sin(t * 1.4)}" r="34" fill="#f8f8f8" stroke="${ink}" stroke-width="6"/>`
    : `<path d="M120 180 Q170 320 150 460" stroke="${ink}" stroke-width="64" stroke-linecap="round" fill="none"/><path d="M120 180 Q170 320 150 460" stroke="#f2f2f2" stroke-width="50" stroke-linecap="round" fill="none"/><circle cx="150" cy="480" r="34" fill="#f8f8f8" stroke="${ink}" stroke-width="6"/>`;
  const shh = o.shh ? `<path d="M-60 400 Q-40 200 -6 96" stroke="${ink}" stroke-width="58" stroke-linecap="round" fill="none"/><path d="M-60 400 Q-40 200 -6 96" stroke="#f2f2f2" stroke-width="44" stroke-linecap="round" fill="none"/>
      <path d="M-8 110 L-4 30" stroke="${ink}" stroke-width="26" stroke-linecap="round"/><path d="M-8 110 L-4 30" stroke="#f8f8f8" stroke-width="16" stroke-linecap="round"/>` : `<path d="M-120 180 Q-170 320 -150 460" stroke="${ink}" stroke-width="64" stroke-linecap="round" fill="none"/><path d="M-120 180 Q-170 320 -150 460" stroke="#f2f2f2" stroke-width="50" stroke-linecap="round" fill="none"/><circle cx="-150" cy="480" r="34" fill="#f8f8f8" stroke="${ink}" stroke-width="6"/>`;
  const sm = o.smile || 0;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cy="640" rx="190" ry="34" fill="#000" opacity=".45"/>
    <path d="M-150 160 Q-160 60 -60 50 L60 50 Q160 60 150 160 L170 620 L-170 620Z" fill="#e8e4f0" stroke="${ink}" stroke-width="8"/>
    ${[...Array(6)].map((_, k) => `<path d="M${-150 + k * 60} 120 L${-170 + k * 66} 620" stroke="#c0182a" stroke-width="22"/>`).join('')}
    <path d="M40 50 Q150 60 150 160 L170 620 L60 620Z" fill="#000" opacity=".22"/>
    ${[0, 1, 2].map((k) => `<circle cx="0" cy="${200 + k * 110}" r="22" fill="#1a1a2a" stroke="${ink}" stroke-width="5"/>`).join('')}
    <path d="M-150 60 Q-80 140 0 90 Q80 140 150 60 Q80 30 0 50 Q-80 30 -150 60Z" fill="#f4f0e6" stroke="${ink}" stroke-width="7"/>
    ${arm}
    <g transform="rotate(${tilt}) translate(0,-100)">
      ${hair}
      <path d="M-120 -30 Q-130 -170 0 -178 Q130 -170 120 -30 Q122 80 84 130 Q40 172 0 172 Q-40 172 -84 130 Q-122 80 -120 -30Z" fill="#f6f4ee" stroke="${ink}" stroke-width="8"/>
      <path d="M50 -170 Q130 -150 120 -30 Q122 80 84 130 Q130 30 90 -100Z" fill="#c8c4be" opacity=".6"/>
      ${[-48, 48].map((dx) => `<path d="M${dx} -90 L${dx + 26} -30 L${dx} 30 L${dx - 26} -30Z" fill="#0a0a1e" stroke="${ink}" stroke-width="5"/>
        <path d="M${dx - 26} -36 h52" stroke="#0a0a1e" stroke-width="5"/>
        <circle cx="${dx}" cy="-30" r="${o.eyesGlow ? 9 : 6}" fill="#ff1a1a"/>${o.eyesGlow ? `<circle cx="${dx}" cy="-30" r="26" fill="#ff1a1a" opacity=".3"/>` : ''}`).join('')}
      <path d="M-104 50 Q0 ${170 + 30 * sm} 104 50 Q90 70 70 62 Q0 ${130 + 20 * sm} -70 62 Q-90 70 -104 50Z" fill="#c0101e" stroke="${ink}" stroke-width="6"/>
      ${sm ? `<path d="M-46 74 Q0 ${110 + 70 * sm} 46 74 Q0 ${92 + 10 * sm} -46 74Z" fill="#1a0204" stroke="${ink}" stroke-width="5"/>${[...Array(7)].map((_, k) => `<path d="M${-38 + k * 12} 80 l6 ${10 + 8 * sm} l6 ${-10 - 8 * sm}" fill="#e8e0c8"/>`).join('')}` : ''}
      <circle cx="0" cy="20" r="30" fill="#e8101e" stroke="${ink}" stroke-width="6"/><circle cx="-9" cy="10" r="9" fill="#fff" opacity=".7"/>
      ${shh}
    </g>
  </g>`;
}
// p.where: 'corner' (statue in the guest-room corner, or empty when p.gone), 'kids' (standing over a kid's bed),
// 'hall' (at the far end of a dark hallway), 'door' (half behind a door frame), 'close' (face fills the frame)
S.clown = (t, d, p) => {
  const w = p.where || 'corner', o = { t, tilt: p.tilt || 0, shh: p.shh, smile: p.smile === 'grow' ? ease(t / d) : p.smile, wave: p.wave, eyesGlow: p.glow };
  if (w === 'close') return `${room('#000')}<rect width="1920" height="1920" fill="#0a0204"/>${clown(960, 1250, 3.6, { ...o, tilt: (p.tilt || 0) + 3 * Math.sin(t * 2) })}`;
  if (w === 'hall') return `${room('#050507')}<path d="M0 0 L760 500 L760 1040 L0 1920Z" fill="#0d0c0b"/><path d="M1920 0 L1160 500 L1160 1040 L1920 1920Z" fill="#0b0a09"/>
      <rect x="760" y="500" width="400" height="540" fill="#070707"/><path d="M760 1040 L1160 1040 L1920 1920 L0 1920Z" fill="#0a0908"/>
      ${clown(960, 780, 0.42 + (p.approach ? 0.3 * ease(t / d) : 0), o)}
      ${p.you !== false ? person(960, 1560, 1.1, { back: true, body: '#1a1e29' }) : ''}`;
  if (w === 'door') return `${room('#060608')}<rect x="560" y="320" width="800" height="1380" fill="#0a0a10" stroke="#1a1a22" stroke-width="20"/>
      <g clip-path="url(#doorClip)">${clown(1240, 940, 1.1, { ...o, tilt: 18 })}</g>
      <defs><clipPath id="doorClip"><rect x="1040" y="320" width="320" height="1380"/></clipPath></defs>
      <rect x="560" y="320" width="480" height="1380" fill="#2a2018" stroke="#120c06" stroke-width="10"/><circle cx="1000" cy="1000" r="18" fill="#9a8a5a"/>`;
  if (w === 'kids') return `${room('#0b0c14')}
      <rect x="420" y="1160" width="760" height="220" rx="30" fill="#4a5a8a"/><rect x="440" y="1100" width="240" height="110" rx="40" fill="#e8e2d4"/>
      ${kid(560, 1130, 0.55, { eyes: 'closed' })}<path d="M600 1180 Q900 1120 1180 1170 L1180 1380 L420 1380Z" fill="#6a7ab0" stroke="#000" stroke-width="6"/>
      ${clown(1380, 760, 1.0, o)}`;
  // corner of the guest room (statue), or the same corner empty
  return `${room('#0a0a10')}
    <rect x="300" y="1060" width="760" height="260" rx="40" fill="#3a3348"/><rect x="300" y="980" width="760" height="120" rx="40" fill="#4a4258"/>
    <rect x="460" y="760" width="420" height="260" fill="#0c0c14" stroke="#1a1a24" stroke-width="12"/><rect x="480" y="780" width="380" height="220" fill="#2a3a5a" opacity="${0.5 + 0.2 * Math.sin(t * 6)}"/>
    ${p.gone ? '<ellipse cx="1420" cy="1400" rx="190" ry="34" fill="#000" opacity=".25"/>' : clown(1420, 760, 1.0, { ...o, tilt: p.tilt || 0 })}`;
};

// ---------- The Watcher (true story, Westfield NJ, 2014) ----------
// handwritten letter on a desk under a lamp; the lines write themselves in. p: lines [..], sign, to (heading), shake, red (index of a line drawn in red)
S.letter = (t, d, p) => {
  const lines = p.lines || [], n = lines.length, per = Math.max(0.6, (d * 0.8) / Math.max(1, n));
  const sh = p.shake ? Math.sin(t * 31) * 3 * p.shake : 0;
  const ln = (s, i) => {
    const u = ease((t - 0.2 - i * per) / per), k = Math.round(s.length * u);
    return `<text x="570" y="${700 + i * 120}" font-family="Hand" font-size="${Math.min(100, 800 / (0.42 * s.length))}" fill="${p.red === i ? '#8a0a0a' : '#1c1612'}" font-weight="700">${esc3(s.slice(0, k))}</text>`;
  };
  return `<rect width="1920" height="1920" fill="#0d0805"/>
    <radialGradient id="lamp" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <rect width="1920" height="1920" fill="#2a1a10"/><rect width="1920" height="1920" fill="url(#lamp)"/>
    <g transform="translate(${sh},${sh / 2}) rotate(-2 960 1000)">
      <rect x="520" y="420" width="880" height="1260" fill="#000" opacity=".45" transform="translate(18,24)"/>
      <rect x="520" y="420" width="880" height="1260" fill="#efe6d2"/>
      ${[...Array(8)].map((_, i) => `<path d="M560 ${720 + i * 120} H1360" stroke="#9fb4c8" stroke-width="2" opacity=".5"/>`).join('')}
      <path d="M520 420 h880 v1260 h-880z" fill="none" stroke="#c9bca0" stroke-width="6"/>
      ${p.to ? `<text x="570" y="560" font-family="Hand" font-size="96" fill="#1c1612" font-weight="700">${esc3(p.to)}</text>` : ''}
      ${lines.map(ln).join('')}
      ${p.sign ? `<text x="1350" y="${760 + n * 120}" text-anchor="end" font-family="Hand" font-size="120" fill="#1c1612" font-weight="700" opacity="${ease((t - 0.2 - n * per) / 0.5)}">${esc3(p.sign)}</text>` : ''}
    </g>
    <rect width="1920" height="1920" fill="#000" opacity="${0.15 + 0.05 * Math.sin(t * 2)}"/>`;
};
const esc3 = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// the big old house at night, seen from the street. p: lit (which window glows: 'none'|'top'|'all'), watcher (0..1: a figure
// standing on the sidewalk across the street, back to us), van (moving van in the drive), zoom
S.house = (t, d, p) => {
  const z = 1 + (p.zoom || 0) * ease(t / d), fl = flick(t, 0.7);
  const win = (x, y, on) => `<rect x="${x}" y="${y}" width="86" height="130" fill="${on ? '#ffcf7a' : '#0c0f18'}" opacity="${on ? 0.85 * fl : 1}" stroke="#1a1410" stroke-width="10"/>
    <path d="M${x + 43} ${y} v130 M${x} ${y + 65} h86" stroke="#1a1410" stroke-width="6"/>`;
  const lit = p.lit || 'none';
  return `<rect width="1920" height="1920" fill="#070a14"/>
    ${[...Array(50)].map((_, i) => `<circle cx="${(i * 733) % 1920}" cy="${430 + (i * 197) % 360}" r="${1 + i % 2}" fill="#fff" opacity=".5"/>`).join('')}
    <g transform="translate(960,1000) scale(${z}) translate(-960,-1000)">
      ${[...Array(9)].map((_, i) => `<ellipse cx="${i * 240}" cy="${880 + (i % 3) * 30}" rx="190" ry="${260 + (i % 2) * 60}" fill="#05070c"/>`).join('')}
      <path d="M520 760 L960 470 L1400 760Z" fill="#14100e" stroke="#05070c" stroke-width="10"/>
      <rect x="560" y="760" width="800" height="520" fill="#2b2620" stroke="#05070c" stroke-width="10"/>
      ${[...Array(12)].map((_, i) => `<path d="M560 ${790 + i * 42} H1360" stroke="#211c17" stroke-width="5"/>`).join('')}
      <path d="M520 760 H1400" stroke="#3a332a" stroke-width="14"/>
      ${win(620, 830, lit === 'all')}${win(760, 830, lit === 'all')}${win(1074, 830, lit === 'top' || lit === 'all')}${win(1214, 830, lit === 'all')}
      <circle cx="960" cy="640" r="44" fill="${lit === 'top' ? '#ffcf7a' : '#0c0f18'}" opacity="${lit === 'top' ? fl : 1}" stroke="#1a1410" stroke-width="8"/>
      ${win(620, 1060, lit === 'all')}${win(1214, 1060, lit === 'all')}
      <rect x="890" y="1080" width="140" height="200" fill="#120c08" stroke="#05070c" stroke-width="8"/><circle cx="1010" cy="1185" r="8" fill="#c9a24a"/>
      <path d="M860 1080 H1060 L1040 1040 H880Z" fill="#1d1813"/>
      <rect x="0" y="1280" width="1920" height="640" fill="#0b0d10"/><path d="M890 1280 L1030 1280 L1300 1920 L620 1920Z" fill="#14161a"/>
      <rect x="0" y="1560" width="1920" height="30" fill="#1c1f24"/>
      ${p.van ? `<g transform="translate(1100,1300) scale(.85)"><rect x="0" y="0" width="300" height="140" rx="16" fill="#cfd2d6"/><rect x="200" y="20" width="80" height="50" fill="#20242c"/><circle cx="60" cy="140" r="30" fill="#0a0a0a"/><circle cx="240" cy="140" r="30" fill="#0a0a0a"/></g>` : ''}
      <g transform="translate(1660,560)"><rect x="-8" y="0" width="16" height="1040" fill="#15171c"/><path d="M0 0 h-90" stroke="#15171c" stroke-width="12"/>
        <ellipse cx="-90" cy="16" rx="30" ry="14" fill="#ffe6b0" opacity="${0.9 * fl}"/>
        <path d="M-90 20 L-300 1040 L120 1040Z" fill="#ffe6b0" opacity="${0.08 * fl}"/></g>
    </g>
    ${p.watcher ? `<g opacity="${ease(p.watcher)}" transform="translate(1330,1760) scale(.85)">
      <path d="M-70 -420 Q-80 -520 0 -526 Q80 -520 70 -420 L96 -120 Q100 0 60 40 L-60 40 Q-100 0 -96 -120Z" fill="#010102"/>
      <ellipse cx="0" cy="-560" rx="58" ry="66" fill="#010102"/><path d="M-60 40 L-50 260 M60 40 L50 260" stroke="#010102" stroke-width="44"/></g>` : ''}
    <rect width="1920" height="1920" fill="#203060" opacity=".12"/>`;
};
FOCUS.letter = 960; FOCUS.house = 1000;

// ---------- places and things for true stories: everything the narrator names gets drawn ----------
const K = { ink: '#0a0a12' };
// police officer (navy uniform, peaked cap, badge), optional flashlight beam. o.beam: angle in degrees (0 = right)
function officer(x, y, s, o = {}) {
  const ink = K.ink, nv = '#1c2a4a', nvS = '#111b33';
  const beam = o.beam != null ? `<g transform="translate(150,330) rotate(${o.beam})"><path d="M0 -14 L1100 -260 L1100 260 L0 14Z" fill="#fff6d0" opacity=".16"/><path d="M0 -6 L900 -90 L900 90 L0 6Z" fill="#fff6d0" opacity=".18"/></g>` : '';
  return `<g transform="translate(${x},${y}) scale(${s})">${beam}
    <path d="M-132 150 Q-138 46 -44 36 L44 36 Q138 46 132 150 L148 520 L-148 520Z" fill="${nv}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M40 40 Q138 46 132 150 L148 520 L50 520 Q90 300 40 40Z" fill="${nvS}"/>
    <path d="M-44 36 L0 110 L44 36" fill="#cfd8ea" stroke="${ink}" stroke-width="6"/><path d="M-8 60 L0 110 L8 60Z" fill="${nvS}"/>
    <path d="M-150 360 H150" stroke="#0b0b10" stroke-width="30"/><rect x="-24" y="345" width="48" height="30" rx="4" fill="#c9a24a"/>
    <path d="M60 120 l26 0 l6 30 l-19 18 l-19 -18z" fill="#e6c25a" stroke="${ink}" stroke-width="4"/>
    <path d="M-124 160 Q-176 300 -150 430" stroke="${ink}" stroke-width="72" stroke-linecap="round" fill="none"/><path d="M-124 160 Q-176 300 -150 430" stroke="${nv}" stroke-width="58" stroke-linecap="round" fill="none"/>
    <path d="M124 160 Q170 260 150 330" stroke="${ink}" stroke-width="72" stroke-linecap="round" fill="none"/><path d="M124 160 Q170 260 150 330" stroke="${nvS}" stroke-width="58" stroke-linecap="round" fill="none"/>
    ${o.beam != null ? `<rect x="130" y="310" width="90" height="34" rx="8" fill="#2a2a2a" stroke="${ink}" stroke-width="5" transform="rotate(${o.beam} 150 330)"/>` : ''}
    ${head(0, -110, 1, { eyes: o.eyes || 'normal', look: o.look ?? 0.5, hero: false })}
    <path d="M-120 -210 Q0 -268 120 -210 L112 -170 L-112 -170Z" fill="${nv}" stroke="${ink}" stroke-width="7"/>
    <path d="M-118 -172 H118 L140 -150 H-140Z" fill="#0b0f1c" stroke="${ink}" stroke-width="6"/>
    <circle cx="0" cy="-208" r="16" fill="#e6c25a" stroke="${ink}" stroke-width="4"/>
  </g>`;
}

// close-up of the open fridge: yogurt cups and a bowl of rice under cling film, milk, eggs. p.yogurt (number of cups 0-6),
// p.rice (0..1 how full the rice bowl is), p.labels (true: small hand-written labels). Light flickers a little.
S.fridgeClose = (t, d, p) => {
  const ink = K.ink, fl = flick(t, 0.2), n = p.yogurt ?? 6, r = p.rice ?? 1;
  const cup = (x, y) => `<g transform="translate(${x},${y})"><path d="M-46 -110 L46 -110 L38 0 L-38 0Z" fill="#f6f4ee" stroke="${ink}" stroke-width="6"/>
    <rect x="-50" y="-124" width="100" height="18" rx="5" fill="#e04a6a" stroke="${ink}" stroke-width="5"/>
    <rect x="-34" y="-80" width="68" height="34" rx="6" fill="#ffd2dc"/><text x="0" y="-56" text-anchor="middle" font-family="Anton" font-size="22" fill="#b0234a">YOGURT</text></g>`;
  const cups = [...Array(6)].map((_, k) => k < n ? cup(640 + k * 115, 900) : `<ellipse cx="${640 + k * 115}" cy="900" rx="40" ry="8" fill="#b8c6d6" opacity=".7"/>`).join('');
  const ry = 1180 - 120 * r;
  return `<rect width="1920" height="1920" fill="#dfeaf2"/>
    <rect x="380" y="300" width="1160" height="1300" rx="30" fill="#f4fbff" stroke="${ink}" stroke-width="14" opacity="${0.92 + 0.08 * fl}"/>
    <circle cx="960" cy="400" r="70" fill="#fff" filter="url(#blur)"/>
    ${[910, 1300].map((y) => `<rect x="400" y="${y}" width="1120" height="22" fill="#b9cad9" stroke="${ink}" stroke-width="5"/><rect x="400" y="${y + 22}" width="1120" height="14" fill="#000" opacity=".08"/>`).join('')}
    ${cups}
    <g transform="translate(760,1300)"><path d="M-170 -150 Q-170 0 0 0 Q170 0 170 -150Z" fill="#fdfdfb" stroke="${ink}" stroke-width="8"/>
      <path d="M-170 -150 H170" stroke="${ink}" stroke-width="8"/>
      ${r > 0 ? `<path d="M-160 ${-150 + (1 - r) * 120} Q0 ${-200 + (1 - r) * 150} 160 ${-150 + (1 - r) * 120} L150 -150 L-150 -150Z" fill="#fffef6" stroke="#d8d4c4" stroke-width="5"/>
        ${[...Array(Math.round(26 * r))].map((_, k) => `<ellipse cx="${-130 + (k * 47) % 260}" cy="${-150 - (k % 3) * 10 + (1 - r) * 110}" rx="9" ry="5" fill="#ece8d8"/>`).join('')}` : ''}
      <path d="M-178 -168 Q0 -230 178 -168" stroke="#bfe0ff" stroke-width="8" fill="none" opacity=".7"/>
      <text x="0" y="-60" text-anchor="middle" font-family="Anton" font-size="44" fill="#6a6a6a">RICE</text></g>
    <g transform="translate(1180,1300)"><path d="M-70 0 V-300 L0 -360 L70 -300 V0Z" fill="#fff" stroke="${ink}" stroke-width="7"/><rect x="-70" y="-220" width="140" height="90" fill="#3a8ae0"/><text x="0" y="-160" text-anchor="middle" font-family="Anton" font-size="40" fill="#fff">MILK</text></g>
    <g transform="translate(1390,1300)">${[0, 1, 2].map((k) => `<ellipse cx="${-50 + k * 50}" cy="-40" rx="26" ry="34" fill="#f2dcc0" stroke="${ink}" stroke-width="5"/>`).join('')}</g>
    ${p.note ? `<g transform="translate(1180,560) rotate(4)"><rect x="-150" y="-110" width="300" height="230" fill="#ffe680" stroke="#8a7a2a" stroke-width="4"/>${String(p.note).split('|').map((ln, i) => `<text x="-128" y="${-56 + i * 62}" font-family="Hand" font-weight="700" font-size="54" fill="${i === String(p.note).split('|').length - 1 && p.noteRed ? '#a0101a' : '#2a2416'}">${esc3(ln)}</text>`).join('')}</g>` : ''}
    <rect width="1920" height="1920" fill="#203060" opacity=".06"/>`;
};
FOCUS.fridgeClose = 960;

// a quiet residential street in Fukuoka (Japan) at night: two-storey houses with dark tiled roofs, power lines on poles,
// a glowing drinks vending machine, one lit window. p.lit (which house window glows: 0,1,2), p.zoom (slow move in)
S.street = (t, d, p) => {
  const ink = K.ink, z = 1 + (p.zoom || 0) * ease(t / d), lit = p.lit ?? 1, fl = flick(t, 0.5);
  const house = (x, i) => `<g transform="translate(${x},0)">
    <path d="M-40 700 L230 560 L500 700Z" fill="#1c2230" stroke="${ink}" stroke-width="8"/>${[0, 1, 2, 3, 4].map((k) => `<path d="M${-10 + k * 50} ${686 - k * 26} L${470 - k * 50} ${686 - k * 26}" stroke="#2a3244" stroke-width="5"/>`).join('')}
    <rect x="0" y="700" width="460" height="230" fill="#3a3a40" stroke="${ink}" stroke-width="8"/>
    <path d="M-30 930 L230 830 L490 930Z" fill="#1c2230" stroke="${ink}" stroke-width="8"/>
    <rect x="0" y="930" width="460" height="300" fill="#4a4740" stroke="${ink}" stroke-width="8"/>
    ${[[60, 760], [300, 760], [60, 1000]].map(([wx, wy], k) => `<rect x="${wx}" y="${wy}" width="110" height="90" fill="${i === lit && k === 0 ? '#ffd27a' : '#0c1018'}" opacity="${i === lit && k === 0 ? fl : 1}" stroke="${ink}" stroke-width="6"/><path d="M${wx + 55} ${wy} v90" stroke="${ink}" stroke-width="5"/>`).join('')}
    <rect x="280" y="1040" width="120" height="190" fill="#2a2016" stroke="${ink}" stroke-width="6"/>
    <rect x="-20" y="1180" width="500" height="50" fill="#2a2a30" stroke="${ink}" stroke-width="6"/></g>`;
  return `<rect width="1920" height="1920" fill="#060a18"/>
    ${[...Array(40)].map((_, i) => `<circle cx="${(i * 733) % 1920}" cy="${430 + (i * 197) % 260}" r="${1 + i % 2}" fill="#fff" opacity=".5"/>`).join('')}
    <circle cx="1600" cy="500" r="50" fill="#eef3ff" opacity=".8"/>
    <g transform="translate(960,1000) scale(${z}) translate(-960,-1000)">
      ${house(-180, 0)}${house(380, 1)}${house(940, 2)}
      <rect x="1460" y="1020" width="150" height="210" rx="10" fill="#e9f2ff" opacity="${0.9 * fl}" stroke="${ink}" stroke-width="7"/>
      ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${1475 + c * 44}" y="${1040 + r * 50}" width="32" height="38" rx="5" fill="${['#e04a4a', '#3a8ae0', '#f0c040'][(r + c) % 3]}"/>`).join('')).join('')}
      <circle cx="1535" cy="1125" r="230" fill="#cfe4ff" opacity=".12" filter="url(#blur)"/>
      ${[350, 1350].map((x) => `<rect x="${x}" y="520" width="22" height="720" fill="#151515"/><path d="M${x - 50} 560 h122" stroke="#151515" stroke-width="12"/>`).join('')}
      <path d="M-100 600 Q350 650 361 562 Q860 640 1361 562 Q1700 620 2100 590 M-100 640 Q350 690 361 600 Q860 690 1361 600 Q1700 660 2100 630" stroke="#0e0e0e" stroke-width="5" fill="none"/>
      <rect x="0" y="1230" width="1920" height="700" fill="#141820"/><path d="M0 1400 H1920" stroke="#e8e0a0" stroke-width="10" stroke-dasharray="80 60" opacity=".5"/>
    </g>
    <rect width="1920" height="1920" fill="#203060" opacity=".12"/>`;
};
FOCUS.street = 960;

// an office in the daytime: big windows over the city, rows of desks and monitors, co-workers, and HIM at the front desk
// holding his phone. p.alert (phone lights up red with a notification), p.shock (his eyes go wide)
S.office = (t, d, p) => {
  const ink = K.ink, al = p.alert ? (Math.sin(t * 10) > 0 ? 1 : 0.6) : 0;
  const desk = (x, y, s, who) => `<g transform="translate(${x},${y}) scale(${s})">
    ${who ? `<g transform="translate(0,-40)">${person(0, 0, 0.55, { eyes: 'normal', look: 0.3, body: '#3a4a6a', hero: false })}</g>` : ''}
    <rect x="-60" y="-190" width="160" height="110" rx="8" fill="#20283a" stroke="${ink}" stroke-width="6"/><rect x="-50" y="-180" width="140" height="90" fill="#7fa6e0" opacity=".8"/>
    <rect x="-220" y="-70" width="440" height="40" fill="#c9b89a" stroke="${ink}" stroke-width="6"/><rect x="-200" y="-30" width="20" height="160" fill="#8a7a60"/><rect x="180" y="-30" width="20" height="160" fill="#8a7a60"/></g>`;
  return `<rect width="1920" height="1920" fill="#d8dee6"/>
    <rect x="0" y="420" width="1920" height="520" fill="#9fc2e6"/>
    ${[...Array(12)].map((_, i) => `<rect x="${i * 170 - 20}" y="${600 - (i * 53 % 160)}" width="${120 + i * 17 % 50}" height="${400 + (i * 53 % 160)}" fill="#6c86a6" opacity=".7"/>`).join('')}
    ${[...Array(7)].map((_, i) => `<rect x="${i * 300}" y="420" width="24" height="520" fill="#5a606a"/>`).join('')}
    <rect x="0" y="940" width="1920" height="980" fill="#b9b2a4"/><rect x="0" y="930" width="1920" height="20" fill="#7a7468"/>
    ${desk(420, 1060, 0.7, true)}${desk(960, 1040, 0.65, true)}${desk(1500, 1060, 0.7, true)}
    <g transform="translate(960,1060)">${person(0, 120, 1.05, { eyes: p.shock ? 'wide' : 'normal', look: 0, sweat: p.shock, body: '#2a3550' })}
      <rect x="-300" y="430" width="600" height="60" fill="#c9b89a" stroke="${ink}" stroke-width="8"/>
      <g transform="translate(150,480)"><rect x="-55" y="-120" width="110" height="200" rx="16" fill="#111" stroke="${ink}" stroke-width="6"/>
        <rect x="-45" y="-108" width="90" height="176" rx="8" fill="${p.alert ? '#ff3a3a' : '#9fd2ff'}" opacity="${p.alert ? al : 0.8}"/>
        ${p.alert ? '<text x="0" y="-20" text-anchor="middle" font-family="Anton" font-size="44" fill="#fff">⚠</text>' : ''}</g></g>
    ${p.alert ? `<circle cx="1110" cy="1500" r="300" fill="#ff3a3a" opacity="${0.12 * al}" filter="url(#blur)"/>` : ''}`;
};
FOCUS.office = 1000;

// police searching the house with flashlights: a dark hallway, two officers, beams sweeping. p.n (1 or 2 officers)
S.police = (t, d, p) => {
  const sw = Math.sin(t * 1.3) * 18;
  return `${room('#05060a')}
    <rect x="740" y="470" width="440" height="700" fill="#0a0b10" stroke="#1a1c24" stroke-width="12"/>
    ${(p.n ?? 2) > 1 ? officer(1250, 880, 0.8, { beam: 200 + sw, look: -0.6 }) : ''}
    ${officer(720, 960, 0.95, { beam: -20 - sw, look: 0.6, eyes: p.eyes })}
    <rect width="1920" height="1920" fill="#203060" opacity=".14"/>`;
};
FOCUS.police = 960;

// a Japanese oshiire closet in a tatami room: wide sliding paper doors below and a small upper compartment (tenbukuro)
// up near the ceiling. p.open (0..1 the upper door slides open), p.person (0..1 the woman lying on a thin mattress inside),
// p.bottles (water bottles beside her), p.officer (an officer's flashlight beam from the bottom right)
S.oshiire = (t, d, p) => {
  const ink = K.ink, o = (p.open ?? 0) + ((p.openTo ?? p.open ?? 0) - (p.open ?? 0)) * ease(t / d);
  const X0 = 560, X1 = 1360, TY0 = 440, TY1 = 640;
  const fusuma = (x, w, y, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e9e0c8" stroke="#3a2a1a" stroke-width="10"/>
    <path d="M${x + 40} ${y + h * 0.7} q${w * 0.2} -40 ${w * 0.4} 0 t${w * 0.4} 0" stroke="#b9a87a" stroke-width="5" fill="none" opacity=".7"/>
    <circle cx="${x + w - 40}" cy="${y + h / 2}" r="16" fill="#8a6a3a" stroke="#3a2a1a" stroke-width="4"/>`;
  const inside = `<rect x="${X0}" y="${TY0}" width="${X1 - X0}" height="${TY1 - TY0}" fill="#07080c"/>
    ${p.person ? `<g opacity="${p.person}"><rect x="${X0 + 40}" y="${TY1 - 50}" width="${X1 - X0 - 80}" height="34" rx="12" fill="#c9b8d8" stroke="${ink}" stroke-width="5"/>
      <path d="M${X0 + 170} ${TY1 - 52} Q${X0 + 400} ${TY1 - 110} ${X1 - 120} ${TY1 - 60} L${X1 - 120} ${TY1 - 48} L${X0 + 170} ${TY1 - 40}Z" fill="#6a5a8a" stroke="${ink}" stroke-width="5"/>
      ${head(X0 + 110, TY1 - 105, 0.5, { eyes: 'wide', look: 0.8, hero: false, hair: '<path d="M-132 130 Q-152 -172 0 -180 Q152 -172 132 130 L98 160 L102 -36 Q60 -108 0 -110 Q-60 -108 -102 -36 L-98 160Z" fill="#8d8780" stroke="#120d0a" stroke-width="7" stroke-linejoin="round"/>' })}</g>` : ''}
    ${p.bottles ? [0, 1, 2, 3].map((k) => `<g transform="translate(${X0 + 340 - k * 36},${TY1 - 40})"><rect x="-12" y="-74" width="24" height="74" rx="8" fill="#bfe6ff" opacity=".8" stroke="${ink}" stroke-width="3"/><rect x="-6" y="-86" width="12" height="14" fill="#2a6ad0"/></g>`).join('') : ''}`;
  return `<rect width="1920" height="1920" fill="#14110c"/>
    <rect x="0" y="420" width="1920" height="900" fill="#3a3326"/>
    <rect x="0" y="1300" width="1920" height="620" fill="#7a7448"/>${[0, 1, 2, 3, 4].map((k) => `<path d="M${-200 + k * 520} 1300 L${-600 + k * 700} 1920" stroke="#4a4428" stroke-width="10"/>`).join('')}
    <path d="M0 1300 H1920" stroke="#2a2416" stroke-width="16"/>
    <rect x="${X0 - 40}" y="${TY0 - 30}" width="${X1 - X0 + 80}" height="900" fill="#2a1f14" stroke="#120c06" stroke-width="12"/>
    ${inside}
    ${fusuma(X0 + (X1 - X0) / 2 * o, (X1 - X0) / 2, TY0, TY1 - TY0)}${fusuma(X0 + (X1 - X0) / 2, (X1 - X0) / 2, TY0, TY1 - TY0)}
    <rect x="${X0 - 40}" y="${TY1}" width="${X1 - X0 + 80}" height="30" fill="#2a1f14"/>
    ${fusuma(X0, (X1 - X0) / 2, TY1 + 30, 620)}${fusuma(X0 + (X1 - X0) / 2, (X1 - X0) / 2, TY1 + 30, 620)}
    ${p.officer ? `<path d="M1800 1700 L${X0 + 120} ${TY0 + 60} L${X1 - 200} ${TY1 - 10}Z" fill="#fff6d0" opacity=".2"/><circle cx="${X0 + 200}" cy="${TY1 - 80}" r="160" fill="#fff6d0" opacity=".14" filter="url(#blur)"/>` : ''}
    <rect width="1920" height="1920" fill="#203060" opacity=".12"/>`;
};
FOCUS.oshiire = 960;


// ---------- per-video look: every story gets its own colour grade and its own lead character ----------
// story.json "grade": a gradient map over the whole frame, mixed with the original picture:
//   { shadow: '#hex', mid: '#hex', high: '#hex', amount: 0..1 (how strong), sat: saturation (1 = unchanged),
//     contrast: 1 = unchanged, wash: '#hex' (optional colour laid over everything), washA }
// story.json "hero": { hair: '#hex', hairH: '#hex' (highlight), body: '#hex' (hoodie/jacket), skin: '#hex' }
const GRADES = {
  noirTeal:    { shadow: '#04161c', mid: '#3f7a7a', high: '#ffd9a0', amount: 0.55, sat: 0.9, contrast: 1.12 },
  bloodMoon:   { shadow: '#14030a', mid: '#8a2030', high: '#ffd2b0', amount: 0.6, sat: 0.85, contrast: 1.15 },
  sodiumNight: { shadow: '#0a0c1a', mid: '#a0602a', high: '#ffe2a0', amount: 0.55, sat: 1.0, contrast: 1.1 },
  sickGreen:   { shadow: '#06120a', mid: '#4f7a3a', high: '#e8f0b0', amount: 0.55, sat: 0.8, contrast: 1.12 },
  violetHaze:  { shadow: '#0e0618', mid: '#6a3a9a', high: '#ffd0f0', amount: 0.5, sat: 1.0, contrast: 1.08 },
  coldSteel:   { shadow: '#05080e', mid: '#5a6a80', high: '#eef4ff', amount: 0.6, sat: 0.55, contrast: 1.18 },
  sepiaFilm:   { shadow: '#140c06', mid: '#8a6a40', high: '#fff0d0', amount: 0.65, sat: 0.6, contrast: 1.1 },
  neonPink:    { shadow: '#0c0414', mid: '#c03a8a', high: '#a0f0ff', amount: 0.5, sat: 1.15, contrast: 1.1 },
  emberOrange: { shadow: '#120402', mid: '#b04a14', high: '#ffe8b0', amount: 0.55, sat: 1.05, contrast: 1.12 },
  arcticBlue:  { shadow: '#020a14', mid: '#3a7ab0', high: '#f0fbff', amount: 0.5, sat: 0.9, contrast: 1.1 },
};
const hex3 = (h) => [1, 3, 5].map((i) => (parseInt(h.substr(i, 2), 16) / 255).toFixed(3));
function gradeDefs(g) {
  if (!g) return '';
  if (typeof g === 'string') g = GRADES[g] || GRADES.noirTeal;
  else if (g.preset) g = { ...(GRADES[g.preset] || {}), ...g };
  const [S0, M0, H0] = [hex3(g.shadow || '#000000'), hex3(g.mid || '#808080'), hex3(g.high || '#ffffff')];
  const a = g.amount ?? 0.5, c = g.contrast ?? 1, sat = g.sat ?? 1;
  const tv = (i) => `${S0[i]} ${M0[i]} ${H0[i]}`;
  return `<defs><filter id="gradeF" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feColorMatrix in="SourceGraphic" type="saturate" values="${sat}" result="sat"/>
    <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="grey"/>
    <feComponentTransfer in="grey" result="map"><feFuncR type="table" tableValues="${tv(0)}"/><feFuncG type="table" tableValues="${tv(1)}"/><feFuncB type="table" tableValues="${tv(2)}"/></feComponentTransfer>
    <feComposite in="map" in2="sat" operator="arithmetic" k2="${a}" k3="${1 - a}" result="mix"/>
    <feComponentTransfer in="mix"><feFuncR type="linear" slope="${c}" intercept="${(1 - c) / 2}"/><feFuncG type="linear" slope="${c}" intercept="${(1 - c) / 2}"/><feFuncB type="linear" slope="${c}" intercept="${(1 - c) / 2}"/></feComponentTransfer>
  </filter></defs>`;
}
const AN0 = { ...AN };
function setHero(h) {
  HERO = h || {};
  Object.assign(AN, AN0);
  if (h) { if (h.hair) AN.hair = h.hair; if (h.hairH) AN.hairH = h.hairH; if (h.skin) { AN.skin = h.skin; } if (h.skinS) AN.skinS = h.skinS; }
  HERO_BODY = h && h.body ? h.body : null;
}
let HERO_BODY = null;

// ---------- character builder: a new lead for every story ----------
// story.json "hero": { hairStyle: 'parted'|'buzz'|'long'|'curly'|'bald'|'bun'|'spiky', hair, hairH, glasses: true|'round',
//   lines (age wrinkles 0..1), stubble, moustache, beard, outfit: 'hoodie'|'shirtTie'|'suit'|'jacket'|'sweater', body (main colour),
//   shirt (shirt colour), tie (tie colour), skin, skinS }
let HERO = {};
const HAIRS = {
  parted: (ink) => `<path d="M-124 10 Q-140 -150 -10 -170 Q120 -174 128 -20 L118 -40 Q110 -110 30 -126 Q-20 -112 -70 -120 Q-108 -96 -112 -20Z" fill="${AN.hair}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-30 -164 Q-40 -140 -70 -120" stroke="${AN.hairH}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M10 -160 Q60 -150 100 -110" stroke="${AN.hairH}" stroke-width="12" fill="none" stroke-linecap="round" opacity=".8"/>`,
  buzz: (ink) => `<path d="M-116 -30 Q-120 -150 0 -160 Q120 -150 116 -30 Q100 -100 0 -108 Q-100 -100 -116 -30Z" fill="${AN.hair}" stroke="${ink}" stroke-width="6"/>`,
  long: (ink) => `<path d="M-140 150 Q-160 -170 0 -178 Q160 -170 140 150 L106 170 L110 -30 Q70 -110 0 -112 Q-70 -110 -110 -30 L-106 170Z" fill="${AN.hair}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-60 -150 Q0 -170 70 -146" stroke="${AN.hairH}" stroke-width="14" fill="none" stroke-linecap="round"/>`,
  curly: (ink) => [[-110, -60], [-96, -120], [-50, -156], [0, -166], [50, -156], [96, -120], [112, -60], [-70, -100], [0, -120], [70, -100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${38}" fill="${AN.hair}" stroke="${ink}" stroke-width="6"/>`).join('') + [[-80, -130], [20, -150], [80, -110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${AN.hairH}"/>`).join(''),
  bald: (ink) => `<path d="M-60 -136 Q-20 -152 30 -146" stroke="#fff" stroke-width="12" opacity=".5" fill="none" stroke-linecap="round"/><path d="M-118 -20 Q-122 -70 -104 -90 L-100 -20Z M118 -20 Q122 -70 104 -90 L100 -20Z" fill="${AN.hair}" stroke="${ink}" stroke-width="5"/>`,
  bun: (ink) => `<circle cx="0" cy="-196" r="52" fill="${AN.hair}" stroke="${ink}" stroke-width="7"/>` + HAIRS.buzz(ink).replace('M-116 -30 Q-120 -150 0 -160 Q120 -150 116 -30 Q100 -100 0 -108 Q-100 -100 -116 -30Z', 'M-120 0 Q-130 -160 0 -168 Q130 -160 120 0 Q110 -100 0 -112 Q-110 -100 -120 0Z'),
};
function heroFace(ink) {
  const h = HERO, out = [];
  if (h.lines) out.push(`<g opacity="${h.lines}"><path d="M-70 -96 h50 M24 -96 h50 M-60 -110 h36 M30 -110 h36" stroke="${ink}" stroke-width="3" opacity=".6"/>
    <path d="M-86 30 q-6 30 10 50 M86 30 q6 30 -10 50 M-92 -10 l-14 -6 M92 -10 l14 -6 M-92 0 l-14 4 M92 0 l14 4" stroke="${ink}" stroke-width="3.5" fill="none" opacity=".7"/></g>`);
  if (h.stubble) out.push(`<path d="M-96 40 Q-80 120 0 160 Q80 120 96 40 Q60 110 0 120 Q-60 110 -96 40Z" fill="${AN.hair}" opacity=".22"/>`);
  if (h.beard) out.push(`<path d="M-104 20 Q-96 150 0 190 Q96 150 104 20 Q80 70 40 80 Q0 70 -40 80 Q-80 70 -104 20Z M-24 100 Q0 120 24 100 Q0 108 -24 100Z" fill="${AN.hair}" stroke="${ink}" stroke-width="6" fill-rule="evenodd"/>`);
  if (h.moustache || h.beard) out.push(`<path d="M-44 74 Q-20 58 0 70 Q20 58 44 74 Q20 84 0 76 Q-20 84 -44 74Z" fill="${AN.hair}" stroke="${ink}" stroke-width="5"/>`);
  if (h.glasses) { const r = h.glasses === 'round';
    out.push(`<g fill="#bfe0ff" fill-opacity=".14" stroke="${ink}" stroke-width="7">${r ? '<circle cx="-50" cy="-2" r="44"/><circle cx="50" cy="-2" r="44"/>' : '<rect x="-98" y="-40" width="92" height="66" rx="12"/><rect x="6" y="-40" width="92" height="66" rx="12"/>'}</g>
      <path d="M-6 -8 Q0 -16 6 -8 M-98 -12 L-118 -18 M98 -12 L118 -18" stroke="${ink}" stroke-width="6" fill="none"/>`); }
  return out.join('');
}
function outfit(ink) {
  const o = HERO.outfit; if (!o || o === 'hoodie') return '';
  const shirt = HERO.shirt || '#e9edf4', tie = HERO.tie || '#7a1a2a', body = HERO.body || '#2a2e3a';
  const shirtTie = `<path d="M-44 36 L0 120 L44 36 L40 300 L-40 300Z" fill="${shirt}" stroke="${ink}" stroke-width="5"/>
    <path d="M-44 36 L-10 70 L-30 90Z M44 36 L10 70 L30 90Z" fill="${shirt}" stroke="${ink}" stroke-width="5"/>
    <path d="M-12 66 L12 66 L18 240 L0 270 L-18 240Z" fill="${tie}" stroke="${ink}" stroke-width="5"/>`;
  if (o === 'shirtTie') return `<path d="M-130 150 Q-136 46 -44 36 L44 36 Q136 46 130 150 L148 520 L-148 520Z" fill="${shirt}" stroke="${ink}" stroke-width="8"/>${shirtTie}`;
  if (o === 'suit') return `${shirtTie}<path d="M-44 36 L-6 250 L-40 520 L-148 520 L-130 150 Q-136 46 -44 36Z M44 36 L6 250 L40 520 L148 520 L130 150 Q136 46 44 36Z" fill="${body}" stroke="${ink}" stroke-width="7"/>
    <path d="M-44 36 L-60 140 L-14 200 M44 36 L60 140 L14 200" stroke="${ink}" stroke-width="5" fill="none"/>`;
  if (o === 'jacket') return `<path d="M-44 36 L0 120 L44 36" fill="${shirt}" stroke="${ink}" stroke-width="5"/><path d="M-6 120 V520 M6 120 V520" stroke="#c9c9c9" stroke-width="4"/>
    <path d="M-60 40 L-80 150 L-40 160 M60 40 L80 150 L40 160" stroke="${ink}" stroke-width="6" fill="none"/>`;
  if (o === 'scrubs') return `<path d="M-130 150 Q-136 46 -44 36 L44 36 Q136 46 130 150 L148 520 L-148 520Z" fill="${body}" stroke="${ink}" stroke-width="8"/>
    <path d="M-44 36 L0 110 L44 36" fill="none" stroke="${ink}" stroke-width="7"/><rect x="40" y="200" width="56" height="50" rx="6" fill="none" stroke="${ink}" stroke-width="5"/>
    <rect x="-96" y="210" width="44" height="34" rx="4" fill="#e8f2f4" stroke="${ink}" stroke-width="4"/><path d="M-90 222 h30 M-90 232 h20" stroke="#4a6a7a" stroke-width="3"/>`;
  if (o === 'hivis') return `<path d="M-130 150 Q-136 46 -44 36 L44 36 Q136 46 130 150 L148 520 L-148 520Z" fill="${body}" stroke="${ink}" stroke-width="8"/>
    <path d="M-110 90 L-40 40 L-20 300 L-120 300Z M110 90 L40 40 L20 300 L120 300Z" fill="#d8f02a" stroke="${ink}" stroke-width="6"/>
    <path d="M-118 200 H-26 M118 200 H26 M-118 250 H-24 M118 250 H24" stroke="#e8eef4" stroke-width="12"/>`;
  if (o === 'sweater') return `<path d="M-44 36 Q0 70 44 36" stroke="${ink}" stroke-width="10" fill="none"/>${[0, 1, 2, 3].map((k) => `<path d="M-120 ${220 + k * 70} H120" stroke="#000" stroke-width="5" opacity=".18"/>`).join('')}`;
  return '';
}


// ---------- apartment building: elevator, its button panel, the corridor ----------
// inside the elevator, facing the doors. p.floor (display text, or p.from/p.to to count up across the scene),
// p.open (0..1 doors), p.openTo, p.beyond ('dark' | 'hall' | 'lobby'), p.lead (the lead stands to the side), p.flicker
S.elevator = (t, d, p) => {
  const ink = K.ink, fl = p.flicker ? flick(t, 1.2) : 1;
  const o = (p.open ?? 0) + ((p.openTo ?? p.open ?? 0) - (p.open ?? 0)) * ease(t / d);
  let fl2 = p.floor ?? '12';
  if (p.from != null) { const n = Math.min(p.to, p.from + Math.floor((t / d) * (p.to - p.from + 1))); fl2 = String(n); }
  const DX0 = 680, DX1 = 1240, DY0 = 470, DY1 = 1240, half = (DX1 - DX0) / 2, gap = half * o;
  const beyond = p.beyond === 'hall' ? `<rect x="${DX0}" y="${DY0}" width="${DX1 - DX0}" height="${DY1 - DY0}" fill="#3a3024"/>
      <path d="M${DX0} ${DY1} L${DX1} ${DY1} L${960 + 60} 900 L${960 - 60} 900Z" fill="#5a1e22"/>
      ${[0, 1, 2].map((k) => `<rect x="${DX0 + 30 + k * 30}" y="${640 + k * 40}" width="${60 - k * 14}" height="${300 - k * 70}" fill="#2a1c12" stroke="${ink}" stroke-width="4"/><rect x="${DX1 - 90 - k * 30}" y="${640 + k * 40}" width="${60 - k * 14}" height="${300 - k * 70}" fill="#2a1c12" stroke="${ink}" stroke-width="4"/>`).join('')}
      <rect x="930" y="740" width="60" height="160" fill="#2a1c12" stroke="${ink}" stroke-width="4"/><rect x="930" y="890" width="60" height="10" fill="#ffd27a" opacity=".8"/>
      ${p.figure ? `<g opacity="${p.figure}" transform="translate(960,900) scale(0.2)">${person(0, -520, 1, { back: true, hero: true, body: HERO.body })}</g>` : ''}
      <circle cx="960" cy="560" r="26" fill="#fff4cc" opacity="${0.8 * fl}"/>`
    : p.beyond === 'lobby' ? `<rect x="${DX0}" y="${DY0}" width="${DX1 - DX0}" height="${DY1 - DY0}" fill="#cfc6b0"/><rect x="${DX0}" y="1000" width="${DX1 - DX0}" height="240" fill="#8a8070"/>`
    : `<rect x="${DX0}" y="${DY0}" width="${DX1 - DX0}" height="${DY1 - DY0}" fill="#020203"/>`;
  return `<rect width="1920" height="1920" fill="#2a2e34"/>
    <path d="M0 420 L560 520 L560 1300 L0 1500Z" fill="#8a9098"/><path d="M1920 420 L1360 520 L1360 1300 L1920 1500Z" fill="#7a8088"/>
    ${[0, 1, 2, 3].map((k) => `<path d="M${80 + k * 120} ${440 + k * 20} V${1480 - k * 46}" stroke="#a8aeb6" stroke-width="5" opacity=".6"/><path d="M${1840 - k * 120} ${440 + k * 20} V${1480 - k * 46}" stroke="#9aa0a8" stroke-width="5" opacity=".6"/>`).join('')}
    <rect x="560" y="420" width="800" height="100" fill="#1a1c20"/><rect x="600" y="440" width="720" height="40" rx="10" fill="#f4f8ff" opacity="${0.9 * fl}"/>
    <path d="M560 1300 L1360 1300 L1920 1500 L0 1500Z" fill="#3a3a3e"/>${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M${560 + k * 160} 1300 L${k * 384} 1500" stroke="#2a2a2e" stroke-width="4"/>`).join('')}
    <rect x="560" y="520" width="800" height="780" fill="#9aa2ac"/>
    ${beyond}
    <rect x="${DX0}" y="${DY0}" width="${half - gap}" height="${DY1 - DY0}" fill="#b8c0c8" stroke="${ink}" stroke-width="6"/>
    <rect x="${DX0 + half + gap}" y="${DY0}" width="${half - gap}" height="${DY1 - DY0}" fill="#aeb6be" stroke="${ink}" stroke-width="6"/>
    <path d="M${DX0 + 40} ${DY0 + 60} L${DX0 + half - gap - 30} ${DY0 + 200}" stroke="#fff" stroke-width="10" opacity=".25"/>
    <rect x="${DX0 - 20}" y="${DY0 - 20}" width="${DX1 - DX0 + 40}" height="${DY1 - DY0 + 20}" fill="none" stroke="#6a7078" stroke-width="20"/>
    <g transform="translate(960,${DY0 + 52}) scale(0.82)"><rect x="-110" y="-46" width="220" height="92" rx="10" fill="#0a0606" stroke="${ink}" stroke-width="6"/>
      <text x="0" y="28" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="78" fill="${fl2 === '13' ? '#ff3a2a' : '#ffb03a'}">${fl2}</text>
      <path d="M-86 -20 l14 -16 l14 16z" fill="#ffb03a" opacity="${p.from != null ? 1 : 0.3}"/></g>
    ${p.lead ? `<g transform="translate(700,1060) scale(0.8)">${person(0, 0, 1, { eyes: p.eyes || 'tired', look: 0.6, sweat: p.sweat })}</g>` : ''}
    <rect x="1290" y="760" width="60" height="200" rx="8" fill="#c8ccd2" stroke="${ink}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map((k) => `<circle cx="1320" cy="${790 + k * 28}" r="9" fill="#e8e8e0" stroke="${ink}" stroke-width="2"/>`).join('')}
    <rect width="1920" height="1920" fill="#203060" opacity=".08"/>`;
};
FOCUS.elevator = 960;

// close-up of the elevator button panel. p.n (floors, default 12), p.lit (which button glows), p.thirteen (0..1 a 13th
// button that should not exist, fading in), p.finger (a finger pressing p.lit)
S.panel = (t, d, p) => {
  const ink = K.ink, n = p.n ?? 12, lit = String(p.lit ?? ''), th = p.thirteen ?? 0;
  const btn = (x, y, lab, on, red) => `<g transform="translate(${x},${y})"><circle r="62" fill="#9aa0a8" stroke="${ink}" stroke-width="6"/>
    <circle r="48" fill="${on ? (red ? '#ff4a3a' : '#ffcf6a') : '#d8dce2'}" stroke="${ink}" stroke-width="5"/>
    ${on ? `<circle r="80" fill="${red ? '#ff4a3a' : '#ffcf6a'}" opacity=".25" filter="url(#blur)"/>` : ''}
    <text x="0" y="18" text-anchor="middle" font-family="Anton" font-size="52" fill="${on ? '#3a1a0a' : '#2a2e34'}">${lab}</text></g>`;
  const rows = Math.ceil(n / 2), btns = [];
  for (let i = 1; i <= n; i++) { const r = Math.floor((i - 1) / 2), c = (i - 1) % 2; btns.push(btn(820 + c * 280, 1500 - r * 165, i, String(i) === lit)); }
  return `<rect width="1920" height="1920" fill="#7a8088"/>
    <rect x="620" y="300" width="680" height="1340" rx="30" fill="#b8bec6" stroke="${ink}" stroke-width="10"/>
    <rect x="640" y="320" width="640" height="40" fill="#fff" opacity=".18"/>
    ${btns.join('')}
    ${th > 0 ? `<g opacity="${ease(th)}">${btn(960, 1500 - rows * 165, 13, true, true)}</g>` : ''}
    ${p.finger ? `<g transform="translate(${lit === '13' ? 1010 : 870 + ((+lit - 1) % 2) * 280},${(lit === '13' ? 1500 - rows * 165 : 1500 - Math.floor((+lit - 1) / 2) * 165) + 20 - 20 * Math.abs(Math.sin(t * 6))})">
      <path d="M0 0 Q30 -10 60 30 L260 330 L180 380 L-10 70Z" fill="${AN.skin}" stroke="${ink}" stroke-width="7"/></g>` : ''}`;
};
FOCUS.panel = 960;

// apartment corridor in perspective: runner carpet, doors on both sides with number plates, the end door with p.num,
// p.ajar (end door open a crack with warm light and a moving shadow), p.flicker (a failing ceiling light)
S.corridor = (t, d, p) => {
  const ink = K.ink, fl = p.flicker ? flick(t, 1.0) : 1, VX = 960, VY = 820;
  const doors = [0, 1, 2].map((k) => { const s = 1 - k * 0.27, xL = 260 + k * 190, xR = 1660 - k * 190, w = 150 * s, h = 520 * s, y = VY + 330 * s - h;
    const num = (side) => `${(p.floor ?? 13)}0${side === 'L' ? 1 + k * 2 : 2 + k * 2}`;
    return `<rect x="${xL}" y="${y}" width="${w}" height="${h}" fill="#3a2414" stroke="${ink}" stroke-width="5"/><rect x="${xL + w * 0.3}" y="${y + h * 0.18}" width="${w * 0.4}" height="${h * 0.07}" fill="#c9a24a"/><text x="${xL + w / 2}" y="${y + h * 0.235}" text-anchor="middle" font-family="Anton" font-size="${22 * s}" fill="#2a1a0a">${num('L')}</text>
      <rect x="${xR - w}" y="${y}" width="${w}" height="${h}" fill="#3a2414" stroke="${ink}" stroke-width="5"/><rect x="${xR - w + w * 0.3}" y="${y + h * 0.18}" width="${w * 0.4}" height="${h * 0.07}" fill="#c9a24a"/><text x="${xR - w / 2}" y="${y + h * 0.235}" text-anchor="middle" font-family="Anton" font-size="${22 * s}" fill="#2a1a0a">${num('R')}</text>`; }).join('');
  const aj = p.ajar ? ease(Math.min(1, t / 1.5)) : 0;
  return `<rect width="1920" height="1920" fill="#2a2018"/>
    <path d="M0 420 L${VX - 180} ${VY - 220} L${VX + 180} ${VY - 220} L1920 420Z" fill="#3a3024"/>
    <path d="M0 420 L${VX - 180} ${VY - 220} L${VX - 180} ${VY + 120} L0 1500Z" fill="#6a5a44"/><path d="M1920 420 L${VX + 180} ${VY - 220} L${VX + 180} ${VY + 120} L1920 1500Z" fill="#5e5040"/>
    <path d="M0 1500 L${VX - 180} ${VY + 120} L${VX + 180} ${VY + 120} L1920 1500Z" fill="#4a3a2a"/>
    <path d="M500 1500 L${VX - 70} ${VY + 120} L${VX + 70} ${VY + 120} L1420 1500Z" fill="#6a1e24"/><path d="M560 1500 L${VX - 60} ${VY + 120} M1360 1500 L${VX + 60} ${VY + 120}" stroke="#c9a24a" stroke-width="5" opacity=".6"/>
    ${doors}
    <rect x="${VX - 70}" y="${VY - 120}" width="140" height="240" fill="#3a2414" stroke="${ink}" stroke-width="5"/>
    <rect x="${VX - 22}" y="${VY - 80}" width="44" height="18" fill="#c9a24a"/><text x="${VX}" y="${VY - 66}" text-anchor="middle" font-family="Anton" font-size="16" fill="#2a1a0a">${p.num || '1307'}</text>
    ${p.figure ? `<g opacity="${p.figure}" transform="translate(${VX},${VY + 120 + 420 * (p.figNear || 0)}) scale(${0.22 + 0.6 * (p.figNear || 0)})">${person(0, -520, 1, { back: true, hero: true, body: HERO.body })}</g>` : ''}
    ${aj ? `<rect x="${VX - 70}" y="${VY - 120}" width="${30 * aj}" height="240" fill="#ffd27a" opacity=".9"/><path d="M${VX - 70} ${VY + 120} L${VX - 70 + 30 * aj} ${VY + 120} L${VX - 30 + 160 * aj} 1500 L${VX - 160} 1500Z" fill="#ffd27a" opacity=".15"/>
      <rect x="${VX - 66}" y="${VY - 60 + 6 * Math.sin(t * 1.4)}" width="${18 * aj}" height="150" fill="#1a1008" opacity="${0.4 + 0.3 * Math.sin(t * 0.9)}"/>` : ''}
    ${[0, 1, 2].map((k) => `<rect x="${VX - 60 + 0}" y="${440 + k * 60}" width="120" height="${16 - k * 3}" rx="6" fill="#fff4cc" opacity="${(k === 1 ? fl : 1) * (0.9 - k * 0.2)}" transform="translate(${0},0) scale(${1 - k * 0.2}) translate(${(k * 0.2) * VX / (1 - k * 0.2) * (1 - k * 0.2) / (1 - k * 0.2) * 0},0)"/>`).join('')}
    <rect width="1920" height="1920" fill="#ffcf8a" opacity=".05"/>`;
};
FOCUS.corridor = 960;


// ---------- night delivery: van cab, animated map route, a photo, a dark roadside ----------
// the van seen from the driver's seat at night: windshield road in headlights, dashboard with a phone on a mount
// (p.map: the phone shows a route), the rear-view mirror (p.back 0..1: a shape in the back seat, closer each time),
// p.driver (the lead's shoulder and hands on the wheel), p.speed (road dashes speed)
S.van = (t, d, p) => {
  const ink = K.ink, sp = p.speed ?? 1, back = p.back ?? 0;
  const dashes = [...Array(7)].map((_, k) => { const u = ((k / 7) + t * 0.35 * sp) % 1, y = 760 + u * u * 520, w = 6 + u * 40, h = 10 + u * 70;
    return `<rect x="${960 - w / 2}" y="${y}" width="${w}" height="${h}" fill="#e8e0a0" opacity="${0.3 + u * 0.6}"/>`; }).join('');
  return `<rect width="1920" height="1920" fill="#020308"/>
    <path d="M300 520 L1620 520 L1820 1180 L100 1180Z" fill="#05070e"/>
    <path d="M760 760 L1160 760 L1720 1180 L200 1180Z" fill="#1a1c22"/><path d="M760 760 L1160 760 L1720 1180 L200 1180Z" fill="url(#vanBeam)"/>
    <defs><radialGradient id="vanBeam" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#fff4c0" stop-opacity=".35"/><stop offset="1" stop-color="#fff4c0" stop-opacity="0"/></radialGradient></defs>
    ${dashes}
    ${[...Array(10)].map((_, k) => `<path d="M${k * 60} 760 l26 -${60 + (k * 37) % 70} l26 ${60 + (k * 37) % 70}Z M${1920 - k * 60} 760 l-26 -${60 + (k * 41) % 70} l-26 ${60 + (k * 41) % 70}Z" fill="#03050a"/>`).join('')}
    <path d="M0 420 H1920 V560 Q960 500 0 560Z" fill="#101218"/><path d="M0 1180 Q960 1120 1920 1180 V1920 H0Z" fill="#14161c"/>
    <path d="M300 520 L100 1180 M1620 520 L1820 1180" stroke="#0a0b10" stroke-width="60"/>
    <g transform="translate(960,470)"><rect x="-190" y="-34" width="380" height="96" rx="16" fill="#0c0d12" stroke="#2a2c34" stroke-width="8"/>
      <rect x="-176" y="-22" width="352" height="72" rx="10" fill="#4a5a7a"/><rect x="-150" y="-16" width="300" height="40" rx="6" fill="#8aa0c8" opacity=".55"/>
      ${back > 0 ? `<g opacity="${Math.min(1, back * 1.3)}" transform="translate(${50 - 40 * back},${46}) scale(${0.25 + 0.75 * back})"><path d="M-70 40 Q-70 -6 -30 -14 L30 -14 Q70 -6 70 40Z" fill="#000"/><ellipse cx="0" cy="-44" rx="30" ry="36" fill="#000"/>${back > 0.6 ? '<circle cx="-11" cy="-46" r="3.5" fill="#e8eef4"/><circle cx="11" cy="-46" r="3.5" fill="#e8eef4"/>' : ''}</g>` : ''}
      <rect x="-176" y="-22" width="352" height="72" rx="10" fill="#9fb4ff" opacity=".08"/></g>
    <path d="M0 1230 Q960 1180 1920 1230 V1920 H0Z" fill="#1c1e26" stroke="#0a0b10" stroke-width="10"/>
    ${p.map ? `<g transform="translate(1340,1120) rotate(-6)"><rect x="-120" y="-200" width="240" height="400" rx="26" fill="#0b0b0e" stroke="#30323a" stroke-width="8"/>
      <rect x="-104" y="-182" width="208" height="364" rx="14" fill="#e8ecf2"/>${[0, 1, 2, 3, 4].map((k) => `<path d="M-104 ${-150 + k * 70} H104 M${-80 + k * 44} -182 V182" stroke="#c8ccd6" stroke-width="6"/>`).join('')}
      <path d="M-60 150 L-60 40 L30 40 L30 -60 L70 -140" stroke="#2a7aff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M70 -170 c-22 0 -22 30 0 46 c22 -16 22 -46 0 -46z" fill="#ff3a3a"/><circle cx="70" cy="-158" r="7" fill="#fff"/>
      <circle cx="0" cy="0" r="400" fill="#cfe0ff" opacity=".07" filter="url(#blur)"/></g>` : ''}
    ${p.driver ? `<g transform="translate(560,1380)"><circle r="230" fill="none" stroke="#111" stroke-width="44"/><circle r="230" fill="none" stroke="#2a2c34" stroke-width="10"/>
      <path d="M-210 -40 q-20 40 0 70" stroke="${AN.skin}" stroke-width="60" stroke-linecap="round" fill="none"/><path d="M210 -40 q20 40 0 70" stroke="${AN.skin}" stroke-width="60" stroke-linecap="round" fill="none"/></g>` : ''}
    <rect width="1920" height="1920" fill="#203060" opacity=".1"/>`;
};
FOCUS.van = 960;

// a map seen at a tilt (like a nav app): a dark city grid, a route that draws itself (p.draw 0..1 over the scene, or a
// fixed p.progress), the van dot riding the line, a pin that drops in at p.pinAt (eased, no bounce), an ETA card that
// counts down from p.eta[0] to p.eta[1] minutes, and a label under the pin (p.pin)
S.maproute = (t, d, p) => {
  const ink = K.ink, prog = p.progress ?? ease(Math.min(1, t / Math.max(0.5, d * (p.draw ?? 0.8))));
  const pts = [[300, 1500], [300, 1200], [700, 1200], [700, 900], [1100, 900], [1100, 600], [1500, 450]];
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])), L = seg.reduce((a, b) => a + b, 0);
  let acc = 0, head = pts[0];
  for (let i = 0; i < seg.length; i++) { if (acc + seg[i] >= prog * L) { const u = (prog * L - acc) / seg[i]; head = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; break; } acc += seg[i]; head = pts[i + 1]; }
  const path = 'M' + pts.map((q) => q.join(' ')).join(' L');
  const pa = p.pinAt != null ? ease(Math.min(1, Math.max(0, (t - p.pinAt) / 0.5))) : 0;
  const eta = p.eta ? Math.max(p.eta[1], Math.round(p.eta[0] - (p.eta[0] - p.eta[1]) * prog)) : null;
  return `<rect width="1920" height="1920" fill="#0a0d16"/>
    <g transform="translate(960,980) scale(1,0.62) rotate(-18) translate(-960,-980)">
      <rect x="-400" y="-200" width="2700" height="2400" fill="#121828"/>
      ${[...Array(22)].map((_, k) => `<path d="M${-300 + k * 140} -200 V2200" stroke="#1e2638" stroke-width="${k % 4 ? 8 : 18}"/><path d="M-400 ${-100 + k * 120} H2300" stroke="#1e2638" stroke-width="${k % 3 ? 8 : 18}"/>`).join('')}
      ${[...Array(30)].map((_, k) => `<rect x="${-260 + (k * 377) % 2400}" y="${-80 + (k * 211) % 2100}" width="${80 + k % 3 * 30}" height="${70 + k % 4 * 20}" fill="#182034"/>`).join('')}
      <path d="M1250 -200 Q1400 400 1650 700 Q1900 1000 2300 1100" stroke="#0a1220" stroke-width="120" fill="none"/>
      <path d="${path}" stroke="#2a3a5a" stroke-width="26" fill="none" stroke-linejoin="round"/>
      <path d="${path}" stroke="#3a9aff" stroke-width="26" fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - prog)}"/>
      <circle cx="${head[0]}" cy="${head[1]}" r="34" fill="#fff" stroke="#3a9aff" stroke-width="12"/>
      <ellipse cx="1500" cy="450" rx="${60 * pa}" ry="${30 * pa}" fill="#ff3a3a" opacity=".3"/>
    </g>
    ${pa > 0 ? `<g transform="translate(1310,${414 - 300 * (1 - pa)})" opacity="${pa}"><path d="M0 0 c-70 0 -70 90 0 150 c70 -60 70 -150 0 -150z" fill="#ff3a3a" stroke="${ink}" stroke-width="6"/><circle cx="0" cy="58" r="22" fill="#fff"/>
      ${p.pin ? `<rect x="-150" y="170" width="300" height="70" rx="14" fill="#0b0b10" stroke="#ff3a3a" stroke-width="5"/><text x="0" y="218" text-anchor="middle" font-family="Anton" font-size="40" fill="#fff">${esc3(p.pin)}</text>` : ''}</g>` : ''}
    ${eta != null ? `<g transform="translate(960,560)"><rect x="-230" y="-70" width="460" height="130" rx="24" fill="#0b0b10" stroke="#3a9aff" stroke-width="6"/>
      <text x="0" y="20" text-anchor="middle" font-family="Anton" font-size="72" fill="#fff">${eta} MIN</text></g>` : ''}`;
};
FOCUS.maproute = 960;

// a photo on a phone screen: the inside of the van from the back seat, the driver's head and shoulders from behind,
// the road lit up ahead. p.reveal (0..1 the photo fades up as if loading), p.caption (the notification above it)
S.photo = (t, d, p) => {
  const ink = K.ink, rv = p.reveal != null ? ease(Math.min(1, t / Math.max(0.3, d * p.reveal))) : 1;
  return `<rect width="1920" height="1920" fill="#050507"/>
    <rect x="560" y="200" width="800" height="1560" rx="70" fill="#0b0b0e" stroke="#2a2a32" stroke-width="14"/>
    ${p.caption ? `<rect x="610" y="300" width="700" height="130" rx="24" fill="#1c2230"/><text x="650" y="356" font-family="Inter, sans-serif" font-weight="800" font-size="34" fill="#e8eef8">${esc3(p.caption[0])}</text><text x="650" y="404" font-family="Inter, sans-serif" font-size="30" fill="#9fb4d0">${esc3(p.caption[1])}</text>` : ''}
    <g opacity="${rv}"><clipPath id="phClip"><rect x="610" y="480" width="700" height="900" rx="20"/></clipPath>
      <g clip-path="url(#phClip)" filter="url(#blur)" style="filter:blur(${(1 - rv) * 8}px)">
        <rect x="610" y="480" width="700" height="900" fill="#05060a"/>
        <path d="M700 560 L1220 560 L1300 900 L620 900Z" fill="#0c1018"/><path d="M880 700 L1040 700 L1220 900 L700 900Z" fill="#3a3a2a" opacity=".7"/>
        <rect x="610" y="900" width="700" height="480" fill="#0e0f14"/>
        <g transform="translate(960,1130) scale(1.25)">${head(0, 0, 1, { back: true })}<path d="M-150 120 Q-140 40 0 40 Q140 40 150 120 L170 320 L-170 320Z" fill="${HERO.body || '#2a2e3a'}" stroke="${ink}" stroke-width="8"/></g>
        <rect x="610" y="480" width="700" height="900" fill="#ffe8a0" opacity=".05"/>
      </g></g>
    <rect x="610" y="480" width="700" height="900" rx="20" fill="none" stroke="#2a2a32" stroke-width="6"/>`;
};
FOCUS.photo = 960;

// a dark country roadside: an empty field behind a wire fence, a crooked mailbox, one far-off light, the van's headlights
// washing across the grass. p.pin (a red map pin standing over the field, as the app sees it), p.figure (0..1 someone far off)
S.roadside = (t, d, p) => {
  const ink = K.ink;
  return `<rect width="1920" height="1920" fill="#04060c"/>
    ${[...Array(60)].map((_, i) => `<circle cx="${(i * 733) % 1920}" cy="${430 + (i * 197) % 320}" r="${1 + i % 2}" fill="#fff" opacity=".45"/>`).join('')}
    <path d="M0 860 Q500 820 960 850 Q1400 880 1920 840 V1920 H0Z" fill="#0a0e0a"/>
    <path d="M300 1500 L900 900 L1100 900 L1700 1500Z" fill="#e8f0c0" opacity=".08"/>
    ${[...Array(40)].map((_, k) => `<path d="M${(k * 97) % 1920} ${1000 + (k * 53) % 460} l6 -${30 + k % 4 * 10} l6 ${30 + k % 4 * 10}" stroke="#1a2a1a" stroke-width="4" fill="none"/>`).join('')}
    ${[...Array(9)].map((_, k) => `<rect x="${80 + k * 230}" y="${960 - (k % 2) * 6}" width="12" height="150" fill="#1a1612"/>`).join('')}
    <path d="M80 990 H1940 M80 1040 H1940" stroke="#2a2420" stroke-width="3"/>
    <g transform="translate(420,1100) rotate(-6)"><rect x="-8" y="0" width="16" height="200" fill="#2a2016"/><rect x="-60" y="-70" width="120" height="74" rx="30" fill="#3a4048" stroke="${ink}" stroke-width="6"/><rect x="40" y="-60" width="10" height="40" fill="#ff3a3a"/></g>
    <circle cx="1500" cy="860" r="6" fill="#ffd27a"/><circle cx="1500" cy="860" r="40" fill="#ffd27a" opacity=".12"/>
    ${p.figure ? `<g opacity="${p.figure}" transform="translate(1160,930) scale(0.25)">${watcher(0, 0, 1, 1, { noeyes: true })}</g>` : ''}
    ${p.pin ? `<g transform="translate(960,${760 + 8 * Math.sin(t * 2)})"><path d="M0 0 c-70 0 -70 90 0 150 c70 -60 70 -150 0 -150z" fill="#ff3a3a" stroke="${ink}" stroke-width="6" opacity=".9"/><circle cx="0" cy="58" r="22" fill="#fff"/></g>` : ''}
    <rect width="1920" height="1920" fill="#203060" opacity=".1"/>`;
};
FOCUS.roadside = 960;


// ---------- long-form set pieces ----------
// building lobby at night: wall of brass mailboxes (1201-1207...), a floor directory listing 1-12 (p.thirteen 0..1 a 13th
// line that shouldn't be there), the front desk with the old building manager behind it (p.manager)
S.lobby = (t, d, p) => {
  const ink = K.ink, th = p.thirteen ?? 0;
  return `${room('#120e0a')}
    <rect x="560" y="470" width="420" height="420" fill="#3a2a18" stroke="${ink}" stroke-width="8"/>
    ${[...Array(5)].map((_, r) => [...Array(4)].map((_, c) => `<rect x="${580 + c * 98}" y="${490 + r * 78}" width="86" height="64" fill="#b8963a" stroke="${ink}" stroke-width="4"/><text x="${623 + c * 98}" y="${530 + r * 78}" text-anchor="middle" font-family="Anton" font-size="20" fill="#3a2a10">${12 - r}0${c + 1}</text>`).join('')).join('')}
    <rect x="1080" y="470" width="300" height="440" fill="#14100c" stroke="#8a7a5a" stroke-width="8"/>
    <text x="1230" y="512" text-anchor="middle" font-family="Anton" font-size="30" fill="#e8dcb8">DIRECTORY</text>
    ${[...Array(12)].map((_, i) => `<text x="1110" y="${548 + i * 28}" font-family="Courier New, monospace" font-weight="700" font-size="22" fill="#e8dcb8">FL ${12 - i}  ......  ${['ROOF ACCESS', 'RESIDENTS', 'RESIDENTS', 'RESIDENTS', 'RESIDENTS', 'RESIDENTS', 'RESIDENTS', 'RESIDENTS', 'GYM', 'LAUNDRY', 'MAIL', 'LOBBY'][i]}</text>`).join('')}
    ${th > 0 ? `<text x="1110" y="${548 - 28}" font-family="Courier New, monospace" font-weight="700" font-size="22" fill="#ff4a3a" opacity="${ease(th)}">FL 13  ......  </text>` : ''}
    <rect x="460" y="960" width="1000" height="220" fill="#4a3220" stroke="${ink}" stroke-width="10"/><rect x="440" y="940" width="1040" height="34" fill="#6a4a30" stroke="${ink}" stroke-width="7"/>
    ${p.manager ? `<g transform="translate(860,820) scale(0.62)">${person(0, 0, 1, { hero: false, body: '#3a3a44', eyes: p.mEyes || 'tired', look: 0.3, hair: HAIRS.bald(K.ink).split(AN.hair).join('#cfcfd4') + '<path d="M-70 -60 h50 M20 -60 h50" stroke="#cfcfd4" stroke-width="10" stroke-linecap="round"/>' })}</g><rect x="460" y="960" width="1000" height="220" fill="#4a3220" stroke="${ink}" stroke-width="10"/>` : ''}
    <rect x="1300" y="900" width="70" height="40" fill="#d8d0b0" stroke="${ink}" stroke-width="4"/><circle cx="1335" cy="880" r="18" fill="#c9a24a" stroke="${ink}" stroke-width="4"/>
    <rect width="1920" height="1920" fill="#ffcf8a" opacity=".05"/>`;
};
FOCUS.lobby = 960;

// an old newspaper clipping under a desk lamp: p.date, p.headline, p.sub (2 lines max via |), a photo of a woman in a
// 1970s nurse's cap (p.photo), p.circle (red pen circle around the photo)
S.news = (t, d, p) => {
  const ink = K.ink;
  return `<rect width="1920" height="1920" fill="#1a120a"/><rect width="1920" height="1920" fill="url(#lamp)"/>
    <radialGradient id="lamp" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#ffd08a" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <g transform="rotate(-3 960 960)"><rect x="560" y="420" width="800" height="1080" fill="#e2d6b8" stroke="#a8946a" stroke-width="6"/>
      <text x="960" y="490" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="30" fill="#3a2e1e">${esc3(p.date || 'MARCH 3, 1974')}</text>
      <path d="M600 510 H1320" stroke="#3a2e1e" stroke-width="4"/>
      ${String(p.headline || '').split('|').map((ln, i) => `<text x="960" y="${590 + i * 78}" text-anchor="middle" font-family="Anton" font-size="${Math.min(76, 1300 / Math.max(8, ln.length))}" fill="#1e1810">${esc3(ln)}</text>`).join('')}
      ${p.kid ? `<g transform="translate(960,930)"><rect x="-170" y="-170" width="340" height="340" fill="#8a8070" stroke="#3a2e1e" stroke-width="6"/><g transform="translate(0,40) scale(0.9)" style="filter:grayscale(1)">${head(0, 0, 1, { hero: false, eyes: 'normal', look: 0, smile: 0.5, hair: '<path d="M-120 -40 Q-130 -160 0 -164 Q130 -160 120 -40 Q100 -110 40 -100 Q20 -130 -20 -104 Q-80 -116 -120 -40Z" fill="#4a3a2a" stroke="#120d0a" stroke-width="7"/>' })}</g>${p.circle ? `<ellipse cx="0" cy="0" rx="210" ry="200" fill="none" stroke="#c0101a" stroke-width="10" stroke-dasharray="${1400 * ease(Math.min(1, t / 1.2))} 1400" transform="rotate(-8)"/>` : ''}</g>` : ''}
      ${p.photo ? `<g transform="translate(960,${930})"><rect x="-170" y="-170" width="340" height="340" fill="#8a8070" stroke="#3a2e1e" stroke-width="6"/>
        <g transform="translate(0,40) scale(0.9)" style="filter:grayscale(1)">${head(0, 0, 1, { hero: false, eyes: 'normal', look: 0, hair: '<path d="M-132 60 Q-150 -170 0 -176 Q150 -170 132 60 L104 -30 Q60 -110 0 -112 Q-60 -110 -104 -30Z" fill="#3a3028" stroke="#120d0a" stroke-width="7"/><path d="M-110 -150 L110 -150 L90 -200 L-90 -200Z" fill="#f4f2ec" stroke="#120d0a" stroke-width="6"/><path d="M-12 -190 h24 v-0 M0 -198 v20" stroke="#c02020" stroke-width="8"/>' })}</g>
        ${p.circle ? `<ellipse cx="0" cy="0" rx="${210}" ry="${200}" fill="none" stroke="#c0101a" stroke-width="10" stroke-dasharray="${1400 * ease(Math.min(1, t / 1.2))} 1400" transform="rotate(-8)"/>` : ''}</g>` : ''}
      ${[...Array(9)].map((_, i) => `<path d="M610 ${1150 + i * 34} H${i % 3 === 2 ? 1100 : 1310}" stroke="#7a6a52" stroke-width="10" opacity=".5"/>`).join('')}
      ${p.sub ? String(p.sub).split('|').map((ln, i) => `<text x="960" y="${1160 + i * 46}" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="30" fill="#2a2216">${esc3(ln)}</text>`).join('') : ''}
    </g>`;
};
FOCUS.news = 960;

// chapter sting: a case-file cork board. p.n (chapter number), p.title, p.items ([label, ...] polaroids pinned so far),
// red string joining them; the newest polaroid and the title slide in. No narration needed (6-9 s pattern interrupt).
S.casefile = (t, d, p) => {
  const ink = K.ink, items = p.items || [], k = ease(Math.min(1, t / 0.9));
  const pos = (i) => [520 + (i % 4) * 300 + (i % 2) * 30, 560 + Math.floor(i / 4) * 300 + (i % 3) * 20];
  const strings = items.slice(1).map((_, i) => { const a = pos(i), b = pos(i + 1); return `<path d="M${a[0]} ${a[1] - 60} Q${(a[0] + b[0]) / 2} ${Math.max(a[1], b[1]) + 30} ${b[0]} ${b[1] - 60}" stroke="#c0101a" stroke-width="5" fill="none" opacity="${i === items.length - 2 ? k : 1}"/>`; }).join('');
  return `<rect width="1920" height="1920" fill="#2a1a0e"/><rect x="380" y="430" width="1160" height="1060" fill="#8a6440" stroke="#3a2412" stroke-width="20"/>
    ${[...Array(60)].map((_, i) => `<circle cx="${400 + (i * 197) % 1120}" cy="${450 + (i * 131) % 1020}" r="${2 + i % 3}" fill="#6a4a2a" opacity=".6"/>`).join('')}
    ${strings}
    ${items.map((lab, i) => { const [x, y] = pos(i), last = i === items.length - 1, o = last ? k : 1;
      return `<g opacity="${o}" transform="translate(${x},${y - (last ? 60 * (1 - k) : 0)}) rotate(${(i % 3 - 1) * 4})"><rect x="-110" y="-120" width="220" height="230" fill="#f2efe6" stroke="#9a9488" stroke-width="3"/><rect x="-94" y="-104" width="188" height="150" fill="#2a2e38"/><text x="0" y="-20" text-anchor="middle" font-family="Anton" font-size="${Math.min(46, 330 / Math.max(3, lab.length))}" fill="#e8e0c8">${esc3(lab)}</text><circle cx="0" cy="-112" r="12" fill="#c0101a"/></g>`; }).join('')}
    <g opacity="${k}"><rect x="460" y="1300" width="1000" height="150" fill="#0c0a08" opacity=".85"/>
      <text x="960" y="1362" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="34" fill="#c0101a">CHAPTER ${p.n || 1}</text>
      <text x="960" y="1426" text-anchor="middle" font-family="Anton" font-size="${Math.min(64, 1500 / Math.max(10, String(p.title || '').length))}" fill="#f2ead8">${esc3(p.title || '')}</text></g>`;
};
FOCUS.casefile = 960;

// ---------- Black Lake: night swim, heads in the water, the beach ----------
const LAKE_FRIENDS = {
  jordan: { hair: '<path d="M-118 -10 Q-130 -150 0 -168 Q130 -150 118 -10 L104 -60 L88 -30 L74 -96 L50 -60 L30 -110 L6 -70 L-20 -112 L-40 -66 L-66 -104 L-80 -54 L-100 -80Z" fill="#e8c86a" stroke="#120d0a" stroke-width="6" stroke-linejoin="round"/>', skin: '#f2d2bc', body: '#3a6ab0' },
  priya: { hair: '<path d="M-136 150 Q-158 -170 0 -178 Q158 -170 136 150 L104 170 L110 -30 Q70 -110 0 -112 Q-70 -110 -110 -30 L-104 170Z" fill="#141018" stroke="#120d0a" stroke-width="6"/>', skin: '#c99a76', body: '#8a3a8a' },
};
// a head in the water: p is [x, y, scale, who]; who 'hero' | 'jordan' | 'priya' | 'stranger' (no face: wet hair over it)
function swimmer(x, y, s, who, t) {
  const bob = Math.sin(t * 1.7 + x) * 6, rip = (k) => `<ellipse cx="0" cy="${150}" rx="${190 + k * 50}" ry="${30 + k * 8}" fill="none" stroke="#cfe0ff" stroke-width="4" opacity="${0.35 - k * 0.1}"/>`;
  if (who === 'stranger') return `<g transform="translate(${x},${y}) scale(${s})">${rip(0)}${rip(1)}
    <path d="M-120 140 Q-130 -150 0 -160 Q130 -150 120 140Z" fill="#0a0c10"/><path d="M-90 -100 q-10 120 -20 240 M-40 -140 q-6 140 -10 280 M10 -150 q6 150 4 290 M60 -130 q10 140 14 270" stroke="#1a1e26" stroke-width="10" fill="none"/>
    <ellipse cx="-34" cy="-30" rx="13" ry="7" fill="#dfe8f0" opacity=".9"/><ellipse cx="34" cy="-30" rx="13" ry="7" fill="#dfe8f0" opacity=".9"/>
    <rect x="-200" y="120" width="400" height="200" fill="#0a1424"/></g>`;
  const f = LAKE_FRIENDS[who] || {};
  return `<g transform="translate(${x},${y + bob}) scale(${s})">${rip(0)}${rip(1)}
    ${head(0, 0, 1, who === 'hero' ? { eyes: 'wide', look: 0.4, seed: x / 97 } : { hero: false, hair: f.hair, skin: f.skin, eyes: 'normal', look: -0.3, seed: x / 97 })}
    <rect x="-220" y="110" width="440" height="220" fill="#0a1424"/><path d="M-220 110 H220" stroke="#cfe0ff" stroke-width="5" opacity=".5"/></g>`;
}
// the lake at night: moon and its reflection, black treeline, a floating dock, a warning sign on the shore.
// p.heads [[x, y, scale, who], ...], p.sign (show the sign close), p.dock (towel on the dock: 'dry'), p.ripple
S.lake = (t, d, p) => {
  const ink = K.ink;
  return `<rect width="1920" height="1920" fill="#040814"/>
    ${[...Array(70)].map((_, i) => `<circle cx="${(i * 733) % 1920}" cy="${430 + (i * 197) % 300}" r="${1 + i % 2}" fill="#fff" opacity=".5"/>`).join('')}
    <circle cx="1400" cy="540" r="70" fill="#eef4ff"/><circle cx="1400" cy="540" r="160" fill="#eef4ff" opacity=".08"/>
    ${[...Array(26)].map((_, i) => `<path d="M${i * 80 - 20} 790 l40 -${120 + (i * 53) % 110} l40 ${120 + (i * 53) % 110}Z" fill="#02040a"/>`).join('')}
    <rect x="0" y="790" width="1920" height="1130" fill="#0a1424"/>
    ${[...Array(9)].map((_, k) => `<rect x="${1400 - 60 + Math.sin(t * 2 + k) * 14 - k * 6}" y="${820 + k * 40}" width="${120 + k * 12}" height="8" fill="#eef4ff" opacity="${0.55 - k * 0.05}"/>`).join('')}
    <g transform="translate(560,960)"><rect x="-200" y="0" width="400" height="40" fill="#3a2a1a" stroke="${ink}" stroke-width="6"/>${[-150, -50, 50, 150].map((x) => `<rect x="${x - 6}" y="40" width="12" height="40" fill="#2a1e14"/>`).join('')}
      ${p.dock === 'dry' ? '<rect x="40" y="-28" width="110" height="30" rx="6" fill="#d8443a" stroke="#120d0a" stroke-width="4"/><path d="M50 -20 h90 M50 -10 h90" stroke="#f2e2c0" stroke-width="4"/>' : ''}</g>
    ${[...(p.heads || [])].sort((a, b) => a[1] - b[1]).map(([x, y, s, who]) => swimmer(x, y, s, who, t)).join('')}
    ${p.sign ? `<g transform="translate(300,1150)"><rect x="-10" y="0" width="20" height="330" fill="#3a2a1a"/><rect x="-190" y="-150" width="380" height="170" fill="#e8dcb0" stroke="${ink}" stroke-width="8"/>
      <text x="0" y="-92" text-anchor="middle" font-family="Anton" font-size="44" fill="#a0101a">NO SWIMMING</text><text x="0" y="-38" text-anchor="middle" font-family="Anton" font-size="44" fill="#2a2016">AFTER DARK</text></g>` : ''}
    <rect width="1920" height="1920" fill="#1a3060" opacity=".14"/>`;
};
FOCUS.lake = 960;

// the beach after: a campfire, the three of them (p.who list of 'hero' | 'jordan' | 'priya'), wet footprints on the dock
// boards in the foreground (p.prints count, the last one fading in), and a folded towel (p.towel 'dry').
S.shore = (t, d, p) => {
  const ink = K.ink, fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7);
  const who = p.who || ['hero', 'jordan', 'priya'];
  const pos = { hero: 760, jordan: 1060, priya: 1300 };
  return `<rect width="1920" height="1920" fill="#040814"/>
    ${[...Array(24)].map((_, i) => `<path d="M${i * 84 - 20} 760 l42 -${120 + (i * 53) % 110} l42 ${120 + (i * 53) % 110}Z" fill="#02040a"/>`).join('')}
    <rect x="0" y="760" width="1920" height="200" fill="#0a1424"/><path d="M0 960 Q960 900 1920 960 V1920 H0Z" fill="#3a3024"/>
    <g transform="translate(560,1060)"><circle r="300" fill="#ff9a3a" opacity="${0.12 * fl}"/>${[0, 1, 2].map((k) => `<path d="M${-30 + k * 30} 40 q${-20 + k * 20} -${80 + k * 20} 0 -${150 + k * 30} q${20 - k * 10} ${70} 0 ${150 + k * 30}" fill="${['#ff6a1a', '#ffb03a', '#ffe08a'][k]}" opacity="${fl}"/>`).join('')}<path d="M-70 50 L70 30 M-70 30 L70 50" stroke="#3a2416" stroke-width="18"/></g>
    ${who.map((w) => w === 'hero' ? `<g transform="translate(${pos[w]},880) scale(0.55)">${person(0, 0, 1, { eyes: p.eyes || 'wide', look: 0.3 })}</g>` : `<g transform="translate(${pos[w]},880) scale(0.55)">${person(0, 0, 1, { hero: false, hair: LAKE_FRIENDS[w].hair, skin: LAKE_FRIENDS[w].skin, body: LAKE_FRIENDS[w].body, eyes: p.eyes || 'wide', look: -0.3 })}</g>`).join('')}
    <rect x="0" y="1300" width="1920" height="620" fill="#4a3624"/>${[...Array(8)].map((_, k) => `<path d="M0 ${1320 + k * 26} H1920" stroke="#2a1e14" stroke-width="5"/>`).join('')}
    ${[...Array(p.prints || 0)].map((_, k) => `<g opacity="${k === (p.prints - 1) && p.newPrint ? ease(Math.min(1, t / 1.5)) : 0.9}" transform="translate(${560 + k * 230},${1420 + (k % 2) * 40}) rotate(${-10 + k * 6})"><ellipse rx="34" ry="62" fill="#1e1610"/>${[0, 1, 2, 3, 4].map((q) => `<circle cx="${-24 + q * 12}" cy="${-72 - Math.abs(q - 2) * 4}" r="${9 - Math.abs(q - 2)}" fill="#1e1610"/>`).join('')}</g>`).join('')}
    ${p.towel === 'dry' ? `<g transform="translate(1560,1440)"><rect x="-110" y="-40" width="220" height="70" rx="10" fill="#d8443a" stroke="${ink}" stroke-width="6"/><path d="M-100 -20 h200 M-100 0 h200" stroke="#f2e2c0" stroke-width="6"/></g>` : ''}
    <rect width="1920" height="1920" fill="#ff8a3a" opacity=".04"/>`;
};
FOCUS.shore = 960;

// ---------- 24-hour laundromat: the row of washers, one porthole close-up, the coin slot, the notice, the counter ----------
// a wall-clock face for any scene: hh:mm text drawn as hands
function wallClock(x, y, r, hh, mm) {
  const ink = K.ink, a = ((hh % 12) + mm / 60) * 30 - 90, b = mm * 6 - 90, rad = Math.PI / 180;
  return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#f2efe6" stroke="${ink}" stroke-width="8"/>
    ${[...Array(12)].map((_, i) => `<path d="M${Math.cos(i * 30 * rad) * r * 0.8} ${Math.sin(i * 30 * rad) * r * 0.8} L${Math.cos(i * 30 * rad) * r * 0.92} ${Math.sin(i * 30 * rad) * r * 0.92}" stroke="${ink}" stroke-width="5"/>`).join('')}
    <path d="M0 0 L${Math.cos(a * rad) * r * 0.5} ${Math.sin(a * rad) * r * 0.5}" stroke="${ink}" stroke-width="10" stroke-linecap="round"/>
    <path d="M0 0 L${Math.cos(b * rad) * r * 0.78} ${Math.sin(b * rad) * r * 0.78}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><circle r="9" fill="${ink}"/></g>`;
}
// tumbling laundry inside a round window: p colours, t time, spin speed, r radius
function tumble(t, r, cols, speed = 2.4) {
  return `<g transform="rotate(${t * speed * 57.3})">${cols.map((c, i) => { const a = i * (6.283 / cols.length);
    return `<path d="M${Math.cos(a) * r * 0.2} ${Math.sin(a) * r * 0.2} Q${Math.cos(a + 0.6) * r * 0.9} ${Math.sin(a + 0.6) * r * 0.9} ${Math.cos(a + 1.1) * r * 0.55} ${Math.sin(a + 1.1) * r * 0.55} Q${Math.cos(a + 0.3) * r * 0.4} ${Math.sin(a + 0.3) * r * 0.4} ${Math.cos(a) * r * 0.2} ${Math.sin(a) * r * 0.2}Z" fill="${c}" stroke="#0a0a12" stroke-width="4" opacity=".92"/>`; }).join('')}</g>`;
}
const LAUNDRY_COLS = [['#d84a4a', '#f2f2f2', '#3a5a9a'], ['#e8c84a', '#4a8a5a', '#f2e8d8'], ['#7a4a9a', '#e8e8f0', '#d88a3a'], ['#2a2a34', '#c8c8d0', '#6a8ab0'], ['#f0a0b0', '#f8f8f8', '#5a6a3a'], ['#3a6a8a', '#d8d0c0', '#a03a3a']];
// the laundromat at 3 AM: washers numbered 3-9 along the back wall, machine 7 (x 1325) with a paper sign.
// p.open7 (door open, empty), p.run7 (7 running with sheets), p.lead ('stand' | 'sit' | false), p.time [h, m] wall clock,
// p.hum (fluorescent flicker), p.empty (no other machines running)
S.laundro = (t, d, p) => {
  const ink = K.ink, fl = p.hum ? flick(t, 0.6) : 1;
  const mach = (n, i) => {
    const x = 170 + i * 260, cx = x + 115, is7 = n === 7, run = is7 ? p.run7 : !p.empty;
    return `<g><rect x="${x}" y="760" width="230" height="330" rx="12" fill="#e8eaee" stroke="${ink}" stroke-width="7"/>
      <rect x="${x + 14}" y="774" width="202" height="46" rx="6" fill="#c8ccd4" stroke="${ink}" stroke-width="4"/>
      <rect x="${x + 130}" y="782" width="74" height="30" rx="4" fill="#0e1a12"/><text x="${x + 167}" y="806" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="22" fill="${run ? '#5aff8a' : '#1e3a24'}">${run ? (is7 ? '45:00' : `${12 + i * 7}:0${i}`) : '--:--'}</text>
      <text x="${x + 50}" y="810" text-anchor="middle" font-family="Anton" font-size="34" fill="${is7 ? '#c0101a' : '#2a2e3a'}">${n}</text>
      ${is7 && p.open7 ? `<circle cx="${cx}" cy="950" r="86" fill="#0c0e14" stroke="${ink}" stroke-width="6"/><g transform="translate(${cx - 150},950) scale(0.92,1)"><circle r="92" fill="#cfe4f0" fill-opacity=".25" stroke="#9aa4b0" stroke-width="16"/></g>`
        : `<circle cx="${cx}" cy="950" r="92" fill="#9aa4b0" stroke="${ink}" stroke-width="7"/><circle cx="${cx}" cy="950" r="74" fill="#0c1018"/>
        ${run ? `<g transform="translate(${cx},950)">${tumble(t + i, 70, is7 ? ['#f4f0e8', '#e8dcc8', '#f8f4f0'] : LAUNDRY_COLS[i % 6])}</g>` : ''}
        <circle cx="${cx}" cy="950" r="74" fill="#bfe0ff" opacity=".12"/><path d="M${cx - 40} 900 q30 -18 60 -8" stroke="#fff" stroke-width="8" opacity=".35" fill="none" stroke-linecap="round"/>`}
      ${is7 ? `<g transform="translate(${cx},${p.open7 ? 840 : 852}) rotate(-4)"><rect x="-74" y="-22" width="148" height="78" fill="#f6f0d8" stroke="#8a7a50" stroke-width="3"/><rect x="-26" y="-30" width="52" height="16" fill="#e8e0b0" opacity=".8"/>
        <text x="0" y="12" text-anchor="middle" font-family="Anton" font-size="24" fill="#c0101a">DO NOT USE</text><text x="0" y="40" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="16" fill="#3a2e1e">OUT OF ORDER</text></g>` : ''}
      </g>`;
  };
  const [hh, mm] = p.time || [3, 4];
  return `<rect width="1920" height="1920" fill="#d8d4e4"/><rect y="0" width="1920" height="740" fill="#cfc8dc"/>
    <rect y="1090" width="1920" height="830" fill="#8a8698"/>${[...Array(12)].map((_, i) => `<path d="M${i * 180} 1090 L${i * 180 - 300} 1920" stroke="#6e6a7c" stroke-width="4"/>`).join('')}
    <path d="M0 1260 H1920 M0 1500 H1920" stroke="#6e6a7c" stroke-width="4"/>
    ${[260, 960, 1660].map((x) => `<rect x="${x - 200}" y="440" width="400" height="24" rx="8" fill="#ffffff" opacity="${fl}" stroke="#9a96a8" stroke-width="4"/><rect x="${x - 260}" y="464" width="520" height="300" fill="#f8f4ff" opacity="${0.12 * fl}"/>`).join('')}
    <rect x="200" y="520" width="520" height="190" fill="#0a0c1a" stroke="${ink}" stroke-width="8"/>${[...Array(5)].map((_, i) => `<rect x="${230 + i * 95}" y="${600 - (i % 3) * 30}" width="60" height="${110 + (i % 3) * 30}" fill="#14182a"/><rect x="${244 + i * 95}" y="${620 - (i % 3) * 30}" width="12" height="14" fill="#ffd27a" opacity=".7"/>`).join('')}
    <text x="460" y="580" text-anchor="middle" font-family="Anton" font-size="44" fill="#ff5ad8" opacity="${0.85 * fl}" style="filter:drop-shadow(0 0 10px #ff2ad0)">OPEN 24 HRS</text>
    ${wallClock(1000, 600, 78, hh, mm)}
    <rect x="1300" y="520" width="380" height="120" fill="#2a3a8a" stroke="${ink}" stroke-width="6"/><text x="1490" y="600" text-anchor="middle" font-family="Anton" font-size="62" fill="#f2f2ff">SUDS 24</text>
    ${[3, 4, 5, 6, 7, 8, 9].map(mach).join('')}
    <rect x="80" y="1300" width="1760" height="40" rx="10" fill="#5a3a24" stroke="${ink}" stroke-width="7"/>${[220, 960, 1700].map((x) => `<rect x="${x - 14}" y="1340" width="28" height="140" fill="#3a2414"/>`).join('')}
    ${p.lead ? `<g transform="translate(${p.lead === 'sit' ? 900 : 760},${p.lead === 'sit' ? 1060 : 960}) scale(0.62)">${person(0, 0, 1, { eyes: p.eyes || 'normal', look: p.look ?? 0.6, reach: p.lead === 'stand' })}</g>` : ''}
    ${p.lead === 'sit' ? `<g transform="translate(980,1300) rotate(-8)"><rect x="-70" y="-90" width="140" height="100" fill="#8a2a2a" stroke="${ink}" stroke-width="6"/><path d="M0 -90 v100" stroke="${ink}" stroke-width="5"/><path d="M-60 -70 h50 M10 -70 h50 M-60 -50 h50 M10 -50 h50" stroke="#e8d8c8" stroke-width="4"/></g>` : ''}
    ${p.lead === 'stand' ? `<g transform="translate(620,1290)"><path d="M-110 -110 L110 -110 L90 10 L-90 10Z" fill="#c8a870" stroke="${ink}" stroke-width="7"/>${[-60, 0, 60].map((x) => `<path d="M${x} -110 v120" stroke="#9a7a48" stroke-width="5"/>`).join('')}<path d="M-100 -116 q60 -50 120 -10 q40 -30 80 6" fill="#f4f0e8" stroke="${ink}" stroke-width="5"/></g>` : ''}
    <rect width="1920" height="1920" fill="#b070ff" opacity=".05"/>`;
};
FOCUS.laundro = 1060;

// close-up of a front-loader: big porthole, timer screen above. p.timer (text) or p.from/p.to (minutes, counting down
// across the scene); p.hand (0..1 a small hand pressed flat on the glass from inside), p.knock (shake + hand taps),
// p.locked (padlock icon lit), p.open (door swung open: folded sheets), p.sock (tiny wet sock on top),
// p.home (her machine at home: almond enamel, dark, no laundry), p.stop (drum stopped), p.num (machine number)
S.washer = (t, d, p) => {
  const ink = K.ink, home = p.home;
  let tm = p.timer ?? (p.home ? '' : '45:00');
  if (p.from != null) { const n = Math.max(p.to, p.from - Math.floor((t / d) * (p.from - p.to + 1))); tm = `${n}:00`; }
  const shake = p.knock ? Math.sin(t * 40) * 4 * (Math.sin(t * 3.3) > 0.6 ? 1 : 0) : 0;
  const tapK = p.knock ? (Math.sin(t * 3.3) > 0.6 ? 1 : 0) : 0;
  const body = home ? '#e4d6b4' : '#eceef2', rim = home ? '#b0a07a' : '#a4acb8';
  const handA = p.hand ?? 0;
  const hand = handA > 0 ? `<g transform="translate(${30 + shake},${20 - tapK * 6}) rotate(-10) scale(${p.handS || 1})" opacity="${handA}">
      <path d="M-60 60 Q-70 -10 -50 -40 L-46 -120 Q-40 -136 -28 -120 L-24 -50 L-14 -140 Q-6 -156 6 -140 L6 -54 L20 -134 Q30 -150 40 -132 L32 -48 L50 -110 Q62 -124 70 -106 L56 -30 Q76 -40 92 -26 Q60 20 40 70 Q0 96 -60 60Z" fill="#e8c8b8" stroke="#6a4a3a" stroke-width="5"/>
      <path d="M-40 30 q30 10 60 0" stroke="#b08a7a" stroke-width="4" fill="none"/><ellipse cx="0" cy="0" rx="90" ry="110" fill="#ffffff" opacity=".08"/></g>` : '';
  const inside = p.open ? '' : home ? `<circle r="330" fill="#06070a"/>` : `<circle r="330" fill="#0c1018"/>${p.stop ? `<g transform="rotate(30)">${tumble(0, 320, ['#f4f0e8', '#e8dcc8', '#f8f4f0', '#ece4d8', '#f6f2ea', '#e0d6c8'], 0)}</g><path d="M-300 150 Q-150 90 0 130 Q150 80 300 150 A330 330 0 0 1 -300 150Z" fill="#e8e0d2" stroke="#0a0a12" stroke-width="5" opacity=".9"/>` : tumble(t, 320, ['#f4f0e8', '#e8dcc8', '#f8f4f0', '#ece4d8', '#f6f2ea', '#e0d6c8'])}<path d="M-300 150 Q-150 90 0 130 Q150 80 300 150 A330 330 0 0 1 -300 150Z" fill="#e8e0d2" stroke="#0a0a12" stroke-width="5" opacity=".9"/>`;
  return `<g transform="translate(${shake},0)"><rect width="1920" height="1920" fill="${home ? '#3a2e24' : '#d8d4e4'}"/>
    ${home ? `${[...Array(14)].map((_, i) => `<path d="M${i * 140} 0 V1920" stroke="#4a3a2e" stroke-width="30"/>`).join('')}<rect width="1920" height="1920" fill="#000" opacity=".45"/>` : ''}
    <rect x="360" y="300" width="1200" height="1500" rx="40" fill="${body}" stroke="${ink}" stroke-width="10"/>
    <rect x="400" y="340" width="1120" height="280" rx="20" fill="${home ? '#d4c4a0' : '#d2d6de'}" stroke="${ink}" stroke-width="6"/>
    <rect x="1040" y="400" width="400" height="150" rx="14" fill="#06120a" stroke="${ink}" stroke-width="6"/>
    <text x="1240" y="510" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="104" fill="${home && !p.timer ? '#10241a' : '#5aff8a'}" style="filter:drop-shadow(0 0 12px #2aff6a)">${esc3(tm)}</text>
    <text x="560" y="520" text-anchor="middle" font-family="Anton" font-size="150" fill="${home ? '#5a4a30' : '#c0101a'}">${esc3(p.num ?? (home ? '' : '7'))}</text>
    ${p.locked ? `<g transform="translate(830,470)"><rect x="-34" y="-10" width="68" height="56" rx="8" fill="#ff3a3a" style="filter:drop-shadow(0 0 10px #ff2a2a)"/><path d="M-20 -10 v-20 a20 20 0 0 1 40 0 v20" stroke="#ff3a3a" stroke-width="10" fill="none"/></g>` : ''}
    <g transform="translate(960,1150)">
      <circle r="420" fill="${rim}" stroke="${ink}" stroke-width="10"/><circle r="350" fill="#2a2e38" stroke="${ink}" stroke-width="8"/>
      ${p.open ? `<circle r="340" fill="#0a0c12"/><g transform="translate(0,120)"><rect x="-220" y="-120" width="440" height="80" rx="14" fill="#f4f0e8" stroke="${ink}" stroke-width="6"/><rect x="-210" y="-50" width="420" height="80" rx="14" fill="#e8dcc8" stroke="${ink}" stroke-width="6"/><rect x="-200" y="20" width="400" height="80" rx="14" fill="#f8f4f0" stroke="${ink}" stroke-width="6"/>
          ${p.sock ? `<g transform="translate(20,-150) rotate(-12)"><path d="M-30 -60 h50 v70 q0 20 30 26 q30 8 26 34 q-6 24 -40 20 l-60 -6 q-12 -2 -8 -18Z" fill="#7aa8d8" stroke="${ink}" stroke-width="6"/><path d="M-30 -50 h50 M-30 -36 h50" stroke="#f2f2f2" stroke-width="6"/><circle cx="40" cy="60" r="7" fill="#bfe6ff"/><circle cx="-10" cy="44" r="5" fill="#bfe6ff"/>
            <rect x="-24" y="-20" width="40" height="18" fill="#f8f8f0" stroke="${ink}" stroke-width="3"/><text x="-4" y="-6" text-anchor="middle" font-family="Courier New, monospace" font-weight="700" font-size="13" fill="#1a1a2a">ELI</text></g>` : ''}</g>
          <g transform="translate(-560,0) scale(0.6,1)"><circle r="420" fill="${rim}" stroke="${ink}" stroke-width="10"/><circle r="330" fill="#bfe0ff" opacity=".2"/></g>`
        : `${inside}${hand}<circle r="330" fill="#bfe0ff" opacity=".1"/><path d="M-200 -200 q120 -90 260 -60" stroke="#fff" stroke-width="22" opacity=".25" fill="none" stroke-linecap="round"/>`}
    </g>
    ${!home ? `<rect x="400" y="1620" width="1120" height="130" rx="16" fill="#c4c8d0" stroke="${ink}" stroke-width="5"/>` : ''}
    ${home ? '<rect width="1920" height="1920" fill="#1a2a5a" opacity=".2"/>' : '<rect width="1920" height="1920" fill="#b070ff" opacity=".05"/>'}</g>`;
};
FOCUS.washer = 960;

// coin slot close-up: p.coins (how many quarters are in), the hand pushing the last one, p.start (START button lit)
S.coinslot = (t, d, p) => {
  const ink = K.ink, n = p.coins ?? 2, k = ease(Math.min(1, t / Math.max(0.6, d * 0.5)));
  return `<rect width="1920" height="1920" fill="#d2d6de"/><rect x="300" y="600" width="1320" height="760" rx="30" fill="#bcc2cc" stroke="${ink}" stroke-width="10"/>
    <rect x="460" y="760" width="440" height="140" rx="16" fill="#2a2e38" stroke="${ink}" stroke-width="6"/><text x="680" y="860" text-anchor="middle" font-family="Anton" font-size="80" fill="#e8eaf0">25¢</text>
    <rect x="1040" y="740" width="380" height="180" rx="20" fill="#3a3e4a" stroke="${ink}" stroke-width="6"/><rect x="1110" y="815" width="240" height="30" rx="10" fill="#0a0a10"/>
    ${[...Array(n)].map((_, i) => { const last = i === n - 1, y = last ? 830 - 260 * (1 - k) : 830; return `<g transform="translate(${1170 + i * 120},${y})"><ellipse rx="56" ry="56" fill="#c8ccd4" stroke="${ink}" stroke-width="6"/><ellipse rx="40" ry="40" fill="none" stroke="#8a90a0" stroke-width="5"/><text y="16" text-anchor="middle" font-family="Anton" font-size="40" fill="#5a6070">25</text></g>`; }).join('')}
    <g transform="translate(${1330},${560 - 250 * (1 - k)})">${STYLE === 'anime' ? `<path d="M-70 -400 L-70 -40 Q-80 30 -20 50 L60 50 Q100 20 90 -40 L90 -400Z" fill="${HERO_BODY || '#6a4a7a'}" stroke="${ink}" stroke-width="8"/><path d="M-60 -40 Q-70 60 -10 70 L50 70 Q90 40 80 -20" fill="${AN.skin}" stroke="${ink}" stroke-width="7"/>` : ''}</g>
    <rect x="460" y="1060" width="960" height="200" rx="24" fill="${p.start ? '#2aff6a' : '#1a5a2a'}" stroke="${ink}" stroke-width="8" style="${p.start ? 'filter:drop-shadow(0 0 22px #2aff6a)' : ''}"/>
    <text x="940" y="1195" text-anchor="middle" font-family="Anton" font-size="120" fill="${p.start ? '#04140a' : '#0c2a14'}">START</text>
    <rect width="1920" height="1920" fill="#b070ff" opacity=".05"/>`;
};
FOCUS.coinslot = 1000;

// a paper notice taped to a machine, close: p.lines [[text, colour, size], ...], p.yellow (old, sun-faded)
S.notice = (t, d, p) => {
  const ink = K.ink, lines = p.lines || [['DO NOT USE', '#c0101a', 150], ['OUT OF ORDER', '#2a2216', 80]];
  return `<rect width="1920" height="1920" fill="#e8eaee"/>${[...Array(30)].map((_, i) => `<path d="M0 ${i * 70} H1920" stroke="#d8dce4" stroke-width="3"/>`).join('')}
    <g transform="rotate(-3 960 960)"><rect x="380" y="560" width="1160" height="820" fill="${p.yellow ? '#efe2b0' : '#f8f6ee'}" stroke="#9a8a5a" stroke-width="6"/>
      <rect x="840" y="520" width="240" height="70" fill="#e8e0b4" opacity=".85"/><rect x="380" y="560" width="1160" height="820" fill="url(#vig)" opacity=".25"/>
      ${lines.map(([tx, c, sz], i) => `<text x="960" y="${780 + i * 210}" text-anchor="middle" font-family="${sz > 100 ? 'Anton' : 'Courier New, monospace'}" font-weight="700" font-size="${sz || 100}" fill="${c || '#2a2216'}">${esc3(tx)}</text>`).join('')}
    </g>`;
};
FOCUS.notice = 960;

// the attendant's counter: "WASH & FOLD", detergent shelves, the old owner (grey moustache, bald) behind the till
S.counter = (t, d, p) => {
  const ink = K.ink;
  return `<rect width="1920" height="1920" fill="#c8c2d4"/>
    ${[0, 1, 2].map((r) => `<rect x="1180" y="${480 + r * 170}" width="560" height="20" fill="#6a4a2a"/>${[...Array(6)].map((_, c) => `<rect x="${1200 + c * 88}" y="${380 + r * 170}" width="64" height="100" rx="10" fill="${['#ff8a2a', '#2a8aff', '#3ad86a', '#ff4a6a'][(r + c) % 4]}" stroke="${ink}" stroke-width="4"/>`).join('')}`).join('')}
    <rect x="300" y="420" width="700" height="130" fill="#2a3a8a" stroke="${ink}" stroke-width="6"/><text x="650" y="510" text-anchor="middle" font-family="Anton" font-size="66" fill="#f2f2ff">WASH &amp; FOLD</text>
    <g transform="translate(860,1000) scale(0.75)">${person(0, 0, 1, { hero: false, body: '#2a5a4a', eyes: p.oEyes || 'tired', look: -0.3, hair: HAIRS.bald(K.ink).split(AN.hair).join('#d8d8dc') + '<path d="M-44 74 Q-20 58 0 70 Q20 58 44 74 Q20 84 0 76 Q-20 84 -44 74Z" fill="#e8e8ec" stroke="#0a0a12" stroke-width="5"/>' })}</g>
    <rect x="200" y="1180" width="1520" height="740" fill="#5a3a24" stroke="${ink}" stroke-width="10"/><rect x="180" y="1150" width="1560" height="44" fill="#7a5234" stroke="${ink}" stroke-width="7"/>
    <rect x="1240" y="1060" width="200" height="100" rx="8" fill="#3a3a44" stroke="${ink}" stroke-width="5"/><rect x="1260" y="1076" width="160" height="40" fill="#0e1a12"/>
    ${p.lead ? `<g transform="translate(560,1180) scale(0.8)">${person(0, 0, 1, { back: true })}</g>` : ''}
    <rect width="1920" height="1920" fill="#b070ff" opacity=".05"/>`;
};
FOCUS.counter = 900;

// Farmhouse Rules thumbnail (v2): upstairs hall, the shut bedroom door on the left third, warm light under it with two
// feet standing on the other side, knock marks on the door, empty dark hall to the right. p.text [[word, colour], ...]
S.thumbFarm = (t, d, p) => {
  const ink = K.ink;
  return `<rect width="1920" height="1920" fill="#120e1c"/>
    ${[...Array(24)].map((_, i) => `<rect x="${i * 80}" y="420" width="40" height="980" fill="#1a1526"/>`).join('')}
    <path d="M0 1300 H1920 V1920 H0Z" fill="#2a1c14"/>${[...Array(16)].map((_, i) => `<path d="M${640 + (i - 8) * 60} 1300 L${640 + (i - 8) * 260} 1920" stroke="#1a110c" stroke-width="6"/>`).join('')}
    <rect x="0" y="1280" width="1920" height="26" fill="#3a2a1c"/>
    <path d="M330 1300 L950 1300 L1500 1920 L-200 1920Z" fill="#ffb84a" opacity=".16"/>
    <rect x="360" y="500" width="580" height="800" fill="#4a3220" stroke="#120c08" stroke-width="18"/>
    <rect x="400" y="545" width="500" height="320" fill="none" stroke="#2e1e12" stroke-width="10"/><rect x="400" y="905" width="500" height="340" fill="none" stroke="#2e1e12" stroke-width="10"/>
    <circle cx="870" cy="900" r="22" fill="#c8a85a" stroke="#120c08" stroke-width="5"/>
    <rect x="360" y="1276" width="580" height="30" fill="#ffd27a"/><rect x="340" y="1270" width="620" height="46" fill="#ffc04a" opacity=".35" filter="url(#soft)"/>
    <rect x="510" y="1276" width="104" height="30" fill="#050404"/><rect x="680" y="1276" width="104" height="30" fill="#050404"/>
    <g stroke="#ff3a2a" stroke-width="10" stroke-linecap="round" style="filter:drop-shadow(0 0 8px #ff0000)" opacity=".9">${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * 0.785; return `<path d="M${650 + Math.cos(a) * 46} ${740 + Math.sin(a) * 46} L${650 + Math.cos(a) * 88} ${740 + Math.sin(a) * 88}"/>`; }).join('')}</g>
    ${p.text ? p.text.map(([w, c], i) => `<text x="1460" y="${700 + i * 210}" text-anchor="middle" font-family="Anton" font-size="210" fill="${c}" stroke="#000" stroke-width="18" paint-order="stroke" letter-spacing="3">${w}</text>`).join('') : ''}
    <rect width="1920" height="1920" fill="url(#vig)" opacity=".55"/>`;
};

// Floor Thirteen long-form thumbnail (v2): the lead's terrified face big on the left, lit red; on the right the elevator
// doors open on floor 13, the glowing 13 above them, and a pale woman in a 1974 nurse's cap standing just outside.
// p.text [[word, colour], ...] (top-left), p.near (0..1 how close the woman is)
S.thumbF13 = (t, d, p) => {
  const ink = K.ink, near = p.near ?? 0.6;
  const ruthHair = '<path d="M-140 200 Q-160 -170 0 -178 Q160 -170 140 200 L106 210 L110 -30 Q70 -110 0 -112 Q-70 -110 -110 -30 L-106 210Z" fill="#14100e" stroke="#000" stroke-width="7"/><path d="M-110 -150 L110 -150 L90 -205 L-90 -205Z" fill="#f4f2ec" stroke="#000" stroke-width="6"/><path d="M-12 -190 h24 M0 -200 v20" stroke="#c0101a" stroke-width="7"/>';
  return `<rect width="1920" height="1920" fill="#0e1214"/>
    <rect x="0" y="420" width="1920" height="1080" fill="#1a2224"/>${[...Array(10)].map((_, i) => `<path d="M${i * 200} 420 V1500" stroke="#11181a" stroke-width="10"/>`).join('')}
    <rect x="1010" y="640" width="760" height="860" fill="#020304"/>
    <path d="M1010 1500 L1770 1500 L1500 900 L1280 900Z" fill="#2a0608" opacity=".9"/>
    <rect x="1290" y="700" width="200" height="200" fill="#5a0a0e" opacity=".55" filter="url(#blur)"/>
    <g transform="translate(1390,${1120 - 80 * near}) scale(${0.42 + 0.3 * near})">${person(0, 0, 1, { hero: false, black: true, eyes: 'wide', look: 0, seed: 1.7, body: '#d8d4cc', skin: '#d8dcd8', hair: ruthHair })}</g>
    <rect x="1010" y="640" width="760" height="860" fill="#ff2a2a" opacity=".06"/>
    <rect x="930" y="600" width="100" height="900" fill="#8a969c" stroke="${ink}" stroke-width="8"/><rect x="1750" y="600" width="100" height="900" fill="#8a969c" stroke="${ink}" stroke-width="8"/>
    <rect x="930" y="560" width="920" height="80" fill="#6a767c" stroke="${ink}" stroke-width="8"/>
    <rect x="1230" y="430" width="320" height="170" rx="14" fill="#0a0404" stroke="${ink}" stroke-width="8"/>
    <text x="1390" y="570" text-anchor="middle" font-family="Anton" font-size="150" fill="#ff2a2a" style="filter:drop-shadow(0 0 22px #ff0000)">13</text>
    <circle cx="560" cy="1040" r="520" fill="#ff1a1a" opacity=".16" filter="url(#blur)"/>
    <g transform="translate(470,1240)">${person(0, 0, 1.6, { eyes: 'wide', look: 0.9, mouth: 'o', sweat: true, seed: 1.7 })}</g>
    <rect x="0" y="420" width="900" height="1080" fill="#ff2020" opacity=".1"/>
    ${p.text ? p.text.map(([w, c], i) => `<text x="${p.tx ?? 470}" y="${(p.ty ?? 600) + i * 180}" text-anchor="middle" font-family="Anton" font-size="${p.size || 180}" fill="${c}" stroke="#000" stroke-width="18" paint-order="stroke" letter-spacing="3">${w}</text>`).join('') : ''}
    <rect width="1920" height="1920" fill="url(#vig)" opacity=".5"/>`;
};

// Vibrant thumbnail kit (Ifglass look): saturated gradient sky, soft bokeh lights, neon rim glow on characters, big
// rounded-bold words (white + yellow) with a fat black outline and a drop shadow.
const VIB = {
  bg: (a, b, c) => `<defs><linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="1920" height="1920" fill="url(#vbg)"/>`,
  bokeh: (cols, n = 18, seed = 1) => [...Array(n)].map((_, i) => `<circle cx="${(i * 733 * seed + 140) % 1920}" cy="${440 + (i * 389 * seed) % 1040}" r="${18 + (i * 37) % 46}" fill="${cols[i % cols.length]}" opacity="${0.18 + (i % 4) * 0.07}" filter="url(#soft)"/>`).join(''),
  glow: (col, px = 16) => `filter:drop-shadow(0 0 ${px}px ${col}) drop-shadow(0 0 ${px / 2}px ${col})`,
  words: (lines, x, y, anchor = 'start') => lines.map(([w, c, sz], i) => { const yy = y + lines.slice(0, i + 1).reduce((a, l) => a + (l[2] || 160) * 0.92, 0);
    return `<text x="${x}" y="${yy}" text-anchor="${anchor}" font-family="Inter Display, Inter" font-weight="900" font-size="${sz || 160}" fill="${c}" stroke="#0a0614" stroke-width="${(sz || 160) / 7}" paint-order="stroke" stroke-linejoin="round" letter-spacing="-2" style="filter:drop-shadow(0 10px 0 rgba(0,0,0,.55))">${w}</text>`; }).join(''),
  pill: (txt, x, y, col) => `<g transform="translate(${x},${y})"><rect x="0" y="-62" width="${txt.length * 34 + 70}" height="88" rx="20" fill="#0c0a1c" opacity=".88" stroke="${col}" stroke-width="6" style="filter:drop-shadow(0 0 10px ${col})"/><text x="35" y="0" font-family="Inter Display, Inter" font-weight="900" font-size="54" fill="#ffffff">${txt}</text></g>`,
};

// Floor Thirteen thumbnail v3 (vibrant): purple-to-red gradient, neon-rimmed nurse face left, teal elevator frame with a hot
// red corridor and Ruth in it, a glowing red 13, words top-left.
S.thumbF13v = (t, d, p) => {
  const ink = K.ink;
  const ruthHair = '<path d="M-140 200 Q-160 -170 0 -178 Q160 -170 140 200 L106 210 L110 -30 Q70 -110 0 -112 Q-70 -110 -110 -30 L-106 210Z" fill="#14100e" stroke="#000" stroke-width="7"/><path d="M-110 -150 L110 -150 L90 -205 L-90 -205Z" fill="#f4f2ec" stroke="#000" stroke-width="6"/><path d="M-12 -190 h24 M0 -200 v20" stroke="#c0101a" stroke-width="7"/>';
  return `${VIB.bg('#3a0f7a', '#7a1a8a', '#ff3a3a')}${VIB.bokeh(['#ffb03a', '#ff4ad8', '#6a8aff'], 22)}
    <g style="${VIB.glow('#2af0ff', 18)}"><rect x="1030" y="560" width="760" height="940" rx="10" fill="#1aa8b8" stroke="${ink}" stroke-width="10"/></g>
    <rect x="1110" y="660" width="600" height="840" fill="#1a0206"/>
    <defs><radialGradient id="corr" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#ff2a2a" stop-opacity=".95"/><stop offset=".6" stop-color="#8a0010" stop-opacity=".7"/><stop offset="1" stop-color="#1a0206" stop-opacity="0"/></radialGradient></defs>
    <rect x="1110" y="660" width="600" height="840" fill="url(#corr)"/>
    <g transform="translate(1410,1150) scale(0.62)" style="${VIB.glow('#ff2a2a', 14)}">${person(0, 0, 1, { hero: false, black: true, eyes: 'wide', look: 0, seed: 1.7, body: '#f2eee6', skin: '#e4ecec', hair: ruthHair })}</g>
    <g transform="translate(1410,560)"><rect x="-170" y="-110" width="340" height="170" rx="20" fill="#120208" stroke="${ink}" stroke-width="8" style="${VIB.glow('#ff2a2a', 22)}"/>
      <text y="38" text-anchor="middle" font-family="Inter Display, Inter" font-weight="900" font-size="150" fill="#ff3a3a" style="${VIB.glow('#ff0000', 18)}">13</text></g>
    <g transform="translate(500,1260)" style="${VIB.glow('#2af0ff', 20)}">${person(0, 0, 1.55, { eyes: 'wide', look: 0.9, mouth: 'o', sweat: true, seed: 1.7 })}</g>
    <circle cx="560" cy="980" r="360" fill="#ffb060" opacity=".12" filter="url(#blur)"/>
    ${VIB.words(p.words || [['NO 13TH', '#ffffff', 150], ['FLOOR', '#ffe23a', 200]], 70, 420)}`;
};

// v4: even louder. Sun-burst rays behind the face, white sticker outline + neon glow on both characters, Ruth closer with
// glowing red eyes, a red arrow onto her, everything run through a saturation/contrast boost.
S.thumbF13p = (t, d, p) => {
  const ink = K.ink, sticker = (c) => `filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff) drop-shadow(0 0 3px #fff) drop-shadow(0 0 22px ${c}) drop-shadow(0 0 10px ${c})`;
  const ruthHair = '<path d="M-140 200 Q-160 -170 0 -178 Q160 -170 140 200 L106 210 L110 -30 Q70 -110 0 -112 Q-70 -110 -110 -30 L-106 210Z" fill="#14100e" stroke="#000" stroke-width="7"/><path d="M-110 -150 L110 -150 L90 -205 L-90 -205Z" fill="#f4f2ec" stroke="#000" stroke-width="6"/><path d="M-12 -190 h24 M0 -200 v20" stroke="#c0101a" stroke-width="7"/>';
  const rays = [...Array(18)].map((_, i) => { const a = i * Math.PI / 9, b = a + 0.12; return `<path d="M520 1000 L${520 + Math.cos(a) * 1400} ${1000 + Math.sin(a) * 1400} L${520 + Math.cos(b) * 1400} ${1000 + Math.sin(b) * 1400}Z" fill="${p.dark ? '#ff1a1a' : '#ffd25a'}" opacity="${p.dark ? 0.07 : 0.16}"/>`; }).join('');
  const rx = 1410, ry = 1250, rs = 0.82, dark = p.dark;
  return `<g style="filter:saturate(1.35) contrast(1.08)">${dark ? VIB.bg('#050104', '#1a0308', '#4a060c') : VIB.bg('#5a12c8', '#d0208a', '#ff5a1a')}${rays}${dark ? VIB.bokeh(['#ff2a1a', '#ff8a3a'], 10) : VIB.bokeh(['#ffe03a', '#ff4ad8', '#3ae0ff'], 24)}
    <g style="${VIB.glow(dark ? '#ff2a1a' : '#2af0ff', 24)}"><rect x="1030" y="560" width="760" height="940" rx="10" fill="${dark ? '#3a3e44' : '#18c8d8'}" stroke="${ink}" stroke-width="12"/></g>
    <rect x="1110" y="660" width="600" height="840" fill="#1a0206"/>
    <defs><radialGradient id="corr2" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#ff3a2a"/><stop offset=".6" stop-color="#b00018" stop-opacity=".8"/><stop offset="1" stop-color="#1a0206" stop-opacity="0"/></radialGradient></defs>
    <rect x="1110" y="660" width="600" height="840" fill="url(#corr2)"/>
    <g transform="translate(${rx},${ry}) scale(${rs})" style="${sticker('#ff1a1a')}">${person(0, 0, 1, { hero: false, black: true, eyes: 'wide', look: 0, seed: 1.7, body: '#f6f2ea', skin: '#e8f0f0', hair: ruthHair })}</g>
    ${[[-80, -121], [40, -121]].map(([ex, ey]) => `<circle cx="${rx + ex * rs}" cy="${ry + ey * rs}" r="15" fill="#ff2a2a" style="${VIB.glow('#ff0000', 14)}"/><circle cx="${rx + ex * rs}" cy="${ry + ey * rs}" r="6" fill="#fff"/>`).join('')}
    <g transform="translate(1410,560)"><rect x="-180" y="-115" width="360" height="180" rx="22" fill="#120208" stroke="#fff" stroke-width="8" style="${VIB.glow('#ff2a2a', 26)}"/>
      <text y="42" text-anchor="middle" font-family="Inter Display, Inter" font-weight="900" font-size="165" fill="#fff4f0" style="${VIB.glow('#ff0000', 20)}">13</text></g>
    <g stroke="#ff2a2a" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none" style="filter:drop-shadow(0 0 0 #fff) drop-shadow(0 8px 0 rgba(0,0,0,.6))">
      <path d="M980 860 Q1080 800 1180 900"/><path d="M1180 900 l-80 -10 M1180 900 l-20 -76"/></g>
    <g transform="translate(470,1330)" style="${sticker(dark ? '#ff3a2a' : '#2af0ff')}">${person(0, 0, 1.85, { eyes: 'wide', look: 0.9, mouth: 'o', sweat: true, seed: 1.7 })}</g>
    ${VIB.words(p.words || [['NO 13TH', '#ffffff', 165], ['FLOOR', '#ffe23a', 225]], 60, 420)}</g>`;
};

// v5: v4 plus horror. Blood-red handprints and drips, long grey fingers curling round the door frame, Ruth's too-wide
// black grin, blood dripping from the 13, crimson rays and a red edge glow, tears on the lead.
S.thumbF13h = (t, d, p) => {
  const base = S.thumbF13p(t, d, { ...p, words: [] });
  const rx = 1410, ry = 1250, rs = 0.82, mx = rx + (-20) * rs, my = ry + (-18) * rs;
  const hand = (x, y, r, s = 1) => `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})" opacity=".92"><path d="M-30 40 Q-40 -6 -26 -24 L-26 -86 Q-20 -98 -12 -86 L-8 -34 L-2 -100 Q6 -112 14 -100 L12 -36 L24 -92 Q32 -102 40 -90 L32 -30 L46 -66 Q56 -74 60 -62 L44 0 Q40 40 10 52 Q-20 58 -30 40Z" fill="#b0000e"/>
    <path d="M-20 52 q-4 40 2 70 M20 54 q2 30 -2 56" stroke="#b0000e" stroke-width="10" stroke-linecap="round"/></g>`;
  const drips = (x0, x1, y, n) => [...Array(n)].map((_, i) => { const x = x0 + (x1 - x0) * (i + 0.5) / n, L = 30 + (i * 53) % 90; return `<path d="M${x - 9} ${y} Q${x - 9} ${y + L} ${x} ${y + L + 14} Q${x + 9} ${y + L} ${x + 9} ${y}Z" fill="#a8000c"/>`; }).join('');
  const fingers = [0, 1, 2, 3].map((k) => `<path d="M1112 ${790 + k * 46} q46 -10 70 18 q18 22 4 40" stroke="#0a0a12" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M1112 ${790 + k * 46} q46 -10 70 18 q18 22 4 40" stroke="#c8d0d0" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M1184 ${846 + k * 46} l8 6" stroke="#2a1a1a" stroke-width="8" stroke-linecap="round"/>`).join('');
  return `<g style="filter:saturate(${p.dark ? 1.05 : 1.25}) contrast(1.12)">${base}</g>
    <rect width="1920" height="1920" fill="#ff0010" opacity="${p.dark ? 0.03 : 0.08}"/>${p.dark ? '<rect x="0" y="420" width="1920" height="1080" fill="url(#vig)" opacity=".6"/>' : ''}
    <defs><radialGradient id="redEdge" r="70%"><stop offset=".55" stop-color="#3a0008" stop-opacity="0"/><stop offset="1" stop-color="#3a0008" stop-opacity=".75"/></radialGradient></defs>
    <rect x="0" y="420" width="1920" height="1080" fill="url(#redEdge)"/>
    ${hand(1070, 1080, -12, 1.1)}${hand(1760, 820, 18, 0.95)}${hand(1740, 1290, 6, 0.8)}
    ${drips(1240, 1580, 648, 7)}
    <path d="M1300 470 l40 50 l-20 30 l50 40 M1500 460 l-30 60 l30 20" stroke="#ffffff" stroke-width="5" fill="none" opacity=".7"/>
    <path d="M${mx - 58} ${my - 6} Q${mx} ${my + 70} ${mx + 58} ${my - 6} Q${mx} ${my + 24} ${mx - 58} ${my - 6}Z" fill="#050004" stroke="#000" stroke-width="5"/>
    ${[-36, -18, 0, 18, 36].map((dx) => `<path d="M${mx + dx} ${my + 6 - Math.abs(dx) * 0.25} v18" stroke="#f0ece0" stroke-width="7"/>`).join('')}
    ${[[384, 1165], [592, 1165]].map(([x, y]) => `<path d="M${x} ${y} q-10 50 4 90" stroke="#bfefff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/>`).join('')}
    ${VIB.words([['NO 13TH', '#ffffff', 165], ['FLOOR', p.dark ? '#ff2a2a' : '#ffe23a', 225]], 60, 420)}`;
};

// Farmhouse Rules thumbnail v3 (house recipe): the house-sitter's terrified face left; right, the upstairs bedroom door
// open a crack on red light, glowing eyes and a grin in the gap, grey fingers round the edge, light under the door with
// feet, a knock burst, blood handprints. Words top-left.
S.thumbFarmH = (t, d, p) => {
  const ink = K.ink, sticker = (c) => `filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff) drop-shadow(0 0 3px #fff) drop-shadow(0 0 22px ${c}) drop-shadow(0 0 10px ${c})`;
  const dark = p.dark, rays = [...Array(18)].map((_, i) => { const a = i * Math.PI / 9, b = a + 0.12; return `<path d="M520 1000 L${520 + Math.cos(a) * 1400} ${1000 + Math.sin(a) * 1400} L${520 + Math.cos(b) * 1400} ${1000 + Math.sin(b) * 1400}Z" fill="${dark ? '#ff1a1a' : '#ffd25a'}" opacity="${dark ? 0.07 : 0.16}"/>`; }).join('');
  const hand = (x, y, r, s = 1) => `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})" opacity=".92"><path d="M-30 40 Q-40 -6 -26 -24 L-26 -86 Q-20 -98 -12 -86 L-8 -34 L-2 -100 Q6 -112 14 -100 L12 -36 L24 -92 Q32 -102 40 -90 L32 -30 L46 -66 Q56 -74 60 -62 L44 0 Q40 40 10 52 Q-20 58 -30 40Z" fill="#b0000e"/><path d="M-20 52 q-4 40 2 70 M20 54 q2 30 -2 56" stroke="#b0000e" stroke-width="10" stroke-linecap="round"/></g>`;
  const gx = 1250;  // the gap between door and frame
  return `<g style="filter:saturate(${dark ? 1.1 : 1.3}) contrast(1.1)">${dark ? VIB.bg('#050104', '#1a0308', '#4a060c') : VIB.bg('#4a12b8', '#c81a8a', '#ff6a1a')}${rays}${dark ? VIB.bokeh(['#ff2a1a', '#ff8a3a'], 10) : VIB.bokeh(['#ffe03a', '#ff4ad8', '#3ae0ff'], 24)}
    <g style="${VIB.glow('#ffb03a', 22)}"><rect x="1060" y="560" width="680" height="940" fill="#6a3a1a" stroke="${ink}" stroke-width="12"/></g>
    <rect x="1110" y="610" width="580" height="890" fill="#1a0206"/>
    <defs><radialGradient id="farmR" cx="25%" cy="45%" r="60%"><stop offset="0" stop-color="#ff3a2a"/><stop offset=".7" stop-color="#900010" stop-opacity=".6"/><stop offset="1" stop-color="#1a0206" stop-opacity="0"/></radialGradient></defs>
    <rect x="1110" y="610" width="200" height="890" fill="url(#farmR)"/>
    <circle cx="${gx - 50}" cy="930" r="15" fill="#ff2a2a" style="${VIB.glow('#ff0000', 14)}"/><circle cx="${gx - 50}" cy="930" r="6" fill="#fff"/>
    <circle cx="${gx + 10}" cy="934" r="15" fill="#ff2a2a" style="${VIB.glow('#ff0000', 14)}"/><circle cx="${gx + 10}" cy="934" r="6" fill="#fff"/>
    <path d="M${gx - 80} 1000 Q${gx - 20} 1060 ${gx + 30} 1000 Q${gx - 20} 1030 ${gx - 80} 1000Z" fill="#050004"/>${[-60, -40, -20, 0, 20].map((dx) => `<path d="M${gx + dx} ${1008 + Math.abs(dx + 20) * 0.1} v14" stroke="#f0ece0" stroke-width="6"/>`).join('')}
    <g style="${sticker('#ffb03a')}"><path d="M${gx} 610 L1690 640 L1690 1470 L${gx} 1500Z" fill="#8a5228" stroke="${ink}" stroke-width="10"/></g>
    <path d="M${gx + 50} 700 L1640 720 L1640 1010 L${gx + 50} 1010Z M${gx + 50} 1070 L1640 1070 L1640 1400 L${gx + 50} 1420Z" fill="none" stroke="#5a3418" stroke-width="10"/>
    <circle cx="${gx + 50}" cy="1060" r="20" fill="#e8c86a" stroke="${ink}" stroke-width="5"/>
    ${[0, 1, 2, 3].map((k) => `<rect x="${gx - 4}" y="${850 + k * 34}" width="${58 - Math.abs(k - 1.5) * 8}" height="26" rx="13" fill="#c8d0d0" stroke="#0a0a12" stroke-width="5"/><rect x="${gx + 34 - Math.abs(k - 1.5) * 8}" y="${856 + k * 34}" width="14" height="14" rx="4" fill="#3a2a2a"/>`).join('')}
    <rect x="1060" y="1480" width="680" height="24" fill="#ffd27a" style="${VIB.glow('#ffb03a', 14)}"/>
    <g stroke="#ffffff" stroke-width="12" stroke-linecap="round" style="${VIB.glow('#ff2a2a', 12)}">${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => { const a = k * 0.785; return `<path d="M${1480 + Math.cos(a) * 50} ${860 + Math.sin(a) * 50} L${1480 + Math.cos(a) * 92} ${860 + Math.sin(a) * 92}"/>`; }).join('')}</g>
    ${hand(1120, 1250, -10, 1.0)}${hand(1700, 900, 14, 0.9)}${hand(1560, 1280, 8, 0.8)}
    <g stroke="#ff2a2a" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none" style="filter:drop-shadow(0 8px 0 rgba(0,0,0,.6))"><path d="M960 760 Q1060 700 1150 860"/><path d="M1150 860 l-74 -30 M1150 860 l4 -80"/></g>
    <g transform="translate(470,1330)" style="${sticker(dark ? '#ff3a2a' : '#2af0ff')}">${person(0, 0, 1.85, { eyes: 'wide', look: 0.9, mouth: 'o', sweat: true, seed: 1.7 })}</g>
    ${[[384, 1165], [592, 1165]].map(([x, y]) => `<path d="M${x} ${y} q-10 50 4 90" stroke="#bfefff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/>`).join('')}
    </g><rect width="1920" height="1920" fill="#ff0010" opacity="${dark ? 0.03 : 0.06}"/>${dark ? '<rect x="0" y="420" width="1920" height="1080" fill="url(#vig)" opacity=".7"/>' : ''}
    <defs><radialGradient id="redEdgeF" r="70%"><stop offset=".55" stop-color="#3a0008" stop-opacity="0"/><stop offset="1" stop-color="#3a0008" stop-opacity=".7"/></radialGradient></defs><rect x="0" y="420" width="1920" height="1080" fill="url(#redEdgeF)"/>
    ${VIB.words(p.words || [["IT'S", '#ffffff', 165], ['EMPTY', dark ? '#ff2a2a' : '#ffe23a', 225]], 60, 420)}`;
};

// Layout L3 "POV from behind": the lead seen from behind in the left foreground, phone torch beam crossing a dark
// moonlit hallway to the bedroom door, which stands open a crack on orange light: one red eye, a grin, grey fingers,
// feet in the light under the door, blood handprints on the wall. Cold blue-black + one warm light.
S.thumbFarmPOV = (t, d, p) => {
  const ink = K.ink, gx = 1290;
  const hand = (x, y, r, s = 1) => `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})" opacity=".9"><path d="M-30 40 Q-40 -6 -26 -24 L-26 -86 Q-20 -98 -12 -86 L-8 -34 L-2 -100 Q6 -112 14 -100 L12 -36 L24 -92 Q32 -102 40 -90 L32 -30 L46 -66 Q56 -74 60 -62 L44 0 Q40 40 10 52 Q-20 58 -30 40Z" fill="#a0000c"/><path d="M-20 52 q-4 40 2 70 M20 54 q2 30 -2 56" stroke="#a0000c" stroke-width="10" stroke-linecap="round"/></g>`;
  return `${VIB.bg('#010208', '#06101e', '#0e1a30')}
    ${[...Array(20)].map((_, i) => `<rect x="${i * 96}" y="420" width="48" height="900" fill="#0a1626" opacity=".7"/>`).join('')}
    <rect x="120" y="500" width="300" height="380" fill="#1a3050" stroke="#02040a" stroke-width="14"/><path d="M270 500 V880 M120 690 H420" stroke="#02040a" stroke-width="12"/>
    <path d="M140 520 L410 520 L900 1500 L-200 1500Z" fill="#9ac0ff" opacity=".07"/>
    <path d="M0 1320 H1920 V1500 H0Z" fill="#0a0e16"/>${[...Array(14)].map((_, i) => `<path d="M${1220 + (i - 7) * 40} 1320 L${1220 + (i - 7) * 220} 1500" stroke="#05070c" stroke-width="5"/>`).join('')}
    <rect x="1080" y="520" width="520" height="800" fill="#050204" stroke="#000" stroke-width="12"/>
    <defs><radialGradient id="povR" cx="30%" cy="45%" r="60%"><stop offset="0" stop-color="#ff6a1a"/><stop offset=".6" stop-color="#a01808" stop-opacity=".7"/><stop offset="1" stop-color="#1a0204" stop-opacity="0"/></radialGradient></defs>
    <rect x="1100" y="540" width="${gx - 1100}" height="780" fill="url(#povR)"/>
    <circle cx="${gx - 40}" cy="860" r="14" fill="#ff2a2a" style="${VIB.glow('#ff0000', 16)}"/><circle cx="${gx - 40}" cy="860" r="5" fill="#fff"/>
    <path d="M${gx - 90} 930 Q${gx - 30} 985 ${gx + 10} 930 Q${gx - 30} 958 ${gx - 90} 930Z" fill="#050004"/>${[-70, -50, -30, -10].map((dx) => `<path d="M${gx + dx} 936 v13" stroke="#f0ece0" stroke-width="6"/>`).join('')}
    <path d="M${gx} 540 L1580 560 L1580 1300 L${gx} 1320Z" fill="#3a2414" stroke="#000" stroke-width="10"/>
    <path d="M${gx + 40} 620 L1540 634 L1540 900 L${gx + 40} 900Z M${gx + 40} 960 L1540 960 L1540 1250 L${gx + 40} 1266Z" fill="none" stroke="#24160c" stroke-width="10"/>
    ${[0, 1, 2, 3].map((k) => `<rect x="${gx - 4}" y="${790 + k * 32}" width="${54 - Math.abs(k - 1.5) * 8}" height="24" rx="12" fill="#b8c2c2" stroke="#000" stroke-width="5"/><rect x="${gx + 32 - Math.abs(k - 1.5) * 8}" y="${795 + k * 32}" width="12" height="13" rx="4" fill="#3a2a2a"/>`).join('')}
    <rect x="1080" y="1308" width="520" height="22" fill="#ffb04a" style="${VIB.glow('#ff8a1a', 16)}"/><rect x="1190" y="1308" width="80" height="22" fill="#020101"/><rect x="1330" y="1308" width="80" height="22" fill="#020101"/>
    ${hand(1690, 760, 14, 1)}${hand(1000, 1000, -8, 0.85)}${hand(1700, 1130, 4, 0.75)}
    <path d="M740 1230 L1100 760 L1100 1300Z" fill="#e8f2ff" opacity=".12"/><circle cx="738" cy="1232" r="12" fill="#ffffff" style="filter:drop-shadow(0 0 12px #fff)"/>
    <g transform="translate(560,1000) scale(0.72)" style="filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 18px #6aa0ff)">
      <path d="M-150 520 L-140 150 Q-130 60 -40 40 L40 40 Q130 60 140 150 L150 520Z" fill="#2a3a5a" stroke="#000" stroke-width="8"/>
      <path d="M-90 50 Q0 150 90 50 Q60 130 0 140 Q-60 130 -90 50Z" fill="#22304c" stroke="#000" stroke-width="6"/>
      <path d="M-60 320 h120" stroke="#1a2440" stroke-width="8"/>
      <path d="M-128 170 Q-170 320 -150 470" stroke="#000" stroke-width="70" stroke-linecap="round" fill="none"/><path d="M-128 170 Q-170 320 -150 470" stroke="#2a3a5a" stroke-width="56" stroke-linecap="round" fill="none"/>
      <path d="M128 170 Q220 260 230 330" stroke="#000" stroke-width="70" stroke-linecap="round" fill="none"/><path d="M128 170 Q220 260 230 330" stroke="#2a3a5a" stroke-width="56" stroke-linecap="round" fill="none"/>
      <ellipse cx="236" cy="340" rx="28" ry="32" fill="#e8b890" stroke="#000" stroke-width="5"/><rect x="226" y="296" width="44" height="70" rx="8" fill="#0a0a12" stroke="#000" stroke-width="4"/>
      <path d="M-40 40 L-34 0 L34 0 L40 40Z" fill="#c8946c" stroke="#000" stroke-width="6"/>
      <circle cx="0" cy="-90" r="118" fill="#2a1a10" stroke="#000" stroke-width="8"/>
      <ellipse cx="-118" cy="-80" rx="18" ry="30" fill="#c8946c" stroke="#000" stroke-width="5"/><ellipse cx="118" cy="-80" rx="18" ry="30" fill="#c8946c" stroke="#000" stroke-width="5"/>
      <circle cx="0" cy="-90" r="112" fill="#2a1a10"/>
      <path d="M-70 -160 Q0 -200 70 -160" stroke="#5a3a24" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M-100 -10 L-80 30 L-60 0 L-40 36 L-20 4 L0 40 L20 4 L40 36 L60 0 L80 30 L100 -10" fill="#2a1a10" stroke="#000" stroke-width="6" stroke-linejoin="round"/></g>
    <rect x="0" y="420" width="1920" height="1080" fill="url(#vig)" opacity=".55"/>
    ${VIB.words(p.words || [["IT'S", '#ffffff', 165], ['EMPTY', '#ff8a2a', 225]], 60, 420)}`;
};

// Floor Thirteen thumbnail, clean (playbook pass): near-black, one red light. Left: the lead's frightened face, white
// sticker edge, lit red from the right. Right: steel elevator doors open a crack on red light; in the gap only a sliver
// of pale face, one red eye and a grin. The 13 glows above. Two words. No arrow, no blood, no full reveal.
S.thumbF13c = (t, d, p) => {
  const ink = K.ink, gap = 1440, gw = 120;
  return `<rect width="1920" height="1920" fill="#030203"/>
    <defs><radialGradient id="f13cR" cx="${gap / 1920}" cy=".52" r=".42"><stop offset="0" stop-color="#5a0610" stop-opacity=".9"/><stop offset="1" stop-color="#030203" stop-opacity="0"/></radialGradient>
      <linearGradient id="f13cDoor" x1="0" x2="1"><stop offset="0" stop-color="#1c1e22"/><stop offset=".85" stop-color="#2a2c32"/><stop offset="1" stop-color="#5a1418"/></linearGradient>
      <linearGradient id="f13cDoor2" x1="1" x2="0"><stop offset="0" stop-color="#1c1e22"/><stop offset=".85" stop-color="#2a2c32"/><stop offset="1" stop-color="#5a1418"/></linearGradient></defs>
    <rect width="1920" height="1920" fill="url(#f13cR)"/>
    <rect x="${gap - gw / 2}" y="640" width="${gw}" height="860" fill="#ff1a1a" style="${VIB.glow('#ff0000', 30)}"/>
    <rect x="${gap - gw / 2}" y="640" width="${gw}" height="860" fill="#7a0008"/>
    <path d="M${gap + 60} 800 Q${gap - 46} 820 ${gap - 40} 940 Q${gap - 30} 1050 ${gap + 60} 1062Z" fill="#d4dad6"/><path d="M${gap + 60} 750 Q${gap - 80} 770 ${gap - 64} 1000 L${gap - 56} 1260 L${gap - 36} 1260 Q${gap - 44} 980 ${gap - 26} 870 Q${gap} 812 ${gap + 60} 806Z" fill="#050304"/>
    <circle cx="${gap - 6}" cy="900" r="17" fill="#ff2a2a" style="${VIB.glow('#ff0000', 18)}"/><circle cx="${gap - 6}" cy="900" r="6" fill="#fff"/>
    <path d="M${gap - 36} 975 Q${gap + 10} 1015 ${gap + 60} 978 Q${gap + 10} 996 ${gap - 36} 975Z" fill="#050004"/>${[-24, -8, 8, 24, 40].map((dx) => `<path d="M${gap + dx} ${982 + Math.abs(dx - 8) * 0.12} v12" stroke="#f0ece0" stroke-width="6"/>`).join('')}
    <path d="M${gap - 160} 640 L${gap - 60} 640 L${gap - 60} 1500 L${gap - 180} 1500Z" fill="#14100e"/>
    <path d="M${gap + 50} 640 L${gap + 60} 640 L${gap + 60} 1500 L${gap + 50} 1500Z" fill="#14100e"/>
    <rect x="1000" y="640" width="${gap - gw / 2 - 1000}" height="860" fill="url(#f13cDoor)" stroke="${ink}" stroke-width="10"/>
    <rect x="${gap + gw / 2}" y="640" width="${1880 - gap - gw / 2}" height="860" fill="url(#f13cDoor2)" stroke="${ink}" stroke-width="10"/>
    <rect x="960" y="590" width="960" height="54" fill="#121316" stroke="${ink}" stroke-width="8"/>
    <g transform="translate(${gap},500)"><rect x="-150" y="-80" width="300" height="150" rx="16" fill="#0a0203" stroke="#2a0a0c" stroke-width="6"/>
      <text y="44" text-anchor="middle" font-family="Inter Display, Inter" font-weight="900" font-size="140" fill="#fff4f0" style="${VIB.glow('#ff0000', 22)}">13</text></g>
    <g transform="translate(470,1330)" style="filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 2px #fff) drop-shadow(0 0 16px #ff2a2a)">${person(0, 0, 1.85, { eyes: 'wide', look: 0.95, mouth: 'o', sweat: true, seed: 1.7 })}</g>
    <defs><radialGradient id="f13cFace" cx=".42" cy=".55" r=".3"><stop offset="0" stop-color="#ff1a1a" stop-opacity=".16"/><stop offset="1" stop-color="#ff1a1a" stop-opacity="0"/></radialGradient></defs><rect width="1920" height="1920" fill="url(#f13cFace)"/>
    ${VIB.words(p.words || [['NO 13TH', '#ffffff', 165], ['FLOOR', '#ff2a2a', 225]], 60, 420)}`;
};
