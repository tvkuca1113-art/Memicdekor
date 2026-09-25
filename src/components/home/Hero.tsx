import { getImageProps } from 'next/image';
import Link from 'next/link';
import { preload } from 'react-dom';
import { heroPhotos } from '@/content/images';
import { secondaryCta } from '@/content/site';
import { ArrowRightIcon } from '../icons';
import styles from './Hero.module.css';

const DESKTOP_MEDIA = '(min-width: 768px)';
const MOBILE_MEDIA = '(max-width: 767.98px)';

/**
 * Naslovna sekcija. Fotografija je umjetnički usmjerena preko <picture>:
 * preglednik preuzima samo jednu varijantu (portretnu za mobitel, pejzažnu od 768 px).
 */
export function Hero() {
  const common = { alt: heroPhotos.alt, sizes: '100vw' };
  const {
    props: { srcSet: desktopSrcSet, src: desktopSrc },
  } = getImageProps({ ...common, src: heroPhotos.desktop });
  const { props: mobileProps } = getImageProps({
    ...common,
    src: heroPhotos.mobile,
    loading: 'eager',
    fetchPriority: 'high',
  });

  // Rani preload u <head> (LCP slika); media upiti se isključuju, pa se preuzima samo jedna varijanta.
  preload(mobileProps.src, {
    as: 'image',
    imageSrcSet: mobileProps.srcSet,
    imageSizes: '100vw',
    fetchPriority: 'high',
    media: MOBILE_MEDIA,
  });
  preload(desktopSrc, {
    as: 'image',
    imageSrcSet: desktopSrcSet,
    imageSizes: '100vw',
    fetchPriority: 'high',
    media: DESKTOP_MEDIA,
  });

  return (
    <section className={`${styles.hero} on-dark`} aria-labelledby="naslov">
      <picture className={styles.media}>
        <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} sizes="100vw" />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt dolazi iz getImageProps */}
        <img {...mobileProps} className={styles.image} />
      </picture>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>
          Studio keramike <span aria-hidden="true">·</span> Mostar
        </p>
        <h1 id="naslov" className={styles.title}>
          Keramika po mjeri vašeg prostora.
        </h1>
        <p className={styles.lead}>Kuhinje, kupatila i rješenja izrađena po mjeri.</p>
        <div className={styles.actions}>
          <Link href="#upit" className={`btn ${styles.primary}`}>
            Pošaljite upit
            <ArrowRightIcon className="btn-icon" size={20} />
          </Link>
          <Link href={secondaryCta.href} className={`btn btn-outline-light ${styles.secondary}`}>
            {secondaryCta.label}
            <ArrowRightIcon className={`btn-icon ${styles.secondaryIcon}`} size={20} />
          </Link>
        </div>
        <p className={styles.note}>{heroPhotos.note}</p>
      </div>
    </section>
  );
}
