import { Metadata } from 'next';
import { postBySlugQuery, relatedPostsQuery } from '@/lib/sanity.queries';
import { client } from '@/lib/sanity.client';
import { urlFor } from '@/lib/sanity.image';
import { siteConfig } from '@/lib/site.config';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import NewsletterForm from '@/components/NewsletterForm';

/* ------------------------------------------------------------------ */
/*  Metadata (SEO)                                                     */
/* ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : `${siteConfig.url}${siteConfig.ogImage}`;

  const description =
    post.excerpt?.slice(0, 160) || `${post.title} — ${siteConfig.description}`;

  return {
    title: post.title,
    description,
    keywords: post.categories || siteConfig.keywords,
    authors: [{ name: post.author?.name || siteConfig.author.name }],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      url: `${siteConfig.url}/blog/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
      creator: siteConfig.author.twitter,
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Portable Text components                                           */
/* ------------------------------------------------------------------ */
const ptComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full h-[400px] my-8 rounded-lg overflow-hidden border border-slate-800 shadow-[0_0_15px_rgba(20,20,25,0.8)]">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || ' '}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl md:text-5xl font-outfit font-bold mt-12 mb-6 text-white tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-outfit font-semibold mt-10 mb-4 text-white hover:text-neonBlue transition-colors border-b border-slate-800 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-outfit font-medium mt-8 mb-4 text-gray-200">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg text-gray-300 leading-relaxed mb-6 font-inter">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-cyberLime pl-6 py-2 my-8 italic text-xl text-gray-400 bg-slate-900/50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-white max-w-fit px-1 bg-slate-800/50 rounded">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-400">{children}</em>
    ),
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http')
        ? '_blank'
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noindex nofollow' : ''}
          className="text-neonBlue hover:text-cyberLime underline decoration-neonBlue/30 hover:decoration-cyberLime transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-300 text-lg">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300 text-lg">
        {children}
      </ol>
    ),
  },
};

/* ------------------------------------------------------------------ */
/*  Reading Time helper                                                */
/* ------------------------------------------------------------------ */
function estimateReadingTime(body: any[]): number {
  if (!body) return 5;
  const text = body
    .filter((block: any) => block._type === 'block')
    .map((block: any) =>
      block.children?.map((child: any) => child.text).join('') || ''
    )
    .join(' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 250));
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) {
    return (
      <div className="min-h-screen bg-charcoal text-white pt-32 text-center">
        <h1 className="text-4xl font-outfit font-bold mb-4">
          404 - Post Not Found
        </h1>
        <p className="text-xl text-slate-400">
          The article you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  // Fetch related posts
  const relatedPosts = await client.fetch(relatedPostsQuery, {
    currentSlug: slug,
    categories: post.categories || [],
  });

  const readingTime = estimateReadingTime(post.body);

  const formattedDate = new Date(
    post.publishedAt || post._createdAt
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lastUpdated = new Date(post._updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build JSON-LD structured data
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(800).url()
    : undefined;

  const jsonLd = articleSchema({
    title: post.title,
    description: post.excerpt || '',
    slug: post.slug.current,
    publishedAt: post.publishedAt || post._createdAt,
    updatedAt: post._updatedAt,
    authorName: post.author?.name || siteConfig.author.name,
    imageUrl,
    categories: post.categories,
  });

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug.current}` },
  ]);

  return (
    <div className="min-h-screen bg-charcoal">
      <ReadingProgress />
      <NavBar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="pt-24 px-6">
        <nav
          className="max-w-4xl mx-auto text-sm text-slate-500 font-inter flex items-center gap-2"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-cyberLime transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[300px]">
            {post.title}
          </span>
        </nav>
      </div>

      {/* Hero Section of the Article */}
      <div className="pt-6 pb-16 px-6 relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-neonBlue/10 to-transparent pointer-events-none opacity-50" />

        <div className="max-w-4xl mx-auto relative z-10">
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-6">
              {post.categories.map((category: any) => (
                <span
                  key={category}
                  className="text-xs uppercase tracking-widest text-cyberLime font-bold border border-cyberLime/30 px-3 py-1 rounded-full bg-cyberLime/5"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-outfit font-extrabold text-white leading-tight tracking-tighter mb-8 shadow-sm">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-400 font-inter flex-wrap">
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(100).height(100).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full border border-slate-700"
                  />
                )}
                <div>
                  <p className="text-white font-medium">{post.author.name}</p>
                  <p className="text-sm text-slate-500">{formattedDate}</p>
                </div>
              </div>
            )}
            {!post.author && (
              <p className="text-sm text-slate-500">{formattedDate}</p>
            )}
            <span className="text-slate-600">·</span>
            <span className="text-sm text-slate-500">
              {readingTime} min read
            </span>
            {post._updatedAt !== post.publishedAt && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-600">
                  Updated {lastUpdated}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {post.mainImage && (
        <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
          <div className="aspect-video w-full relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <Image
              src={urlFor(post.mainImage).width(1200).height(800).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content + Sticky TOC */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex gap-8">
        <article className="max-w-3xl mx-auto flex-1 min-w-0">
          <div className="prose-container">
            <PortableText value={post.body} components={ptComponents} />
          </div>
        </article>
        <aside className="hidden xl:block flex-shrink-0">
          <TableOfContents />
        </aside>
      </div>

      {/* Author Bio Box (E-E-A-T) */}
      {post.author && (
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="border border-white/10 bg-surface/50 rounded-2xl p-8 flex items-start gap-6">
            {post.author.image && (
              <Image
                src={urlFor(post.author.image).width(120).height(120).url()}
                alt={post.author.name}
                width={80}
                height={80}
                className="rounded-full border-2 border-neonBlue/30 flex-shrink-0"
              />
            )}
            <div>
              <p className="text-xs text-neonBlue font-bold uppercase tracking-widest mb-1">
                Written by
              </p>
              <h3 className="text-xl font-outfit font-bold text-white mb-2">
                {post.author.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Building production-grade AI applications with Next.js and
                modern full-stack architecture. Sharing battle-tested patterns
                from the trenches.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-cyberLime transition-colors uppercase tracking-wider font-bold"
                >
                  GitHub →
                </a>
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-cyberLime transition-colors uppercase tracking-wider font-bold"
                >
                  Twitter/X →
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-outfit font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-cyberLime rounded-full" />
            Continue Reading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((related: any) => (
              <Link
                key={related._id}
                href={`/blog/${related.slug.current}`}
                className="bg-surface border border-white/5 p-6 rounded-xl hover-glow transition-all group block"
              >
                {related.mainImage && (
                  <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(related.mainImage).url()}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2 group-hover:text-cyberLime transition-colors leading-tight">
                  {related.title}
                </h3>
                <span className="text-cyberLime text-xs font-bold uppercase tracking-widest">
                  Read More →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <NewsletterForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 text-center text-slate-500 text-sm font-inter">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
