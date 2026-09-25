import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveIndexable, resolveSiteUrl } from '@/lib/site-config';

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
    expect(config.siteHostname).toBe('memic.ba');
    expect(robots).toEqual({ rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://memic.ba/sitemap.xml' });
  });

  it('Vercel pregledna verzija ostaje noindex i uz SITE_INDEXABLE=true', () => {
    expect(resolveIndexable({ SITE_INDEXABLE: 'true', VERCEL_ENV: 'preview' })).toBe(false);
    expect(resolveIndexable({ SITE_INDEXABLE: 'true', VERCEL_ENV: 'development' })).toBe(false);
    expect(resolveIndexable({ SITE_INDEXABLE: 'true', VERCEL_ENV: 'production' })).toBe(true);
    expect(resolveIndexable({ VERCEL_ENV: 'production' })).toBe(false);
  });
});

describe('adresa stranice', () => {
  it('bez konfiguracije koristi memic.ba', () => {
    expect(resolveSiteUrl({})).toBe('https://memic.ba');
  });

  it('SITE_URL ima prednost i normalizuje se', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://memic.ba/', VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'memicdekor.vercel.app' })).toBe(
      'https://memic.ba',
    );
    expect(resolveSiteUrl({ SITE_URL: 'memic.ba' })).toBe('https://memic.ba');
  });

  it('na Vercel produkciji bez SITE_URL koristi produkcijsku domenu projekta', () => {
    expect(resolveSiteUrl({ VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'memicdekor.vercel.app' })).toBe(
      'https://memicdekor.vercel.app',
    );
  });

  it('na Vercel preview verziji koristi adresu grane, pa adresu deploymenta', () => {
    expect(
      resolveSiteUrl({ VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'memicdekor-git-grana.vercel.app', VERCEL_URL: 'memicdekor-abc.vercel.app' }),
    ).toBe('https://memicdekor-git-grana.vercel.app');
    expect(resolveSiteUrl({ VERCEL_ENV: 'preview', VERCEL_URL: 'memicdekor-abc.vercel.app' })).toBe('https://memicdekor-abc.vercel.app');
  });
});
