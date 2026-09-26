'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { photos } from '@/content/images';
import { projectCategories, projectCopy, projects, type ProjectCategory, type Project } from '@/content/projects';
import { socialProfiles } from '@/content/site';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon, CloseIcon } from '../icons';
import styles from './Details.module.css';

export function Details() {
  const [category, setCategory] = useState<ProjectCategory>('Svi radovi');
  const [active, setActive] = useState<Project | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = category === 'Svi radovi' ? projects : projects.filter((project) => project.category === category);
  const photo = active ? photos[active.photos[photoIndex]] : null;

  useEffect(() => {
    if (active && !dialog.current?.open) dialog.current?.showModal();
  }, [active]);

  function openProject(project: Project) {
    setPhotoIndex(0);
    setActive(project);
  }

  function changePhoto(delta: number) {
    if (active) setPhotoIndex((index) => (index + delta + active.photos.length) % active.photos.length);
  }

  function photoKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!active || active.photos.length < 2) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      changePhoto(event.key === 'ArrowRight' ? 1 : -1);
    }
  }

  return (
    <section id="radovi" className={styles.section} aria-labelledby="detalji-naslov">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading id="detalji-naslov" eyebrow={projectCopy.eyebrow} title={projectCopy.title} className={styles.heading} />
          <p className={styles.lead}>{projectCopy.lead}</p>
        </div>
        <div className={styles.filterBar}>
          <div role="group" aria-label={projectCopy.filter} className={styles.filters}>
            {projectCategories.map((item) => (
              <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <p className={styles.count} role="status" aria-live="polite">{projectCopy.count}: {shown.length} / {projects.length}</p>
        </div>
        <ul className={styles.gallery}>
          {shown.map((project) => (
            <li key={project.id}>
              <button type="button" className={styles.project} onClick={() => openProject(project)} aria-label={`${projectCopy.open}: ${project.title}`}>
                <div className={styles.imageWrap}>
                  <Photo photo={photos[project.photos[0]]} aspect="4 / 5" sizes="(min-width: 1440px) 410px, (min-width: 1000px) 30vw, (min-width: 600px) 45vw, calc(100vw - 40px)" />
                  <span className={styles.open} aria-hidden="true"><ArrowRightIcon size={22} /></span>
                </div>
                <span className={styles.meta}>{project.subtitle}</span>
                <span className={styles.title}>{project.title}</span>
                <span className={styles.projectLink}>{projectCopy.open}<ArrowRightIcon size={17} /></span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.social}>
          <a href={socialProfiles[0].href} target="_blank" rel="noopener noreferrer">{projectCopy.more}<ArrowRightIcon size={20} /><span className="visually-hidden"> (novi prozor)</span></a>
        </div>
      </div>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="projekat-naslov" onClose={() => setActive(null)}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        {active && photo?.file ? (
          <>
            <div className={styles.dialogControls}><button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label={projectCopy.close}><CloseIcon size={24} /></button></div>
            <div className={styles.dialogBody}>
            <div className={styles.viewer} onKeyDown={photoKeyboard}>
              <div className={styles.fullPhoto}>
                <Image key={photo.id} src={photo.file.src} alt={photo.alt} fill sizes="(min-width: 1000px) 680px, (min-width: 700px) 58vw, 95vw" />
              </div>
              <div className={styles.photoControls} role="group" aria-label={projectCopy.photos}>
                {active.photos.length > 1 ? <button type="button" onClick={() => changePhoto(-1)} aria-label={projectCopy.previous}><ArrowRightIcon className={styles.backArrow} size={21} /></button> : null}
                <p role="status" aria-live="polite">{photoIndex + 1} / {active.photos.length}</p>
                {active.photos.length > 1 ? <button type="button" onClick={() => changePhoto(1)} aria-label={projectCopy.next}><ArrowRightIcon size={21} /></button> : null}
              </div>
            </div>
            <div className={styles.projectBody}>
              <p className="eyebrow">{active.category}</p>
              <h2 id="projekat-naslov">{active.title}</h2>
              <p className={styles.description}>{active.description}</p>
              <dl className={styles.facts}>
                <div><dt>{projectCopy.scope}</dt><dd>{active.scope}</dd></div>
                <div><dt>{projectCopy.detail}</dt><dd>{active.detail}</dd></div>
              </dl>
              {active.credit ? <p className={styles.credit}>{active.credit}</p> : null}
              <Link href={`/kontakt/?projekat=${active.id}#upit`} className="btn btn-sm" onClick={() => dialog.current?.close()}>{projectCopy.inquiry}<ArrowRightIcon size={18} /></Link>
              <Link href={active.service.href} className={styles.serviceLink} onClick={() => dialog.current?.close()}>{active.service.label}<ArrowRightIcon size={17} /></Link>
              <a className={styles.source} href={active.source} target="_blank" rel="noopener noreferrer">{projectCopy.source}<span className="visually-hidden"> (Instagram, novi prozor)</span></a>
            </div>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
