// Strukturirani podaci (schema.org) samo s provjerenim podacima:
// bez koordinata, radnog vremena, ocjena i cijena.

import { company, socialProfiles } from '@/content/site';
import { pages, type PageKey } from '@/content/pages';
import { absoluteUrl } from './site-config';

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': absoluteUrl('/#firma'),
    name: company.name,
    legalName: company.legalName,
    description:
      'Studio keramike u Mostaru: keramičke pločice i veliki formati, umivaonici, sanitarna oprema i izrada po mjeri od keramike.',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/brand/memic-dekor-logo.png'),
    image: absoluteUrl('/brand/memic-dekor-logo.png'),
    telephone: company.phone.display,
    email: company.email.display,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressCountry: company.address.countryCode,
    },
    hasMap: company.mapUrl,
    sameAs: socialProfiles.map((profile) => profile.href),
  };
}

export function breadcrumbJsonLd(trail: PageKey[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((key, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: pages[key].breadcrumb,
      item: absoluteUrl(pages[key].path),
    })),
  };
}

/** Siguran JSON za <script type="application/ld+json">. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
