import type { Metadata } from "next";

import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTABanner from "@/components/CTABanner";
import ScrollReveal from "@/components/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on building websites that generate calls for HVAC, plumbing, roofing, and other home-service companies. Written by Leadcraft Agency.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <SiteShell mainClassName="pt-20 sm:pt-24" showStickyCTA={false}>
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

      <section className="section-shell section-pad">
        <ScrollReveal>
          <div className="eyebrow">Insights</div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h1 className="display-title mt-6 text-4xl sm:text-5xl lg:text-6xl">
            Notes on building sites that generate calls
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.16}>
          <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
            Practical thinking on website structure, trust signals, mobile
            conversion, and positioning for local service companies.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <CTABanner />
    </SiteShell>
  );
}
