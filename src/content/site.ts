// Osnovni podaci o firmi, kontakti i navigacija.
// Mijenjajte samo provjerene podatke. Nepotvrđene stavke su popisane u docs/PREDAJA.md.

export type NavItem = {
  label: string;
  href: string;
  /** Dodatne putanje koje pripadaju istoj sekciji (za označavanje aktivne stavke). */
  section?: string[];
};

export type SocialProfile = {
  name: 'Instagram' | 'Facebook';
  label: string;
  href: string;
};

export const company = {
  name: 'Memić Dekor',
  legalName: 'Memić Dekor d.o.o.',
  descriptor: 'studio keramike',
  city: 'Mostar',
  phone: {
    display: '+387 36 281 301',
    href: 'tel:+38736281301',
  },
  email: {
    display: 'info@memic.ba',
    href: 'mailto:info@memic.ba',
  },
  address: {
    street: 'Maršala Tita 294',
    postalCode: '88000',
    city: 'Mostar',
    country: 'Bosna i Hercegovina',
    countryCode: 'BA',
  },
  /** Pretraga adrese na Google kartama; bez izmišljenih koordinata. */
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Memić Dekor, Maršala Tita 294, 88000 Mostar'),
} as const;

export const socialProfiles: SocialProfile[] = [
  {
    name: 'Instagram',
    label: 'Instagram @memicdekor_',
    href: 'https://www.instagram.com/memicdekor_/',
  },
  {
    name: 'Facebook',
    label: 'Facebook: Memić Dekor Mostar',
    href: 'https://www.facebook.com/memicdekormostar/',
  },
];

export const mainNav: NavItem[] = [
  { label: 'Proizvodi', href: '/proizvodi/' },
  { label: 'Izrada po mjeri', href: '/proizvodnja/' },
  { label: 'Usluge', href: '/usluge/', section: ['/digital-print/', '/water-jet/'] },
  { label: 'O nama', href: '/o-nama/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const footerNav: NavItem[] = [
  { label: 'Početna', href: '/' },
  ...mainNav.slice(0, 3),
  { label: 'Digitalni print', href: '/digital-print/' },
  { label: 'Rezanje vodenim mlazom', href: '/water-jet/' },
  ...mainNav.slice(3),
];

/** Glavna radnja na cijeloj stranici. */
export const primaryCta = {
  label: 'Pošaljite upit',
  href: '/kontakt/#upit',
} as const;

/** Sekundarna radnja. */
export const secondaryCta = {
  label: 'Pogledajte proizvodnju',
  href: '/proizvodnja/',
} as const;

export const formattedAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;
