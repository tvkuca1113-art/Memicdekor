import { photoCaption, type PhotoEntry } from '@/content/images';
import { Photo } from './Photo';
import styles from './ContentSection.module.css';

type ContentSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  photo?: PhotoEntry;
  /** Fotografija lijevo, tekst desno (na širim ekranima). */
  reverse?: boolean;
  tone?: 'default' | 'deep';
};

export function ContentSection({ id, eyebrow, title, children, photo, reverse, tone = 'default' }: ContentSectionProps) {
  const layout = [
    'container',
    photo ? styles.split : styles.single,
    photo && reverse ? styles.reverse : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      id={id}
      className={`${styles.section} ${tone === 'deep' ? styles.deep : ''}`}
      aria-labelledby={`${id}-naslov`}
    >
      <div className={layout}>
        <div className={styles.body}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 id={`${id}-naslov`} className={styles.title}>
            {title}
          </h2>
          <div className={`prose ${styles.prose}`}>{children}</div>
        </div>
        {photo ? (
          <figure className={styles.figure}>
            <Photo
              photo={photo}
              aspect="4 / 3"
              sizes="(min-width: 1280px) 600px, (min-width: 900px) 46vw, calc(100vw - 40px)"
            />
            {photoCaption(photo) ? <figcaption className={styles.caption}>{photoCaption(photo)}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}

type Item = { title: string; text: string; id?: string };

/** Popis stavki s naslovom (h3) i opisom, u jednom ili dva stupca. */
export function ItemList({ items, numbered = false }: { items: Item[]; numbered?: boolean }) {
  const Tag = numbered ? 'ol' : 'ul';
  return (
    <Tag className={`${styles.items} ${numbered ? styles.numbered : ''}`}>
      {items.map((item, index) => (
        <li key={item.id ?? item.title} id={item.id} className={styles.item}>
          {numbered ? (
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
          ) : null}
          <h3 className={styles.itemTitle}>{item.title}</h3>
          <p className={styles.itemText}>{item.text}</p>
        </li>
      ))}
    </Tag>
  );
}
