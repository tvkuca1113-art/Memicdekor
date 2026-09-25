import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentSection, ItemList } from '@/components/ContentSection';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { catalogSections } from '@/content/offer';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata('proizvodi');

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        trail={['home', 'proizvodi']}
        eyebrow="Proizvodi"
        title="Keramika, umivaonici i sanitarna oprema"
        lead="Pregled ponude u salonu Memić Dekor u Mostaru. Pločice i umivaonike najbolje je pogledati uživo, a za dostupnost pojedinih modela pošaljite upit."
      >
        <nav aria-label="Kategorije proizvoda" className={styles.jump}>
          <ul>
            {catalogSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
            <li>
              <Link href="/proizvodnja/">Izrada po mjeri</Link>
            </li>
          </ul>
        </nav>
      </PageIntro>

      {catalogSections.map((section, index) => (
        <ContentSection
          key={section.id}
          id={section.id}
          title={section.title}
          tone={index % 2 === 1 ? 'deep' : 'default'}
          photo={section.id === 'umivaonici' ? photos.postolje : undefined}
        >
          <p>{section.intro}</p>
          {section.items ? <ItemList items={section.items} /> : null}
          {section.legacyProducts ? (
            <div className={styles.legacy}>
              <h3 className={styles.legacyTitle}>Iz ranijeg kataloga</h3>
              <ul>
                {section.legacyProducts.map((product) => (
                  <li key={product.name}>
                    <strong>{product.name}</strong> – {product.note}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </ContentSection>
      ))}

      <ContentSection id="izrada-po-mjeri" eyebrow="Po mjeri" title="Ne nalazite odgovarajući format?">
        <p>
          Keramičke umivaonike, kuhinjske ploče, stolove, gazišta, okapnice i mozaike izrađujemo po mjeri vašeg
          prostora, u proizvodnji koja se nalazi u sklopu salona.
        </p>
        <p>
          <Link href="/proizvodnja/" className="text-link">
            <span className="text-link-inner">Saznajte više o izradi po mjeri</span>
          </Link>
        </p>
      </ContentSection>

      <CtaBand
        title="Pitajte za dostupnost i formate."
        text="Pošaljite upit s opisom prostora ili nazovite salon. Aktuelnu ponudu možete pogledati i uživo u Mostaru."
      />
    </>
  );
}
