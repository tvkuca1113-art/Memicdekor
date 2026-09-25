// Provjera spremnosti za objavu. Ispisuje se na početku `next build` (i na Vercelu, u build logu).
// Ne zaustavlja build: upozorava na nepodešene servise i sadržaj koji još nedostaje.
// Koristi samo JSON i konfiguraciju, jer se učitava iz next.config.ts.

import generatedPhotos from '../content/generated/original-photos.json';
import photoIds from '../content/photo-ids.json';
import { resolveIndexable, resolveSiteUrl } from './site-config';

type Env = Record<string, string | undefined>;

export type ReadinessItem = {
  level: 'ok' | 'warn' | 'info';
  message: string;
};

export function deployReadiness(
  env: Env = process.env,
  available: Record<string, unknown> = generatedPhotos,
): ReadinessItem[] {
  const items: ReadinessItem[] = [];
  const siteUrl = resolveSiteUrl(env);
  const indexable = resolveIndexable(env);
  const onVercel = Boolean(env.VERCEL_ENV);
  const production = env.VERCEL_ENV === 'production' || (!onVercel && env.SITE_INDEXABLE === 'true');

  items.push({
    level: 'info',
    message: onVercel ? `Okruženje: Vercel ${env.VERCEL_ENV}` : 'Okruženje: lokalna izvedba',
  });

  items.push({ level: 'ok', message: `Adresa stranice (canonical, sitemap, Open Graph): ${siteUrl}` });

  if (indexable) {
    items.push({ level: 'ok', message: `Indeksiranje uključeno, samo za host ${new URL(siteUrl).hostname}` });
    if (new URL(siteUrl).hostname.endsWith('.vercel.app')) {
      items.push({
        level: 'warn',
        message: 'Indeksiranje je uključeno na *.vercel.app adresi. Dodajte domenu memic.ba i SITE_URL prije uključivanja.',
      });
    }
  } else {
    items.push({
      level: production ? 'warn' : 'info',
      message:
        env.SITE_INDEXABLE === 'true'
          ? 'Indeksiranje isključeno: SITE_INDEXABLE se poštuje samo na produkciji.'
          : 'Indeksiranje isključeno (noindex). Na produkciji postavite SITE_INDEXABLE=true nakon prelaska domene.',
    });
  }

  if (env.RESEND_API_KEY?.trim() && env.CONTACT_FROM_EMAIL?.trim()) {
    items.push({ level: 'ok', message: `Forma za upit šalje na ${env.CONTACT_TO_EMAIL?.trim() || 'info@memic.ba'}` });
  } else {
    items.push({
      level: production ? 'warn' : 'info',
      message:
        'Forma za upit: RESEND_API_KEY ili CONTACT_FROM_EMAIL nisu postavljeni. Forma javlja da poruka nije poslana i nudi e-mail i telefon.',
    });
  }

  const missing = (photoIds as string[]).filter((id) => !available[id]);
  if (missing.length === 0) {
    items.push({ level: 'ok', message: 'Sve originalne fotografije su dodane.' });
  } else {
    items.push({
      level: production ? 'warn' : 'info',
      message: `Nedostaju originalne fotografije (${missing.length}/${photoIds.length}): ${missing.join(', ')}. Na njihovom mjestu stoji oznaka „u pripremi”.`,
    });
  }

  return items;
}

export function formatReadiness(items: ReadinessItem[]): string {
  const symbol = { ok: '✓', warn: '!', info: '·' } as const;
  return ['Memić Dekor – provjera prije objave', ...items.map((item) => `  ${symbol[item.level]} ${item.message}`)].join('\n');
}
