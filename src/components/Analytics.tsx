import Script from 'next/script';

/**
 * Analytics component — loads GA4 or PostHog via Next.js Script component.
 *
 * Uses strategy="afterInteractive" to avoid blocking LCP.
 * Set NEXT_PUBLIC_GA_ID in .env.local to enable Google Analytics.
 *
 * To switch to PostHog, replace the GA4 scripts with PostHog's snippet
 * and set NEXT_PUBLIC_POSTHOG_KEY instead.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}

/**
 * Track custom events (affiliate clicks, CTA clicks, newsletter signups).
 * Call from client components:
 *   import { trackEvent } from '@/components/Analytics';
 *   trackEvent('affiliate_click', { product: 'vercel', position: 'inline' });
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}
