import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site.config';

/**
 * robots.txt — allows all crawlers, points to the dynamic sitemap.
 * Next.js App Router automatically serves this at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
