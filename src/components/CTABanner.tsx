import Link from "next/link";
import { ArrowUpRight, MessageSquareQuote, ShieldCheck } from "lucide-react";

import EditorialReveal from "@/components/EditorialReveal";
import GradientReveal from "@/components/GradientReveal";
import MagneticButton from "@/components/MagneticButton";
import SectionDivider from "@/components/SectionDivider";
import SectionSpotlight from "@/components/SectionSpotlight";
import { siteConfig } from "@/lib/site";

const proofPoints = [
  "Written scope, 50% deposit, and clear launch gate",
  "Launch checks, form routing, and mobile CTA polish included",
  "Leadcraft-hosted launch recommended, clean handoff still available",
] as const;

export default function CTABanner() {
  return (
    <section id="contact" className="relative section-pad">
      <SectionDivider tone="mixed" className="mb-16" />
      <SectionSpotlight tone="gold" />
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(216,170,115,0.1),rgba(17,18,24,0.14)_46%,rgba(125,183,176,0.08))] px-6 py-7 sm:px-8 sm:py-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow">Next Step</p>
              <EditorialReveal
                className="mt-6"
                lineClassName="text-3xl font-semibold text-stone-50 sm:text-4xl"
                delayStep={0.06}
                lines={[
                  <span key="cta-line-1">If the fit looks close,</span>,
                  <span key="cta-line-2">
                    move into the{" "}
                    <GradientReveal text="audit brief" className="headline-accent" delayOffset={0.06} />{" "}
                    or book the call.
                  </span>,
                ]}
              />
              <p className="muted-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
                The homepage now gets buyers to the important decision points
                faster. The next move is to send the audit intake, book the
                strategy call, or review proof of work before the project moves
                into written scope.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <MagneticButton>
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary px-6 py-3.5 text-sm"
                  >
                    Book Strategy Call
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </MagneticButton>
                <Link href="/contact" className="button-secondary px-6 py-3.5 text-sm">
                  Open Audit Intake
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
                      Good-fit projects move through audit direction, written
                      scope, deliverables, deposit, timeline, signer clarity,
                      and launch review before any kickoff step.
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
