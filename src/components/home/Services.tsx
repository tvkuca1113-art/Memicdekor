import Link from 'next/link';
import { photos } from '@/content/images';
import { services } from '@/content/services';
import { homeCopy } from '@/content/home';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Services.module.css';

export function Services() {
  return (
    <section className={styles.section} aria-labelledby="usluge-naslov">
      <div className={`container ${styles.layout}`}>
        <SectionHeading id="usluge-naslov" eyebrow={homeCopy.services.eyebrow} title={homeCopy.services.title} lead={homeCopy.services.lead} className={styles.heading} />
        <ul className={styles.grid}>
          {services.map((service, index) => (
            <li key={service.id} className={styles.item}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div className={styles.body}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.text}>{service.summary}</p>
                <Link href={service.href} className={styles.link}>{homeCopy.services.link}<span className="visually-hidden"> {service.linkLabel}</span><ArrowRightIcon size={18} /></Link>
              </div>
              <Photo photo={photos[service.photo]} aspect="1 / 1" sizes="(min-width: 900px) 180px, 30vw" className={styles.photo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
