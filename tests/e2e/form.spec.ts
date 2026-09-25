import { expect, test, type Page } from '@playwright/test';
import { MOCK_URL, UNCONFIGURED_URL } from './helpers';

type SentEmail = { id: string; to: string[]; subject: string; text: string; reply_to?: string };

function inquiryForm(page: Page) {
  return page.locator('#upit form');
}

async function fillValid(page: Page, message: string) {
  const form = inquiryForm(page);
  await form.getByLabel('Ime').fill('Amra Test');
  await form.getByLabel('E-mail ili telefon').fill('amra@primjer.ba');
  await form.getByRole('radio', { name: 'Kupatilo' }).check();
  await form.getByLabel('Poruka').fill(message);
}

test.describe('forma za upit', () => {
  test('prazna forma prikazuje razumljive greške i fokusira prvo polje', async ({ page }) => {
    await page.goto('/kontakt/');
    const form = inquiryForm(page);
    await form.getByRole('button', { name: 'Pošaljite upit' }).click();

    await expect(form.getByText('Upišite ime.')).toBeVisible();
    await expect(form.getByText('Upišite e-mail adresu ili broj telefona.')).toBeVisible();
    await expect(form.getByText('Odaberite šta uređujete.')).toBeVisible();
    await expect(form.getByText('Napišite kratku poruku.')).toBeVisible();

    const name = form.getByLabel('Ime');
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAccessibleDescription('Upišite ime.');

    await name.fill('Amra');
    await expect(form.getByText('Upišite ime.')).toBeHidden();
    await expect(form.getByText('Napišite kratku poruku.')).toBeVisible();
  });

  test('neispravan kontakt i prekratka poruka se ne šalju', async ({ page }) => {
    await page.goto('/');
    const form = inquiryForm(page);
    await form.getByLabel('Ime').fill('Amra');
    await form.getByLabel('E-mail ili telefon').fill('amra@');
    await form.getByRole('radio', { name: 'Kuhinju' }).check();
    await form.getByLabel('Poruka').fill('Kratko');
    await form.getByRole('button', { name: 'Pošaljite upit' }).click();
    await expect(form.getByText(/Upišite ispravnu e-mail adresu/)).toBeVisible();
    await expect(form.getByText(/najmanje 10 znakova/)).toBeVisible();
    await expect(form.getByLabel('E-mail ili telefon')).toBeFocused();
    await expect(page.getByText('Hvala, vaš upit je poslan.')).toHaveCount(0);
  });

  test('uspjeh se prikazuje tek nakon potvrde servisa za e-mail', async ({ page, request }) => {
    const marker = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await page.goto('/kontakt/');
    await fillValid(page, `Trebam umivaonik po mjeri. ${marker} [simuliraj-sporo]`);
    const form = inquiryForm(page);
    await form.getByRole('button', { name: 'Pošaljite upit' }).click();

    await expect(form.getByRole('button', { name: 'Šaljem upit…' })).toBeVisible();
    await expect(form).toHaveAttribute('aria-busy', 'true');

    const success = page.getByRole('status').filter({ hasText: 'Hvala, vaš upit je poslan.' });
    await expect(success).toBeVisible({ timeout: 10_000 });
    await expect(success).toBeFocused();

    const sent: SentEmail[] = await (await request.get(`${MOCK_URL}/__sent`)).json();
    const email = sent.find((item) => item.text.includes(marker));
    expect(email, 'servis nije primio poruku').toBeDefined();
    expect(email!.to).toEqual(['info@memic.ba']);
    expect(email!.reply_to).toBe('amra@primjer.ba');
    expect(email!.subject).toBe('Upit s web stranice: Kupatilo – Amra Test');
    expect(email!.text).toContain('Ime: Amra Test');

    await page.getByRole('button', { name: 'Pošaljite novi upit' }).click();
    await expect(page.locator('#upit form').getByLabel('Ime')).toBeFocused();
    await expect(page.locator('#upit form').getByLabel('Ime')).toHaveValue('');
  });

  test('greška servisa ne prikazuje uspjeh i čuva uneseni tekst', async ({ page }) => {
    await page.goto('/kontakt/');
    const message = 'Ovo je test greške pri slanju. [simuliraj-gresku]';
    await fillValid(page, message);
    const form = inquiryForm(page);
    await form.getByRole('button', { name: 'Pošaljite upit' }).click();

    const alert = page.getByRole('alert').filter({ hasText: 'Upit nije poslan.' });
    await expect(alert).toBeVisible({ timeout: 10_000 });
    await expect(alert).toBeFocused();
    await expect(page.getByText('Hvala, vaš upit je poslan.')).toHaveCount(0);
    await expect(form.getByLabel('Poruka')).toHaveValue(message);

    const mailto = alert.getByRole('link', { name: /Pošaljite e-mail/ });
    const href = await mailto.getAttribute('href');
    expect(href).toMatch(/^mailto:info@memic\.ba\?/);
    expect(decodeURIComponent(href!)).toContain(message);
    await expect(alert.getByRole('link', { name: /Nazovite/ })).toHaveAttribute('href', 'tel:+38736281301');
  });

  test('bez podešenog servisa forma jasno javlja da poruka nije poslana', async ({ page }) => {
    await page.goto(`${UNCONFIGURED_URL}/kontakt/`);
    await fillValid(page, 'Upit bez podešenog servisa za slanje.');
    await inquiryForm(page).getByRole('button', { name: 'Pošaljite upit' }).click();
    const alert = page.locator('#upit').getByRole('alert');
    await expect(alert).toContainText('Upit trenutno nije moguće poslati putem forme.', { timeout: 10_000 });
    await expect(alert).toContainText('vaša poruka nije poslana');
    await expect(page.getByText('Hvala, vaš upit je poslan.')).toHaveCount(0);
  });

  test('bez JavaScripta server i dalje provjerava i vraća greške', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/kontakt/');
    const form = page.locator('#upit form');
    await form.locator('input[name="name"]').fill('Amra');
    await form.locator('input[name="contact"]').fill('nije-kontakt');
    // Enter u polju šalje formu klasičnim POST zahtjevom (bez JavaScripta).
    await Promise.all([
      page.waitForResponse((response) => response.request().method() === 'POST'),
      form.locator('input[name="contact"]').press('Enter'),
    ]);
    await expect(page.getByText(/Upišite ispravnu e-mail adresu/)).toBeVisible();
    await expect(page.locator('#upit form input[name="name"]')).toHaveValue('Amra');
    await context.close();
  });
});
