import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadRobots() {
  vi.resetModules();
  const [{ default: robots }, config] = await Promise.all([import('@/app/robots'), import('@/lib/site-config')]);
  return { robots: robots(), config };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('indeksiranje', () => {
  it('bez konfiguracije stranica nije indeksabilna', async () => {
    vi.stubEnv('SITE_INDEXABLE', '');
    const { robots, config } = await loadRobots();
    expect(config.isIndexable).toBe(false);
    expect(robots.rules).toEqual([{ userAgent: '*', disallow: '/' }]);
    expect(robots.sitemap).toBeUndefined();
  });

  it('produkcija s SITE_INDEXABLE=true dozvoljava indeksiranje i navodi sitemap', async () => {
    vi.stubEnv('SITE_INDEXABLE', 'true');
    vi.stubEnv('SITE_URL', 'https://memic.ba/');
    const { robots, config } = await loadRobots();
    expect(config.isIndexable).toBe(true);
    expect(config.siteUrl).toBe('https://memic.ba');
    expect(robots).toEqual({ rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://memic.ba/sitemap.xml' });
  });

  it('Vercel pregledna verzija ostaje noindex i uz SITE_INDEXABLE=true', async () => {
    vi.stubEnv('SITE_INDEXABLE', 'true');
    vi.stubEnv('VERCEL_ENV', 'preview');
    const { config } = await loadRobots();
    expect(config.isIndexable).toBe(false);
  });
});
