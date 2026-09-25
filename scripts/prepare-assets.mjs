// Priprema web resursa iz izvornih datoteka u design/.
// Logo se ne crta ni ne mijenja: uklanjaju se samo prozirne margine platna.
// Pokretanje: npm run assets
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const LOGO_WIDTHS = [344, 520];
const src = (file) => path.join(root, 'design', file);
const out = (file) => path.join(root, file);

async function contentBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] < 10) continue; // prozirni piksel
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function main() {
  await mkdir(out('public/brand'), { recursive: true });
  await mkdir(out('src/assets/hero'), { recursive: true });
  await mkdir(out('public/og'), { recursive: true });

  // 1. Logo: originalni PNG bez prozirnih margina (1 px zraka), bez promjene boja.
  const logoSrc = src('izvorni-logo.png');
  const box = await contentBox(logoSrc);
  const pad = 1;
  const logoMeta = await sharp(logoSrc).metadata();
  const crop = {
    left: Math.max(0, box.left - pad),
    top: Math.max(0, box.top - pad),
    width: Math.min(logoMeta.width, box.width + pad * 2),
    height: Math.min(logoMeta.height, box.height + pad * 2),
  };
  await sharp(logoSrc)
    .extract(crop)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out('public/brand/memic-dekor-logo.png'));
  // WebP bez gubitaka (bez promjene boja) u dvije širine za srcset: 344 px za 1–2× prikaz, 520 px za 3×.
  for (const width of LOGO_WIDTHS) {
    await sharp(out('public/brand/memic-dekor-logo.png'))
      .resize({ width })
      .webp({ lossless: true, effort: 6 })
      .toFile(out(`public/brand/memic-dekor-logo-${width}.webp`));
  }

  // 2. Favicon: ikona iz originalnog loga (lijevi znak), na bijeloj kvadratnoj podlozi.
  const iconBox = { left: box.left, top: box.top + 14, width: 64, height: 46 };
  const iconSize = 64;
  const icon = await sharp(logoSrc).extract(iconBox).toBuffer();
  await sharp({
    create: { width: iconSize, height: iconSize, channels: 4, background: '#ffffff' },
  })
    .composite([{ input: icon, top: Math.round((iconSize - iconBox.height) / 2), left: 0 }])
    .png()
    .toFile(out('src/app/icon.png'));

  // 3. Hero fotografije: kopije izvornih datoteka (next/image radi responzivne varijante).
  await copyFile(src('hero-desktop-izvorna.jpg'), out('src/assets/hero/kuhinja-ostrvo-desktop.jpg'));
  await copyFile(src('hero-mobitel-izvorna.jpg'), out('src/assets/hero/kuhinja-ostrvo-mobitel.jpg'));

  // 4. Open Graph slika 1200x630: hero fotografija i originalni logo na bijeloj traci.
  const ogWidth = 1200;
  const ogHeight = 630;
  const band = 120;
  const photo = await sharp(src('hero-desktop-izvorna.jpg'))
    .resize({ width: ogWidth, height: ogHeight - band, fit: 'cover', position: 'right' })
    .toBuffer();
  const logoForOg = await sharp(out('public/brand/memic-dekor-logo.png')).resize({ width: 420 }).toBuffer();
  const logoForOgMeta = await sharp(logoForOg).metadata();
  await sharp({ create: { width: ogWidth, height: ogHeight, channels: 3, background: '#ffffff' } })
    .composite([
      { input: logoForOg, left: 56, top: Math.round((band - logoForOgMeta.height) / 2) },
      { input: photo, left: 0, top: band },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out('public/og/memic-dekor.jpg'));

  // Evidencija: dimenzije i kontrolni zbroj generisanih datoteka.
  const files = [
    'public/brand/memic-dekor-logo.png',
    ...LOGO_WIDTHS.map((width) => `public/brand/memic-dekor-logo-${width}.webp`),
    'src/app/icon.png',
    'src/assets/hero/kuhinja-ostrvo-desktop.jpg',
    'src/assets/hero/kuhinja-ostrvo-mobitel.jpg',
    'public/og/memic-dekor.jpg',
  ];
  const report = [];
  for (const file of files) {
    const meta = await sharp(out(file)).metadata();
    const hash = createHash('sha256').update(await readFile(out(file))).digest('hex').slice(0, 16);
    report.push({ file, width: meta.width, height: meta.height, format: meta.format, sha256: hash });
  }
  await writeFile(out('design/generisani-resursi.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.table(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
