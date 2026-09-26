import Link from 'next/link';
import { company, footerNav, formattedAddress, socialProfiles } from '@/content/site';
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon } from './icons';
import { Logo } from './Logo';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo alt="Memić Dekor – studio keramike" className={styles.logo} sizes="200px" loading="lazy" />
            <p className={styles.tagline}>
              Keramika, umivaonici i sanitarna oprema te izrada po mjeri. Salon i proizvodnja u Mostaru.
            </p>
          </div>

          <nav className={styles.column} aria-labelledby="podnozje-stranice">
            <h2 id="podnozje-stranice" className={styles.heading}>
              Stranice
            </h2>
            <ul className={styles.list}>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 className={styles.heading}>Kontakt</h2>
            <ul className={styles.list}>
              <li>
                <a href={company.phone.href} className={styles.iconLink}>
                  <PhoneIcon size={18} />
                  {company.phone.display}
                </a>
              </li>
              <li>
                <a href={company.email.href} className={styles.iconLink}>
                  <MailIcon size={18} />
                  {company.email.display}
                </a>
              </li>
              <li>
                <a href={company.mapUrl} className={styles.iconLink} target="_blank" rel="noopener noreferrer">
                  <MapPinIcon size={18} />
                  {formattedAddress}
                  <span className="visually-hidden"> (otvara Google karte u novom prozoru)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>Pratite nas</h2>
            <ul className={styles.list}>
              {socialProfiles.map((profile) => (
                <li key={profile.href}>
                  <a href={profile.href} className={styles.iconLink} target="_blank" rel="noopener noreferrer">
                    {profile.name === 'Instagram' ? <InstagramIcon size={18} /> : <FacebookIcon size={18} />}
                    {profile.label}
                    <span className="visually-hidden"> (otvara se u novom prozoru)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {company.legalName}, {company.address.city}
          </p>
          <p>Uvodna fotografija kuhinje je ilustrativni prikaz.</p>
        </div>
      </div>
    </footer>
  );
}
