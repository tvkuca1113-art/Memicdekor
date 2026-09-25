import Link from 'next/link';
import { offerFocus, spaces } from '@/content/offer';
import { photos } from '@/content/images';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Spaces.module.css';

export function Spaces() {
  return (
    <section className={styles.section} aria-labelledby="prostori-naslov">
      <div className={`container ${styles.layout}`}>
        <SectionHeading
          id="prostori-naslov"
          eyebrow="Za vaš prostor"
          title="Šta uređujete?"
          lead={offerFocus}
          className={styles.heading}
        />
        <ol className={styles.list}>
          {spaces.map((space, index) => (
            <li key={space.id} className={styles.row}>
              <Photo photo={photos[space.photo]} aspect="4 / 3"
                sizes="(min-width: 1280px) 400px, (min-width: 768px) 30vw, calc(100vw - 40px)"
                className={styles.photo} />
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.body}>
                <h3 className={styles.title}>{space.title}</h3>
                <p className={styles.text}>{space.text}</p>
                <ul className={styles.links}>
                  {space.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                        <ArrowRightIcon size={18} className="btn-icon" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
