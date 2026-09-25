import { detailGallery, galleryCopy, photoCaption, photos } from '@/content/images';
import { socialProfiles } from '@/content/site';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import styles from './Details.module.css';

export function Details() {
  const [instagram, facebook] = socialProfiles;

  return (
    <section className={styles.section} aria-labelledby="detalji-naslov">
      <div className="container">
        <SectionHeading
          id="detalji-naslov"
          eyebrow={galleryCopy.eyebrow}
          title={galleryCopy.title}
          lead={galleryCopy.lead}
        />
        <ul className={styles.gallery}>
          {detailGallery.map((key, index) => {
            const photo = photos[key];
            const featured = index === 0;
            return (
              <li key={photo.id} className={featured ? styles.featured : styles.item}>
                <figure className={styles.figure}>
                  <Photo
                    photo={photo}
                    aspect="4 / 5"
                    sizes={
                      featured
                        ? '(min-width: 1280px) 620px, (min-width: 900px) 48vw, calc(100vw - 40px)'
                        : '(min-width: 1280px) 300px, (min-width: 900px) 24vw, (min-width: 520px) 46vw, calc(100vw - 40px)'
                    }
                    className={styles.photo}
                  />
                  <figcaption className={styles.caption}>
                    {photoCaption(photo)}
                    {photo.sourceUrl ? <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.source}>{galleryCopy.sourceLabel}<span className="visually-hidden">: {photo.caption} (novi prozor)</span><span aria-hidden="true"> ↗</span></a> : null}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
        <p className={styles.social}>
          Više fotografija iz salona i izrade objavljujemo na{' '}
          <a className="inline-link" href={instagram.href} target="_blank" rel="noopener noreferrer">
            Instagramu<span className="visually-hidden"> (otvara se u novom prozoru)</span>
          </a>{' '}
          i{' '}
          <a className="inline-link" href={facebook.href} target="_blank" rel="noopener noreferrer">
            Facebooku<span className="visually-hidden"> (otvara se u novom prozoru)</span>
          </a>
          .
        </p>
      </div>
    </section>
  );
}
