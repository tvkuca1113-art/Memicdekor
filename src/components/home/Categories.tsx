import Link from 'next/link';
import { categories } from '@/content/offer';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Categories.module.css';

export function Categories() {
  return (
    <section className={styles.section} aria-labelledby="ponuda-naslov">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading
            id="ponuda-naslov"
            eyebrow="Ponuda"
            title="Keramika i oprema za vaš prostor."
            lead="U salonu u Mostaru možete pogledati pločice, umivaonike i sanitarnu opremu, a izrada po mjeri je u istom objektu."
            className={styles.heading}
          />
          <Link href="/proizvodi/" className={`btn btn-outline ${styles.all}`}>
            Pregled proizvoda
            <ArrowRightIcon className="btn-icon" size={18} />
          </Link>
        </div>
        <ul className={styles.grid}>
          {categories.map((category) => (
            <li key={category.id} className={styles.item}>
              <h3 className={styles.title}>
                <Link href={category.href} className={styles.titleLink}>
                  {category.title}
                </Link>
              </h3>
              <p className={styles.text}>{category.text}</p>
              <ArrowRightIcon size={22} className={styles.arrow} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
