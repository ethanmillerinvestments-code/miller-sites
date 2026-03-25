import Link from "next/link";

import ScrollReveal from "@/components/ScrollReveal";
import type { BlogPost } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <ScrollReveal>
      <Link
        href={`/blog/${post.slug}`}
        className="lux-panel group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(216,170,115,0.28)] hover:shadow-[0_12px_40px_rgba(216,170,115,0.1)]"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="mini-label">{formattedDate}</span>
          <span className="mini-label opacity-50">·</span>
          <span className="mini-label">{post.readingTime}</span>
        </div>

        <h2 className="section-title mt-4 text-xl font-semibold text-stone-50 transition-colors duration-300 group-hover:text-[color:var(--accent-strong)] sm:text-2xl">
          {post.title}
        </h2>

        <p className="muted-copy mt-3 text-sm leading-7">
          {post.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-stone-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </ScrollReveal>
  );
}
