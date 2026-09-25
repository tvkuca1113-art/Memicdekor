import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test.describe('mobilni meni', () => {
  test('otvara se, zatvara tipkom Escape i vraća fokus na dugme', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Otvori meni' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const box = await toggle.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);

    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'Meni' });
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Zatvori meni' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('fokus ostaje u otvorenom meniju, a pozadina se ne skrola', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Otvori meni' }).click();
    const dialog = page.getByRole('dialog', { name: 'Meni' });
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const active = document.activeElement;
        return !active || active === document.body || Boolean(active.closest('dialog[open]'));
      });
      expect(inside, `fokus je izašao iz menija nakon ${i + 1}. tipke Tab`).toBe(true);
    }
    const overflow = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
    expect(overflow).toBe('hidden');
  });

  test('radi nakon skrolanja i zatvara se nakon navigacije', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 3000));
    const toggle = page.getByRole('button', { name: 'Otvori meni' });
    await expect(toggle).toBeInViewport();
    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'Meni' });
    await dialog.getByRole('link', { name: 'Usluge' }).click();
    await expect(page).toHaveURL(/\/usluge\/$/);
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Rezanje i obrada keramike');
  });

  test('zatvara se dugmetom i klikom na link iste stranice', async ({ page }) => {
    await page.goto('/kontakt/');
    const toggle = page.getByRole('button', { name: 'Otvori meni' });
    await toggle.click();
    await page.getByRole('button', { name: 'Zatvori meni' }).click();
    await expect(page.getByRole('dialog', { name: 'Meni' })).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await page.getByRole('dialog', { name: 'Meni' }).getByRole('link', { name: 'Pošaljite upit' }).click();
    await expect(page.getByRole('dialog', { name: 'Meni' })).toBeHidden();
    await expect(page).toHaveURL(/\/kontakt\/#upit$/);
  });

  test('stavke menija imaju dodirnu površinu od najmanje 44 px', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Otvori meni' }).click();
    const targets = page.getByRole('dialog', { name: 'Meni' }).locator('a, button');
    const count = await targets.count();
    expect(count).toBeGreaterThan(8);
    for (let i = 0; i < count; i++) {
      const box = await targets.nth(i).boundingBox();
      expect(box!.height, await targets.nth(i).innerText()).toBeGreaterThanOrEqual(44);
    }
  });
});
