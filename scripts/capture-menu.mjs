// Vizuelna provjera menija na lokalnoj produkcijskoj izvedbi.
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const port = 3217;
const output = 'docs/screenshots/meni-v2';
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
  for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [844, 390]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('button', { name: 'Otvori meni' }).click();
    await page.waitForLoadState('networkidle');
    const bytes = await page.screenshot({ animations: 'disabled' });
    await sharp(bytes).resize({ width }).jpeg({ quality: 88, mozjpeg: true }).toFile(`${output}/meni-${width}.jpg`);
    await page.close();
    console.log(`Meni snimljen na ${width} × ${height}.`);
  }
} finally {
  await browser?.close();
  server.kill();
}
