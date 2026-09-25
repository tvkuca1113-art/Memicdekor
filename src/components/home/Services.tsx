import Link from 'next/link';
import { photos } from '@/content/images';
import { services } from '@/content/services';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Services.module.css';

export function Services() {
  return (
    <section className={styles.section} aria-labelledby="usluge-naslov">
      <div className="container">
        <SectionHeading id="usluge-naslov" eyebrow="Naše usluge" title="Od ideje do izrade." />
        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.id} className={styles.item}>
              <h3 className={styles.title}>{service.title}</h3>
              <Photo
                photo={photos[service.photo]}
                aspect="16 / 9"
                sizes="(min-width: 1280px) 390px, (min-width: 900px) 30vw, calc(100vw - 40px)"
                className={styles.photo}
              />
              <p className={styles.text}>{service.summary}</p>
              <Link href={service.href} className={`text-link ${styles.link}`}>
                <span className="text-link-inner">
                  Saznajte više
                  <span className="visually-hidden"> {service.linkLabel}</span>
                  <ArrowRightIcon className="btn-icon" size={20} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
