const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2];
const only = process.argv[3];
const SPH = '[role=img][aria-label^="Interactive unit sphere"]';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2, locale: 'fa-IR' });
  await ctx.addCookies([{ name: 'next-auth.session-token', value: fs.readFileSync('token.txt','utf8').trim(), domain: 'localhost', path: '/' }]);
  const p = await ctx.newPage();
  async function open(preset) {
    await p.goto('http://localhost:3847/lab?preset=' + preset, { waitUntil: 'networkidle', timeout: 180000 });
    await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
    const fa = p.getByRole('button', { name: '۱۲۳' });
    if (await fa.count()) await fa.first().click();
    await p.waitForTimeout(4000);
    const el = p.locator(SPH);
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1500);
    return el;
  }
  async function setRange(label, v) {
    await p.evaluate(([label, v]) => {
      const i = document.querySelector(`input[aria-label="${label}"]`);
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      set.call(i, String(v)); i.dispatchEvent(new Event('input', { bubbles: true }));
    }, [label, v]);
  }
  async function rotate(name, preset, n, dx, dy = 0, pre) {
    const dir = `${OUT}/${name}`; fs.mkdirSync(dir, { recursive: true });
    const el = await open(preset);
    if (pre) await pre();
    const bb = await el.boundingBox();
    const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2;
    await p.mouse.move(cx, cy); await p.mouse.down();
    for (let i = 0; i < n; i++) {
      await p.mouse.move(cx + dx * (i + 1), cy + dy * Math.sin(i / n * Math.PI * 2) * 20);
      await p.waitForTimeout(40);
      await el.screenshot({ path: `${dir}/${String(i).padStart(4,'0')}.png` });
    }
    await p.mouse.up();
    console.log(name, 'done');
  }
  async function sweep(name, preset, label, values, withMetrics) {
    const dir = `${OUT}/${name}`; fs.mkdirSync(dir, { recursive: true });
    const el = await open(preset);
    for (let i = 0; i < values.length; i++) {
      const f = `${dir}/${String(i).padStart(4,'0')}`;
      if (i > 0 && values[i] === values[i - 1]) {
        fs.copyFileSync(`${dir}/${String(i-1).padStart(4,'0')}.png`, f + '.png');
        if (withMetrics) fs.copyFileSync(`${dir}/${String(i-1).padStart(4,'0')}.json`, f + '.json');
        continue;
      }
      await setRange(label, values[i]);
      await p.waitForTimeout(120);
      await el.screenshot({ path: f + '.png' });
      if (withMetrics) {
        const vals = await p.evaluate(() => {
          const out = {};
          document.querySelectorAll('div').forEach(d => {
            if (d.children.length === 2 && d.children[0].className?.includes?.('text-[10px]')) out[d.children[0].textContent.trim()] = d.children[1].textContent.trim();
          });
          return out;
        });
        fs.writeFileSync(`${dir}/${String(i).padStart(4,'0')}.json`, JSON.stringify(vals));
      }
    }
    console.log(name, 'done');
  }
  const ramp = (a, b, n) => Array.from({ length: n }, (_, i) => Math.round(a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * i / (n - 1)))));
  const jobs = {
    circles: () => rotate('circles', 'circles', 120, -1.0),
    celestial: () => rotate('celestial', 'celestial', 120, -1.2),
    ecliptic: () => rotate('ecliptic', 'ecliptic', 100, 1.2, 1),
    smallsweep: () => sweep('smallsweep', 'circles', 'فاصلهٔ قطبی صغیره θ', [...ramp(35, 90, 45), ...ramp(90, 150, 30), ...ramp(150, 90, 30)].flatMap(v => [v, v])),
    triangle: () => rotate('triangle', 'triangle', 120, -1.0),
    trisweep: () => sweep('trisweep', 'triangle', 'عرض / میل رأس A', [...ramp(55, 88, 40), ...ramp(88, 10, 50), ...ramp(10, 55, 30)].flatMap(v => [v, v]), true),
    area: () => rotate('area', 'area', 120, 1.1),
    pzx: () => rotate('pzx', 'astro-tri', 150, -1.7),
    horizon: () => rotate('horizon', 'horizon', 100, -1.1),
    latsweep: () => sweep('latsweep', 'horizon', 'عرض ناظر φ', [...ramp(36, 90, 45), ...ramp(90, 0, 55), ...ramp(0, 36, 30)].flatMap(v => [v, v])),
  };
  for (const [k, f] of Object.entries(jobs)) if (!only || only.split(',').includes(k)) await f();
  await b.close();
})();
