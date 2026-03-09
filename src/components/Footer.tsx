import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import { guidePages, siteConfig } from "@/lib/site";

const sectionLinks = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(8,9,12,0.92)]">
      <div className="section-shell py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr]">
          <div className="max-w-lg">
            <BrandLogo />
            <h2 className="mt-4 text-3xl font-semibold text-stone-50">
              Websites for home-service companies that need better calls, quotes, and first impressions.
            </h2>
            <p className="muted-copy mt-4 text-sm leading-7">
              Built for HVAC, plumbing, roofing, electrical, landscaping,
              painting, pressure washing, garage door, and similar local
              service teams.
            </p>
          </div>

          <div>
            <p className="mini-label">Navigate</p>
            <div className="mt-4 space-y-3 text-sm">
              {sectionLinks.map((link) => (
                <Link
                  key={link.href}
                  className="focus-lux block rounded-full py-1 text-stone-300 transition-colors hover:text-[color:var(--accent-strong)]"
                  href={`/${link.href}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mini-label">Explore</p>
            <div className="mt-4 space-y-3 text-sm">
              {guidePages.map((link) => (
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
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-stone-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
