import Link from "next/link";
import { ArrowUpRight, MessageSquareQuote, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/lib/site";

const proofPoints = [
  "One-time build scope, optional monthly support",
  "Launch checks, form routing, and mobile CTA polish included",
  "No fake ranking promises or filler deliverables",
] as const;

export default function CTABanner() {
  return (
    <section id="contact" className="section-pad section-rule">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(216,170,115,0.1),rgba(17,18,24,0.14)_46%,rgba(125,183,176,0.08))] px-6 py-7 sm:px-8 sm:py-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow">Next Step</p>
              <h2 className="mt-6 text-3xl font-semibold text-stone-50 sm:text-4xl">
                If the pricing looks close, move into contact or a scope call.
              </h2>
              <p className="muted-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
                The homepage keeps the key sales info up front. The next move
                is either to open the contact form, book the strategy call, or
                review proof of work before sending the brief.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary px-6 py-3.5 text-sm"
                >
                  Book Strategy Call
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link href="/contact" className="button-secondary px-6 py-3.5 text-sm">
                  Open Contact Form
                </Link>
              </div>

              <p className="mt-4 text-sm leading-7 text-stone-300">
                Need to see direction first?{" "}
                <Link
                  href="/client-products"
                  className="font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-stone-50"
                >
                  View proof of work.
                </Link>
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                    <MessageSquareQuote className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">Scope First</p>
                    <p className="mt-2 text-sm leading-7 text-stone-200">
                      Good-fit projects move through written scope,
                      deliverables, timeline, and signer clarity before any
                      kickoff or payment step.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="mini-label">What Is Already Included</p>
                    <ul className="mt-3 space-y-3 text-sm leading-7 text-stone-200">
                      {proofPoints.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
