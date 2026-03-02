import { siteConfig } from './site.config';

/**
 * JSON-LD Schema generators for structured data.
 * Injected via <script type="application/ld+json"> in page components.
 *
 * References:
 * - https://schema.org/Article
 * - https://schema.org/BreadcrumbList
 * - https://schema.org/FAQPage
 * - https://schema.org/Organization
 * - https://schema.org/WebSite
 */

/* ------------------------------------------------------------------ */
/*  Organization                                                       */
/* ------------------------------------------------------------------ */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [siteConfig.links.github, siteConfig.links.twitter],
    description: siteConfig.description,
  };
}

/* ------------------------------------------------------------------ */
/*  WebSite (homepage — enables sitelinks search box in Google)        */
/* ------------------------------------------------------------------ */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: organizationSchema(),
  };
}

/* ------------------------------------------------------------------ */
/*  Article                                                            */
/* ------------------------------------------------------------------ */
interface ArticleSchemaInput {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  imageUrl?: string;
  categories?: string[];
}

export function articleSchema(post: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.imageUrl || `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${siteConfig.url}/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: post.authorName || siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: organizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
    ...(post.categories && post.categories.length > 0
      ? { articleSection: post.categories[0] }
      : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList                                                     */
/* ------------------------------------------------------------------ */
interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  FAQPage (for articles that have FAQ sections)                      */
/* ------------------------------------------------------------------ */
interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
