import { photos } from './images';

export const salonCopy = {
  eyebrow: 'Salon u Mostaru',
  title: 'Prostor za vaše ideje.',
  lead: 'Pogledajte keramiku, uporedite teksture i pronađite detalje za svoj prostor. U našem salonu možete razgledati i umivaonike i sanitarnu opremu.',
  address: 'Adresa',
  phone: 'Telefon',
  email: 'E-mail',
  note: 'Radno vrijeme provjerite telefonom prije dolaska.',
  map: 'Otvorite lokaciju na karti',
  mapHint: ' (Google karte, novi prozor)',
  galleryLabel: 'Fotografije salona Memić Dekor',
  thumbnailLabel: 'Odaberite fotografiju salona',
  select: 'Prikažite',
  previous: 'Prethodna fotografija salona',
  next: 'Sljedeća fotografija salona',
  photoLabel: 'Fotografija',
  of: 'od',
  videoTitle: 'Zavirite u naš salon',
  videoLabel: 'Video na Instagramu',
  externalHint: ' (otvara se u novom prozoru)',
  videoUrl: 'https://www.instagram.com/p/DQEwGovDP60/',
};

// Prikazi pulta preuzeti su iz izvornih Reel objava o uređenju salona.
// Ostale fotografije prikazuju salon i izložbenu opremu s originalne stranice firme.
export const salonGallery = [
  { photo: photos.salon, label: 'Salon', title: 'Pogled na izložbeni prostor' },
  { photo: photos.salonPult, label: 'Pult', title: 'Dobro došli u Memić Dekor' },
  { photo: photos.kupatilo, label: 'Kupatilo', title: 'Ideje za uređenje kupatila' },
  { photo: photos.salonPultDetalj, label: 'Detalj', title: 'Keramika izbliza' },
  { photo: photos.sanitarije, label: 'Oprema', title: 'Detalji koji upotpunjuju prostor' },
];
