/**
 * Central site configuration — single source of truth for all SEO,
 * branding, and metadata values used across the entire application.
 */

export const siteConfig = {
  name: 'FrameFoundry',
  tagline: 'Production-Grade AI Engineering',
  description:
    'Battle-tested patterns for founders and engineers shipping AI-powered apps with Next.js. Deep-dives into LLM integration, AI agents, and modern full-stack architecture.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://framefoundry.dev',
  ogImage: '/og-default.png',
  author: {
    name: 'FrameFoundry',
    url: 'https://github.com/framefoundry',
    twitter: '@framefoundry',
  },
  links: {
    github: 'https://github.com/framefoundry',
    twitter: 'https://x.com/framefoundry',
  },
  /** Default keywords applied to all pages, merged with page-specific ones */
  keywords: [
    'AI engineering',
    'Next.js',
    'React',
    'LLM integration',
    'AI agents',
    'full-stack development',
    'Vercel',
    'Sanity CMS',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
