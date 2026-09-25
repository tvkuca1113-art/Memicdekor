import type { Metadata } from 'next';
import Link from 'next/link';
import { company, primaryCta } from '@/content/site';
import { ArrowRightIcon } from '@/components/icons';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Stranica nije pronađena',
  robots: { index: false, follow: true },
};

const suggestions = [
  { label: 'Početna', href: '/' },
  { label: 'Proizvodi', href: '/proizvodi/' },
  { label: 'Izrada po mjeri', href: '/proizvodnja/' },
  { label: 'Usluge', href: '/usluge/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export default function NotFound() {
  return (
    <section className={styles.section} aria-labelledby="naslov">
      <div className="container">
        <p className="eyebrow">Greška 404</p>
        <h1 id="naslov" className={styles.title}>
          Stranica nije pronađena.
        </h1>
        <p className={`lead ${styles.lead}`}>
          Adresa je možda promijenjena ili stranica više ne postoji. Ako ste tražili proizvod iz ranijeg kataloga,
          pogledajte pregled ponude ili nam pošaljite upit.
        </p>
        <ul className={styles.links}>
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                {item.label}
                <ArrowRightIcon size={18} />
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.contact}>
          <Link href={primaryCta.href} className="btn">
            {primaryCta.label}
            <ArrowRightIcon className="btn-icon" size={20} />
          </Link>
          <a href={company.phone.href} className="inline-link">
            {company.phone.display}
          </a>
        </p>
      </div>
    </section>
  );
}
