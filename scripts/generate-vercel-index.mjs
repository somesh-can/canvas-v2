import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('build/client');
const manifestPath = path.join(outDir, '.vite', 'manifest.json');

const manifestRaw = await readFile(manifestPath, 'utf8');
const manifest = JSON.parse(manifestRaw);

const entries = Object.entries(manifest);
const entryPair =
  entries.find(([, v]) => v?.isEntry && String(v.file || '').includes('entry.client')) ||
  entries.find(([, v]) => v?.isEntry) ||
  entries[0];

if (!entryPair) {
  throw new Error('No manifest entries found to generate index.html');
}

const [entryKey, entry] = entryPair;

const visited = new Set();
const cssSet = new Set(entry.css || []);
const preloadSet = new Set();

function collectImports(key) {
  if (!key || visited.has(key)) return;
  visited.add(key);
  const chunk = manifest[key];
  if (!chunk) return;

  (chunk.css || []).forEach((cssFile) => cssSet.add(cssFile));
  (chunk.imports || []).forEach((importKey) => {
    const importChunk = manifest[importKey];
    if (importChunk?.file) preloadSet.add(importChunk.file);
    collectImports(importKey);
  });
}

collectImports(entryKey);

const cssLinks = [...cssSet]
  .map((href) => `    <link rel="stylesheet" href="/${href}">`)
  .join('\n');
const preloadLinks = [...preloadSet]
  .map((href) => `    <link rel="modulepreload" href="/${href}">`)
  .join('\n');

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${cssLinks}
${preloadLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${entry.file}"></script>
  </body>
</html>
`;

await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
