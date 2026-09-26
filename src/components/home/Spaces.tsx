'use client';

import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';
import { spaces } from '@/content/offer';
import { homeCopy } from '@/content/home';
import { photos } from '@/content/images';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Spaces.module.css';

export function Spaces() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const space = spaces[selected];
  const photo = selected === 1 ? photos.umivaonici : photos[space.photo];

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % spaces.length;
    else if (event.key === 'ArrowLeft') next = (index + spaces.length - 1) % spaces.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = spaces.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="prostori" className={styles.section} aria-labelledby="prostori-naslov">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading id="prostori-naslov" eyebrow={homeCopy.spaces.eyebrow} title={homeCopy.spaces.title} className={styles.heading} />
          <p className={styles.intro}>{homeCopy.spaces.lead}</p>
        </div>
        <div className={styles.tabs} role="tablist" aria-label={homeCopy.spaces.label}>
          {spaces.map((item, index) => (
            <button key={item.id} type="button" role="tab" id={`prostor-tab-${index}`}
              aria-selected={selected === index} aria-controls="prostor-panel" tabIndex={selected === index ? 0 : -1}
              ref={(element) => { tabs.current[index] = element; }}
              onKeyDown={(event) => move(event, index)} onClick={() => setSelected(index)} className={styles.tab}>
              <span aria-hidden="true">0{index + 1}</span>{homeCopy.spaces.tabs[index]}
            </button>
          ))}
        </div>
        <div id="prostor-panel" role="tabpanel" aria-labelledby={`prostor-tab-${selected}`} tabIndex={0} className={styles.panel}>
          <figure className={styles.figure}>
            <Photo key={space.id} photo={photo} aspect="4 / 3" sizes="(min-width: 1280px) 780px, (min-width: 768px) 62vw, calc(100vw - 40px)" className={styles.photo} />
            <figcaption className={styles.caption}>{homeCopy.spaces.captions[selected]}</figcaption>
          </figure>
          <div className={styles.body}>
            <span className={styles.index} aria-hidden="true">0{selected + 1} / 03</span>
            <h3 className={styles.title}>{space.title}</h3>
            <p className={styles.text}>{space.text}</p>
            <ul className={styles.links}>
              {space.links.map((link) => (
                <li key={link.href}><Link href={link.href} className={styles.link}>{link.label}<ArrowRightIcon size={18} /></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
