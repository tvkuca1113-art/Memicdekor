import type { PhotoKey } from './images';

// Ponuda: prostori, kategorije, katalog i izrada po mjeri.
// Samo provjerena ponuda; bez cijena, zaliha, rokova i izmišljenih proizvoda.

export type LinkItem = {
  label: string;
  href: string;
};

export type Space = {
  photo: PhotoKey;
  id: string;
  title: string;
  text: string;
  links: LinkItem[];
};

export type Category = {
  id: string;
  title: string;
  text: string;
  href: string;
};

export type CatalogItem = {
  title: string;
  text: string;
};

export type CatalogSection = {
  id: string;
  title: string;
  intro: string;
  items?: CatalogItem[];
  /** Proizvodi iz ranijeg kataloga na memic.ba, zadržani radi kontinuiteta. */
  legacyProducts?: { name: string; note: string }[];
};

export type CustomItem = {
  id: string;
  title: string;
  text: string;
};

export const offerFocus =
  'Bavimo se keramikom: pločicama i velikim formatima, keramičkim površinama po mjeri, umivaonicima i sanitarnom opremom.';

export const spaces: Space[] = [
  {
    id: 'kuhinja',
    photo: 'kuhinjaCrema',
    title: 'Kuhinja',
    text: 'Keramičke kuhinjske ploče i stolovi izrađeni po mjeri, te pločice i veliki formati za zid i pod.',
    links: [
      { label: 'Kuhinjske ploče i stolovi', href: '/proizvodnja/#kuhinjske-ploce-i-stolovi' },
      { label: 'Pločice i veliki formati', href: '/proizvodi/#keramicke-plocice' },
    ],
  },
  {
    id: 'kupatilo',
    photo: 'kupatilo',
    title: 'Kupatilo',
    text: 'Umivaonici i sanitarna oprema, pločice i mozaici. Keramičke umivaonike i postolja izrađujemo i po mjeri.',
    links: [
      { label: 'Umivaonici i sanitarije', href: '/proizvodi/#umivaonici' },
      { label: 'Umivaonici po mjeri', href: '/proizvodnja/#umivaonici-i-postolja' },
    ],
  },
  {
    id: 'ostali-prostori',
    photo: 'dnevniBoravak',
    title: 'Dnevni boravak i drugi prostori',
    text: 'Keramičke ploče za stolove, gazišta i okapnice po mjeri, zidni i podni mozaici te bazenska keramika.',
    links: [
      { label: 'Gazišta i okapnice', href: '/proizvodnja/#gazista-i-okapnice' },
      { label: 'Bazenska keramika i mozaici', href: '/proizvodi/#bazenska-keramika' },
    ],
  },
];

export const categories: Category[] = [
  {
    id: 'keramicke-plocice',
    title: 'Keramičke pločice i veliki formati',
    text: 'Pločice za zid i pod, veliki formati, mozaici i bazenska keramika.',
    href: '/proizvodi/#keramicke-plocice',
  },
  {
    id: 'umivaonici-i-sanitarije',
    title: 'Umivaonici i sanitarije',
    text: 'Nadgradni i podgradni umivaonici te sanitarna oprema za kupatilo.',
    href: '/proizvodi/#umivaonici',
  },
  {
    id: 'izrada-po-mjeri',
    title: 'Izrada po mjeri',
    text: 'Keramički umivaonici, kuhinjske ploče, stolovi, gazišta, okapnice i mozaici po vašim mjerama.',
    href: '/proizvodnja/',
  },
];

export const catalogSections: CatalogSection[] = [
  {
    id: 'keramicke-plocice',
    title: 'Keramičke pločice i veliki formati',
    intro:
      'Pločice za zid i pod, uključujući velike formate. Formate, dekore i završne obrade najbolje je pogledati uživo u salonu, gdje ćemo vam pomoći s izborom.',
    items: [
      { title: 'Zidne i podne pločice', text: 'Za kuhinje, kupatila i ostale prostore.' },
      { title: 'Veliki formati', text: 'Za zidove, podove i keramičke površine izrađene po mjeri.' },
    ],
  },
  {
    id: 'bazenska-keramika',
    title: 'Bazenska keramika i mozaici',
    intro:
      'Mozaik nudimo u plavim, bež i narandžastim tonovima, a bazensku keramiku u plavim i zelenim nijansama. Mozaike slažemo i po vašem izboru boja.',
  },
  {
    id: 'umivaonici',
    title: 'Umivaonici',
    intro: 'Umivaonici za kupatilo u različitim oblicima, dimenzijama i završnim obradama.',
    items: [
      {
        title: 'Nadgradni umivaonici',
        text: 'Bogat izbor dimenzija i dizajna, od jednostavnijih oblika i boja do luksuznijih mramornih ili zlatnih umivaonika.',
      },
      {
        title: 'Podgradni umivaonici',
        text: 'Izrađuju se od keramike po vašem izboru, u odgovarajućim dimenzijama. Oblici: mala elipsa, velika elipsa, kocka i pravougaonik.',
      },
    ],
  },
  {
    id: 'sanitarije',
    title: 'Sanitarna oprema',
    intro: 'Sanitarije za kupatilo, uključujući WC šolje. Za dostupne modele pošaljite upit ili nas posjetite u salonu.',
    legacyProducts: [{ name: 'B2351MC', note: 'WC šolja iz ranijeg kataloga' }],
  },
];

export const customItems: CustomItem[] = [
  {
    id: 'umivaonici-i-postolja',
    title: 'Umivaonici i postolja',
    text: 'Keramički umivaonici i postolja za umivaonike. Podgradne umivaonike izrađujemo od keramike po vašem izboru, u oblicima mala elipsa, velika elipsa, kocka ili pravougaonik.',
  },
  {
    id: 'kuhinjske-ploce-i-stolovi',
    title: 'Kuhinjske ploče i stolovi',
    text: 'Keramičke radne ploče i stolovi izrađeni prema mjerama vašeg prostora.',
  },
  {
    id: 'gazista-i-okapnice',
    title: 'Gazišta i okapnice',
    text: 'Keramička gazišta za stepenice i okapnice, izrezani na tražene dimenzije.',
  },
  {
    id: 'mozaici',
    title: 'Zidni i podni mozaici',
    text: 'Keramiku režemo na različite dimenzije i slažemo u mozaike, u bojama i tonovima po vašem izboru.',
  },
];

export const productionSteps: CatalogItem[] = [
  {
    title: 'Ideja i mjere',
    text: 'Dogovaramo izgled, mjere i materijal prema vašem prostoru, skici ili projektu.',
  },
  {
    title: 'Izbor materijala',
    text: 'Keramiku birate iz naše ponude. Za rezanje možete donijeti i vlastiti materijal.',
  },
  {
    title: 'Izrada',
    text: 'Rezanje, obrada i izrada u proizvodnji koja se nalazi u sklopu našeg salona u Mostaru.',
  },
];
