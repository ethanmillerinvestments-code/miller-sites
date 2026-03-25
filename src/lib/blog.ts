export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  content: string;
};

import { post as whyFail } from "@/content/blog/why-home-service-websites-fail";

const allPosts: BlogPost[] = [whyFail];

export function getAllPosts(): BlogPost[] {
  return allPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}
