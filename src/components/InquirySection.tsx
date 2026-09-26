import { company, formattedAddress } from '@/content/site';
import { ContactForm, type InquiryPrefill } from './ContactForm';
import { SectionHeading } from './SectionHeading';
import { MailIcon, MapPinIcon, PhoneIcon } from './icons';
import styles from './InquirySection.module.css';

type InquirySectionProps = {
  eyebrow?: string;
  title?: string;
  initialInquiry?: InquiryPrefill;
};

export function InquirySection({ eyebrow = 'Upit', title = 'Recite nam šta uređujete.', initialInquiry }: InquirySectionProps) {
  return (
    <section id="upit" className={styles.section} aria-labelledby="upit-naslov">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <SectionHeading
            id="upit-naslov"
            eyebrow={eyebrow}
            title={title}
            lead="Opišite prostor i šta želite izraditi. Javit ćemo vam se na e-mail ili telefon koji ostavite."
            className={styles.heading}
          />
          <ul className={styles.direct}>
            <li>
              <span className={styles.directLabel}>Telefon</span>
              <a href={company.phone.href}>
                <PhoneIcon size={18} />
                {company.phone.display}
              </a>
            </li>
            <li>
              <span className={styles.directLabel}>E-mail</span>
              <a href={company.email.href}>
                <MailIcon size={18} />
                {company.email.display}
              </a>
            </li>
            <li>
              <span className={styles.directLabel}>Salon</span>
              <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPinIcon size={18} />
                {formattedAddress}
                <span className="visually-hidden"> (otvara Google karte u novom prozoru)</span>
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.formWrap}>
          <ContactForm initialInquiry={initialInquiry} />
        </div>
      </div>
    </section>
  );
}
