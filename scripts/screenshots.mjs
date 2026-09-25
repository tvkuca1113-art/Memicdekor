// Screenshotovi za predaju: snima se s gustoćom 2× (kao Retina/mobitel), pa smanjuje na CSS
// veličinu radi realnog prikaza pisma.
// Upotreba: npm run build && npm run start, zatim npm run screenshots [-- http://127.0.0.1:3000]
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:3000';
const outDir = path.resolve(import.meta.dirname, '../docs/screenshots');

const shots = [
  { name: 'pocetna-390x844', path: '/', width: 390, height: 844 },
  { name: 'pocetna-768x1024', path: '/', width: 768, height: 1024 },
  { name: 'pocetna-1440x900', path: '/', width: 1440, height: 900 },
  { name: 'pocetna-cijela-390', path: '/', width: 390, height: 844, fullPage: true },
  { name: 'pocetna-cijela-1440', path: '/', width: 1440, height: 900, fullPage: true },
  { name: 'meni-390x844', path: '/', width: 390, height: 844, openMenu: true },
  { name: 'kontakt-cijela-390', path: '/kontakt/', width: 390, height: 844, fullPage: true },
  { name: 'proizvodi-1440x900', path: '/proizvodi/', width: 1440, height: 900 },
  { name: 'water-jet-1440x900', path: '/water-jet/', width: 1440, height: 900 },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}${shot.path}`, { waitUntil: 'load' });
  if (shot.fullPage) {
    // Lijeno učitane slike se učitaju prije snimanja cijele stranice.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
  // Čekaju se pisma i slike u vidnom polju; lijeno učitane slike izvan ekrana se nikad ne učitaju.
  await page.evaluate(async () => {
    await document.fonts.ready;
    const pending = [...document.images].filter((img) => {
      const rect = img.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
      return !img.complete && (img.loading !== 'lazy' || visible);
    });
    const timeout = new Promise((resolve) => setTimeout(resolve, 10_000));
    await Promise.race([
      Promise.all(pending.map((img) => new Promise((resolve) => (img.onload = img.onerror = resolve)))),
      timeout,
    ]);
  });
  if (shot.openMenu) {
    await page.getByRole('button', { name: 'Otvori meni' }).click();
    await page.waitForTimeout(400);
  }
  const buffer = await page.screenshot({ fullPage: Boolean(shot.fullPage), animations: 'disabled' });
  const file = path.join(outDir, `${shot.name}.jpg`);
  await sharp(buffer).resize({ width: shot.width }).jpeg({ quality: 86, mozjpeg: true }).toFile(file);
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
  await page.close();
}
await browser.close();
