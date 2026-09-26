import { photoCaption, photos } from '@/content/images';
import { productHighlights } from '@/content/offer';
import { Photo } from './Photo';
import { ArrowRightIcon } from './icons';
import styles from './ProductHighlights.module.css';

export function ProductHighlights() {
  return (
    <section className={styles.section} aria-labelledby="primjeri-naslov">
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">Stvarni primjeri</p>
          <h2 id="primjeri-naslov" className={styles.title}>Materijali i izrada koje možete vidjeti na stvarnim fotografijama.</h2>
          <p className={styles.lead}>
            Prikazane fotografije ne potvrđuju trenutnu dostupnost. Za dostupne dekore, formate i modele pošaljite upit ili posjetite salon.
          </p>
        </div>
        <ul className={styles.grid}>
          {productHighlights.map((item) => {
            const photo = photos[item.photo];
            return (
              <li key={item.title} className={styles.card}>
                <Photo photo={photo} aspect="4 / 5" sizes="(min-width: 1100px) 360px, (min-width: 700px) 45vw, calc(100vw - 40px)" />
                <div className={styles.body}>
                  <p className={styles.eyebrow}>{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {photoCaption(photo) ? <p className={styles.caption}>{photoCaption(photo)}</p> : null}
                  {photo.sourceUrl ? (
                    <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.source}>
                      Izvor fotografije <ArrowRightIcon size={16} />
                      <span className="visually-hidden"> (otvara novi prozor)</span>
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
