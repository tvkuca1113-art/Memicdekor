import { expect, test } from '@playwright/test';
import { PAGE_H1 } from './helpers';

test.describe('navigacija na računaru', () => {
  test('stavke glavne navigacije vode na stvarne stranice', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Glavna navigacija' });
    const items: [string, string][] = [
      ['Proizvodi', '/proizvodi/'],
      ['Izrada po mjeri', '/proizvodnja/'],
      ['Usluge', '/usluge/'],
      ['O nama', '/o-nama/'],
      ['Kontakt', '/kontakt/'],
    ];
    for (const [label, path] of items) {
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(PAGE_H1[path]);
      await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page');
    }
  });

  test('podstranice usluga označavaju stavku Usluge', async ({ page }) => {
    await page.goto('/water-jet/');
    const nav = page.getByRole('navigation', { name: 'Glavna navigacija' });
    await expect(nav.getByRole('link', { name: 'Usluge', exact: true })).toHaveAttribute('aria-current', 'true');
  });

  test('logo vraća na početnu stranicu i na vrh', async ({ page }) => {
    await page.goto('/o-nama/');
    await page.mouse.wheel(0, 1500);
    await page.getByRole('link', { name: /početna stranica/ }).click();
    await expect(page).toHaveURL(/127\.0\.0\.1:3200\/$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await page.goto('/#upit');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    await page.getByRole('link', { name: /početna stranica/ }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);
    await expect(page).toHaveURL(/127\.0\.0\.1:3200\/$/);
  });

  test('glavni CTA vodi do forme koja ne završava ispod zaglavlja', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section[aria-labelledby="naslov"]');
    await hero.getByRole('link', { name: 'Pošaljite upit' }).click();
    await expect(page).toHaveURL(/#upit$/);
    const heading = page.getByRole('heading', { name: 'Recite nam šta uređujete.' });
    await expect(heading).toBeInViewport();
    await expect
      .poll(async () => {
        const headerBottom = await page.locator('header').first().evaluate((el) => el.getBoundingClientRect().bottom);
        const headingTop = await heading.evaluate((el) => el.getBoundingClientRect().top);
        return headingTop >= headerBottom;
      })
      .toBe(true);
  });

  test('sidro pri direktnom otvaranju ne završava ispod zaglavlja', async ({ page }) => {
    await page.goto('/proizvodi/#umivaonici');
    const heading = page.getByRole('heading', { name: 'Umivaonici', level: 2 });
    await expect(heading).toBeInViewport();
    const headerBottom = await page.locator('header').first().evaluate((el) => el.getBoundingClientRect().bottom);
    const headingTop = await heading.evaluate((el) => el.getBoundingClientRect().top);
    expect(headingTop).toBeGreaterThanOrEqual(headerBottom);
  });

  test('sekundarni CTA vodi na proizvodnju', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pogledajte proizvodnju' }).click();
    await expect(page).toHaveURL(/\/proizvodnja\/$/);
  });

  test('link za preskakanje vodi na glavni sadržaj', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Preskoči na sadržaj' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#sadrzaj')).toBeFocused();
  });

  test('telefon i e-mail koriste ispravne linkove', async ({ page }) => {
    await page.goto('/kontakt/');
    const main = page.getByRole('main');
    await expect(main.locator('a[href="tel:+38736281301"]').first()).toBeVisible();
    await expect(main.locator('a[href="mailto:info@memic.ba"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Telefon: +387 36 281 301' })).toHaveAttribute('href', 'tel:+38736281301');
    await expect(page.locator('a[href*="wa.me"], a[href*="whatsapp"]')).toHaveCount(0);
  });

  test('česta pitanja rade mišem i tastaturom', async ({ page }) => {
    await page.goto('/');
    const question = page.locator('summary', { hasText: 'Šta je digitalni print na keramici?' });
    const answer = page.getByText('Postupak kojim se odabrani motiv');
    await expect(answer).toBeHidden();
    await question.click();
    await expect(answer).toBeVisible();
    await question.focus();
    await page.keyboard.press('Enter');
    await expect(answer).toBeHidden();
    await page.keyboard.press('Space');
    await expect(answer).toBeVisible();
  });
});
