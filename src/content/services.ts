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
  applications: string[];
  imageNote: string;
};

export const services: Service[] = [
  {
    id: 'rezanje-keramike',
    title: 'Rezanje keramike',
    summary: 'Keramičke ploče režemo dijamantnim alatom prema potrebnim dimenzijama. Od velikog formata do završnog ruba, obrada prati vaš projekt.',
    href: '/usluge/#rezanje-dijamantnim-alatom',
    linkLabel: 'o rezanju keramike',
    photo: 'gazista',
    applications: ['Pločice i mozaici', 'Gazišta i okapnice', 'Površine po mjeri'],
    imageNote: 'Primjer gotove izrade: keramička gazišta u našem salonu.',
  },
  {
    id: 'digitalni-print',
    title: 'Digitalni print',
    summary: 'Vaš motiv, fotografija ili dekor otisnut na keramici, u dimenzijama prilagođenim prostoru.',
    href: '/digital-print/',
    linkLabel: 'o digitalnom printu',
    photo: 'digitalniPrint',
    applications: ['Fotografije i panorame', 'Dekorativni motivi', 'Zidne kompozicije'],
    imageNote: 'Primjer digitalnog printa: motiv Starog mosta na keramici.',
  },
  {
    id: 'water-jet',
    title: 'Rezanje vodenim mlazom',
    summary: 'Složeni oblici i precizni detalji u keramici, kamenu, staklu i željezu.',
    href: '/water-jet/',
    linkLabel: 'o rezanju vodenim mlazom',
    photo: 'waterJet',
    applications: ['Složeni oblici i otvori', 'Keramika, kamen i staklo', 'Rezanje željeza'],
    imageNote: 'Prikaz rezanja vodenim mlazom s originalne stranice Memić Dekora.',
  },
];
