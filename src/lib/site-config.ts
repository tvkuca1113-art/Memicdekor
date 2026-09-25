// Centralna konfiguracija domene i indeksiranja.
// Koristi se u aplikaciji i u next.config.ts, pa ne smije uvoziti React ni Next module.

const DEFAULT_SITE_URL = 'https://memic.ba';

function normalizeSiteUrl(value: string | undefined): string {
  const raw = (value ?? '').trim() || DEFAULT_SITE_URL;
  const url = new URL(raw);
  return url.origin;
}

/** Javna adresa stranice bez završne kose crte, npr. https://memic.ba */
export const siteUrl = normalizeSiteUrl(process.env.SITE_URL);

/**
 * Indeksiranje je dozvoljeno samo kada je eksplicitno uključeno (SITE_INDEXABLE=true).
 * Na Vercelu se pregledne verzije (preview/development) nikad ne indeksiraju.
 */
export const isIndexable =
  process.env.SITE_INDEXABLE === 'true' &&
  (process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === 'production');

/** Apsolutni URL za putanju unutar stranice. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteUrl}/`).toString();
}
