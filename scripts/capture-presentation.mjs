// Vizuelna provjera izmjena prezentacije: isti raspored na mobitelu i računaru.
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const port = 3215;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '-p', String(port)], { stdio: 'inherit' });
const output = 'docs/screenshots/prezentacija-v2';
await mkdir(output, { recursive: true });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; } } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Server za snimke nije pokrenut.');
  browser = await chromium.launch();
  const widths = process.argv.includes('--desktop') ? [1440] : [390, 1440];
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    page.setDefaultTimeout(20000);
    console.log(`Otvaram ${width}px.`);
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    async function save(name, locator) {
      console.log(`Snimam ${name}-${width}.`);
      // Svaka fotografija u dugoj sekciji prvo uđe u vidljivi dio ekrana.
      if (locator) {
        for (const img of await locator.locator('img:visible').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(async (image) => {
            await Promise.race([image.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 8000))]);
          });
        }
      }
      if (locator) await locator.scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        await Promise.all([...document.images].filter((image) => {
          const box = image.getBoundingClientRect();
          return box.width > 0 && box.top < innerHeight && box.bottom > 0;
        }).map((image) => Promise.race([image.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 8000))])));
      });
      let bytes;
      if (locator) {
        // Snimak cijele stranice pri vrhu ne postavlja fiksno zaglavlje usred sekcije.
        await page.evaluate(() => window.scrollTo(0, 0));
        const box = await locator.boundingBox();
        const full = await page.screenshot({ fullPage: true, animations: 'disabled' });
        bytes = await sharp(full).extract({ left: Math.round(box.x * 2), top: Math.round(box.y * 2), width: Math.round(box.width * 2), height: Math.round(box.height * 2) }).toBuffer();
      } else bytes = await page.screenshot({ animations: 'disabled' });
      const meta = await sharp(bytes).metadata();
      await sharp(bytes).resize({ width: Math.round(meta.width / 2) }).jpeg({ quality: 86, mozjpeg: true }).toFile(`${output}/${name}-${width}.jpg`);
    }
    await save('uvod');
    await save('prostori', page.locator('#prostori'));
    await save('radovi', page.locator('#radovi'));
    await page.getByRole('button', { name: 'Pogledajte detalje: Stol i komoda u istom dekoru', exact: true }).click();
    await save('projekat');
    await page.keyboard.press('Escape');
    await save('usluge', page.locator('#usluge'));
    await page.locator('#usluge').getByRole('button', { name: /Digitalni print/ }).click();
    await save('digitalni-print', page.locator('#usluge'));
    await save('proces', page.locator('section[aria-labelledby="proces-naslov"]'));
    await page.close();
    console.log(`Snimci ${width}px sačuvani.`);
  }
} finally {
  await browser?.close();
  server.kill();
}
