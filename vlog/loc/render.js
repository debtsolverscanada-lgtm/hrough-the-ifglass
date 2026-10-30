// Render each location tag in cards.json to vlog/loc/<slug>.webm (VP9 with alpha, 30 fps) plus the
// shared pop + chime sound pin.wav. usage: node vlog/loc/render.js [slug ...]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const cards = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards.json')));
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1100, height: 300 } });
  for (const slug of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(cards)) {
    const c = cards[slug], dir = path.join(__dirname, 'frames', slug);
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    await p.goto('file://' + path.join(__dirname, 'card.html') + `?name=${encodeURIComponent(c.name)}&sub=${encodeURIComponent(c.sub)}`);
    const dur = await p.evaluate(() => window.DUR);
    for (let i = 0; i < Math.round(dur * 30); i++) {
      await p.evaluate(t => window.frame(t), i / 30);
      await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.png`), omitBackground: true });
    }
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', path.join(dir, 'f%04d.png'), '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
      '-b:v', '0', '-crf', '28', '-auto-alt-ref', '0', path.join(__dirname, `${slug}.webm`)]);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(slug);
  }
  await b.close();
  // boop as the pin drops, a sparkly two-note chime as it lands
  const g = "aevalsrc='0.5*sin(2*PI*(700-500*t/0.14)*t)*exp(-8*t)':d=0.16:s=48000[a];" +
    "aevalsrc='0.35*(sin(2*PI*1568*t)+0.6*sin(2*PI*3136*t))*exp(-6*t)':d=0.9:s=48000,adelay=430[b];" +
    "aevalsrc='0.3*(sin(2*PI*2093*t)+0.5*sin(2*PI*4186*t))*exp(-5*t)':d=0.9:s=48000,adelay=560[c];" +
    "[a][b][c]amix=inputs=3:normalize=0,aecho=0.8:0.5:60:0.25,volume=1.4";
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-filter_complex', g, '-ac', '2', '-ar', '48000', path.join(__dirname, 'pin.wav')]);
})();
