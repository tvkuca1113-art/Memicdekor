import { photos } from './images';
import { mainNav, type NavItem } from './site';

export const menuPrimary: (NavItem & { description: string })[] = [
  { ...mainNav[0], description: 'Keramika i oprema za vaš prostor' },
  { ...mainNav[1], description: 'Površine i detalji prema vašim mjerama' },
  { ...mainNav[2], description: 'Rezanje, obrada i digitalni print' },
];

export const menuSecondary: NavItem[] = [{ label: 'Početna', href: '/' }, ...mainNav.slice(3)];

export const menuCopy = {
  explore: 'Istražite Memić Dekor',
  close: 'Zatvori',
  closeLabel: 'Zatvori meni',
  location: 'Posjetite naš salon',
  mapHint: ' (otvara Google karte u novom prozoru)',
};

export const menuFeature = {
  eyebrow: 'Naši radovi',
  title: 'Detalji čine prostor.',
  action: 'Pogledajte projekte',
  href: '/#radovi',
  photo: photos.salonPultDetalj,
};
