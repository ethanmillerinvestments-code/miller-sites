import Link from "next/link";
import { Compass, MapPin, MessageSquareText } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/site";

const operatingCards = [
  {
    title: siteConfig.operatingModel,
    body:
      "Leadcraft is run directly by Ethan Miller. Strategy, scope, copy direction, and build execution stay close together instead of passing through extra layers.",
    icon: Compass,
    tone: "accent",
  },
  {
    title: siteConfig.locationDisplay,
    body:
      "The company is based in Cincinnati, Ohio and works with US home-service operators that need stronger trust, clearer service structure, and a better lead path.",
    icon: MapPin,
    tone: "neutral",
  },
  {
    title: siteConfig.responseStandard,
    body:
      "Fit reviews move quickly. If the project looks aligned, the reply moves into teardown notes, scope direction, and the next practical step instead of a vague wait.",
    icon: MessageSquareText,
    tone: "teal",
  },
] as const;

export default function FounderOperatingNote() {
  return (
    <section className="section-pad section-rule">
      <div className="section-shell">
        <ScrollReveal direction="blur">
          <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr] xl:items-end">
            <div className="max-w-3xl">
              <span className="eyebrow">Direct Operator</span>
              <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
                Leadcraft is intentionally small, direct, and scope-first.
              </h2>
              <p className="muted-copy mt-6 text-lg leading-8">
                The company is set up to feel premium without pretending there is
                a giant team behind the curtain. The point is tighter thinking,
                cleaner execution, and clearer accountability from the first call
                through launch.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] p-6">
              <p className="mini-label">Commercial Standard</p>
              <p className="mt-4 text-lg leading-8 text-stone-100">
                {siteConfig.scopeStandard}. The public prices are real starting
                points, but the project still moves through fit review, written
                scope, and a clear next-step path.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/about" className="button-secondary px-5 py-3 text-sm">
                  Read About Leadcraft
                </Link>
                <Link href="/contact" className="button-primary px-5 py-3 text-sm">
                  Request A Scope Review
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {operatingCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <ScrollReveal
                key={card.title}
                delay={0.04 + index * 0.05}
                direction={index === 1 ? "blur" : "up"}
              >
                <article
                  className={`h-full rounded-[1.75rem] border p-5 sm:p-6 ${
                    card.tone === "accent"
                      ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                      : card.tone === "teal"
                        ? "border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)]"
                        : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mini-label">Leadcraft Standard</p>
                  </div>
                  <h3 className="mt-4 text-[1.65rem] font-semibold text-stone-50">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">
                    {card.body}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
