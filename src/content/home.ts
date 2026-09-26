// Urednički sadržaj početne stranice. Podaci i ponuda prate izvorni memic.ba.
export const homeCopy = {
  hero: {
    eyebrow: 'Studio keramike · Mostar',
    title: 'Keramika po mjeri vašeg prostora.',
    lead: 'Kuhinje, kupatila i detalji po vašoj mjeri.',
    links: [
      { label: 'Naši radovi', href: '#radovi' },
      { label: 'Izrada po mjeri', href: '/proizvodnja/' },
      { label: 'Naš salon', href: '#salon' },
    ],
  },
  spaces: {
    eyebrow: 'Za vaš prostor',
    title: 'Šta želite urediti?',
    lead: 'U našem salonu birate keramiku. U našoj proizvodnji od nje nastaju površine i detalji po vašim mjerama.',
    label: 'Odaberite prostor',
    tabs: ['Kuhinja', 'Kupatilo', 'Dnevni boravak'],
    captions: ['Pietra Antica Crema', 'Umivaonici po mjeri', 'Keramičke ploče za stolove'],
  },
  services: {
    eyebrow: 'Usluge i obrada',
    title: 'Preciznost iza svakog detalja.',
    lead: 'Od rezanja na zadanu mjeru do složenih oblika i motiva na keramici. Odaberite uslugu i pogledajte šta omogućava.',
    link: 'Saznajte više',
    all: 'Sve o našim uslugama',
  },
  gallery: {
    eyebrow: 'Iz naših projekata',
    title: 'Lijepo na pogled. Vaše u svakom detalju.',
    lead: 'Stvarne fotografije izrade Memić Dekora. Pogledajte kako keramika postaje dio doma.',
    social: 'Još ideja i radova',
    link: 'Pogledajte na Instagramu',
  },
  process: {
    eyebrow: 'Izrada po mjeri', title: 'Od vaše ideje do izrade.',
    lead: 'Za početak su dovoljni opis prostora i okvirne mjere. Fotografija, skica ili projekt pomoći će nam da razumijemo šta želite.',
    link: 'Razgovarajmo o vašoj ideji',
    note: 'Imate vlastitu keramiku? Kontaktirajte nas da dogovorimo mogućnost rezanja i obrade.',
  },
} as const;
