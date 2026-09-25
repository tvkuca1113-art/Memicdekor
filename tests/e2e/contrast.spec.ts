import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';
import { settle } from './helpers';

// Kontrast teksta preko fotografije mjeri se na stvarnoj izvedbi:
// 1) iz DOM-a se uzmu pravougaonici svakog reda teksta u hero sekciji,
// 2) tekst se sakrije (ostaju fotografija i gradijent),
// 3) za svaki piksel iza teksta računa se WCAG kontrast s bojom teksta.
// Kao mjerodavna vrijednost uzima se 2. percentil (najlošija 2 % piksela), uz prikaz minimuma.

type Target = {
  text: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  rects: { x: number; y: number; w: number; h: number }[];
};

function channel(value: number) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(r: number, g: number, b: number) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a: number, b: number) {
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

function parseColor(color: string) {
  const [r, g, b, a = 1] = color.match(/[\d.]+/g)!.map(Number);
  return { r, g, b, a };
}

async function measureHero(page: Page) {
  const hero = page.locator('section[aria-labelledby="naslov"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  const targets: Target[] = await hero.evaluate((section) => {
    const sectionRect = section.getBoundingClientRect();
    return [...section.querySelectorAll('.container p, .container h1, .container a')]
      .filter((element) => {
        const background = getComputedStyle(element).backgroundColor;
        return background === 'rgba(0, 0, 0, 0)' || background === 'transparent';
      })
      .map((element) => {
        const style = getComputedStyle(element);
        const range = document.createRange();
        range.selectNodeContents(element);
        const rects = [...range.getClientRects()]
          .filter((rect) => rect.width > 2 && rect.height > 2)
          .map((rect) => ({ x: rect.x - sectionRect.x, y: rect.y - sectionRect.y, w: rect.width, h: rect.height }));
        return {
          text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 48),
          color: style.color,
          fontSize: parseFloat(style.fontSize),
          fontWeight: Number(style.fontWeight),
          rects,
        };
      });
  });

  await page.addStyleTag({
    content: `section[aria-labelledby="naslov"] .container, section[aria-labelledby="naslov"] .container * {
      color: transparent !important; text-shadow: none !important; border-color: transparent !important; }
      section[aria-labelledby="naslov"] .container svg { visibility: hidden !important; }`,
  });
  await page.waitForTimeout(100);
  const shot = await hero.screenshot({ animations: 'disabled' });
  const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const scale = info.width / (await hero.evaluate((el) => el.getBoundingClientRect().width));

  return targets.map((target) => {
    const text = parseColor(target.color);
    const values: number[] = [];
    for (const rect of target.rects) {
      const x0 = Math.max(0, Math.floor(rect.x * scale));
      const y0 = Math.max(0, Math.floor(rect.y * scale));
      const x1 = Math.min(info.width, Math.ceil((rect.x + rect.w) * scale));
      const y1 = Math.min(info.height, Math.ceil((rect.y + rect.h) * scale));
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * info.width + x) * info.channels;
          const [br, bg, bb] = [data[i], data[i + 1], data[i + 2]];
          const blended = luminance(
            text.a * text.r + (1 - text.a) * br,
            text.a * text.g + (1 - text.a) * bg,
            text.a * text.b + (1 - text.a) * bb,
          );
          values.push(ratio(blended, luminance(br, bg, bb)));
        }
      }
    }
    values.sort((a, b) => a - b);
    const large = target.fontSize >= 24 || (target.fontSize >= 18.66 && target.fontWeight >= 700);
    return {
      text: target.text,
      size: target.fontSize,
      required: large ? 3 : 4.5,
      p2: Number(values[Math.floor(values.length * 0.02)].toFixed(2)),
      min: Number(values[0].toFixed(2)),
    };
  });
}

const VIEWPORTS = [
  { width: 320, height: 700 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

for (const viewport of VIEWPORTS) {
  test(`kontrast teksta preko fotografije na ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await settle(page);
    const results = await measureHero(page);
    console.log(`KONTRAST ${viewport.width}x${viewport.height} ${JSON.stringify(results)}`);
    expect(results.length).toBeGreaterThanOrEqual(4);
    for (const result of results) {
      expect(result.p2, `„${result.text}” (${result.size}px) mora imati najmanje ${result.required}:1`).toBeGreaterThanOrEqual(
        result.required,
      );
    }
  });
}
