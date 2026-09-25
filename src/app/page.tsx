import type { Metadata } from 'next';
import { InquirySection } from '@/components/InquirySection';
import { JsonLd } from '@/components/JsonLd';
import { Categories } from '@/components/home/Categories';
import { Details } from '@/components/home/Details';
import { FaqSection } from '@/components/home/FaqSection';
import { Hero } from '@/components/home/Hero';
import { Salon } from '@/components/home/Salon';
import { Services } from '@/components/home/Services';
import { Spaces } from '@/components/home/Spaces';
import { localBusinessJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('home');

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Hero />
      <Services />
      <Spaces />
      <Categories />
      <Details />
      <Salon />
      <FaqSection />
      <InquirySection />
    </>
  );
}
