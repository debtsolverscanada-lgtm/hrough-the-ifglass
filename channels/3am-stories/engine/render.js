// node render.js timeline.json OUTDIR short|long WORKER COUNT  -> OUTDIR/f00000.jpg ... (every COUNT-th frame from WORKER)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [tlFile, out, fmt, wk = '0', n = '1'] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(tlFile)); const FPS = 30;
const ROOT = path.resolve(__dirname, '../../..');  // photo paths in story.json are relative to the repo root
const dataUrl = (f) => (f.startsWith('data:') ? f : `data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(path.resolve(ROOT, f)).toString('base64'));
for (const s of TL) { if (s.p?.img) s.p.img = dataUrl(s.p.img); if (s.p?.imgs) s.p.imgs = s.p.imgs.map(dataUrl); }
const view = fmt === 'short' ? [480, 250, 960, 1707] : [0, 420, 1920, 1080];  // Shorts frame a little tighter
const size = fmt === 'short' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const total = Math.round(TL.reduce((m, s) => Math.max(m, s.start + s.dur), 0) * FPS);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: size });
  await p.goto('file://' + path.join(__dirname, 'engine.html')); await p.evaluate(() => window.ready);
  await p.evaluate(([tl, v]) => window.setup(tl, v), [TL, view]);
  for (let i = +wk; i < total; i += +n) {
    await p.evaluate(([T, k]) => window.frame(T, k), [i / FPS, i]);
    await p.screenshot({ path: path.join(out, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 });
  }
  await b.close();
})();
