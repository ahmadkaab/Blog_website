import { groq } from "next-sanity";

// Query for the homepage — latest posts with author + category info
export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  "authorName": author->name,
  "authorImage": author->image,
  "categories": categories[]->title,
  "excerpt": coalesce(excerpt, pt::text(body)[0..200]),
  body
}`;

// Query for a single post by slug — includes all fields needed for SEO metadata + schema
export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  _updatedAt,
  _createdAt,
  "author": author->{
    name,
    image,
    "bio": coalesce(bio, ""),
    "slug": slug.current
  },
  "categories": categories[]->title,
  "excerpt": coalesce(excerpt, pt::text(body)[0..200]),
  body
}`;

// Query to get slugs of related posts in the same category
export const relatedPostsQuery = groq`*[_type == "post" && defined(slug.current) && slug.current != $currentSlug && count((categories[]->title)[@ in $categories]) > 0] | order(publishedAt desc) [0..2] {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  "authorName": author->name,
  "categories": categories[]->title,
  "excerpt": coalesce(excerpt, pt::text(body)[0..200])
}`;
