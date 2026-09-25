import Image from 'next/image';
import type { PhotoEntry } from '@/content/images';
import styles from './Photo.module.css';

type PhotoProps = {
  photo: PhotoEntry;
  /** Atribut sizes za responzivni srcset. */
  sizes: string;
  /** Omjer stranica okvira, npr. '16 / 9'. Rezerviše prostor i sprječava pomjeranje sadržaja. */
  aspect?: string;
  className?: string;
  /** Fotografija iznad preloma (npr. uvod podstranice) učitava se odmah. */
  eager?: boolean;
};

/**
 * Fotografija u okviru fiksnog omjera. Ako originalna fotografija još nije dodana,
 * prikazuje se jasno označeno mjesto za nju umjesto zamjenske ili tuđe fotografije.
 */
export function Photo({ photo, sizes, aspect = '16 / 9', className, eager = false }: PhotoProps) {
  const frameClass = [styles.frame, className].filter(Boolean).join(' ');
  // Zadani omjer ide kroz varijablu, pa ga roditeljski CSS može zamijeniti s --photo-aspect.
  const frameStyle = { '--photo-aspect-default': aspect } as React.CSSProperties;

  if (!photo.file) {
    return (
      <div className={`${frameClass} ${styles.pending}`} style={frameStyle} data-photo-pending={photo.id}>
        <span className={styles.pendingLabel}>Originalna fotografija u pripremi</span>
      </div>
    );
  }

  return (
    <div className={frameClass} style={frameStyle}>
      <Image
        src={photo.file.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        className={styles.image}
        style={photo.focus ? { objectPosition: photo.focus } : undefined}
      />
    </div>
  );
}
