// Renders the demo userscript in headless Chromium and saves README screenshots to docs/images.
// Usage: bun scripts/screenshots.js   (after a build; needs Playwright's Chromium)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const out = resolve(root, 'docs/images');
mkdirSync(out, { recursive: true });

const page = `<!doctype html><html><head><style>
  html,body{margin:0;height:100%;background:radial-gradient(1200px 700px at 30% 20%,#23232b,#121216);}
</style></head><body></body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 1000 }, deviceScaleFactor: 2 });
const pg = await ctx.newPage();
const errors = [];
pg.on('pageerror', (e) => errors.push(e.message));
await pg.setContent(page);
await pg.addScriptTag({ content: readFileSync(resolve(root, 'dist/odium-ui.user.js'), 'utf8') });
await pg.waitForTimeout(500);

// The demo keeps its UI instance private; grab it through the window host.
await pg.evaluate(() => {
  const ui = window.__odium;
  if (!ui) throw new Error('demo UI not exposed');
  ui.win.style.left = '170px';
  ui.win.style.top = '80px';
  ui.win.style.width = '760px';
  ui.win.style.height = '520px';
});

const shoot = async (name, extra = 0, extraH = 0) => {
  const r = await pg.evaluate(() => { const b = window.__odium.win.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
  const pad = 28;
  await pg.screenshot({ path: `${out}/${name}.png`, clip: { x: r.x - pad, y: r.y - pad, width: r.w + pad * 2 + extra, height: r.h + pad * 2 + extraH } });
};
const select = (name) => pg.evaluate((n) => { const ui = window.__odium; ui.selectTab(ui.tabs.find((t) => t.name === n)); }, name);

for (const [tab, file] of [['Main', 'main'], ['Inputs', 'inputs'], ['Display', 'display'], ['Layout', 'layout'], ['Settings', 'settings']]) {
  await select(tab);
  await pg.waitForTimeout(tab === 'Display' ? 2500 : 400);
  await shoot(file);
}

// Context menu
await select('Main');
const r = await pg.evaluate(() => { const b = window.__odium.win.getBoundingClientRect(); return { x: b.x + 240, y: b.y + 70 }; });
await pg.mouse.click(r.x, r.y, { button: 'right' });
await pg.waitForTimeout(300);
await shoot('context-menu', 0, 260);
await pg.keyboard.press('Escape');

await browser.close();
if (errors.length) { console.error('page errors:', errors); process.exit(1); }
console.log('screenshots written to docs/images');
