// Urednički sadržaj početne stranice. Podaci i ponuda prate izvorni memic.ba.
export const homeCopy = {
  hero: {
    eyebrow: 'Studio keramike · Mostar',
    title: 'Keramika po mjeri vašeg prostora.',
    lead: 'Kuhinje, kupatila i detalji po vašoj mjeri.',
    links: [
      { label: 'Proizvodi', href: '/proizvodi/' },
      { label: 'Izrada po mjeri', href: '/proizvodnja/' },
      { label: 'Naš salon', href: '#salon' },
    ],
  },
  spaces: {
    eyebrow: 'Za vaš prostor',
    title: 'Svaki prostor ima svoju priču.',
    lead: 'Pronađite keramiku i rješenja po mjeri za prostor koji uređujete.',
    label: 'Odaberite prostor',
    tabs: ['Kuhinja', 'Kupatilo', 'Dnevni boravak'],
    captions: ['Pietra Antica Crema', 'Umivaonici po mjeri', 'Keramičke ploče za stolove'],
  },
  services: {
    eyebrow: 'Naša proizvodnja',
    title: 'Od materijala do detalja.',
    lead: 'Rezanje, obrada i dekoracija keramike. U proizvodnji koja se nalazi u sklopu našeg salona.',
    link: 'Saznajte više',
  },
  gallery: {
    eyebrow: 'Iz naših projekata',
    title: 'Lijepo na pogled. Vaše u svakom detalju.',
    lead: 'Stvarne fotografije izrade Memić Dekora. Pogledajte kako keramika postaje dio doma.',
    social: 'Još ideja i radova',
    link: 'Pogledajte na Instagramu',
  },
} as const;
