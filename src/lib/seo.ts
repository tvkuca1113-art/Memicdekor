import type { Metadata } from 'next';
import { company } from '@/content/site';
import { pages, type PageKey } from '@/content/pages';

export const ogImage = {
  url: '/og/memic-dekor.jpg',
  width: 1200,
  height: 630,
  alt: 'Memić Dekor – studio keramike, Mostar',
};

/** Metapodaci jedne stranice: title, description, canonical i Open Graph. */
export function pageMetadata(key: PageKey): Metadata {
  const page = pages[key];
  const fullTitle = key === 'home' ? page.title : `${page.title} | ${company.name}`;
  return {
    title: key === 'home' ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: 'website',
      locale: 'bs_BA',
      siteName: company.name,
      url: page.path,
      title: fullTitle,
      description: page.description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page.description,
      images: [ogImage.url],
    },
  };
}
