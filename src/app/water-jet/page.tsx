import type { Metadata } from 'next';
import { ContentSection } from '@/components/ContentSection';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata('waterJet');

const materials = ['Keramika', 'Kamen', 'Staklo', 'Željezo'];

export default function WaterJetPage() {
  return (
    <>
      <PageIntro
        trail={['home', 'usluge', 'waterJet']}
        eyebrow="Usluge"
        title="Rezanje vodenim mlazom"
        lead="Water jet je tehnologija rezanja mlazom vode pod visokim pritiskom, pomiješanim s abrazivnim materijalom poput granuliranog stakla ili pijeska."
        photo={photos.waterJet}
      />

      <ContentSection id="preciznost" eyebrow="Tehnologija" title="Precizni rezovi bez pukotina">
        <p>
          Mlaz vode pod visokim pritiskom omogućava rezanje i najtvrđih keramičkih materijala bez oštećenja i pukotina,
          uz veliku preciznost. Tako se mogu izrezati složeni oblici i detalji.
        </p>
      </ContentSection>

      <ContentSection id="materijali" eyebrow="Materijali" title="Šta režemo vodenim mlazom" tone="deep">
        <ul className={styles.materials}>
          {materials.map((material) => (
            <li key={material}>{material}</li>
          ))}
        </ul>
        <p>Moguće je i rezanje keramike koju donesete sami. Prije dolaska nas kontaktirajte da dogovorimo detalje.</p>
      </ContentSection>

      <CtaBand
        title="Imate materijal i nacrt?"
        text="Pošaljite nam mjere, oblik i vrstu materijala. Javit ćemo vam se s informacijama o izradi."
      />
    </>
  );
}
