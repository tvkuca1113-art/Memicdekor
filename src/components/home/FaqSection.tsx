import { faq } from '@/content/faq';
import { Faq } from '../Faq';
import { SectionHeading } from '../SectionHeading';
import styles from './FaqSection.module.css';

export function FaqSection() {
  return (
    <section className={styles.section} aria-labelledby="pitanja-naslov">
      <div className={`container ${styles.layout}`}>
        <SectionHeading
          id="pitanja-naslov"
          eyebrow="Prije upita"
          title="Česta pitanja"
          lead="Kratki odgovori o izradi po mjeri, uslugama i salonu."
          className={styles.heading}
        />
        <Faq items={faq} />
      </div>
    </section>
  );
}
