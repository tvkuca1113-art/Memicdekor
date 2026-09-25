// Globalni stilovi se uvoze prvi, da bi ih CSS moduli komponenti mogli nadjačati.
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { company } from '@/content/site';
import { isIndexable, siteUrl } from '@/lib/site-config';

const serif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-dm-serif',
});

const sans = Manrope({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} – ${company.descriptor}`,
    template: `%s | ${company.name}`,
  },
  applicationName: company.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bs" className={`${serif.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#sadrzaj">
          Preskoči na sadržaj
        </a>
        <SiteHeader />
        <main id="sadrzaj" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
