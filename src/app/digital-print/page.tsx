import type { Metadata } from 'next';
import { ContentSection, ItemList } from '@/components/ContentSection';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { company } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('digitalPrint');

const whatToSend = [
  { title: 'Motiv', text: 'Fotografiju, dekor, panoramu ili umjetničko djelo koje želite na keramici.' },
  { title: 'Mjere površine', text: 'Širinu i visinu zida, poda ili druge površine na koju se keramika postavlja.' },
  { title: 'Prostor', text: 'Gdje će keramika biti postavljena, npr. kuhinja, kupatilo ili drugi prostor.' },
];

export default function DigitalPrintPage() {
  return (
    <>
      <PageIntro
        trail={['home', 'usluge', 'digitalPrint']}
        eyebrow="Usluge"
        title="Digitalni print na keramici"
        lead="Digitalni print omogućava izradu jedinstvenih i detaljnih dizajna na keramičkoj površini, u dimenzijama prilagođenim prostoru."
        photo={photos.digitalniPrint}
      />

      <ContentSection id="vas-motiv" eyebrow="Vaš motiv" title="Fotografija ili dekor na keramičkim pločicama">
        <p>
          Donesite vlastitu fotografiju, npr. omiljenu panoramu, lik iz filma ili umjetničko djelo, i prenijet ćemo je
          na keramičke pločice. Dimenzije prilagođavamo prostoru u kojem će keramika biti postavljena.
        </p>
        <p>
          Željeni dekor možemo kopirati i predstaviti nove ideje na keramici, u skladu s kolekcijom naših dizajnera.
        </p>
      </ContentSection>

      <ContentSection id="sta-poslati" eyebrow="Upit" title="Šta poslati za upit" tone="deep">
        <ItemList items={whatToSend} numbered />
        <p>
          Motiv i mjere pošaljite na <a href={company.email.href}>{company.email.display}</a> ili opišite ideju putem
          forme za upit.
        </p>
      </ContentSection>

      <CtaBand />
    </>
  );
}
