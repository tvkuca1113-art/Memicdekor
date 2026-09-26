// Evidencija fotografija: porijeklo, zasluge i status.
// Originalne fotografije firme dodaju se skriptom (npm run photos:fetch ili photos:add),
// koja provjerava datoteku i upisuje je u generated/original-photos.json.
// Dok datoteka ne postoji, stranica prikazuje jasno označeno mjesto za fotografiju.

import heroDesktop from '@/assets/hero/kuhinja-ostrvo-desktop.jpg';
import heroMobile from '@/assets/hero/kuhinja-ostrvo-mobitel-v2.jpg';
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
    sourceUrl: remoteSources[entry.id] ?? file?.source,
    file: file ? { src: file.src, width: file.width, height: file.height } : undefined,
  };
}

export const heroPhotos = {
  desktop: heroDesktop,
  mobile: heroMobile,
  alt: 'Kuhinja s ostrvom obloženim keramikom s mramornim uzorkom',
  note: 'Ilustrativni prikaz; nije fotografija izvedenog projekta Memić Dekora.',
  origin: 'illustrative' as PhotoOrigin,
};

export const photos = {
  salonPult: originalPhoto({
    id: 'salon-pult',
    alt: 'Pult obložen tamnom keramikom s natpisom Memić Dekor u izložbenom salonu',
    caption: 'Novi pult u našem salonu, obložen keramikom.',
    focus: '50% 72%',
  }),
  salonPultDetalj: originalPhoto({
    id: 'salon-pult-detalj',
    alt: 'Detalj spoja i šare keramičke obloge na pultu salona Memić Dekor',
    caption: 'Detalj keramičke obloge i završne obrade pulta.',
    focus: '50% 60%',
  }),
  gazista: originalPhoto({
    id: 'gazista-salon',
    alt: 'Siva keramička gazišta sa završnim rubovima, izložena u salonu Memić Dekor',
    caption: 'Primjer izrade: keramička gazišta u našem salonu.',
    focus: '50% 60%',
  }),
  zidnaObloga: originalPhoto({
    id: 'zidna-obloga-xxl',
    alt: 'Zidna obloga od keramike velikog formata u kuhinji s drvenom radnom pločom',
    caption: 'Keramička zidna obloga izrezana prema mjerama kuhinje.',
    credit: 'Memić Dekor · partner u objavi: Modimex',
  }),
  umivaoniciDetalj: originalPhoto({
    id: 'umivaonici-detalj',
    alt: 'Dva keramička umivaonika po mjeri, sa zlatnim slavinama i ogledalima',
    caption: 'Dva umivaonika izrađena po mjeri prostora.',
  }),
  komodaSequoia: originalPhoto({
    id: 'komoda-sequoia',
    alt: 'Komoda obložena keramikom Marble Sequoia, sa staklenim vratima u sredini',
    caption: 'Komoda obložena keramikom Marble Sequoia.',
    credit: 'Memić Dekor · konstrukcija Modimex',
  }),
  postolje: originalPhoto({
    id: 'postolje-grigio-luna',
    alt: 'Postolje za umivaonik izrađeno od keramike Grigio Luna',
    caption: 'Gotov proizvod: postolje za umivaonik od keramike Grigio Luna.',
    focus: '50% 76%',
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
    alt: 'Detalj keramičkih umivaonika izrađenih po mjeri, sa zlatnim slavinama',
    caption: 'Keramički umivaonici po mjeri.',
  }),
  kuhinjskePloce: originalPhoto({
    id: 'kuhinjske-ploce',
    alt: 'Kuhinjska ploča od keramike izrađena po mjeri',
    caption: 'Kuhinjsko ostrvo, radna ploča i zidna obloga.',
    credit: 'Memić Dekor · saradnja s Modimexom',
  }),
  dnevniBoravak: originalPhoto({
    id: 'dnevni-boravak',
    alt: 'Keramičke ploče na dva stolića u dnevnom boravku',
    caption: 'Keramičke ploče za stolove u dnevnom boravku.',
  }),
  stolSequoia: originalPhoto({
    id: 'stol-sequoia',
    alt: 'Trpezarijski stol obložen keramikom Marble Sequoia uz zelene stolice',
    caption: 'Stol i komoda obloženi keramikom Marble Sequoia.',
    credit: 'Memić Dekor · konstrukcija Modimex',
  }),
  kuhinjaCrema: originalPhoto({
    id: 'kuhinja-crema',
    alt: 'Kuhinja s radnom pločom i zidnom oblogom od keramike Pietra Antica Crema',
    caption: 'Kuhinja u keramici Pietra Antica Crema.',
  }),
  kupatilo: originalPhoto({
    id: 'kupatilo-salon',
    alt: 'Uređeno kupatilo s keramičkim oblogama u salonu Memić Dekor',
    caption: 'Keramika i oprema za kupatilo u našem salonu.',
  }),
  sanitarije: originalPhoto({
    id: 'sanitarije-salon',
    alt: 'Izloženi tuševi i slavine u salonu Memić Dekor',
    caption: 'Detalji sanitarne opreme u salonu.',
  }),
} satisfies Record<string, PhotoEntry>;

export type PhotoKey = keyof typeof photos;

/** Tekst ispod fotografije: opis i, ako postoje, zasluge fotografa ili partnera. */
export function photoCaption(photo: PhotoEntry): string | undefined {
  const parts = [photo.caption, photo.credit ? `${photo.credit}.` : undefined].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : undefined;
}

/** Fotografije za sekciju „Detalji iz ponude i izrade” (salon ima vlastitu sekciju). */
export const detailGallery: PhotoKey[] = ['stolSequoia', 'umivaonici', 'kuhinjskePloce', 'postolje'];

export const galleryCopy = {
  eyebrow: 'Iz naših projekata',
  title: 'Keramika koja oblikuje prostor.',
  lead: 'Stvarne fotografije naše izrade: kuhinjske površine, keramički stolovi i umivaonici po mjeri.',
  sourceLabel: 'Pogledajte originalnu objavu',
};
