import { expect, test } from '@playwright/test';
import { pages } from '../../src/content/pages';
import { legacyRedirects } from '../../src/content/redirects';
import { PAGE_H1, SITE_URL } from './helpers';

type JsonLd = Record<string, unknown> & { '@type': string };

for (const page of Object.values(pages)) {
  test(`metapodaci i struktura: ${page.path}`, async ({ page: browserPage }) => {
    const response = await browserPage.goto(page.path);
    expect(response?.status()).toBe(200);

    const expectedTitle = page.path === '/' ? page.title : `${page.title} | Memić Dekor`;
    await expect(browserPage).toHaveTitle(expectedTitle);
    await expect(browserPage.locator('html')).toHaveAttribute('lang', 'bs');
    await expect(browserPage.locator('meta[name="description"]')).toHaveAttribute('content', page.description);
    await expect(browserPage.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}${page.path}`);
    await expect(browserPage.locator('meta[property="og:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(browserPage.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}${page.path}`);
    await expect(browserPage.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${SITE_URL}/og/memic-dekor.jpg`,
    );
    // Lokalna i pregledna izvedba nisu indeksabilne.
    await expect(browserPage.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

    // Tačno jedan H1 i hijerarhija naslova bez preskakanja nivoa.
    await expect(browserPage.getByRole('heading', { level: 1 })).toHaveText(PAGE_H1[page.path]);
    const levels = await browserPage
      .locator('main h1, main h2, main h3, main h4')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `preskočen nivo naslova na ${page.path}`).toBeLessThanOrEqual(1);
    }

    // Strukturirani podaci su ispravan JSON i ne sadrže nepotvrđene podatke.
    const blocks = await browserPage
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => script.textContent ?? ''));
    const data = blocks.map((block) => JSON.parse(block) as JsonLd);
    const serialized = JSON.stringify(data);
    for (const forbidden of ['geo', 'openingHours', 'aggregateRating', 'review', 'priceRange', 'latitude']) {
      expect(serialized).not.toContain(`"${forbidden}"`);
    }
    const types = data.map((item) => item['@type']);
    if (page.path === '/' || page.path === '/kontakt/') {
      const business = data.find((item) => item['@type'] === 'HomeGoodsStore')!;
      expect(business).toMatchObject({
        name: 'Memić Dekor',
        legalName: 'Memić Dekor d.o.o.',
        telephone: '+387 36 281 301',
        email: 'info@memic.ba',
        address: { streetAddress: 'Maršala Tita 294', postalCode: '88000', addressLocality: 'Mostar', addressCountry: 'BA' },
      });
    }
    if (page.path !== '/') {
      expect(types).toContain('BreadcrumbList');
      const breadcrumb = data.find((item) => item['@type'] === 'BreadcrumbList') as unknown as {
        itemListElement: { item: string }[];
      };
      expect(breadcrumb.itemListElement.at(-1)?.item).toBe(`${SITE_URL}${page.path}`);
    }
  });
}

test('sitemap sadrži sve javne stranice sa stvarnom domenom', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(locations).toEqual(Object.values(pages).map((page) => `${SITE_URL}${page.path}`));
});

test('robots.txt i zaglavlje blokiraju indeksiranje pregledne verzije', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  const home = await request.get('/');
  expect(home.headers()['x-robots-tag']).toBe('noindex, nofollow');
});

test('stari URL-ovi imaju trajno (301) preusmjerenje na odgovarajuću stranicu', async ({ request }) => {
  for (const redirect of legacyRedirects) {
    const from = redirect.from.replace(':path*', 'sanitarija/wc-solje/').replace(':slug', 'nepoznati-model');
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    const location = new URL(response.headers().location, 'http://127.0.0.1');
    expect(location.pathname + location.hash, from).toBe(redirect.to);
  }
});

test('nepostojeća stranica vraća 404 s korisnim linkovima', async ({ page }) => {
  const response = await page.goto('/ova-stranica-ne-postoji/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stranica nije pronađena.');
  const robots = await page.locator('meta[name="robots"]').evaluateAll((metas) => metas.map((meta) => meta.getAttribute('content')));
  expect(robots.length).toBeGreaterThan(0);
  for (const value of robots) expect(value).toContain('noindex');
  await page.getByRole('main').getByRole('link', { name: 'Proizvodi' }).click();
  await expect(page).toHaveURL(/\/proizvodi\/$/);
});
