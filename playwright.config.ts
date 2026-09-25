import { defineConfig, devices } from '@playwright/test';
import { CONFIGURED_URL, UNCONFIGURED_URL } from './tests/e2e/helpers';

// Testovi rade nad produkcijskom izvedbom (npm run build) na dva servera:
// 3200 sa slanjem preko lokalne zamjene za Resend, 3201 bez podešenog slanja.
const MOCK_PORT = 3299;

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list']],
  use: {
    baseURL: CONFIGURED_URL,
    trace: 'retain-on-failure',
    locale: 'bs-BA',
    // Glatko skrolanje ometa stabilne klikove; poseban test provjerava obje postavke.
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: [
    {
      command: `node tests/e2e/mock-resend.mjs`,
      url: `http://127.0.0.1:${MOCK_PORT}/health`,
      env: { MOCK_RESEND_PORT: String(MOCK_PORT) },
      reuseExistingServer: false,
    },
    {
      command: 'npx next start --hostname 127.0.0.1 -p 3200',
      url: `${CONFIGURED_URL}/`,
      env: {
        RESEND_API_KEY: 'test-kljuc',
        CONTACT_FROM_EMAIL: 'Web upit <upit@memic.ba>',
        CONTACT_TO_EMAIL: 'info@memic.ba',
        RESEND_API_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
      },
      reuseExistingServer: false,
    },
    {
      command: 'npx next start --hostname 127.0.0.1 -p 3201',
      url: `${UNCONFIGURED_URL}/`,
      env: { RESEND_API_KEY: '', CONTACT_FROM_EMAIL: '' },
      reuseExistingServer: false,
    },
  ],
});
