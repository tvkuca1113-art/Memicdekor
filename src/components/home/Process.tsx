import Link from 'next/link';
import { homeCopy } from '@/content/home';
import { productionSteps } from '@/content/offer';
import { ArrowRightIcon } from '../icons';
import { SectionHeading } from '../SectionHeading';
import styles from './Process.module.css';

export function Process() {
  return (
    <section className={styles.section} aria-labelledby="proces-naslov">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading id="proces-naslov" eyebrow={homeCopy.process.eyebrow} title={homeCopy.process.title} />
          <p>{homeCopy.process.lead}</p>
        </div>
        <ol className={styles.steps}>
          {productionSteps.map((step, index) => <li key={step.title}><span className={styles.number} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
        </ol>
        <div className={styles.bottom}>
          <Link href="#upit" className="btn btn-outline">{homeCopy.process.link}<ArrowRightIcon size={20} /></Link>
          <p>{homeCopy.process.note}</p>
        </div>
      </div>
    </section>
  );
}
