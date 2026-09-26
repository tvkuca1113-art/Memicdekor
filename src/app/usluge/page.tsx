import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentSection } from '@/components/ContentSection';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('usluge');

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        trail={['home', 'usluge']}
        eyebrow="Usluge"
        title="Rezanje i obrada keramike"
        lead="Keramiku režemo dijamantnim alatom i vodenim mlazom, a motive prenosimo na keramiku digitalnim printom. Radimo na projektima svih vrsta, od industrijskih do personaliziranih i umjetničkih."
      />

      <ContentSection
        id="rezanje-dijamantnim-alatom"
        eyebrow="Rezanje keramike"
        title="Rezanje dijamantnim alatom"
        photo={photos.gazista}
      >
        <p>
          Precizno rezanje keramičkih ploča na dimenzije iz vašeg projekta: za pločice, mozaike, gazišta, okapnice i
          keramičke površine izrađene po mjeri.
        </p>
        <p>
          <Link href="/proizvodnja/" className="text-link">
            <span className="text-link-inner">Šta izrađujemo po mjeri</span>
          </Link>
        </p>
      </ContentSection>

      <ContentSection
        id="rezanje-vodenim-mlazom"
        eyebrow="Water jet"
        title="Rezanje vodenim mlazom"
        photo={photos.waterJet}
        reverse
        tone="deep"
      >
        <p>
          Mlaz vode pod visokim pritiskom, pomiješan s abrazivnim materijalom, reže keramiku, kamen, staklo i željezo.
          Omogućava složene oblike i precizne detalje bez oštećenja i pukotina.
        </p>
        <p>
          <Link href="/water-jet/" className="text-link">
            <span className="text-link-inner">Saznajte više o rezanju vodenim mlazom</span>
          </Link>
        </p>
      </ContentSection>

      <ContentSection id="digitalni-print" eyebrow="Dekoracija" title="Digitalni print na keramici" photo={photos.digitalniPrint}>
        <p>
          Vaša fotografija, dekor ili umjetničko djelo otisnuti na keramičkim pločicama, u dimenzijama prilagođenim
          prostoru u kojem će biti postavljeni.
        </p>
        <p>
          <Link href="/digital-print/" className="text-link">
            <span className="text-link-inner">Saznajte više o digitalnom printu</span>
          </Link>
        </p>
      </ContentSection>

      <ContentSection id="vas-materijal" eyebrow="Vaš materijal" title="Rezanje keramike koju donesete" tone="deep">
        <p>
          Moguće je rezanje i obrada keramike koju donesete sami. Prije dolaska nas kontaktirajte kako bismo dogovorili
          vrstu obrade i dimenzije.
        </p>
      </ContentSection>

      <CtaBand />
    </>
  );
}
