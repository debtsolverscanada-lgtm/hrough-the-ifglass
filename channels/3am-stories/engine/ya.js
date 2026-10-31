// YoutubeAfterLife scenes: documentary pieces (real-photo polaroids, counters, charts, timelines, a blurred phone post,
// a drama-news screen, the tombstone title) plus cartoon versions of the people in the story, drawn in the '3d' style.
// Photos arrive as data URLs (render.js converts the repo paths in story.json).
const YA = { ink: '#0d0718', purple: '#2a1458', deep: '#12082a', red: '#ff3a4a', gold: '#ffd86a', lilac: '#d8d0ff' };
const yaBg = (c1 = '#2a1458', c2 = '#0b0618') => `<defs><radialGradient id="yaBg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
  <rect width="1920" height="1920" fill="url(#yaBg)"/>${[...Array(40)].map((_, i) => `<circle cx="${(i * 733) % 1920}" cy="${420 + (i * 397) % 1080}" r="${1 + i % 3}" fill="#fff" opacity="${0.12 + (i % 5) / 14}"/>`).join('')}`;
const yaSrc = (txt) => txt ? `<text x="70" y="1460" font-family="Inter, sans-serif" font-size="26" fill="#fff" opacity=".7">Source: ${txt}</text>` : '';
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- people ----------
// Wolfie: tan skin, short dark hair (or a backwards cap), black tee, gold chain, little earrings.
function yaWolfie(x, y, s, o = {}) {
  const ink = '#2a160c';
  const hair = o.cap
    ? `<path d="M-130 -36 Q-134 -178 0 -182 Q134 -178 130 -36 Q64 -70 0 -72 Q-64 -70 -130 -36Z" fill="${o.cap === true ? '#e9e4da' : o.cap}"/>
       <path d="M-130 -36 Q-64 -70 0 -72 Q64 -70 130 -36" stroke="#000" stroke-width="5" fill="none" opacity=".25"/>
       <path d="M-46 -60 Q0 -100 46 -60 L46 -70 Q0 -112 -46 -70Z" fill="${o.hairCol || '#1a120c'}"/><path d="M-46 -62 Q0 -96 46 -62" stroke="#8a847a" stroke-width="6" fill="none"/>
       <path d="M-100 -150 Q-40 -176 30 -168" stroke="#fff" stroke-width="10" fill="none" opacity=".35" stroke-linecap="round"/>`
    : `<path d="M-126 -26 Q-138 -164 0 -170 Q138 -164 126 -26 Q118 -100 60 -118 Q0 -128 -60 -118 Q-118 -100 -126 -26Z" fill="${o.hairCol || '#17100b'}"/>
       <path d="M-70 -150 Q0 -166 70 -150" stroke="${o.hairHi || '#4a3626'}" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>`;
  const extra = (o.beard ? `<path d="M-112 10 Q-110 120 -50 160 Q0 186 50 160 Q110 120 112 10 Q100 90 60 110 Q0 96 -60 110 Q-100 90 -112 10Z" fill="${o.beard}"/>
      <path d="M-48 52 Q0 40 48 52 Q30 64 0 60 Q-30 64 -48 52Z" fill="${o.beard}"/>` : '')
    + (o.glasses ? `<g fill="none" stroke="#111" stroke-width="9"><circle cx="-48" cy="-10" r="50"/><circle cx="48" cy="-10" r="50"/><path d="M-2 -14 h4 M-98 -16 l-26 -6 M98 -16 l26 -6"/></g>` : '');
  return `<g>${person(x, y, s, { ...o, body: o.body || '#24242c', skin: o.skinT || 'url(#k3tan)', ear: o.earT || 'url(#k3earTan)', neck: o.neckT || '#9a6440', hair: hair + extra })}
    <g transform="translate(${x},${y}) scale(${s})">
      ${o.chain === false ? '' : '<path d="M-58 70 Q0 150 58 70" stroke="#f0c040" stroke-width="9" fill="none"/><path d="M-58 70 Q0 150 58 70" stroke="#fff3b0" stroke-width="3" fill="none" stroke-dasharray="6 8"/>'}
      ${o.earrings === false ? '' : '<circle cx="-124" cy="-76" r="8" fill="#fff6d0"/><circle cx="124" cy="-76" r="8" fill="#fff6d0"/>'}
    </g></g>`;
}
// Sylvia: fair skin, long wavy blonde hair, lashes, light top. o.bump: pregnant.
function yaSylvia(x, y, s, o = {}) {
  const back = `<g transform="translate(${x},${y + (o.breathe ? Math.sin(o.breathe) * 3 : 0)}) scale(${s})">
      <path d="M-150 -260 Q-210 -40 -200 200 Q-150 260 -90 220 L90 220 Q150 260 200 200 Q210 -40 150 -260 Q0 -360 -150 -260Z" fill="url(#yaBlonde)"/>
      ${[...Array(8)].map((_, k) => `<path d="M${-170 + k * 48} -120 q${k % 2 ? 20 : -20} 150 ${k % 2 ? -10 : 10} 320" stroke="#c89a50" stroke-width="5" fill="none" opacity=".5"/>`).join('')}
    </g>`;
  const front = `<path d="M-134 10 Q-156 -176 0 -180 Q156 -176 134 10 Q124 -90 50 -126 Q-20 -96 -70 -60 Q-112 -32 -134 10Z" fill="url(#yaBlonde)"/>
    <path d="M-60 -150 Q10 -178 80 -150" stroke="#fff4c8" stroke-width="12" fill="none" opacity=".6" stroke-linecap="round"/>
    <path d="M-128 0 Q-158 140 -132 300 Q-112 250 -110 120Z M128 0 Q158 140 132 300 Q112 250 110 120Z" fill="url(#yaBlonde)"/>
    <path d="M-92 -38 l-14 -10 M-88 -48 l-10 -14 M92 -38 l14 -10 M88 -48 l10 -14" stroke="#2a160c" stroke-width="4" stroke-linecap="round"/>`;
  const bump = o.bump ? `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="10" cy="350" rx="${130 * o.bump}" ry="${120 * o.bump}" fill="${o.top || '#efe6dc'}"/>
      <ellipse cx="-30" cy="320" rx="${60 * o.bump}" ry="${40 * o.bump}" fill="#fff" opacity=".35"/><ellipse cx="40" cy="390" rx="${90 * o.bump}" ry="${50 * o.bump}" fill="#000" opacity=".08"/></g>` : '';
  const hc = o.hairCols || ['#f6dc9a', '#d9b06a', '#a87a3c'];
  return `<defs><linearGradient id="yaBlonde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hc[0]}"/><stop offset=".6" stop-color="${hc[1]}"/><stop offset="1" stop-color="${hc[2]}"/></linearGradient></defs>
    ${back}${person(x, y, s, { ...o, body: o.top || '#efe6dc', skin: o.skinT || 'url(#k3fair)', neck: o.neckT || '#d8a088', hair: front })}${bump}`;
}

// ---------- scenes ----------
// title: tombstone with a halo, the creator's name carved in. p: name, years, sub
S.yaTitle = (t, d, p) => {
  const a = ease(t / 1.2), hz = Math.sin(t * 2) * 6;
  return `${yaBg()}
    <path d="M0 1260 Q600 1180 960 1210 Q1400 1180 1920 1250 V1920 H0Z" fill="#132a1e"/>
    <circle cx="1560" cy="640" r="110" fill="#fff6d8" opacity=".9"/>
    <g transform="translate(960,${1290 - 20 * a}) scale(${0.78 + 0.08 * a})">
      <circle cy="-300" r="420" fill="#8a5aff" opacity=".18" filter="url(#blur)"/>
      <path d="M190 -480 L190 0 L230 0 L230 -420 Q230 -560 120 -600Z" fill="#2a2b38"/>
      <path d="M-200 0 L-200 -420 Q-200 -620 0 -620 Q200 -620 200 -420 L200 0Z" fill="#a9acbd"/>
      <path d="M-200 -420 Q-200 -620 0 -620 Q200 -620 200 -420" stroke="#e8eaf4" stroke-width="8" fill="none"/>
      <text y="-400" text-anchor="middle" font-family="Anton" font-size="${fit(p.name, 120, 0.2)}" fill="#3a3c4c" letter-spacing="3">${esc(p.name)}</text>
      <text y="-310" text-anchor="middle" font-family="Anton" font-size="56" fill="#4a4c5e" letter-spacing="4">${esc(p.years || '')}</text>
      <path d="M-40 -250 L60 -190 L-40 -130Z" fill="${YA.red}" opacity=".85"/>
      <ellipse cy="${-700 + hz}" rx="170" ry="40" fill="none" stroke="#ffe08a" stroke-width="20" style="filter:drop-shadow(0 0 20px #ffb830)"/>
      <ellipse cy="${-700 + hz}" rx="170" ry="40" fill="none" stroke="#fff6cf" stroke-width="6"/>
    </g>
    ${p.sub ? `<text x="960" y="1400" text-anchor="middle" font-family="Anton" font-size="84" fill="#fff" letter-spacing="6" opacity="${ease((t - 0.8) / 0.8)}" style="filter:drop-shadow(0 6px 0 #000)">${esc(p.sub)}</text>` : ''}`;
};
// one real photo as a taped polaroid over a blurred copy of itself. p: img, cap, src, tilt, crop ('left'|'right'|'center')
S.yaPhoto = (t, d, p) => {
  const z = 1 + 0.07 * (t / d), tilt = p.tilt ?? -3, a = ease(t / 0.5);
  const pa = p.crop === 'left' ? 'xMinYMid slice' : p.crop === 'right' ? 'xMaxYMid slice' : 'xMidYMid slice';
  return `<defs><filter id="yaBlur"><feGaussianBlur stdDeviation="40"/></filter><clipPath id="yaPc"><rect x="-480" y="-270" width="960" height="540"/></clipPath></defs>
    <image href="${p.img}" x="-100" y="300" width="2120" height="1320" preserveAspectRatio="xMidYMid slice" filter="url(#yaBlur)" opacity=".55"/>
    <rect width="1920" height="1920" fill="#120826" opacity=".55"/>
    <g transform="translate(960,${900 + 30 * (1 - a)}) rotate(${tilt}) scale(${0.96 + 0.04 * a})" opacity="${a}">
      <rect x="-520" y="-310" width="1040" height="720" fill="#f6f2ea" style="filter:drop-shadow(0 20px 30px rgba(0,0,0,.6))"/>
      <g clip-path="url(#yaPc)"><image href="${p.img}" x="${-480 * z}" y="${-270 * z}" width="${960 * z}" height="${540 * z}" preserveAspectRatio="${pa}"/></g>
      <rect x="-90" y="-336" width="180" height="50" fill="#f3e7b8" opacity=".85" transform="rotate(${-tilt * 1.5})"/>
      ${p.cap ? `<text y="350" text-anchor="middle" font-family="Marker" font-size="${fit(p.cap, 52, 0.5)}" fill="#2a2030">${esc(p.cap)}</text>` : ''}
    </g>
    ${yaSrc(p.src)}`;
};
// several photos landing one after another. p: imgs, caps, src
S.yaPhotos = (t, d, p) => {
  const n = p.imgs.length, spots = [[560, 760, -6], [1360, 760, 5], [960, 1130, -2], [600, 1140, 4], [1320, 1140, -4]];
  return `${yaBg('#24124a', '#0a0616')}<defs>${p.imgs.map((_, i) => `<clipPath id="yaPs${i}"><rect x="-300" y="-169" width="600" height="338"/></clipPath>`).join('')}</defs>
    ${p.imgs.map((img, i) => {
      const at = (d * 0.8) * i / n, a = ease((t - at) / 0.4); if (a <= 0) return '';
      const [x, y, r] = spots[i % spots.length];
      return `<g transform="translate(${x},${y}) rotate(${r}) scale(${1.25 - 0.25 * a})" opacity="${a}">
        <rect x="-324" y="-193" width="648" height="${p.caps ? 446 : 400}" fill="#f6f2ea" style="filter:drop-shadow(0 16px 24px rgba(0,0,0,.6))"/>
        <g clip-path="url(#yaPs${i})"><image href="${img}" x="-300" y="-169" width="600" height="338" preserveAspectRatio="xMidYMid slice"/></g>
        ${p.caps ? `<text y="222" text-anchor="middle" font-family="Marker" font-size="${fit(p.caps[i], 40, 0.3)}" fill="#2a2030">${esc(p.caps[i])}</text>` : ''}</g>`;
    }).join('')}
    ${yaSrc(p.src)}`;
};
// subscriber counter. p: from, to, label, mode ('rise' | 'freeze' | 'drop')
S.yaCounter = (t, d, p) => {
  const k = p.mode === 'freeze' ? 1 : ease(t / (d * 0.75)), v = Math.round(p.from + (p.to - p.from) * k);
  const shake = p.mode === 'freeze' && Math.floor(t * 6) % 4 === 0 ? 4 : 0;
  const col = p.mode === 'freeze' ? '#9aa0b8' : p.mode === 'drop' ? YA.red : '#fff';
  const pts = [...Array(40)].map((_, i) => { const u = i / 39, h = p.mode === 'rise' ? Math.pow(u, 1.6) : p.mode === 'drop' ? 1 - 0.25 * Math.max(0, u - 0.4) : Math.min(1, u * 1.6) - 0.04 * Math.max(0, u - 0.6);
    return `${460 + u * 1000},${1360 - h * 220}`; });
  const shown = Math.max(2, Math.round(pts.length * Math.min(1, t / (d * 0.75))));
  return `${yaBg()}
    <text x="${960 + shake}" y="860" text-anchor="middle" font-family="Anton" font-size="230" fill="${col}" letter-spacing="6" style="filter:drop-shadow(0 8px 0 #000)">${v.toLocaleString('en-US')}</text>
    <text x="960" y="950" text-anchor="middle" font-family="Anton" font-size="60" fill="${YA.lilac}" letter-spacing="10">${esc(p.label || 'SUBSCRIBERS')}</text>
    <polyline points="${pts.slice(0, shown).join(' ')}" fill="none" stroke="${p.mode === 'drop' ? YA.red : YA.gold}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M460 1360 H1460" stroke="#fff" stroke-width="3" opacity=".3"/>
    ${p.mode === 'freeze' ? `<text x="960" y="560" text-anchor="middle" font-family="Anton" font-size="70" fill="${YA.red}" letter-spacing="8" opacity="${0.6 + 0.4 * Math.sin(t * 5)}">FROZEN</text>` : ''}
    ${yaSrc(p.src)}`;
};
// horizontal bar chart. p: title, bars [[label, value, unit]], src
S.yaChart = (t, d, p) => {
  const max = Math.max(...p.bars.map((b) => b[1])), n = p.bars.length, rowH = Math.min(150, 860 / n);
  return `${yaBg()}
    <text x="960" y="560" text-anchor="middle" font-family="Anton" font-size="78" fill="#fff" letter-spacing="4">${esc(p.title)}</text>
    ${p.bars.map((b, i) => {
      const y = 640 + i * rowH, a = ease((t - i * 0.35) / 0.8), w = 900 * (b[1] / max) * a, hot = i === p.hi;
      return `<text x="760" y="${y + rowH * 0.55}" text-anchor="end" font-family="Anton" font-size="${Math.min(46, rowH * 0.36)}" fill="${hot ? YA.gold : YA.lilac}">${esc(b[0])}</text>
        <rect x="790" y="${y + rowH * 0.18}" width="${Math.max(4, w)}" height="${rowH * 0.56}" rx="10" fill="${hot ? YA.red : '#8a6aff'}"/>
        <text x="${810 + w}" y="${y + rowH * 0.58}" font-family="Anton" font-size="${Math.min(44, rowH * 0.34)}" fill="#fff" opacity="${a}">${esc(b[2] || '')}</text>`;
    }).join('')}
    ${yaSrc(p.src)}`;
};
// timeline with dated stops. p: items [[date, label]], hi (index lit up)
S.yaTimeline = (t, d, p) => {
  const n = p.items.length, x0 = 220, x1 = 1700, a = ease(t / 1.2);
  return `${yaBg()}
    <path d="M${x0} 960 H${x0 + (x1 - x0) * a}" stroke="#fff" stroke-width="8" opacity=".5"/>
    ${p.items.map(([date, label], i) => {
      const x = x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)), on = i === p.hi, vis = ease((t - 0.2 - i * 0.25) / 0.4);
      return `<g opacity="${vis * (on || p.hi === undefined ? 1 : 0.45)}">
        <circle cx="${x}" cy="960" r="${on ? 30 : 18}" fill="${on ? YA.red : YA.gold}" ${on ? 'style="filter:drop-shadow(0 0 16px #ff3a4a)"' : ''}/>
        <text x="${x}" y="${i % 2 ? 1080 : 880}" text-anchor="middle" font-family="Anton" font-size="${on ? 58 : 46}" fill="#fff">${esc(date)}</text>
        <text x="${x}" y="${i % 2 ? 1140 : 820}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="${on ? 34 : 28}" fill="${YA.lilac}">${esc(label)}</text></g>`;
    }).join('')}`;
};
// phone with a blurred social post: no names, no faces. p: contact (shown), msgs [[side, text]], stamp
S.yaPost = (t, d, p) => {
  const msgs = (p.msgs || []).filter((_, i) => t > 0.5 + i * 0.9);
  return `${yaBg('#1c0f38', '#06040c')}
    <defs><filter id="yaPb"><feGaussianBlur stdDeviation="14"/></filter></defs>
    <rect x="620" y="440" width="680" height="1020" rx="70" fill="#0c0c12" stroke="#2c2c3a" stroke-width="12"/>
    <rect x="648" y="470" width="624" height="960" rx="48" fill="#141420"/>
    <circle cx="730" cy="560" r="40" fill="#8a7aa8" filter="url(#yaPb)"/>
    <text x="790" y="572" font-family="Inter, sans-serif" font-weight="800" font-size="40" fill="#fff">${esc(p.contact || '')}</text>
    ${p.photo ? `<rect x="690" y="640" width="540" height="420" rx="20" fill="#3a2a50" filter="url(#yaPb)"/><circle cx="960" cy="800" r="90" fill="#6a5a80" filter="url(#yaPb)"/><path d="M820 1040 Q960 880 1100 1040Z" fill="#6a5a80" filter="url(#yaPb)"/>` : ''}
    ${msgs.map(([side, txt], i) => { const y = (p.photo ? 1100 : 660) + i * 120, r = side === 'me';
      return `<rect x="${r ? 860 : 690}" y="${y}" width="370" height="90" rx="40" fill="${r ? '#3a7aff' : '#2c2c3c'}"/>
        <rect x="${r ? 890 : 720}" y="${y + 30}" width="${200 + (i * 53) % 110}" height="28" rx="14" fill="#fff" opacity=".6" filter="url(#yaPb)"/>`; }).join('')}
    ${p.stamp ? `<g transform="translate(1380,760) rotate(-14)" opacity="${ease((t - 0.8) / 0.4)}"><rect x="-230" y="-70" width="460" height="140" rx="12" fill="none" stroke="${YA.red}" stroke-width="12"/>
      <text y="34" text-anchor="middle" font-family="Anton" font-size="96" fill="${YA.red}" letter-spacing="8">${esc(p.stamp)}</text></g>` : ''}`;
};
// generic drama news screen (no real logos). p: headline, ticker
S.yaNews = (t, d, p) => `${yaBg('#2a0a14', '#08040a')}
    <rect x="260" y="470" width="1400" height="800" rx="30" fill="#0c0c14" stroke="#30303c" stroke-width="16"/>
    <rect x="290" y="500" width="1340" height="740" fill="#1a1030"/>
    <rect x="290" y="500" width="1340" height="740" fill="url(#yaBg)" opacity=".4"/>
    <rect x="290" y="${520}" width="330" height="80" fill="${YA.red}"/><text x="455" y="578" text-anchor="middle" font-family="Anton" font-size="52" fill="#fff" letter-spacing="4" opacity="${0.6 + 0.4 * Math.sin(t * 6)}">BREAKING</text>
    <text x="960" y="860" text-anchor="middle" font-family="Anton" font-size="${fit(p.headline, 110, 0.6)}" fill="#fff" style="filter:drop-shadow(0 6px 0 #000)">${esc(p.headline)}</text>
    <rect x="290" y="1160" width="1340" height="80" fill="#000" opacity=".8"/>
    <text x="${1640 - ((t * 260) % 2600)}" y="1214" font-family="Inter, sans-serif" font-weight="800" font-size="40" fill="${YA.gold}">${esc((p.ticker || '') + '   •   ' + (p.ticker || ''))}</text>`;
// big text card. p: text (| = new line), sub, color
S.yaCard = (t, d, p) => {
  const lines = String(p.text).split('|'), a = ease(t / 0.5);
  return `${yaBg()}
    ${lines.map((ln, i) => `<text x="960" y="${930 + (i - (lines.length - 1) / 2) * 170}" text-anchor="middle" font-family="Anton" font-size="${fit(ln, p.size || 150, 0.8)}" fill="${p.color || '#fff'}" letter-spacing="4" opacity="${a}" style="filter:drop-shadow(0 8px 0 #000)">${esc(ln)}</text>`).join('')}
    ${p.sub ? `<text x="960" y="${1110 + (lines.length - 1) * 85}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="${fit(p.sub, 46, 0.8)}" fill="${YA.lilac}" opacity="${ease((t - 0.5) / 0.5)}">${esc(p.sub)}</text>` : ''}
    ${yaSrc(p.src)}`;
};
// the cartoon couple in a room. p: mood ('happy'|'apart'|'sad'|'calm'), bump, icecream, cam (prank camera), rain
S.yaCouple = (t, d, p) => {
  const m = p.mood || 'happy', b = t * 2, apart = m === 'apart' ? 1 : 0;
  const wx = 760 - 220 * apart, sx = 1180 + 220 * apart;
  const P = p.pair === 'ek' ? YA_EK : { man: {}, woman: {} };
  const wEyes = m === 'sad' || m === 'apart' ? 'tired' : m === 'shock' ? 'wide' : 'normal';
  return `${room('#1a1428')}
    ${p.rain ? `<rect x="1300" y="560" width="360" height="460" fill="#203050" stroke="#0a0a14" stroke-width="16"/>${[...Array(18)].map((_, k) => `<path d="M${1310 + (k * 37) % 340} ${560 + ((t * 600 + k * 97) % 460)} l-6 30" stroke="#9ab8ff" stroke-width="3" opacity=".6"/>`).join('')}` : ''}
    ${p.couch !== false ? `<rect x="420" y="1180" width="1080" height="200" rx="60" fill="#5a3a6a"/><rect x="380" y="1100" width="140" height="300" rx="60" fill="#4a2e5a"/><rect x="1400" y="1100" width="140" height="300" rx="60" fill="#4a2e5a"/>` : ''}
    ${p.only !== 'sylvia' ? yaWolfie(wx, 900, 0.95, { ...P.man, eyes: wEyes, look: apart ? -0.6 : 0.6, breathe: b, cap: p.cap ?? (p.pair === 'ek' ? false : true), happy: m === 'happy' ? 0.5 : 0, mouth: m === 'shock' ? 'o' : undefined }) : ''}
    ${p.only !== 'wolfie' ? yaSylvia(sx, 910, 0.92, { ...P.woman, eyes: m === 'sad' || m === 'apart' ? 'tired' : m === 'shock' ? 'wide' : 'normal', look: apart ? 0.6 : -0.6, breathe: b + 1, bump: p.bump || 0, happy: m === 'happy' ? 0.45 : 0 }) : ''}
    ${p.icecream ? `<g transform="translate(${wx - 170},1010)"><rect x="-60" y="-70" width="120" height="140" rx="16" fill="#f4f0ff" stroke="#8a7ab0" stroke-width="6"/><ellipse cy="-70" rx="60" ry="18" fill="#ffb8d0"/><text y="20" text-anchor="middle" font-family="Anton" font-size="34" fill="#8a3a6a">ICE CREAM</text></g>` : ''}
    ${p.cam ? `<g transform="translate(${wx - 230},880) rotate(-8)"><rect x="-70" y="-46" width="140" height="92" rx="14" fill="#1c1c28"/><circle r="32" fill="#0a0a14" stroke="#6a6aa0" stroke-width="7"/><circle cx="46" cy="-28" r="9" fill="${YA.red}" opacity="${0.5 + 0.5 * Math.sin(t * 6)}"/></g>` : ''}
    ${p.crack ? `<path d="M960 420 L920 700 L1010 860 L940 1100 L990 1500" stroke="#fff" stroke-width="8" fill="none" opacity="${ease(t / 0.3)}"/><path d="M920 700 L780 760 M1010 860 L1180 900 M940 1100 L800 1180" stroke="#fff" stroke-width="5" fill="none" opacity="${ease(t / 0.3)}"/>` : ''}`;
};
// Ethan & Hila presets for the same two figures: grey hair and beard, glasses, big black tee; long dark hair.
const YA_EK = { man: { cap: false, hairCol: '#8a8a8e', hairHi: '#c8c8cc', beard: '#7a7a80', glasses: true, skinT: 'url(#k3skin)', earT: 'url(#k3ear)', neckT: '#d8a088', body: '#18181e', chain: false, earrings: false },
  woman: { hairCols: ['#4a3022', '#2a1810', '#140a06'], skinT: 'url(#k3skin)', top: '#2a2a34' } };
// Wolfie alone. p: prop ('phone'|'mic'|'sign'), eyes, sign
S.yaWolfie = (t, d, p) => `${room('#141024')}
    ${yaWolfie(960, 900, 1.05, { ...(p.pair === 'ek' ? YA_EK.man : {}), eyes: p.eyes || 'normal', look: p.look ?? 0, breathe: t * 2, cap: p.cap ?? (p.pair === 'ek' ? false : true), glow: p.prop === 'phone' ? 'phoneGlow' : null, light: p.prop === 'phone' ? '#9fd2ff' : null, mouth: p.mouth })}
    ${p.prop === 'phone' ? `<g transform="translate(1110,1170) rotate(-10)"><rect x="-50" y="-90" width="100" height="180" rx="16" fill="#0c0c0c" stroke="#d8eeff" stroke-width="5"/><rect x="-40" y="-78" width="80" height="150" rx="8" fill="#dff1ff"/></g>` : ''}
    ${p.prop === 'mic' ? `<g transform="translate(1180,960)"><rect x="-12" y="0" width="24" height="380" fill="#2a2a34"/><rect x="-46" y="-110" width="92" height="140" rx="46" fill="#3a3a48"/>${[...Array(5)].map((_, k) => `<path d="M-40 ${-90 + k * 22} H40" stroke="#5a5a6a" stroke-width="4"/>`).join('')}</g>
      <text x="1400" y="${700 - (t * 40) % 120}" font-family="Anton" font-size="90" fill="${YA.gold}" opacity=".8">♪</text><text x="1500" y="${820 - (t * 50) % 140}" font-family="Anton" font-size="70" fill="${YA.lilac}" opacity=".7">♫</text>` : ''}`;

// thumbnail: real photo on the left, the cartoon tombstone on the right, big question. p: img, title, sub, crop
S.yaThumb = (t, d, p) => `${yaBg('#3a1670', '#0b0618')}
    <defs><clipPath id="yaTc"><rect x="-430" y="-300" width="860" height="600"/></clipPath></defs>
    <g transform="translate(560,1000) rotate(-5)">
      <rect x="-460" y="-330" width="920" height="720" fill="#f6f2ea" style="filter:drop-shadow(0 20px 30px rgba(0,0,0,.7))"/>
      <g clip-path="url(#yaTc)"><image href="${p.img}" x="-430" y="-300" width="860" height="600" preserveAspectRatio="${p.crop === 'left' ? 'xMinYMid' : p.crop === 'right' ? 'xMaxYMid' : 'xMidYMid'} slice"/></g>
      <text y="360" text-anchor="middle" font-family="Marker" font-size="56" fill="#2a2030">${esc(p.cap || '')}</text>
    </g>
    <g transform="translate(1520,1500) scale(.7)">
      <path d="M-200 0 L-200 -420 Q-200 -620 0 -620 Q200 -620 200 -420 L200 0Z" fill="#a9acbd" style="filter:drop-shadow(0 20px 20px rgba(0,0,0,.6))"/>
      <text y="-420" text-anchor="middle" font-family="Anton" font-size="${fit(p.name || '', 110, 0.18)}" fill="#3a3c4c">${esc(p.name || '')}</text>
      <text y="-330" text-anchor="middle" font-family="Anton" font-size="56" fill="#4a4c5e">${esc(p.years || '')}</text>
      <ellipse cy="-700" rx="170" ry="40" fill="none" stroke="#ffe08a" stroke-width="20" style="filter:drop-shadow(0 0 20px #ffb830)"/>
    </g>
    <text x="1440" y="600" text-anchor="middle" font-family="Anton" font-size="${fit(p.title, 170, 0.5)}" fill="#fff" letter-spacing="2" style="filter:drop-shadow(0 8px 0 #000)">${esc(p.title)}</text>
    <text x="1440" y="760" text-anchor="middle" font-family="Anton" font-size="${fit(p.sub || '', 170, 0.5)}" fill="${YA.red}" letter-spacing="2" style="filter:drop-shadow(0 8px 0 #000)">${esc(p.sub || '')}</text>`;
