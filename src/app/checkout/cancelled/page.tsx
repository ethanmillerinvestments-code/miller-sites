import type { Metadata } from "next";
import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutCancelledPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0f] px-4 py-16 text-stone-100 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(21,22,27,0.92),rgba(13,14,18,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <BrandLogo />
        <div className="space-y-4">
          <p className="eyebrow">Checkout paused</p>
          <h1 className="section-title text-5xl text-stone-50 sm:text-6xl">
            No payment was taken.
          </h1>
          <p className="muted-copy max-w-2xl text-lg leading-8">
            Checkout was cancelled before anything completed. You can return to
            the site, request scope first, or book a call instead. If the brief
            submitted cleanly before checkout opened, Leadcraft still has the
            project details for follow-up.
          </p>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="lux-subtle rounded-[1.4rem] p-5">
            <p className="mini-label">Recommended path</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              Use the pricing and contact sections to confirm the right scope,
              then move into payment when the project is aligned.
            </p>
          </div>
          <div className="lux-subtle rounded-[1.4rem] p-5">
            <p className="mini-label">Need clarification</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              If pricing, deliverables, or timeline need to be clarified, book a
              strategy call and sort it out before paying.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#package-finder"
            className="button-primary px-6 py-3.5 text-sm"
          >
            Return to Price Finder
          </Link>
          <a
            href="https://calendly.com/ethanmillerinvestments"
            target="_blank"
            rel="noreferrer"
            className="button-secondary px-6 py-3.5 text-sm"
          >
            Book Strategy Call
          </a>
        </div>
      </div>
    </main>
  );
}
