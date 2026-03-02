import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity.client';
import { siteConfig } from '@/lib/site.config';
import { groq } from 'next-sanity';

/**
 * Dynamic sitemap generated from all published Sanity posts.
 * Next.js App Router automatically serves this at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Fetch all published post slugs + their last modified dates from Sanity
  const posts: { slug: string; updatedAt: string }[] = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }`
  );

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  return [...staticPages, ...postEntries];
}
