import { photoCaption, photos } from '@/content/images';
import { homeCopy } from '@/content/home';
import { socialProfiles } from '@/content/site';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Details.module.css';

export function Details() {
  const instagram = socialProfiles[0];
  return (
    <section className={styles.section} aria-labelledby="detalji-naslov">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading id="detalji-naslov" eyebrow={homeCopy.gallery.eyebrow} title={homeCopy.gallery.title} className={styles.heading} />
          <p className={styles.lead}>{homeCopy.gallery.lead}</p>
        </div>
        <div className={styles.gallery}>
          <figure className={styles.featured}>
            <Photo photo={photos.stolSequoia} aspect="4 / 5" sizes="(min-width: 1280px) 650px, (min-width: 768px) 52vw, calc(100vw - 40px)" />
            <figcaption className={styles.caption}>{photoCaption(photos.stolSequoia)}</figcaption>
          </figure>
          <div className={styles.side}>
            <figure>
              <Photo photo={photos.kuhinjskePloce} aspect="4 / 5" sizes="(min-width: 1280px) 420px, (min-width: 768px) 34vw, 75vw" />
              <figcaption className={styles.caption}>{photoCaption(photos.kuhinjskePloce)}</figcaption>
            </figure>
            <div className={styles.social}>
              <p>{homeCopy.gallery.social}</p>
              <a href={instagram.href} target="_blank" rel="noopener noreferrer">{homeCopy.gallery.link}<ArrowRightIcon size={20} /><span className="visually-hidden"> (novi prozor)</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
