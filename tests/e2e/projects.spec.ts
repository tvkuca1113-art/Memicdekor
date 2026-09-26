import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1440]) {
  test(`galerija: filter, detalji, fotografije i povratak fokusa na ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const gallery = page.locator('#radovi');
    await gallery.getByRole('button', { name: 'Stolovi', exact: true }).click();
    await expect(gallery.getByRole('button', { name: /^Pogledajte detalje:/ })).toHaveCount(2);
    const opener = gallery.getByRole('button', { name: 'Pogledajte detalje: Stol i komoda u istom dekoru', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Stol i komoda u istom dekoru' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('img')).toHaveAttribute('alt', /Trpezarijski stol/);
    await dialog.getByRole('button', { name: 'Sljedeća fotografija' }).click();
    await expect(dialog.getByRole('img')).toHaveAttribute('alt', /Komoda/);
    await expect(dialog.getByText('Keramičke obloge: Memić Dekor. Konstrukcija: Modimex.')).toBeVisible();
    const image = dialog.getByRole('img');
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await dialog.getByRole('link', { name: 'Želim slično rješenje' }).scrollIntoViewIfNeeded();
    await expect(dialog.getByRole('button', { name: 'Zatvori detalje projekta' })).toBeInViewport();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await gallery.getByRole('button', { name: 'Obloge', exact: true }).click();
    await expect(gallery.getByRole('button', { name: /^Pogledajte detalje:/ })).toHaveCount(1);
    await gallery.getByRole('button', { name: /^Pogledajte detalje:/ }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Želim slično rješenje' }).click();
    await expect(page).toHaveURL(/\/kontakt\/\?projekat=zidna-obloga-xxl#upit$/);
    await expect(page.getByRole('textbox', { name: 'Poruka', exact: true })).toHaveValue(/Veliki format za kuhinjski zid/);
    await expect(page.getByRole('radio', { name: 'Kuhinju', exact: true })).toBeChecked();
    await expect(page.getByRole('heading', { name: 'Recite nam šta uređujete.' })).toBeInViewport();
  });

  test(`usluga mijenja opis, fotografiju i odredište na ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const service = page.locator('#usluge');
    await service.getByRole('button', { name: /Digitalni print/ }).click();
    await expect(service.getByRole('region', { name: /Digitalni print/ })).toBeVisible();
    await expect(service.getByRole('img', { name: 'Motiv otisnut digitalnim printom na keramičkim pločicama' }).filter({ visible: true })).toBeVisible();
    await expect(service.getByRole('link', { name: 'Saznajte više o digitalnom printu' })).toHaveAttribute('href', '/digital-print/');
    await service.getByRole('button', { name: /Rezanje vodenim mlazom/ }).click();
    await expect(service.getByRole('region', { name: /Digitalni print/ })).toBeHidden();
    await expect(service.getByRole('img', { name: 'Rezanje keramičkih pločica vodenim mlazom', exact: true }).filter({ visible: true })).toBeVisible();
    await service.getByRole('link', { name: 'Saznajte više o rezanju vodenim mlazom' }).click();
    await expect(page).toHaveURL(/\/water-jet\/$/);
  });
}

test('nepoznat projekat ne popunjava kontakt formu', async ({ page }) => {
  await page.goto('/kontakt/?projekat=nepoznat#upit');
  await expect(page.getByRole('textbox', { name: 'Poruka', exact: true })).toHaveValue('');
  await expect(page.locator('input[name="space"]:checked')).toHaveCount(0);
});
