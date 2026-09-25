import Link from 'next/link';
import { company, primaryCta } from '@/content/site';
import { ArrowRightIcon, PhoneIcon } from './icons';
import styles from './CtaBand.module.css';

type CtaBandProps = {
  title?: string;
  text?: string;
};

export function CtaBand({
  title = 'Recite nam šta uređujete.',
  text = 'Pošaljite kratak opis prostora, mjere ili skicu. Javit ćemo vam se na kontakt koji ostavite.',
}: CtaBandProps) {
  return (
    <section className={styles.band} aria-labelledby="poziv-naslov">
      <div className={`container ${styles.layout}`}>
        <div className={styles.text}>
          <h2 id="poziv-naslov" className={styles.title}>
            {title}
          </h2>
          <p className={styles.body}>{text}</p>
        </div>
        <div className={styles.actions}>
          <Link href={primaryCta.href} className="btn">
            {primaryCta.label}
            <ArrowRightIcon className="btn-icon" size={20} />
          </Link>
          <a href={company.phone.href} className={styles.phone}>
            <PhoneIcon size={18} />
            {company.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
