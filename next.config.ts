import type { NextConfig } from 'next';
import generatedPhotos from './src/content/generated/original-photos.json';
import photoSources from './src/content/photo-sources.json';
import { legacyRedirects } from './src/content/redirects';
import { isIndexable } from './src/lib/site-config';

type GeneratedPhoto = { src: string };

// Stare adrese originalnih fotografija (wp-content/uploads) vode na nove lokalne datoteke,
// ali samo za fotografije koje su stvarno preuzete i provjerene.
const photoRedirects = Object.entries(photoSources as Record<string, string>).flatMap(([id, sourceUrl]) => {
  const file = (generatedPhotos as Record<string, GeneratedPhoto | undefined>)[id];
  if (!file) return [];
  const { pathname } = new URL(sourceUrl);
  return [{ source: pathname, destination: file.src, statusCode: 301 as const }];
});

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

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
    const headers = [...securityHeaders];
    // Pregledne verzije i lokalne izvedbe ne smiju u indeks pretraživača.
    if (!isIndexable) headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
    return [{ source: '/:path*', headers }];
  },
};

export default nextConfig;
