import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentSection } from '@/components/ContentSection';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('oNama');

export default function AboutPage() {
  return (
    <>
      <PageIntro
        trail={['home', 'oNama']}
        eyebrow="O nama"
        title="Studio keramike iz Mostara"
        lead="Memić Dekor d.o.o. donosi aktuelne trendove i kvalitet u svijetu keramičkih proizvoda: pločice, umivaonike i sanitarnu opremu koji spajaju trajnost i estetiku."
        photo={photos.salon}
      />

      <ContentSection id="salon-i-proizvodnja" eyebrow="Salon i proizvodnja" title="Sve na jednom mjestu">
        <p>
          U salonu je bogat izbor keramike, sanitarne opreme i bazenske keramike. Proizvodnja se nalazi u sklopu
          izložbenog salona: keramiku režemo na različite dimenzije, slažemo je u zidne i podne mozaike i izrađujemo
          keramičke umivaonike, kuhinjske ploče, stolove, gazišta i okapnice.
        </p>
        <p>
          <Link href="/proizvodnja/" className="text-link">
            <span className="text-link-inner">Izrada po mjeri</span>
          </Link>
        </p>
      </ContentSection>

      <ContentSection id="misija" eyebrow="Misija" title="Kvalitetna keramička rješenja uz savremenu tehnologiju" tone="deep">
        <p>
          Naša misija je pružiti klijentima kvalitetne keramičke proizvode i usluge, uz savremenu tehnologiju i
          inovativne procese.
        </p>
        <p>
          Kroz precizno rezanje, digitalni print i rezanje vodenim mlazom radimo na kreativnosti, efikasnosti i
          trajnosti keramičkih rješenja za sve vrste projekata, od industrijskih do personaliziranih i umjetničkih.
        </p>
      </ContentSection>

      <ContentSection id="za-koga-radimo" eyebrow="Za koga radimo" title="Za vaš dom i za projekte">
        <p>
          Radimo za ljude koji uređuju kuhinju, kupatilo ili drugi prostor, kao i za arhitekte, dizajnere i izvođače.
          Prihvatamo i veće obime posla, a svoje proizvode izvozimo i na tržišta zapadne Evrope.
        </p>
      </ContentSection>

      <CtaBand />
    </>
  );
}
