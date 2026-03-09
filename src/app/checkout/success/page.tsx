import type { Metadata } from "next";
import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Checkout Success",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0f] px-4 py-16 text-stone-100 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(21,22,27,0.92),rgba(13,14,18,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <BrandLogo />
        <div className="space-y-4">
          <p className="eyebrow">Payment received</p>
          <h1 className="section-title text-5xl text-stone-50 sm:text-6xl">
            Secure checkout completed.
          </h1>
          <p className="muted-copy max-w-2xl text-lg leading-8">
            The payment went through. The project brief should already be in the
            Leadcraft inbox, and the next step is scope confirmation, timeline
            alignment, and kickoff around what was purchased.
          </p>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="lux-subtle rounded-[1.4rem] p-5">
            <p className="mini-label">What happens next</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              The next reply should confirm scope, deliverables, signer details,
              timeline, and kickoff details before build work begins.
            </p>
          </div>
          <div className="lux-subtle rounded-[1.4rem] p-5">
            <p className="mini-label">Need anything immediately</p>
            <p className="mt-3 text-sm leading-7 text-stone-200">
              Call or email directly if you need to add notes, assets, or a
              service-page list before the project starts.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="button-primary px-6 py-3.5 text-sm">
            Back to Site
          </Link>
          <a href="mailto:ethanmillerinvestments@gmail.com" className="button-secondary px-6 py-3.5 text-sm">
            Email Leadcraft
          </a>
        </div>
      </div>
    </main>
  );
}
