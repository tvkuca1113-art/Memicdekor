// Evidencija fotografija: porijeklo, zasluge i status.
// Originalne fotografije firme dodaju se skriptom (npm run photos:fetch ili photos:add),
// koja provjerava datoteku i upisuje je u generated/original-photos.json.
// Dok datoteka ne postoji, stranica prikazuje jasno označeno mjesto za fotografiju.

import heroDesktop from '@/assets/hero/kuhinja-ostrvo-desktop.jpg';
import heroMobile from '@/assets/hero/kuhinja-ostrvo-mobitel.jpg';
import generated from './generated/original-photos.json';
import photoSources from './photo-sources.json';

export type PhotoOrigin =
  /** Stvarna fotografija proizvoda, izrade ili salona Memić Dekor. */
  | 'original'
  /** Ilustrativni prikaz; ne predstavlja stvarni projekat firme. */
  | 'illustrative';

export type PhotoFile = {
  src: string;
  width: number;
  height: number;
};

export type PhotoEntry = {
  id: string;
  alt: string;
  /** Kratak opis ispod fotografije (opcionalno). */
  caption?: string;
  origin: PhotoOrigin;
  /** Izvorna objava fotografije, ako postoji. */
  sourceUrl?: string;
  /** Zasluge fotografa ili partnera, ako su poznate. */
  credit?: string;
  /** Fokus kadra za object-position, npr. '50% 40%'. */
  focus?: string;
  /** Lokalna datoteka; bez nje se prikazuje mjesto za fotografiju. */
  file?: PhotoFile;
};

type GeneratedPhoto = PhotoFile & { sha256: string; source: string; addedAt: string };
const generatedPhotos = generated as Record<string, GeneratedPhoto | undefined>;
const remoteSources = photoSources as Record<string, string | undefined>;

function originalPhoto(entry: Omit<PhotoEntry, 'origin' | 'file' | 'sourceUrl'>): PhotoEntry {
  const file = generatedPhotos[entry.id];
  return {
    ...entry,
    origin: 'original',
    sourceUrl: remoteSources[entry.id],
    file: file ? { src: file.src, width: file.width, height: file.height } : undefined,
  };
}

export const heroPhotos = {
  desktop: heroDesktop,
  mobile: heroMobile,
  alt: 'Kuhinja s ostrvom obloženim keramikom s mramornim uzorkom',
  note: 'Ilustrativni prikaz prostora.',
  origin: 'illustrative' as PhotoOrigin,
};

export const photos = {
  postolje: originalPhoto({
    id: 'postolje-grigio-luna',
    alt: 'Postolje za umivaonik izrađeno od keramike Grigio Luna',
    caption: 'Gotov proizvod: postolje za umivaonik od keramike Grigio Luna.',
    focus: '50% 50%',
  }),
  digitalniPrint: originalPhoto({
    id: 'digitalni-print',
    alt: 'Motiv otisnut digitalnim printom na keramičkim pločicama',
    caption: 'Dekoracija keramičke površine digitalnim printom.',
    focus: '50% 50%',
  }),
  waterJet: originalPhoto({
    id: 'water-jet',
    alt: 'Rezanje keramičkih pločica vodenim mlazom',
    caption: 'Rezanje keramike vodenim mlazom.',
    focus: '50% 50%',
  }),
  salon: originalPhoto({
    id: 'salon',
    alt: 'Izložbeni salon Memić Dekor u Mostaru',
    caption: 'Salon u Mostaru.',
  }),
  umivaonici: originalPhoto({
    id: 'umivaonici',
    alt: 'Keramički umivaonici iz ponude Memić Dekor',
    caption: 'Umivaonici',
  }),
  kuhinjskePloce: originalPhoto({
    id: 'kuhinjske-ploce',
    alt: 'Kuhinjska ploča od keramike izrađena po mjeri',
    caption: 'Kuhinjske ploče i stolovi',
  }),
  gazista: originalPhoto({
    id: 'gazista',
    alt: 'Keramička gazišta za stepenice izrađena po mjeri',
    caption: 'Gazišta i okapnice',
  }),
  mozaici: originalPhoto({
    id: 'mozaici',
    alt: 'Zidni mozaik složen od rezane keramike',
    caption: 'Mozaici',
  }),
} satisfies Record<string, PhotoEntry>;

export type PhotoKey = keyof typeof photos;

/** Tekst ispod fotografije: opis i, ako postoje, zasluge fotografa ili partnera. */
export function photoCaption(photo: PhotoEntry): string | undefined {
  const parts = [photo.caption, photo.credit ? `Foto: ${photo.credit}.` : undefined].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : undefined;
}

/** Fotografije za sekciju „Detalji iz ponude i izrade” (salon ima vlastitu sekciju). */
export const detailGallery: PhotoKey[] = ['umivaonici', 'kuhinjskePloce', 'gazista', 'mozaici'];
