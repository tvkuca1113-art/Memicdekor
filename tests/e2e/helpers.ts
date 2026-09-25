import type { Page } from '@playwright/test';
import { pages } from '../../src/content/pages';

export const CONFIGURED_URL = 'http://127.0.0.1:3200';
export const UNCONFIGURED_URL = 'http://127.0.0.1:3201';
export const MOCK_URL = 'http://127.0.0.1:3299';

export const SITE_URL = 'https://memic.ba';

export const PAGE_H1: Record<string, string> = {
  '/': 'Keramika po mjeri vašeg prostora.',
  '/proizvodi/': 'Keramika, umivaonici i sanitarna oprema',
  '/proizvodnja/': 'Izrada po mjeri od keramike',
  '/usluge/': 'Rezanje i obrada keramike',
  '/digital-print/': 'Digitalni print na keramici',
  '/water-jet/': 'Rezanje vodenim mlazom',
  '/o-nama/': 'Studio keramike iz Mostara',
  '/kontakt/': 'Kontakt i upit',
};

export const ALL_PATHS = Object.values(pages).map((page) => page.path);

export const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440, 1920];

/** Čeka pisma i slike u vidnom polju, da mjerenja ne zavise od učitavanja. */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => !image.complete && image.loading !== 'lazy')
        .map((image) => new Promise((resolve) => image.addEventListener('load', resolve, { once: true }))),
    );
  });
}
