// node render.js -> avatar.png (800x800) and banner.png (2560x1440) from art.html
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [mode, w, h] of [['avatar', 800, 800], ['banner', 2560, 1440]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + path.join(__dirname, 'art.html') + '?mode=' + mode);
    await p.evaluate(() => window.ready);
    await p.screenshot({ path: path.join(__dirname, `${mode}.png`) });
  }
  await b.close();
})();
