"use client";

import Link from "next/link";

import EditorialReveal from "@/components/EditorialReveal";
import MagneticButton from "@/components/MagneticButton";
import SiteShell from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export default function NotFoundPage() {
  return (
    <SiteShell showBackToTop={false} showStickyCTA={false}>
      <section className="section-shell section-pad flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="eyebrow mb-8">404</p>

        <EditorialReveal
          className="mb-6"
          lines={[
            <span key="line" className="display-title text-4xl sm:text-5xl md:text-6xl">
              This page does{" "}
              <span className="text-sheen">not</span>{" "}
              exist.
            </span>,
          ]}
        />

        <p className="muted-copy mx-auto mt-4 max-w-md text-base leading-relaxed sm:text-lg">
          You may have followed a broken link, or the page has been moved.
          Either way, the path forward is simple.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <MagneticButton>
            <Link
              href="/"
              className="button-primary px-7 py-3.5 text-sm sm:text-base"
            >
              Back to the homepage
            </Link>
          </MagneticButton>

          <a
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-secondary px-7 py-3.5 text-sm sm:text-base"
          >
            Book a strategy call
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
