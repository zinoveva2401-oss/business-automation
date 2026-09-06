import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const outputDir = path.join(publicDir, '_optimized');
const widths = [480, 768, 1200, 1600];
const raster = /\.(png|jpe?g)$/i;

async function filesIn(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(full) : [full];
  }))).flat();
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });
for (const source of (await filesIn(publicDir)).filter((file) => raster.test(file) && !file.includes(`${path.sep}_optimized${path.sep}`))) {
  const relative = path.relative(publicDir, source);
  const relativeBase = relative.replace(raster, '');
  const metadata = await sharp(source).metadata();
  for (const width of widths.filter((value) => value < (metadata.width ?? value))) {
    const targetBase = path.join(outputDir, relativeBase);
    await fs.mkdir(path.dirname(targetBase), { recursive: true });
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`${targetBase}.w${width}.webp`);
    await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 58, effort: 4 }).toFile(`${targetBase}.w${width}.avif`);
  }
}

const oversized = (await filesIn(publicDir)).filter((file) => raster.test(file) && !file.includes(`${path.sep}_optimized${path.sep}`));
for (const file of oversized) {
  const stat = await fs.stat(file);
  if (stat.size > 1.5 * 1024 * 1024) console.warn(`image-budget: source exceeds 1.5 MB: ${path.relative(process.cwd(), file)}`);
}
