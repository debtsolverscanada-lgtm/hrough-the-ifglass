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
  const skin = o.skin === 'url(#skinOld)' ? 'url(#k3old)' : o.skin && (o.skin.startsWith('#') || o.skin.startsWith('url(#k3')) ? o.skin : 'url(#k3skin)';
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
  const look = o.look || 0, eyes = o.eyes || 'normal', ink = AN.ink;
  const skin = o.skin && o.skin.startsWith('#') ? o.skin : AN.skin;
  const face = 'M-112 -30 Q-116 -150 0 -152 Q116 -150 112 -30 L106 34 Q94 92 44 138 L0 164 L-44 138 Q-94 92 -106 34Z';
  const id = ++ANID;
  if (o.back) return `<path d="M-50 110 L-54 200 L54 200 L50 110Z" fill="${AN.skinS}" stroke="${ink}" stroke-width="6"/>
    <path d="M-128 40 Q-150 -170 0 -176 Q150 -170 128 40 L110 20 L96 110 L70 60 L40 130 L10 70 L-20 132 L-48 66 L-76 116 L-96 40 L-114 90Z" fill="${AN.hair}" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-70 -140 Q0 -170 80 -130" stroke="${AN.hairH}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
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
  const hair = o.hair || `
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
    const base = o.body && !o.body.startsWith('url') ? o.body : '#23273d', shd = '#12131f', ink = AN.ink, rx = o.reach ? 230 : 150, ry = o.reach ? 300 : 430;
    const hand = (hx, hy) => `<g transform="translate(${hx},${hy})"><path d="M-24 -20 Q-30 20 -14 34 L20 34 Q32 10 24 -20Z" fill="${AN.skin}" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><path d="M-8 0 v26 M6 0 v28" stroke="${ink}" stroke-width="3"/></g>`;
    return `<g transform="translate(${x},${y + bob}) scale(${s})">
      <path d="M-130 150 Q-136 46 -44 36 L44 36 Q136 46 130 150 L148 520 L-148 520Z" fill="${base}" stroke="${ink}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M40 40 Q136 46 130 150 L148 520 L50 520 Q90 300 40 40Z" fill="${shd}"/>
      <path d="M-44 36 L0 120 L44 36" fill="#e8e6f0" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/><path d="M0 120 V520" stroke="${ink}" stroke-width="5"/>
      <path d="M-130 150 Q-110 120 -60 110" stroke="${AN.rim}" stroke-width="6" fill="none" opacity=".6"/>
      <path d="M-124 160 Q-180 300 -150 430" stroke="${ink}" stroke-width="72" stroke-linecap="round" fill="none"/><path d="M-124 160 Q-180 300 -150 430" stroke="${base}" stroke-width="58" stroke-linecap="round" fill="none"/>
      <path d="M124 160 Q180 300 ${rx} ${ry}" stroke="${ink}" stroke-width="72" stroke-linecap="round" fill="none"/><path d="M124 160 Q180 300 ${rx} ${ry}" stroke="${shd}" stroke-width="58" stroke-linecap="round" fill="none"/>
      ${hand(-150, 452)}${hand(rx, ry + 22)}
      ${head(0, -110, 1, o)}
    </g>`;
  }
  if (STYLE === '3d') {
    const tint = o.body && !o.body.startsWith('url') ? o.body : null, rx = o.reach ? 230 : 150, ry = o.reach ? 300 : 430;
    const fill = tint || 'url(#k3hood)', sl = tint || '#2e3a5e';
    const hand = (hx, hy) => `<g transform="translate(${hx},${hy})"><ellipse rx="32" ry="36" fill="${o.skin && o.skin.startsWith('url(#k3') ? o.skin : 'url(#k3skin)'}"/><path d="M-20 -6 q-4 24 6 30 M-4 -4 q-2 26 6 32 M12 -4 q0 26 6 28" stroke="#a8624a" stroke-width="4" fill="none" opacity=".7"/><ellipse cx="-8" cy="-14" rx="10" ry="6" fill="#fff" opacity=".35"/></g>`;
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
const FOCUS = { bed: 790, reflection: 960, face: 960, door: 800, nan: 1040, kitchen: 1000, morning: 960 };
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
  if (p.whip !== false && t < WHIP) cx += ((p._i || 0) % 2 ? -1 : 1) * 900 * Math.pow(1 - clamp(t / WHIP), 3);
  if (p.snap) {
    const sn = p.snap, k = eio((t - sn.at) / SNAP) - (sn.back != null ? eio((t - sn.back) / SNAP) : 0);
    cx += (sn.to[0] - cx) * k; cy += (sn.to[1] - cy) * k; z += ((sn.z || 2.2) - z) * k;
  }
  const hs = 1 + 3 * (p.shake || 0);  // handheld: slow breathing drift plus a little jitter when shaking
  cx += hs * (6 * Math.sin(t * 0.9) + (p.shake ? 5 * noise(Math.floor(t * 24)) : 0));
  cy += hs * (4 * Math.sin(t * 1.3 + 1) + (p.shake ? 5 * noise(Math.floor(t * 24) + 7) : 0));
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
  const drift = p.still ? 1 : 1 + (DEPTH() ? 0.08 : 0.04) * (t / Math.max(d, 1));
  CUR_T = t; CUR_DRIFT = drift; CUR_SCENE = name;
  const body = (S[name] || S.text)(t, d, p);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${view[2]}" height="${view[3]}" viewBox="${view.join(' ')}">${DEFS.replace('SEED', frameNo % 7)}
    ${STYLE === '3d' ? D3 : ''}
    ${STYLE === 'anime' ? '<defs><linearGradient id="anIris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1430"/><stop offset=".55" stop-color="#2a4aa8"/><stop offset="1" stop-color="#8ab4ff"/></linearGradient></defs>' : ''}
    ${STYLE === 'sketch' ? `<defs><filter id="boil" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="${Math.floor(frameNo / 3) % 6 + 1}"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
      <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".6 .015" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .9  0 0 0 0 .85  0 0 0 0 .75  0 0 0 .18 -.04"/></filter></defs>` : ''}
    ${camWrap(body, name, t, d, p, view, drift)}
    ${STYLE === 'sketch' ? '<rect width="1920" height="1920" filter="url(#paper)"/>' : ''}
    ${STYLE === 'anime' ? '<rect width="1920" height="1920" fill="#2030a0" opacity=".08"/>' : ''}
    <rect width="1920" height="1920" fill="url(#vig)"/>
    <rect width="1920" height="1920" fill="#fff" filter="url(#grain)" opacity=".55"/>
  </svg>`;
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

// your closet door from bed, open a crack. The gap widens over the scene (p.gap -> p.gapTo, 0..1); inside is black.
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
    <path d="M${X0} ${Y0} L${edge} ${Y0 - 20 * g} L${edge} ${Y1 + 20 * g} L${X0} ${Y1}Z" fill="#2c2620" stroke="#120e0a" stroke-width="10"/>
    <rect x="${X0 + 50}" y="${Y0 + 60}" width="${(edge - X0) - 100}" height="420" fill="none" stroke="#3a3228" stroke-width="8"/>
    <rect x="${X0 + 50}" y="${Y0 + 560}" width="${(edge - X0) - 100}" height="420" fill="none" stroke="#3a3228" stroke-width="8"/>
    <circle cx="${edge - 50 + shake}" cy="980" r="20" fill="#9a8a5a"/>
    ${fingers}
    <rect width="1920" height="1920" fill="#203060" opacity=".12"/>`;
};

// lonely farmhouse at night in snow, a dark forest behind, footprints coming out of the trees to the door, none going back.
// p.prints (0..1 how far the trail is drawn), p.smoke (chimney smoke), p.light (one window lit)
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
