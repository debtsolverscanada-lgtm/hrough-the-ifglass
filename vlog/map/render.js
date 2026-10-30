// Render map.html frame by frame into vlog/map/map.mp4 (30 fps, with a jet fly-by sound).
// usage: node vlog/map/render.js
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(__dirname, 'frames');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf' };
const srv = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(0, async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT);
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`http://127.0.0.1:${srv.address().port}/map/map.html`); await p.evaluate(() => window.ready);
  const dur = await p.evaluate(() => window.DUR), n = Math.round(dur * 30);
  for (let i = 0; i < n; i++) {
    const png = await p.evaluate(t => window.frame(t), i / 30);
    fs.writeFileSync(path.join(OUT, `f${String(i).padStart(4, '0')}.png`), Buffer.from(png.split(',')[1], 'base64'));
  }
  await b.close(); srv.close();
  const jet = `anoisesrc=d=${dur}:c=brown:a=0.9,lowpass=f=900,highpass=f=60,volume='0.15+0.85*sin(PI*t/${dur})':eval=frame,afade=t=in:d=0.4,afade=t=out:st=${dur - 0.6}:d=0.6`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', path.join(OUT, 'f%04d.png'), '-f', 'lavfi', '-i', jet,
    '-vf', `rgbashift=rh=-12:bh=12:gv=3:enable='gt(t,${dur - 0.75})'`, '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-shortest', path.join(__dirname, 'map.mp4')]);
  console.log('map.mp4', n, 'frames');
});
