'use client';

import Link from 'next/link';
import { useState } from 'react';
import { photos } from '@/content/images';
import { services } from '@/content/services';
import { homeCopy } from '@/content/home';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon, PlusIcon } from '../icons';
import styles from './Services.module.css';

export function Services() {
  const [selected, setSelected] = useState<number | null>(0);
  const current = services[selected ?? 0];
  return (
    <section id="usluge" className={`${styles.section} on-dark`} aria-labelledby="usluge-naslov">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading id="usluge-naslov" eyebrow={homeCopy.services.eyebrow} title={homeCopy.services.title} className={styles.heading} />
          <p className={styles.lead}>{homeCopy.services.lead}</p>
        </div>
        <div className={styles.layout}>
          <figure className={styles.visual}>
            <Photo key={current.id} photo={photos[current.photo]} aspect="4 / 5" sizes="(min-width: 1440px) 600px, 46vw" />
            <figcaption>{current.imageNote}</figcaption>
          </figure>
          <div className={styles.list}>
            {services.map((service, index) => (
              <article key={service.id} className={styles.item} data-active={selected === index}>
                <h3><button type="button" id={`usluga-${service.id}`} aria-expanded={selected === index} aria-controls={`opis-${service.id}`} onClick={() => setSelected((value) => value === index ? null : index)}>
                  <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                  <span>{service.title}</span><PlusIcon size={22} className={styles.toggle} />
                </button></h3>
                <div id={`opis-${service.id}`} role="region" aria-labelledby={`usluga-${service.id}`} hidden={selected !== index} className={styles.body}>
                  <p>{service.summary}</p>
                  <ul className={styles.applications}>{service.applications.map((item) => <li key={item}>{item}</li>)}</ul>
                  <figure className={styles.mobileVisual}>
                    {selected === index ? <Photo photo={photos[service.photo]} aspect="4 / 3" sizes="calc(100vw - 40px)" /> : null}
                    <figcaption>{service.imageNote}</figcaption>
                  </figure>
                  <Link href={service.href} className={styles.link}>{homeCopy.services.link}<span className="visually-hidden"> {service.linkLabel}</span><ArrowRightIcon size={18} /></Link>
                </div>
              </article>
            ))}
            <Link className={styles.all} href="/usluge/">{homeCopy.services.all}<ArrowRightIcon size={18} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
