import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import { client } from "@/lib/sanity.client";
import { postsQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import { websiteSchema, organizationSchema } from "@/lib/schema";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const posts = await client.fetch(postsQuery);

  const jsonLdWebsite = websiteSchema();
  const jsonLdOrg = organizationSchema();

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />

      <NavBar />
      <Hero />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold font-outfit mb-12 flex items-center gap-4">
            <span className="w-12 h-1 bg-cyberLime rounded-full"></span>
            LATEST DEEP-DIVES
          </h2>
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="bg-surface border border-white/5 p-8 rounded-2xl hover-glow transition-all group block"
                >
                  {post.mainImage && (
                    <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                      <Image
                        src={urlFor(post.mainImage).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {post.categories && post.categories.length > 0 && (
                    <div className="text-neonBlue text-xs font-bold uppercase tracking-widest mb-4">
                      {post.categories[0]}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-cyberLime transition-colors leading-tight">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {post.authorName && (
                    <div className="flex items-center gap-3 mb-6">
                      {post.authorImage ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                          <Image
                            src={urlFor(post.authorImage).width(100).url()}
                            alt={post.authorName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">
                          {post.authorName.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-gray-400">
                        {post.authorName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold text-gray-600 uppercase">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-cyberLime text-xs font-bold uppercase tracking-widest">
                      Read Deep-Dive →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 border border-white/5 rounded-2xl bg-white/[0.02]">
              <p className="mb-4">No content found.</p>
              <p className="text-sm text-gray-600">
                Please add your first article from the Sanity Studio dashboard.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
