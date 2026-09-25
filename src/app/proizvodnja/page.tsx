import type { Metadata } from 'next';
import { ContentSection, ItemList } from '@/components/ContentSection';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { customItems, productionSteps } from '@/content/offer';
import { company } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('proizvodnja');

export default function ProductionPage() {
  return (
    <>
      <PageIntro
        trail={['home', 'proizvodnja']}
        eyebrow="Izrada po mjeri"
        title="Izrada po mjeri od keramike"
        lead="Osnovna djelatnost Memić Dekora je rezanje pločica i izrada keramičkih mozaika. Proizvodnja se nalazi u sklopu izložbenog salona u Mostaru, gdje od keramike izrađujemo elemente po mjeri vašeg prostora."
        photo={photos.postolje}
      />

      <ContentSection id="sta-izradujemo" eyebrow="Proizvodnja" title="Šta izrađujemo">
        <p>Keramiku režemo na različite dimenzije i od nje izrađujemo:</p>
        <ItemList items={customItems} />
      </ContentSection>

      <ContentSection id="kako-radimo" eyebrow="Od ideje do izrade" title="Kako nastaje proizvod po mjeri" tone="deep">
        <ItemList items={productionSteps} numbered />
      </ContentSection>

      <ContentSection id="za-projekte" eyebrow="Za arhitekte, dizajnere i izvođače" title="Rad na većim projektima">
        <p>
          Prihvatamo i veće obime posla. Projekt, specifikaciju ili nacrt pošaljite na{' '}
          <a href={company.email.href}>{company.email.display}</a>, a detalje izrade dogovorit ćemo s vama.
        </p>
        <p>Svoje proizvode izvozimo i na tržišta zapadne Evrope.</p>
      </ContentSection>

      <CtaBand />
    </>
  );
}
