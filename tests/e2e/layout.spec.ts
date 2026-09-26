import { expect, test } from '@playwright/test';
import { ALL_PATHS, WIDTHS, settle } from './helpers';

test.describe('raspored na svim širinama', () => {
  for (const width of WIDTHS) {
    test(`bez horizontalnog skrolanja i preklapanja u zaglavlju na ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ALL_PATHS) {
        await page.goto(path);
        await settle(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `horizontalno prelijevanje na ${path}`).toBeLessThanOrEqual(0);
      }

      await page.goto('/');
      const boxes = await page.locator('header').first().evaluate((header) => {
        const elements = header.querySelectorAll('a[href="/"], nav li, a[href^="tel:"], a.btn, button');
        return [...elements]
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && !element.closest('dialog');
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { name: element.textContent?.trim() || element.getAttribute('aria-label') || element.tagName, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          });
      });
      for (const box of boxes) {
        expect(box.left, `${box.name} izlazi lijevo`).toBeGreaterThanOrEqual(0);
        expect(box.right, `${box.name} izlazi desno`).toBeLessThanOrEqual(width);
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const overlap = a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
          expect(overlap, `„${a.name}” i „${b.name}” se preklapaju na ${width} px`).toBe(false);
        }
      }
    });
  }

  test('na 390×844 naslov i glavni CTA su vidljivi bez skrolanja', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await settle(page);
    const hero = page.locator('section[aria-labelledby="naslov"]');
    await expect(hero.getByRole('heading', { level: 1 })).toBeInViewport({ ratio: 1 });
    const cta = hero.getByRole('link', { name: 'Pošaljite upit' });
    await expect(cta).toBeInViewport({ ratio: 1 });
    const ctaBox = await cta.boundingBox();
    expect(ctaBox!.height).toBeGreaterThanOrEqual(48);
    expect(ctaBox!.width).toBeGreaterThanOrEqual(160);
    expect(ctaBox!.width).toBeLessThanOrEqual(240);
    const titleSize = await hero.getByRole('heading', { level: 1 }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(titleSize).toBeGreaterThanOrEqual(36);
    expect(titleSize).toBeLessThanOrEqual(42);
    const header = await page.locator('header').first().boundingBox();
    expect(header!.height).toBeGreaterThanOrEqual(64);
    expect(header!.height).toBeLessThanOrEqual(72);
    const logo = await page.locator('header a[href="/"] img').first().boundingBox();
    expect(logo!.width).toBeGreaterThanOrEqual(165);
    expect(logo!.width).toBeLessThanOrEqual(180);
  });

  test('na 1440 px zaglavlje, naslov i hero imaju zadane mjere', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await settle(page);
    const header = await page.locator('header').first().boundingBox();
    expect(header!.height).toBeGreaterThanOrEqual(80);
    expect(header!.height).toBeLessThanOrEqual(88);
    const hero = page.locator('section[aria-labelledby="naslov"]');
    const heroBox = await hero.boundingBox();
    expect(heroBox!.height).toBeGreaterThanOrEqual(720);
    expect(heroBox!.height).toBeLessThanOrEqual(900);
    const titleSize = await hero.getByRole('heading', { level: 1 }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(titleSize).toBeGreaterThanOrEqual(64);
    expect(titleSize).toBeLessThanOrEqual(88);
    await expect(page.locator('header').getByRole('link', { name: /Telefon/ })).toBeVisible();
  });

  test('hero preuzima samo jednu varijantu fotografije za uređaj', async ({ browser }) => {
    for (const [width, height, expected, unexpected] of [
      [390, 844, 'kuhinja-ostrvo-mobitel', 'kuhinja-ostrvo-desktop'],
      [1440, 900, 'kuhinja-ostrvo-desktop', 'kuhinja-ostrvo-mobitel'],
    ] as const) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      const requested: string[] = [];
      page.on('request', (request) => {
        if (request.resourceType() === 'image') requested.push(decodeURIComponent(request.url()));
      });
      await page.goto('/');
      await settle(page);
      const hero = page.locator('section[aria-labelledby="naslov"] img');
      await expect(hero).toHaveAttribute('fetchpriority', 'high');
      await expect(hero).toHaveAttribute('loading', 'eager');
      expect(await hero.evaluate((img: HTMLImageElement) => decodeURIComponent(img.currentSrc))).toContain(expected);
      expect(requested.some((url) => url.includes(expected))).toBe(true);
      expect(requested.some((url) => url.includes(unexpected)), `${width}px ne smije preuzeti ${unexpected}`).toBe(false);
      await context.close();
    }
  });

  test('uvećan tekst (200 %) ne odsijeca sadržaj i ne pravi horizontalni scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ['/', '/kontakt/', '/proizvodi/']) {
      await page.goto(path);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      await settle(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontalno prelijevanje na ${path}`).toBeLessThanOrEqual(0);
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('main section')].filter((section) => section.scrollHeight > section.clientHeight + 1).length,
      );
      expect(clipped, `odsječen sadržaj na ${path}`).toBe(0);
    }
  });

  test('poštuje prefers-reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    await context.close();

    const motion = await browser.newContext({ reducedMotion: 'no-preference' });
    const motionPage = await motion.newPage();
    await motionPage.goto('/');
    expect(await motionPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth');
    await motion.close();
  });

  test('fotografije ispod prvog ekrana se učitavaju lijeno i imaju rezervisan prostor', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('main img').evaluateAll((items) =>
      items.map((img) => ({
        src: (img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src,
        loading: img.getAttribute('loading'),
        alt: img.getAttribute('alt'),
        inHero: Boolean(img.closest('section[aria-labelledby="naslov"]')),
      })),
    );
    for (const image of images) {
      expect(image.alt, image.src).not.toBeNull();
      if (!image.inHero) expect(image.loading, image.src).toBe('lazy');
    }
    // Prikazane fotografije imaju rezervisan prostor; zatvoreni paneli su namjerno skriveni.
    const heights = await page.locator('main img:visible').evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().height),
    );
    expect(heights.length).toBeGreaterThan(0);
    for (const height of heights) expect(height).toBeGreaterThan(100);
  });
});
