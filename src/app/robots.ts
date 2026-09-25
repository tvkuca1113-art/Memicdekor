import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/site-config';

// Bez eksplicitne produkcijske konfiguracije (SITE_INDEXABLE=true) stranica se ne indeksira.
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
