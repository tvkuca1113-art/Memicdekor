// Snimci galerije iz produkcijske izvedbe za vizuelnu provjeru.
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const port = 3216;
const output = 'docs/screenshots/salon';
await mkdir(output, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '-p', String(port)], { stdio: 'inherit' });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; } } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Server za snimke nije pokrenut.');
  browser = await chromium.launch();
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('#salon');
    async function capture(name) {
      for (const image of await section.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((el) => Promise.race([el.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 8000))]));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const box = await section.boundingBox();
      const bytes = await page.screenshot({ fullPage: true, animations: 'disabled' });
      await sharp(bytes).extract({ left: Math.round(box.x * 2), top: Math.round(box.y * 2), width: Math.round(box.width * 2), height: Math.round(box.height * 2) }).resize({ width }).jpeg({ quality: 87, mozjpeg: true }).toFile(`${output}/${name}-${width}.jpg`);
    }
    await capture('salon');
    await section.getByRole('button', { name: 'Prikažite: Dobro došli u Memić Dekor', exact: true }).click();
    await capture('pult');
    await page.close();
    console.log(`Galerija provjerena i snimljena na ${width}px.`);
  }
} finally {
  await browser?.close();
  server.kill();
}
