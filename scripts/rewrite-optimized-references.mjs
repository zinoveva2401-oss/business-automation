import fs from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const publicDir = path.resolve('public');
const raster = /\.(png|jpe?g)$/i;
const files = async (dir) => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map(async (entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? files(full) : [full];
}))).flat();

const candidates = new Map();
for (const source of (await files(publicDir)).filter((file) => raster.test(file) && !file.includes(`${path.sep}_optimized${path.sep}`))) {
  const relative = path.relative(publicDir, source).replaceAll(path.sep, '/');
  const base = relative.replace(raster, '');
  const options = [1200, 768, 480].map((width) => `/_optimized/${base}.w${width}.webp`);
  for (const url of options) if (await fs.stat(path.join(publicDir, url.slice(1))).then(() => true, () => false)) { candidates.set(`/${relative}`, url); break; }
}

for (const file of (await files(dist)).filter((item) => /\.(html|css)$/i.test(item))) {
  let text = await fs.readFile(file, 'utf8');
  for (const [original, optimized] of candidates) {
    text = text.replaceAll(`src="${original}"`, `src="${optimized}"`).replaceAll(`url('${original}')`, `url('${optimized}')`).replaceAll(`url("${original}")`, `url("${optimized}")`);
  }
  await fs.writeFile(file, text);
}
