// Metapodaci i naslovi svih stranica na jednom mjestu.

export type PageKey =
  | 'home'
  | 'proizvodi'
  | 'proizvodnja'
  | 'usluge'
  | 'digitalPrint'
  | 'waterJet'
  | 'oNama'
  | 'kontakt';

export type PageMeta = {
  path: string;
  /** <title>; na podstranicama se dodaje „ | Memić Dekor”. */
  title: string;
  description: string;
  /** Naziv u navigaciji mrvica (breadcrumb). */
  breadcrumb: string;
};

export const pages: Record<PageKey, PageMeta> = {
  home: {
    path: '/',
    title: 'Keramika i izrada po mjeri u Mostaru | Memić Dekor',
    description:
      'Salon keramike u Mostaru: keramičke pločice i veliki formati, umivaonici i sanitarna oprema te izrada po mjeri od keramike. Pošaljite upit.',
    breadcrumb: 'Početna',
  },
  proizvodi: {
    path: '/proizvodi/',
    title: 'Keramičke pločice, umivaonici i sanitarije',
    description:
      'Keramičke pločice i veliki formati, bazenska keramika i mozaici, nadgradni i podgradni umivaonici te sanitarna oprema u salonu Memić Dekor u Mostaru.',
    breadcrumb: 'Proizvodi',
  },
  proizvodnja: {
    path: '/proizvodnja/',
    title: 'Izrada po mjeri od keramike',
    description:
      'Izrada po mjeri od keramike: umivaonici i postolja, kuhinjske ploče, stolovi, gazišta, okapnice i mozaici. Proizvodnja u sklopu salona u Mostaru.',
    breadcrumb: 'Izrada po mjeri',
  },
  usluge: {
    path: '/usluge/',
    title: 'Rezanje keramike i digitalni print',
    description:
      'Rezanje keramike dijamantnim alatom i vodenim mlazom te digitalni print na keramici. Moguće je i rezanje vašeg materijala. Memić Dekor, Mostar.',
    breadcrumb: 'Usluge',
  },
  digitalPrint: {
    path: '/digital-print/',
    title: 'Digitalni print na keramici',
    description:
      'Digitalni print na keramici: vaša fotografija, dekor ili umjetničko djelo otisnuto na keramičkim pločicama, u dimenzijama prilagođenim prostoru.',
    breadcrumb: 'Digitalni print',
  },
  waterJet: {
    path: '/water-jet/',
    title: 'Rezanje vodenim mlazom (water jet)',
    description:
      'Rezanje vodenim mlazom pod visokim pritiskom za složene oblike u keramici, kamenu, staklu i željezu, bez oštećenja i pukotina. Memić Dekor, Mostar.',
    breadcrumb: 'Rezanje vodenim mlazom',
  },
  oNama: {
    path: '/o-nama/',
    title: 'O nama – studio keramike u Mostaru',
    description:
      'Memić Dekor d.o.o. je studio keramike iz Mostara: salon s pločicama, umivaonicima i sanitarnom opremom te proizvodnja keramike po mjeri.',
    breadcrumb: 'O nama',
  },
  kontakt: {
    path: '/kontakt/',
    title: 'Kontakt i upit',
    description:
      'Kontakt Memić Dekor: Maršala Tita 294, 88000 Mostar, telefon +387 36 281 301, e-mail info@memic.ba. Pošaljite upit putem forme.',
    breadcrumb: 'Kontakt',
  },
};

/** Stranice u mapi stranice (sitemap), redoslijedom važnosti. */
export const sitemapPages: PageKey[] = [
  'home',
  'proizvodi',
  'proizvodnja',
  'usluge',
  'digitalPrint',
  'waterJet',
  'oNama',
  'kontakt',
];
