import styles from './SectionHeading.module.css';

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Nivo naslova; na početnoj stranici sekcije koriste h2. */
  as?: 'h2' | 'h3';
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, lead, as: Tag = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={[styles.heading, className].filter(Boolean).join(' ')}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {lead ? <p className={`lead ${styles.lead}`}>{lead}</p> : null}
    </div>
  );
}
