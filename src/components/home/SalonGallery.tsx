'use client';

import Image from 'next/image';
import { useRef, useState, type TouchEvent } from 'react';
import type { salonGallery as GalleryItems, salonCopy as GalleryCopy } from '@/content/salon';
import { Photo } from '../Photo';
import { ArrowRightIcon } from '../icons';
import styles from './SalonGallery.module.css';

type SalonGalleryProps = {
  items: typeof GalleryItems;
  copy: typeof GalleryCopy;
};

export function SalonGallery({ items, copy }: SalonGalleryProps) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = items[active];

  function move(direction: number) {
    setActive((index) => (index + direction + items.length) % items.length);
  }

  function finishSwipe(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
  }

  return (
    <div className={styles.gallery} role="group" aria-label={copy.galleryLabel}>
      <div
        className={styles.stage}
        onTouchStart={(event) => {
          touchStart.current = event.touches.length === 1
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
            : null;
        }}
        onTouchEnd={finishSwipe}
        onTouchCancel={() => { touchStart.current = null; }}
      >
        <Photo
          photo={current.photo}
          aspect="4 / 3"
          sizes="(min-width: 1280px) 640px, (min-width: 900px) 50vw, calc(100vw - 40px)"
        />
        <div className={styles.controls}>
          <button type="button" onClick={() => move(-1)} aria-label={copy.previous}>
            <ArrowRightIcon size={18} className={styles.back} />
          </button>
          <span className={styles.count} aria-hidden="true">
            {String(active + 1).padStart(2, '0')} <span>/</span> {String(items.length).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => move(1)} aria-label={copy.next}>
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>
      <div className={styles.caption} aria-live="polite" aria-atomic="true">
        <span className="visually-hidden">{copy.photoLabel} {active + 1} {copy.of} {items.length}. </span>
        <p>{current.title}</p>
        <span>{current.photo.caption}</span>
      </div>
      <div className={styles.thumbnails} role="group" aria-label={copy.thumbnailLabel}>
        {items.map((item, index) => (
          <button
            key={item.photo.id}
            type="button"
            className={styles.thumbnail}
            aria-label={`${copy.select}: ${item.title}`}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span className={styles.thumbnailImage}>
              {item.photo.file && <Image
                src={item.photo.file.src}
                alt=""
                fill
                sizes="(min-width: 900px) 120px, 20vw"
                loading="lazy"
                data-gallery-thumbnail
                style={{ objectFit: 'cover', objectPosition: item.photo.focus }}
              />}
            </span>
            <span className={styles.thumbnailLabel}>{item.label}</span>
          </button>
        ))}
      </div>
      <a className={styles.video} href={copy.videoUrl} target="_blank" rel="noopener noreferrer">
        <span className={styles.play} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="m9 5 11 7-11 7Z" /></svg>
        </span>
        <span className={styles.videoText}>
          <strong>{copy.videoTitle}</strong>
          <span>{copy.videoLabel}</span>
        </span>
        <ArrowRightIcon size={20} />
        <span className="visually-hidden">{copy.externalHint}</span>
      </a>
    </div>
  );
}
