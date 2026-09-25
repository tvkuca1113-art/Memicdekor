import type { MetadataRoute } from 'next';
import { pages, sitemapPages } from '@/content/pages';
import { absoluteUrl } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPages.map((key) => ({
    url: absoluteUrl(pages[key].path),
    changeFrequency: key === 'home' ? 'monthly' : 'yearly',
    priority: key === 'home' ? 1 : 0.7,
  }));
}
