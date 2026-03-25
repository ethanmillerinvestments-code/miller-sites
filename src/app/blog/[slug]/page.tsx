import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import CTABanner from "@/components/CTABanner";
import ScrollReveal from "@/components/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import { buildArticleSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteConfig.siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteConfig.siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
    },
  };
}

function renderContent(content: string) {
  const blocks = content.split("\n\n");

  return blocks.map((block, index) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="section-title mt-10 text-2xl font-semibold text-stone-50 sm:text-3xl"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s/, ""));
      return (
        <ol key={index} className="mt-4 list-decimal space-y-2 pl-5 text-stone-300">
          {items.map((item, i) => (
            <li key={i} className="leading-7">
              {item}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p key={index} className="text-stone-300">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
  });

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <SiteShell mainClassName="pt-20 sm:pt-24" showStickyCTA={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="section-shell section-pad">
        <header className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="mini-label">{formattedDate}</span>
              <span className="mini-label opacity-50">·</span>
              <span className="mini-label">{post.readingTime}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h1 className="display-title mt-6 text-3xl sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <p className="muted-copy mt-4 text-lg leading-8">
              {post.description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-stone-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </header>

        <ScrollReveal delay={0.24}>
          <div className="mx-auto mt-12 max-w-3xl border-t border-white/10 pt-10">
            <div className="rhythm-copy text-base leading-8">
              {renderContent(post.content)}
            </div>
          </div>
        </ScrollReveal>
      </article>

      <CTABanner />
    </SiteShell>
  );
}
