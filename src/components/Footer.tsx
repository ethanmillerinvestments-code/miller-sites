"use client";

import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import ScrollReveal from "@/components/ScrollReveal";
import StaggerReveal from "@/components/StaggerReveal";
import { supportPlans, websitePlans } from "@/lib/offers";
import { guidePages, legalPages, siteConfig } from "@/lib/site";

const sectionLinks = [
  { href: "#package-finder", label: "Quiz" },
  { href: "#pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Footer() {
  return (
    <footer className="footer-glow-strip bg-[rgba(8,9,12,0.92)]">
      <div className="section-shell py-10 sm:py-12">
        <StaggerReveal staggerDelay={0.06} direction="up" pattern="sequential" className="grid gap-10 md:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr]">
          <div className="max-w-lg">
            <ScrollReveal direction="blur" depth="near">
              <BrandLogo />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.08}>
              <h2 className="mt-4 text-3xl font-semibold text-stone-50">
                Editorial websites for home-service companies that need stronger trust, sharper positioning, and better calls.
              </h2>
            </ScrollReveal>
            <p className="muted-copy mt-4 text-sm leading-7">
              Built for HVAC, plumbing, roofing, electrical, landscaping,
              painting, pressure washing, garage door, and similar local
              service teams.
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              {siteConfig.operatingModel}. Based in {siteConfig.locationDisplay}.
              {" "}
              {siteConfig.responseStandard}.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ScrollReveal direction="left" delay={0.12} depth="near">
                <div className="rounded-[1.3rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] px-4 py-4 text-sm leading-7 text-stone-200">
                  Builds:
                  {" "}
                  {websitePlans.map((plan) => `${plan.name} ${plan.priceLabel}`).join(" · ")}
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.14} depth="near">
                <div className="rounded-[1.3rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] px-4 py-4 text-sm leading-7 text-stone-200">
                  Support:
                  {" "}
                  {supportPlans.map((plan) => `${plan.name} ${plan.priceLabel}`).join(" · ")}
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-4 rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-stone-300">
              The fastest next step is the audit intake. Send the current site,
              the market, the biggest issue, and the main growth goal so the
              reply can move straight into direction.
            </div>
          </div>

          <div>
            <p className="mini-label">Navigate</p>
            <div className="mt-4 space-y-3 text-sm">
              {sectionLinks.map((link) => (
                <Link
                  key={link.href}
                  className="nav-link-slide focus-lux block rounded-full py-1 text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                className="nav-link-slide focus-lux block rounded-full py-1 text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                href="/blog"
              >
                Blog
              </Link>
            </div>
          </div>

          <div>
            <p className="mini-label">Explore</p>
            <div className="mt-4 space-y-3 text-sm">
              {guidePages.map((link) => (
                <Link
                  key={link.href}
                  className="nav-link-slide focus-lux block rounded-full py-1 text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mini-label">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-stone-300">
              <a
                href={siteConfig.phoneHref}
                className="focus-lux block rounded-full py-1 transition-colors hover:text-[color:var(--accent-strong)]"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.emailHref}
                className="focus-lux block rounded-full py-1 break-words transition-colors hover:text-[color:var(--accent-strong)]"
              >
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-lux inline-flex rounded-full py-1 transition-colors hover:text-[color:var(--accent-strong)]"
              >
                Book Strategy Call
              </a>
            </div>

            <div className="mt-6">
              <p className="mini-label">Legal</p>
              <div className="mt-4 space-y-3 text-sm">
                {legalPages.map((link) => (
                  <Link
                    key={link.href}
                    className="focus-lux block rounded-full py-1 text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </StaggerReveal>

        <ScrollReveal direction="up" delay={0.3} depth="near">
          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-stone-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
