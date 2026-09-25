// Usluge: kratki opisi za početnu stranicu i sadržaj podstranica.
// Izvor: sadržaj stranica memic.ba/usluge, /digital-print i /water-jet (vidi docs/PREDAJA.md).

import type { PhotoKey } from './images';

export type Service = {
  id: string;
  title: string;
  /** Kratak opis za karticu na početnoj stranici. */
  summary: string;
  href: string;
  linkLabel: string;
  photo: PhotoKey;
};

export const services: Service[] = [
  {
    id: 'rezanje-keramike',
    title: 'Rezanje keramike',
    summary: 'Precizno rezanje keramičkih ploča dijamantnim alatom, na mjere iz vašeg projekta.',
    href: '/usluge/#rezanje-dijamantnim-alatom',
    linkLabel: 'o rezanju keramike',
    photo: 'postolje',
  },
  {
    id: 'digitalni-print',
    title: 'Digitalni print',
    summary: 'Vaš motiv, fotografija ili dekor otisnut na keramici, u dimenzijama prilagođenim prostoru.',
    href: '/digital-print/',
    linkLabel: 'o digitalnom printu',
    photo: 'digitalniPrint',
  },
  {
    id: 'water-jet',
    title: 'Rezanje vodenim mlazom',
    summary: 'Složeni oblici i precizni detalji u keramici, kamenu, staklu i željezu.',
    href: '/water-jet/',
    linkLabel: 'o rezanju vodenim mlazom',
    photo: 'waterJet',
  },
];
