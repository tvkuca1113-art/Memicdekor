import type { PhotoKey } from './images';
import type { SpaceValue } from '@/lib/contact/validation';

// Svaki zapis prati javnu objavu firme. Doprinos partnera se navodi odvojeno.
export const projectCategories = ['Svi radovi', 'Kuhinje', 'Umivaonici', 'Stolovi', 'Obloge'] as const;
export type ProjectCategory = (typeof projectCategories)[number];
export type Project = {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'Svi radovi'>;
  subtitle: string;
  description: string;
  scope: string;
  detail: string;
  credit?: string;
  photos: PhotoKey[];
  source: string;
  service: { label: string; href: string };
  space: SpaceValue;
};

export const projects: Project[] = [
  {
    id: 'marble-sequoia', title: 'Stol i komoda u istom dekoru', category: 'Stolovi',
    subtitle: 'Marble Sequoia · izrada po mjeri',
    description: 'Isti dekor keramike povezuje trpezarijski stol i komodu. Oblaganje je prilagođeno konstrukciji namještaja i prostoru kupca.',
    scope: 'Oblaganje stola i komode keramikom.', detail: 'Keramika Marble Sequoia.',
    credit: 'Keramičke obloge: Memić Dekor. Konstrukcija: Modimex.',
    photos: ['stolSequoia', 'komodaSequoia'], source: 'https://www.instagram.com/memicdekor_/p/DdqY9KljAhQ/',
    service: { label: 'Više o stolovima po mjeri', href: '/proizvodnja/#kuhinjske-ploce-i-stolovi' }, space: 'drugi-prostor',
  },
  {
    id: 'umivaonici-po-mjeri', title: 'Dva umivaonika, jedna cjelina', category: 'Umivaonici',
    subtitle: 'Kupatilo · keramički umivaonici',
    description: 'Umivaonici izrađeni prema dimenzijama i željama kupca. Na fotografijama se vide oblik korita, završni rubovi i uklapanje u kupatilo.',
    scope: 'Izrada keramičkih umivaonika po mjeri.', detail: 'Oblik i dimenzije prilagođeni prostoru.',
    photos: ['umivaoniciDetalj', 'umivaonici'], source: 'https://www.instagram.com/memicdekor_/p/DIcLIB1spZM/',
    service: { label: 'Više o umivaonicima po mjeri', href: '/proizvodnja/#umivaonici-i-postolja' }, space: 'kupatilo',
  },
  {
    id: 'kuhinja-ostrvo', title: 'Ostrvo, radna ploča i zid', category: 'Kuhinje',
    subtitle: 'Kuhinja · keramičke površine',
    description: 'Keramika povezuje radnu ploču, oblogu ostrva i zid iza kuhinje. Svaka površina obrađena je prema mjerama ovog prostora.',
    scope: 'Oblaganje kuhinjskog ostrva, radne ploče i zida.', detail: 'Povezane keramičke površine po mjeri.',
    credit: 'Realizacija Memić Dekora u saradnji s Modimexom.',
    photos: ['kuhinjskePloce'], source: 'https://www.instagram.com/memicdekor_/p/DIs4M6iMDSX/',
    service: { label: 'Više o kuhinjskim površinama', href: '/proizvodnja/#kuhinjske-ploce-i-stolovi' }, space: 'kuhinja',
  },
  {
    id: 'zidna-obloga-xxl', title: 'Veliki format za kuhinjski zid', category: 'Obloge',
    subtitle: 'Zidna obloga · XXL keramika',
    description: 'Keramička zidna obloga uklopljena je uz drvene radne površine i kuhinjske elemente. Ploča polaznog formata 160 × 320 cm rezana je prema mjerama zida.',
    scope: 'Rezanje i izrada keramičke zidne obloge.', detail: 'Polazni format ploče: 160 × 320 cm.',
    photos: ['zidnaObloga'], source: 'https://www.instagram.com/memicdekor_/p/DRt7dGXjFdv/',
    service: { label: 'Više o velikim formatima', href: '/proizvodi/#keramicke-plocice' }, space: 'kuhinja',
  },
  {
    id: 'pietra-antica-crema', title: 'Kuhinja u svijetlim tonovima', category: 'Kuhinje',
    subtitle: 'Pietra Antica Crema · Široki Brijeg',
    description: 'Radna ploča, zidna obloga i ostrvo izrađeni su od keramike Pietra Antica Crema. Isti materijal povezuje tri površine u mirnu, skladnu cjelinu.',
    scope: 'Radna ploča, zidna obloga i oblaganje ostrva.', detail: 'Keramika Pietra Antica Crema.',
    photos: ['kuhinjaCrema'], source: 'https://www.instagram.com/memicdekor_/p/DX6VNhZjHix/',
    service: { label: 'Više o izradi po mjeri', href: '/proizvodnja/' }, space: 'kuhinja',
  },
  {
    id: 'stolici-po-mjeri', title: 'Oblik koji prati prostor', category: 'Stolovi',
    subtitle: 'Dnevni boravak · keramičke ploče',
    description: 'Keramičke ploče izrađene su za stoliće u dnevnom boravku. Oblik i dimenzije ploča prilagođeni su konstrukciji stolova.',
    scope: 'Izrada keramičkih ploča za stolove.', detail: 'Oblikovanje prema dimenzijama i planu kupca.',
    photos: ['dnevniBoravak'], source: 'https://www.instagram.com/memicdekor_/p/DIie35LsyGg/',
    service: { label: 'Više o stolovima po mjeri', href: '/proizvodnja/#kuhinjske-ploce-i-stolovi' }, space: 'drugi-prostor',
  },
];

export const projectCopy = {
  eyebrow: 'Odabrani radovi', title: 'Naša izrada. Vaš prostor.',
  lead: 'Kuhinjske površine, umivaonici i stolovi. Pogledajte šta smo izradili i kako se keramika uklapa u stvarne prostore.',
  filter: 'Vrsta rada', count: 'Prikaz', open: 'Pogledajte detalje', close: 'Zatvori detalje projekta',
  scope: 'Šta smo izradili', detail: 'Detalj projekta', source: 'Pogledajte izvornu objavu',
  inquiry: 'Želim slično rješenje', more: 'Više radova na Instagramu',
  photos: 'Fotografije projekta', previous: 'Prethodna fotografija', next: 'Sljedeća fotografija',
  inquiryMessage: (title: string) => `Zanima me slično rješenje kao u projektu „${title}”.\n\nMoj prostor i okvirne mjere: `,
};
