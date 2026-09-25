import Link from 'next/link';
import { photoCaption, type PhotoEntry } from '@/content/images';
import { pages, type PageKey } from '@/content/pages';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { JsonLd } from './JsonLd';
import { Photo } from './Photo';
import styles from './PageIntro.module.css';

type PageIntroProps = {
  /** Putanja od početne do trenutne stranice, npr. ['home', 'usluge', 'waterJet']. */
  trail: PageKey[];
  eyebrow: string;
  title: string;
  lead: string;
  photo?: PhotoEntry;
  children?: React.ReactNode;
};

export function PageIntro({ trail, eyebrow, title, lead, photo, children }: PageIntroProps) {
  return (
    <section className={styles.intro} aria-labelledby="naslov">
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <div className="container">
        <nav aria-label="Putanja" className={styles.breadcrumbs}>
          <ol>
            {trail.map((key, index) => {
              const page = pages[key];
              const isLast = index === trail.length - 1;
              return (
                <li key={key}>
                  {isLast ? (
                    <span aria-current="page">{page.breadcrumb}</span>
                  ) : (
                    <Link href={page.path}>{page.breadcrumb}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className={photo ? styles.withPhoto : undefined}>
          <div className={styles.text}>
            <p className="eyebrow">{eyebrow}</p>
            <h1 id="naslov" className={styles.title}>
              {title}
            </h1>
            <p className={`lead ${styles.lead}`}>{lead}</p>
            {children}
          </div>
          {photo ? (
            <figure className={styles.figure}>
              <Photo
                photo={photo}
                aspect="4 / 3"
                sizes="(min-width: 1280px) 600px, (min-width: 900px) 46vw, calc(100vw - 40px)"
                eager
              />
              {photoCaption(photo) ? <figcaption className={styles.caption}>{photoCaption(photo)}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
