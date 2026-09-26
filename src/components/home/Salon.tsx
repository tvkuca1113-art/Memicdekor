import { salonCopy, salonGallery } from '@/content/salon';
import { company, formattedAddress } from '@/content/site';
import { SectionHeading } from '../SectionHeading';
import { ArrowRightIcon } from '../icons';
import { SalonGallery } from './SalonGallery';
import styles from './Salon.module.css';

export function Salon() {
  return (
    <section id="salon" className={styles.section} aria-labelledby="salon-naslov">
      <div className={`container ${styles.layout}`}>
        <SectionHeading
          id="salon-naslov"
          eyebrow={salonCopy.eyebrow}
          title={salonCopy.title}
          lead={salonCopy.lead}
          className={styles.heading}
        />
        <div className={styles.gallery}><SalonGallery items={salonGallery} copy={salonCopy} /></div>
        <div className={styles.body}>
          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>{salonCopy.address}</dt>
              <dd>
                {company.legalName}
                <br />
                {formattedAddress}
              </dd>
            </div>
            <div className={styles.row}>
              <dt>{salonCopy.phone}</dt>
              <dd>
                <a href={company.phone.href}>{company.phone.display}</a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt>{salonCopy.email}</dt>
              <dd>
                <a href={company.email.href}>{company.email.display}</a>
              </dd>
            </div>
          </dl>
          <p className={styles.note}>{salonCopy.note}</p>
          <a href={company.mapUrl} className={`btn btn-outline ${styles.map}`} target="_blank" rel="noopener noreferrer">
            {salonCopy.map}
            <span className="visually-hidden">{salonCopy.mapHint}</span>
            <ArrowRightIcon className="btn-icon" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
