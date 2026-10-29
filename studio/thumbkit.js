// Thumbnail kit v2: rich lit scenes, big hero, extruded headline text, HUD badges.
const TK = {};
TK.defs = `<defs>
 <filter id="tkGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="tkSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
 <filter id="tkShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="10" flood-color="#000" flood-opacity=".7"/></filter>
 <radialGradient id="tkVig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".75"/></radialGradient>
</defs>`;
TK.rim = (inner, col, w = 26) => `<g filter="url(#tkShadow)"><g style="filter:drop-shadow(0 0 ${w}px ${col}) drop-shadow(0 0 ${w / 3}px ${col})">${inner}</g></g>`;
TK.text = (x, y, str, o = {}) => {
  const { size = 200, fill = '#FFD43B', rot = 0, anchor = 'start', ls = -2, depth = 12 } = o;
  const t = (dx, dy, f, s, sw) => `<text x="${dx}" y="${dy}" text-anchor="${anchor}" font-size="${size}" font-weight="900" letter-spacing="${ls}" fill="${f}" ${s ? `stroke="${s}" stroke-width="${sw}" stroke-linejoin="round"` : ''}>${str}</text>`;
  let ext = ''; for (let i = depth; i > 0; i -= 2) ext += t(0, i, '#0A0612', '#0A0612', size * .2);
  return `<g transform="translate(${x},${y}) rotate(${rot})" filter="url(#tkShadow)">${ext}${t(0, 0, '#0A0612', '#0A0612', size * .2)}${t(0, 0, fill)}
   <clipPath id="c${Math.round(x + y)}"><rect x="-2000" y="${-size * .95}" width="4000" height="${size * .42}"/></clipPath></g>`;
};
TK.badge = (x, y, label, value, col = '#7CF5FF', rot = 0) => {
  const w = Math.max(label.length * 26, value.length * 46) + 70;
  return `<g transform="translate(${x},${y}) rotate(${rot})" filter="url(#tkShadow)"><rect x="${-w / 2}" y="-70" width="${w}" height="140" rx="16" fill="#0B1026" fill-opacity=".85" stroke="${col}" stroke-width="6"/>
   <text y="-18" text-anchor="middle" font-size="40" font-weight="800" fill="${col}" letter-spacing="3">${label}</text><text y="46" text-anchor="middle" font-size="72" font-weight="900" fill="#fff">${value}</text></g>`;
};
TK.tag = (x, y, str, bg = '#FF3B3B', rot = -4) => `<g transform="translate(${x},${y}) rotate(${rot})" filter="url(#tkShadow)"><rect x="${-str.length * 19 - 30}" y="-48" width="${str.length * 38 + 60}" height="96" rx="14" fill="${bg}" stroke="#0A0612" stroke-width="8"/><text y="22" text-anchor="middle" font-size="62" font-weight="900" fill="#fff">${str}</text></g>`;
TK.rays = (x, y, col, n = 14, len = 1400, op = .18) => { let s = ''; for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n, b = a + .09; s += `<path d="M${x} ${y} L${x + Math.cos(a) * len} ${y + Math.sin(a) * len} L${x + Math.cos(b) * len} ${y + Math.sin(b) * len}Z" fill="${col}" opacity="${op}"/>`; } return s; };
TK.bokeh = (seed, cols, n = 40, ymax = 700) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${r() * 1920}" cy="${r() * ymax}" r="${6 + r() * 26}" fill="${cols[i % cols.length]}" opacity="${.15 + r() * .35}"/>`; return s; };
TK.glowBlob = (x, y, r, col, op = .8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#tkSoft)"/>`;
TK.skyline = (seed, y0, col, win, hmin = 200, hmax = 600, wmin = 80, wmax = 200) => {
  const r = rng(seed); let s = '', x = -50;
  while (x < 1980) { const w = wmin + r() * (wmax - wmin), h = hmin + r() * (hmax - hmin); s += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h + 400}" fill="${col}"/>`;
    if (win) for (let k = 0; k < 4; k++) s += `<rect x="${x + 10 + r() * (w - 30)}" y="${y0 - h + 20 + r() * (h - 40)}" width="${10 + r() * 10}" height="${8 + r() * 8}" fill="${win[k % win.length]}" opacity="${.5 + r() * .5}"/>`;
    x += w + 8 + r() * 20; }
  return s;
};
TK.wrap = (inner, bg = '#0B1026') => `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">${DEFS}${TK.defs}<rect width="1920" height="1080" fill="${bg}"/>${inner}<rect width="1920" height="1080" fill="url(#tkVig)"/></svg>`;
