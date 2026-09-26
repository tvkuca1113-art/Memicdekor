import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1440]) {
  test(`salon: pregled fotografija i video izvor na ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const salon = page.locator('#salon');
    const thumbnails = salon.getByRole('group', { name: 'Odaberite fotografiju salona' });
    await expect(thumbnails.getByRole('button')).toHaveCount(5);
    for (const button of await thumbnails.getByRole('button').all()) {
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(thumbnails.locator('button[aria-pressed="true"]')).toHaveCount(1);
      const image = salon.getByRole('img');
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const bounds = await button.boundingBox();
      expect(bounds?.width).toBeGreaterThanOrEqual(44);
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
    }
    await salon.getByRole('button', { name: 'Sljedeća fotografija salona' }).click();
    await expect(salon.getByRole('img')).toHaveAttribute('alt', 'Izložbeni salon Memić Dekor u Mostaru');
    await salon.getByRole('button', { name: 'Prethodna fotografija salona' }).press('Enter');
    await expect(salon.getByRole('img')).toHaveAttribute('alt', /Izloženi tuševi/);
    await expect(salon.getByRole('link', { name: /Zavirite u naš salon/ })).toHaveAttribute('href', 'https://www.instagram.com/p/DQEwGovDP60/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include('#salon').analyze()).violations).toEqual([]);
  });
}
