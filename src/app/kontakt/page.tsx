import type { Metadata } from 'next';
import { InquirySection } from '@/components/InquirySection';
import { JsonLd } from '@/components/JsonLd';
import { PageIntro } from '@/components/PageIntro';
import { photos } from '@/content/images';
import { Salon } from '@/components/home/Salon';
import { localBusinessJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';
import { projectCopy, projects } from '@/content/projects';

export const metadata: Metadata = pageMetadata('kontakt');

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ projekat?: string | string[] }> }) {
  const { projekat } = await searchParams;
  const project = typeof projekat === 'string' ? projects.find((item) => item.id === projekat) : undefined;
  const initialInquiry = project ? {
    space: project.space,
    message: projectCopy.inquiryMessage(project.title),
  } : undefined;
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <PageIntro
        trail={['home', 'kontakt']}
        eyebrow="Kontakt"
        title="Kontakt i upit"
        lead="Pošaljite upit putem forme, nazovite nas ili posjetite salon u Mostaru."
        photo={photos.salonPult}
      />
      <InquirySection initialInquiry={initialInquiry} />
      <Salon />
    </>
  );
}
