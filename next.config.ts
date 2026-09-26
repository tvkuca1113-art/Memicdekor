import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import generatedPhotos from './src/content/generated/original-photos.json';
import photoSources from './src/content/photo-sources.json';
import { legacyRedirects } from './src/content/redirects';
import { deployReadiness, formatReadiness } from './src/lib/deploy-readiness';
import { isIndexable, siteHostname } from './src/lib/site-config';

type GeneratedPhoto = { src: string };

// Stare adrese originalnih fotografija (wp-content/uploads) vode na nove lokalne datoteke,
// ali samo za fotografije koje su stvarno preuzete i provjerene.
const photoRedirects = Object.entries(photoSources as Record<string, string>).flatMap(([id, sourceUrl]) => {
  const file = (generatedPhotos as Record<string, GeneratedPhoto | undefined>)[id];
  if (!file) return [];

  const source = new URL(sourceUrl);
  // 301 je potreban samo za stare direktne WordPress URL-ove slika.
  // Izvor može biti i Instagram objava ili obična stranica memic.ba; takve stranice
  // nikada ne preusmjeravamo na lokalnu JPG datoteku.
  if (source.hostname !== 'memic.ba' && source.hostname !== 'www.memic.ba') return [];
  if (!source.pathname.startsWith('/wp-content/uploads/')) return [];

  return [{ source: source.pathname, destination: file.src, statusCode: 301 as const }];
});

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const noindex = { key: 'X-Robots-Tag', value: 'noindex, nofollow' };

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75],
  },
  async redirects() {
    return [
      ...legacyRedirects.map((redirect) => ({
        source: redirect.from,
        destination: redirect.to,
        statusCode: 301 as const,
      })),
      ...photoRedirects,
    ];
  },
  async headers() {
    // Pregledne verzije i lokalne izvedbe ne smiju u indeks pretraživača.
    if (!isIndexable) return [{ source: '/:path*', headers: [...securityHeaders, noindex] }];
    return [
      { source: '/:path*', headers: securityHeaders },
      // Na produkciji se indeksira samo kanonska domena; *.vercel.app i ostali hostovi dobijaju noindex.
      {
        source: '/:path*',
        missing: [{ type: 'host', value: escapeRegex(siteHostname) }],
        headers: [noindex],
      },
    ];
  },
};

export default function config(phase: string): NextConfig {
  // Build učitava konfiguraciju i u radnim procesima; izvještaj se ispisuje samo jednom.
  if (phase === PHASE_PRODUCTION_BUILD && !process.env.MEMIC_READINESS_PRINTED) {
    process.env.MEMIC_READINESS_PRINTED = '1';
    console.log(`\n${formatReadiness(deployReadiness())}\n`);
  }
  return nextConfig;
}
