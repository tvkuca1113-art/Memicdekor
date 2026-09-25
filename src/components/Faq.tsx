import Link from 'next/link';
import type { FaqItem } from '@/content/faq';
import { PlusIcon } from './icons';
import styles from './Faq.module.css';

/** Česta pitanja kao nativni details/summary: rade tastaturom i bez JavaScripta. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <details key={item.id} className={styles.item} id={`pitanje-${item.id}`}>
          <summary className={styles.summary}>
            <span className={styles.question}>{item.question}</span>
            <PlusIcon size={22} className={styles.icon} />
          </summary>
          <div className={styles.answer}>
            <p>{item.answer}</p>
            {item.link ? (
              <p>
                <Link href={item.link.href} className="inline-link">
                  {item.link.label}
                </Link>
              </p>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
