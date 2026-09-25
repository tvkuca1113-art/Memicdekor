import type { Metadata } from 'next';
import { InquirySection } from '@/components/InquirySection';
import { JsonLd } from '@/components/JsonLd';
import { PageIntro } from '@/components/PageIntro';
import { Salon } from '@/components/home/Salon';
import { localBusinessJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('kontakt');

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <PageIntro
        trail={['home', 'kontakt']}
        eyebrow="Kontakt"
        title="Kontakt i upit"
        lead="Pošaljite upit putem forme, nazovite nas ili posjetite salon u Mostaru."
      />
      <InquirySection />
      <Salon />
    </>
  );
}
