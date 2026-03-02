/**
 * Affiliate link utilities — centralized management of affiliate URLs,
 * UTM parameters, and proper rel attributes for SEO compliance.
 *
 * Usage in Sanity content or JSX:
 *   import { getAffiliateUrl, AFFILIATE_PRODUCTS } from '@/lib/affiliates';
 *   <a href={getAffiliateUrl('vercel')} {...affiliateLinkProps}>Vercel Pro</a>
 */

export interface AffiliateProduct {
  name: string;
  slug: string;
  baseUrl: string;
  /** Affiliate ref/partner ID appended as query param */
  refParam?: string;
  refValue?: string;
  /** UTM campaign for tracking */
  campaign: string;
}

/**
 * Central registry of affiliate products.
 * Add new products here and they're automatically tracked everywhere.
 */
export const AFFILIATE_PRODUCTS: Record<string, AffiliateProduct> = {
  vercel: {
    name: 'Vercel',
    slug: 'vercel',
    baseUrl: 'https://vercel.com',
    refParam: 'ref',
    refValue: 'framefoundry',
    campaign: 'vercel-pro',
  },
  sanity: {
    name: 'Sanity',
    slug: 'sanity',
    baseUrl: 'https://www.sanity.io',
    refParam: 'ref',
    refValue: 'framefoundry',
    campaign: 'sanity-cms',
  },
  neon: {
    name: 'Neon',
    slug: 'neon',
    baseUrl: 'https://neon.tech',
    refParam: 'ref',
    refValue: 'framefoundry',
    campaign: 'neon-postgres',
  },
  supabase: {
    name: 'Supabase',
    slug: 'supabase',
    baseUrl: 'https://supabase.com',
    refParam: 'ref',
    refValue: 'framefoundry',
    campaign: 'supabase-db',
  },
  cursor: {
    name: 'Cursor',
    slug: 'cursor',
    baseUrl: 'https://cursor.com',
    refParam: 'ref',
    refValue: 'framefoundry',
    campaign: 'cursor-ide',
  },
  railway: {
    name: 'Railway',
    slug: 'railway',
    baseUrl: 'https://railway.app',
    refParam: 'referralCode',
    refValue: 'framefoundry',
    campaign: 'railway-hosting',
  },
};

/**
 * Build a fully tracked affiliate URL with UTM parameters.
 *
 * @param productSlug - Key from AFFILIATE_PRODUCTS
 * @param source - UTM source, defaults to 'blog'
 * @param medium - UTM medium, defaults to 'article'
 */
export function getAffiliateUrl(
  productSlug: string,
  source = 'blog',
  medium = 'article'
): string {
  const product = AFFILIATE_PRODUCTS[productSlug];
  if (!product) return '#';

  const url = new URL(product.baseUrl);

  // Affiliate referral parameter
  if (product.refParam && product.refValue) {
    url.searchParams.set(product.refParam, product.refValue);
  }

  // UTM tracking parameters
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', product.campaign);

  return url.toString();
}

/**
 * Standard props for affiliate links — ensures SEO compliance.
 * Apply to all <a> tags that contain affiliate links.
 */
export const affiliateLinkProps = {
  target: '_blank' as const,
  rel: 'sponsored noopener noreferrer',
} as const;
