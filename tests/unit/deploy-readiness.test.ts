import { describe, expect, it } from 'vitest';
import photoIds from '@/content/photo-ids.json';
import { photos } from '@/content/images';
import { deployReadiness, formatReadiness } from '@/lib/deploy-readiness';

const allPhotos = Object.fromEntries(photoIds.map((id) => [id, { src: `/images/originali/${id}.jpg` }]));

describe('provjera prije objave', () => {
  it('lokalno samo informiše o nepodešenim servisima i fotografijama', () => {
    const items = deployReadiness({}, {});
    expect(items.filter((item) => item.level === 'warn')).toEqual([]);
    expect(formatReadiness(items)).toContain('Adresa stranice (canonical, sitemap, Open Graph): https://memic.ba');
    expect(formatReadiness(items)).toContain(`Nedostaju originalne fotografije (${photoIds.length}/${photoIds.length})`);
  });

  it('na Vercel produkciji upozorava na formu, indeksiranje i fotografije', () => {
    const items = deployReadiness({ VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'memic.ba' }, {});
    const warnings = items.filter((item) => item.level === 'warn').map((item) => item.message);
    expect(warnings).toHaveLength(3);
    expect(warnings.join('\n')).toMatch(/SITE_INDEXABLE=true/);
    expect(warnings.join('\n')).toMatch(/RESEND_API_KEY/);
    expect(warnings.join('\n')).toMatch(/Nedostaju originalne fotografije/);
  });

  it('potpuno podešena produkcija nema upozorenja', () => {
    const items = deployReadiness(
      {
        VERCEL_ENV: 'production',
        SITE_URL: 'https://memic.ba',
        SITE_INDEXABLE: 'true',
        RESEND_API_KEY: 're_test',
        CONTACT_FROM_EMAIL: 'Web upit <upit@memic.ba>',
      },
      allPhotos,
    );
    expect(items.filter((item) => item.level === 'warn')).toEqual([]);
    expect(formatReadiness(items)).toContain('Indeksiranje uključeno, samo za host memic.ba');
  });

  it('upozorava ako je indeksiranje uključeno na *.vercel.app adresi', () => {
    const items = deployReadiness({ VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'memicdekor.vercel.app', SITE_INDEXABLE: 'true' }, allPhotos);
    expect(items.some((item) => item.level === 'warn' && item.message.includes('*.vercel.app'))).toBe(true);
  });

  it('popis id-jeva fotografija odgovara evidenciji u images.ts', () => {
    expect(Object.values(photos).map((photo) => photo.id).sort()).toEqual([...photoIds].sort());
  });
});
