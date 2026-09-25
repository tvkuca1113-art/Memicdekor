// Česta pitanja: kratki odgovori zasnovani na provjerenoj ponudi.

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

export const faq: FaqItem[] = [
  {
    id: 'sta-se-izraduje-po-mjeri',
    question: 'Šta se izrađuje po mjeri?',
    answer:
      'Od keramike izrađujemo umivaonike i postolja, kuhinjske ploče, stolove, gazišta, okapnice te zidne i podne mozaike. Keramiku režemo na dimenzije koje su vam potrebne.',
    link: { label: 'Izrada po mjeri', href: '/proizvodnja/' },
  },
  {
    id: 'sta-poslati-za-upit',
    question: 'Šta poslati za početni upit?',
    answer:
      'Dovoljno je kratko opisati prostor i šta želite izraditi. Ako imate mjere, skicu, projekt ili fotografije prostora, pošaljite ih e-mailom na info@memic.ba.',
    link: { label: 'Pošaljite upit', href: '/kontakt/#upit' },
  },
  {
    id: 'vlastiti-materijal',
    question: 'Mogu li donijeti vlastiti materijal za rezanje?',
    answer:
      'Da, moguće je rezanje keramike koju donesete. Prije dolaska nas kontaktirajte kako bismo dogovorili vrstu obrade i dimenzije.',
    link: { label: 'Usluge rezanja', href: '/usluge/' },
  },
  {
    id: 'digitalni-print',
    question: 'Šta je digitalni print na keramici?',
    answer:
      'Postupak kojim se odabrani motiv, poput fotografije, dekora ili umjetničkog djela, prenosi na keramičke pločice. Dimenzije prilagođavamo prostoru u kojem će keramika biti postavljena.',
    link: { label: 'Digitalni print', href: '/digital-print/' },
  },
  {
    id: 'gdje-pogledati-ponudu',
    question: 'Gdje mogu pogledati ponudu?',
    answer:
      'U našem salonu na adresi Maršala Tita 294 u Mostaru. Pregled ponude je i na stranici Proizvodi, a fotografije iz salona i izrade objavljujemo na Instagramu i Facebooku.',
    link: { label: 'Pregled proizvoda', href: '/proizvodi/' },
  },
];
