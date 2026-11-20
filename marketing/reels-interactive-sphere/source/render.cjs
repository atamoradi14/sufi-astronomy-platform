// Renders [{out, html, transparent}] specs to 1080x1920 PNGs with Chromium (proper Persian shaping).
const { chromium } = require('playwright');
const fs = require('fs');
const specs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const css = fs.readFileSync(process.argv[3], 'utf8');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const s of specs) {
    await p.setContent(`<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><style>${css}</style></head><body class="${s.cls || ''}">${s.html}</body></html>`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(50);
    await p.screenshot({ path: s.out, omitBackground: !!s.transparent, clip: s.clip || { x: 0, y: 0, width: s.w || 1080, height: s.h || 1920 } });
  }
  await b.close();
  console.log('rendered', specs.length);
})();
