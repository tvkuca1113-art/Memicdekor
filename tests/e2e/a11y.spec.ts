import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ALL_PATHS, settle } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

function summarize(violations: { id: string; nodes: { target: unknown }[] }[]) {
  return violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => JSON.stringify(node.target)).join(', ')}`);
}

for (const [label, viewport] of [
  ['računar', { width: 1440, height: 900 }],
  ['mobitel', { width: 390, height: 844 }],
] as const) {
  test.describe(`axe provjera (${label})`, () => {
    test.use({ viewport });

    for (const path of ALL_PATHS) {
      test(`bez WCAG 2.2 AA grešaka: ${path}`, async ({ page }) => {
        await page.goto(path);
        await settle(page);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        expect(summarize(results.violations)).toEqual([]);
      });
    }
  });
}

test.describe('axe provjera stanja', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('otvoren mobilni meni', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Otvori meni' }).click();
    await expect(page.getByRole('dialog', { name: 'Meni' })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(summarize(results.violations)).toEqual([]);
  });

  test('forma s greškama i otvorena česta pitanja', async ({ page }) => {
    await page.goto('/');
    await page.locator('#upit form').getByRole('button', { name: 'Pošaljite upit' }).click();
    await expect(page.getByText('Upišite ime.')).toBeVisible();
    for (const summary of await page.locator('details summary').all()) await summary.click();
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(summarize(results.violations)).toEqual([]);
  });
});
