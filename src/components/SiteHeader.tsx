'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { company, formattedAddress, mainNav, primaryCta, type NavItem } from '@/content/site';
import { ArrowRightIcon, CloseIcon, MailIcon, MapPinIcon, MenuIcon, PhoneIcon } from './icons';
import { Logo } from './Logo';
import styles from './SiteHeader.module.css';

const DESKTOP_QUERY = '(min-width: 1080px)';

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}
const getScrolled = () => window.scrollY > 40;
const getServerScrolled = () => false;

function trimSlash(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function currentState(pathname: string, item: NavItem): 'page' | 'true' | undefined {
  const current = trimSlash(pathname);
  if (current === trimSlash(item.href)) return 'page';
  if (item.section?.some((path) => trimSlash(path) === current)) return 'true';
  return undefined;
}

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getServerScrolled);
  const home = pathname === '/';
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setMenuOpen(true);
    closeRef.current?.focus();
  };

  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, []);

  // Zatvaranje (Escape, dugme ili link) vraća fokus na dugme menija.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setMenuOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  // Meni se zatvara nakon promjene stranice i pri prelasku na širi ekran.
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = () => {
      if (query.matches) closeMenu();
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [closeMenu]);

  // Na početnoj stranici logo vraća na vrh bez ponovnog učitavanja.
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    if (window.location.hash) window.history.replaceState(window.history.state, '', '/');
  };

  return (
    <header className={[styles.header, home && styles.home, home && !scrolled && styles.overlay].filter(Boolean).join(' ')}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} onClick={handleLogoClick}>
          <Logo
            alt="Memić Dekor – studio keramike, početna stranica"
            className={styles.logoImage}
            sizes="(min-width: 1280px) 252px, (min-width: 1080px) 204px, 172px"
          />
        </Link>

        <nav className={styles.nav} aria-label="Glavna navigacija">
          <ul className={styles.navList}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink} aria-current={currentState(pathname, item)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={company.phone.href} className={styles.phone}>
            <PhoneIcon size={18} />
            <span>
              <span className="visually-hidden">Telefon: </span>
              {company.phone.display}
            </span>
          </a>
          <Link href={primaryCta.href} className={`btn btn-sm ${styles.cta}`}>
            {primaryCta.label}
            <ArrowRightIcon className="btn-icon" size={18} />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuButton}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobilni-meni"
            onClick={openMenu}
          >
            <MenuIcon size={28} />
            <span className="visually-hidden">Otvori meni</span>
          </button>
        </div>
      </div>

      <dialog
        id="mobilni-meni"
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Meni"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.panelTop}>
            <Logo alt="" className={styles.panelLogo} sizes="172px" loading="lazy" />
            <button ref={closeRef} type="button" className={styles.closeButton} onClick={closeMenu}>
              <CloseIcon size={26} />
              <span className="visually-hidden">Zatvori meni</span>
            </button>
          </div>

          <nav aria-label="Meni stranice">
            <ul className={styles.panelList}>
              {[{ label: 'Početna', href: '/' }, ...mainNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.panelLink}
                    aria-current={currentState(pathname, item)}
                    onClick={closeMenu}
                  >
                    {item.label}
                    <ArrowRightIcon size={20} className={styles.panelArrow} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href={primaryCta.href} className={`btn ${styles.panelCta}`} onClick={closeMenu}>
            {primaryCta.label}
            <ArrowRightIcon className="btn-icon" size={20} />
          </Link>

          <ul className={styles.panelContact}>
            <li>
              <a href={company.phone.href}>
                <PhoneIcon size={18} />
                {company.phone.display}
              </a>
            </li>
            <li>
              <a href={company.email.href}>
                <MailIcon size={18} />
                {company.email.display}
              </a>
            </li>
            <li>
              <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPinIcon size={18} />
                {formattedAddress}
                <span className="visually-hidden"> (otvara Google karte u novom prozoru)</span>
              </a>
            </li>
          </ul>
        </div>
      </dialog>
    </header>
  );
}
