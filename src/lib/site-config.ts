// Centralna konfiguracija domene i indeksiranja.
// Koristi se u aplikaciji i u next.config.ts, pa ne smije uvoziti React ni Next module.

type Env = Record<string, string | undefined>;

const DEFAULT_SITE_URL = 'https://memic.ba';

function originOf(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return new URL(withProtocol).origin;
}

/**
 * Javna adresa stranice, redom:
 * 1. SITE_URL (preporučeno na produkciji: https://memic.ba),
 * 2. na Vercel produkciji: produkcijska domena projekta (VERCEL_PROJECT_PRODUCTION_URL),
 * 3. na Vercel preview verziji: adresa grane ili deploymenta,
 * 4. inače https://memic.ba.
 */
export function resolveSiteUrl(env: Env = process.env): string {
  const explicit = env.SITE_URL?.trim();
  if (explicit) return originOf(explicit);
  if (env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return originOf(env.VERCEL_PROJECT_PRODUCTION_URL);
  }
  if (env.VERCEL_ENV && env.VERCEL_ENV !== 'production') {
    const host = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
    if (host) return originOf(host);
  }
  return DEFAULT_SITE_URL;
}

/**
 * Indeksiranje je dozvoljeno samo kada je eksplicitno uključeno (SITE_INDEXABLE=true).
 * Na Vercelu se pregledne verzije (preview/development) nikad ne indeksiraju.
 */
export function resolveIndexable(env: Env = process.env): boolean {
  return env.SITE_INDEXABLE === 'true' && (env.VERCEL_ENV === undefined || env.VERCEL_ENV === 'production');
}

/** Javna adresa stranice bez završne kose crte, npr. https://memic.ba */
export const siteUrl = resolveSiteUrl();

/** Ime hosta kanonske domene, npr. memic.ba */
export const siteHostname = new URL(siteUrl).hostname;

export const isIndexable = resolveIndexable();

/** Apsolutni URL za putanju unutar stranice. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteUrl}/`).toString();
}
