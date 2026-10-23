// Runs after Parcel. Produces the two final files in dist/:
//   dist/odium-ui.js       plain JS (library only, exposes window.UI / window.OdiumUI)
//   dist/odium-ui.user.js  userscript (library + src/userscript/main.js) with a metadata header
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));
const cfg = JSON.parse(read('userscript.config.json'));

// A local image path for @icon is embedded as a data: URI so the script needs no hosting.
if (cfg.icon && !/^(https?:|data:)/i.test(cfg.icon) && existsSync(resolve(root, cfg.icon))) {
  const ext = cfg.icon.split('.').pop().toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  cfg.icon = `data:${mime};base64,${readFileSync(resolve(root, cfg.icon)).toString('base64')}`;
}

const buildHeader = (meta) => {
  const { name, namespace, ...rest } = meta;
  // conventional order: name, namespace, version, then everything else
  const entries = Object.entries({ name, namespace, version: pkg.version, ...rest }).filter(([, v]) => v != null && v !== false);
  const pad = Math.max(...entries.map(([k]) => k.length)) + 1;
  const lines = [];
  for (const [key, val] of entries) {
    if (val === true) { lines.push(`// @${key}`); continue; }
    for (const v of [].concat(val)) lines.push(`// @${key.padEnd(pad)} ${v}`);
  }
  return ['// ==UserScript==', ...lines, '// ==/UserScript=='].join('\n') + '\n\n';
};

const lib = 'dist/.lib/index.js';
const usr = 'dist/.userscript/main.js';
if (!existsSync(resolve(root, lib)) || !existsSync(resolve(root, usr))) {
  console.error('Parcel output missing. Run "npm run build" instead of calling this script directly.');
  process.exit(1);
}

writeFileSync(resolve(root, 'dist/odium-ui.js'), read(lib));
writeFileSync(resolve(root, 'dist/odium-ui.user.js'), buildHeader(cfg) + read(usr));
rmSync(resolve(root, 'dist/.lib'), { recursive: true, force: true });
rmSync(resolve(root, 'dist/.userscript'), { recursive: true, force: true });
console.log('Built dist/odium-ui.js and dist/odium-ui.user.js');
