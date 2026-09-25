// Originalne fotografije firme: preuzimanje s memic.ba ili uvoz lokalne datoteke.
//
//   npm run photos:fetch                         preuzima fotografije iz src/content/photo-sources.json
//   npm run photos:add -- <id> <datoteka> [izvor] uvozi lokalnu fotografiju za dati id
//
// Svaka datoteka se provjerava (stvarni format slike, dimenzije, veličina), uklanjaju se
// EXIF/GPS metapodaci, slika se smanjuje na najviše 2400 px i upisuje u
// src/content/generated/original-photos.json. Nakon toga pokrenite npm run build.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const manifestPath = path.join(root, 'src/content/generated/original-photos.json');
const sourcesPath = path.join(root, 'src/content/photo-sources.json');
const outDir = path.join(root, 'public/images/originali');

// Popis dozvoljenih id-jeva; test provjerava da odgovara src/content/images.ts.
const KNOWN_IDS = JSON.parse(await readFile(path.join(root, 'src/content/photo-ids.json'), 'utf8'));
const MAX_BYTES = 25 * 1024 * 1024;
const MAX_WIDTH = 2400;
const MIN_WIDTH = 600;

function detectFormat(buffer) {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'webp';
  }
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') return 'avif';
  return null;
}

async function processImage(id, buffer, source) {
  if (!KNOWN_IDS.includes(id)) throw new Error(`nepoznat id „${id}”; dozvoljeni: ${KNOWN_IDS.join(', ')}`);
  if (buffer.length > MAX_BYTES) throw new Error('datoteka je veća od 25 MB');
  if (!detectFormat(buffer)) throw new Error('datoteka nije podržana slika (JPEG, PNG, WebP ili AVIF)');

  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) throw new Error('nije moguće očitati dimenzije slike');
  if (meta.width < MIN_WIDTH) throw new Error(`slika je preuska (${meta.width} px, potrebno najmanje ${MIN_WIDTH} px)`);

  // rotate() primjenjuje EXIF orijentaciju; sharp po zadanom ne prenosi EXIF/GPS u izlaz.
  const output = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toColourspace('srgb')
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const outMeta = await sharp(output).metadata();

  await mkdir(outDir, { recursive: true });
  const file = `${id}.jpg`;
  await writeFile(path.join(outDir, file), output);

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest[id] = {
    src: `/images/originali/${file}`,
    width: outMeta.width,
    height: outMeta.height,
    sha256: createHash('sha256').update(output).digest('hex'),
    source,
    addedAt: new Date().toISOString(),
  };
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`✓ ${id}: ${outMeta.width}×${outMeta.height}, ${Math.round(output.length / 1024)} KB → public/images/originali/${file}`);
}

async function fetchAll() {
  const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));
  let failed = 0;
  for (const [id, url] of Object.entries(sources)) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = response.headers.get('content-type') ?? '';
      if (!type.startsWith('image/')) throw new Error(`odgovor nije slika (${type || 'bez content-type'})`);
      await processImage(id, Buffer.from(await response.arrayBuffer()), url);
    } catch (error) {
      failed += 1;
      console.error(`✗ ${id}: ${error.message} (${url})`);
    }
  }
  if (failed > 0) {
    console.error(`Broj fotografija koje nisu preuzete: ${failed}. Provjerite pristup domeni memic.ba.`);
    process.exitCode = 1;
  }
}

async function addLocal(id, file, source) {
  if (!id || !file) {
    console.error('Upotreba: npm run photos:add -- <id> <datoteka> [opis izvora]');
    process.exitCode = 1;
    return;
  }
  await processImage(id, await readFile(path.resolve(file)), source ?? `lokalna datoteka: ${path.basename(file)}`);
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'fetch') await fetchAll();
  else if (command === 'add') await addLocal(...args);
  else {
    console.error('Naredbe: fetch | add <id> <datoteka> [izvor]');
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
}
