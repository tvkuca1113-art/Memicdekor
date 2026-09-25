// 301 mapa starih URL-ova s memic.ba (WordPress/WooCommerce).
// Stranice koje zadržavaju istu adresu (/proizvodi/, /proizvodnja/, /usluge/, /digital-print/,
// /water-jet/, /o-nama/, /kontakt/) ne trebaju preusmjerenje.
// Stari URL-ovi su prikupljeni iz javnog indeksa pretraživača jer memic.ba nije bio
// dostupan iz radnog okruženja; prije objave provjerite puni popis (docs/PREDAJA.md).

export type LegacyRedirect = {
  from: string;
  to: string;
  /** Zašto baš ta destinacija. */
  note: string;
  /** true = stari URL je potvrđen u indeksu; false = pravilo za očekivane WooCommerce obrasce. */
  confirmed: boolean;
};

export const legacyRedirects: LegacyRedirect[] = [
  { from: '/shop/', to: '/proizvodi/', note: 'Stara WooCommerce trgovina → pregled ponude', confirmed: true },
  { from: '/asortiman/', to: '/proizvodi/', note: 'Stari pregled asortimana → pregled ponude', confirmed: true },
  {
    from: '/product-category/keramika/',
    to: '/proizvodi/#keramicke-plocice',
    note: 'Kategorija Keramika',
    confirmed: true,
  },
  {
    from: '/product/keramicke-plocice/',
    to: '/proizvodi/#keramicke-plocice',
    note: 'Proizvod Keramičke pločice',
    confirmed: true,
  },
  {
    from: '/product/bazenska-keramika/',
    to: '/proizvodi/#bazenska-keramika',
    note: 'Proizvod Bazenska keramika',
    confirmed: true,
  },
  {
    from: '/product/b2351mc/',
    to: '/proizvodi/#sanitarije',
    note: 'Model B2351MC (Sanitarija → WC šolje)',
    confirmed: true,
  },
  {
    from: '/category/podgradni-umivaonici/',
    to: '/proizvodi/#umivaonici',
    note: 'Arhiva objava o podgradnim umivaonicima',
    confirmed: true,
  },
  { from: '/mozaik/', to: '/proizvodnja/#mozaici', note: 'Stara stranica Mozaik', confirmed: true },
  // Obrasci za ostatak starog kataloga. Kada se preuzme puni popis proizvoda,
  // dodajte pojedinačna pravila iznad ovih (redoslijed je bitan).
  {
    from: '/product-category/:path*',
    to: '/proizvodi/',
    note: 'Ostale kategorije proizvoda → pregled ponude',
    confirmed: false,
  },
  { from: '/product/:slug/', to: '/proizvodi/', note: 'Ostali proizvodi → pregled ponude', confirmed: false },
];
