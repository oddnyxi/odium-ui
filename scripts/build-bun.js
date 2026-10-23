// Same output as `npm run build`, using Bun's bundler instead of Parcel (no npm install needed).
//   bun scripts/build-bun.js             minified
//   bun scripts/build-bun.js --readable  unminified
import { readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const minify = !process.argv.includes('--readable');

// Parcel's "bundle-text:" scheme: inline a CSS file (following @import) as a string.
const inlineCss = (file) =>
  readFileSync(file, 'utf8').replace(/@import\s+["'](.+?)["'];?/g, (_, p) => inlineCss(resolve(dirname(file), p)));
const bundleText = {
  name: 'bundle-text',
  setup(build) {
    build.onResolve({ filter: /^bundle-text:/ }, (a) => ({ path: resolve(dirname(a.importer), a.path.slice(12)), namespace: 'bundle-text' }));
    build.onLoad({ filter: /.*/, namespace: 'bundle-text' }, (a) => ({ contents: `export default ${JSON.stringify(inlineCss(a.path))};`, loader: 'js' }));
  },
};

rmSync(resolve(root, 'dist'), { recursive: true, force: true });
for (const [entry, outdir] of [['src/index.js', 'dist/.lib'], ['src/userscript/main.js', 'dist/.userscript']]) {
  const out = await Bun.build({ entrypoints: [resolve(root, entry)], outdir: resolve(root, outdir), target: 'browser', format: 'iife', minify, plugins: [bundleText] });
  if (!out.success) { out.logs.forEach((l) => console.error(l)); process.exit(1); }
}
await import('./finalize.js');
