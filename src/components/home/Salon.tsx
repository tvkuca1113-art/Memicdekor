import { photos } from '@/content/images';
import { company, formattedAddress } from '@/content/site';
import { Photo } from '../Photo';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import styles from './Salon.module.css';

export function Salon() {
  return (
    <section className={styles.section} aria-labelledby="salon-naslov">
      <div className={`container ${styles.layout}`}>
        <Photo
          photo={photos.salon}
          aspect="4 / 3"
          sizes="(min-width: 1280px) 640px, (min-width: 900px) 50vw, calc(100vw - 40px)"
          className={styles.photo}
        />
        <div className={styles.body}>
          <SectionHeading
            id="salon-naslov"
            eyebrow="Salon"
            title="Posjetite naš salon u Mostaru."
            lead="U salonu možete pogledati keramiku, umivaonike i sanitarnu opremu. Proizvodnja se nalazi u sklopu salona."
            className={styles.heading}
          />
          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>Adresa</dt>
              <dd>
                {company.legalName}
                <br />
                {formattedAddress}
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Telefon</dt>
              <dd>
                <a href={company.phone.href}>{company.phone.display}</a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt>E-mail</dt>
              <dd>
                <a href={company.email.href}>{company.email.display}</a>
              </dd>
            </div>
          </dl>
          <p className={styles.note}>Radno vrijeme provjerite telefonom prije dolaska.</p>
          <a href={company.mapUrl} className={`btn btn-outline ${styles.map}`} target="_blank" rel="noopener noreferrer">
            Otvorite lokaciju na karti
            <span className="visually-hidden"> (Google karte, novi prozor)</span>
            <ArrowRightIcon className="btn-icon" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
