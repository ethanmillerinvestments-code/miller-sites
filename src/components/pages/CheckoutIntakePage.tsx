"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Layers3, ShieldCheck } from "lucide-react";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import StarBorder from "@/components/reactbits/Animations/StarBorder";
import {
  getCheckoutOffers,
  getCheckoutSelectionLabel,
  getCheckoutWorkflowLabel,
  normalizeCheckoutOfferIds,
} from "@/lib/checkout-intake";
import { siteConfig } from "@/lib/site";

type CheckoutIntakePageProps = {
  itemId?: string;
  itemIds?: string[];
};

const requiredBriefPoints = [
  "Who the company is and where it operates",
  "What services matter most right now",
  "What the current website or sales flow is missing",
  "What result the business wants from the selected package",
] as const;

const timelineOptions = [
  "ASAP",
  "Within 2 weeks",
  "This month",
  "Next month",
  "Just planning ahead",
] as const;

function getSelection(itemId?: string, itemIds?: string[]) {
  const ids = normalizeCheckoutOfferIds(itemIds?.length ? itemIds : itemId ? [itemId] : []);
  const offers = getCheckoutOffers(ids);

  return {
    ids,
    offers,
    label: getCheckoutSelectionLabel(ids),
    workflowLabel: getCheckoutWorkflowLabel(ids),
  };
}

function formatCurrency(priceLabel: string) {
  return priceLabel;
}

const supportIds = new Set([
  "hosted-core",
  "managed-site-care",
  "search-conversion-support",
]);

export default function CheckoutIntakePage({
  itemId,
  itemIds,
}: CheckoutIntakePageProps) {
  const selection = getSelection(itemId, itemIds);
  const [startedAt, setStartedAt] = useState(() => Date.now().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualReviewMessage, setManualReviewMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selection.offers.length === 0) {
      setError("Please choose a valid offer before continuing.");
      return;
    }

    setIsLoading(true);
    setError("");

    const form = event.currentTarget;
    const data = {
      itemIds: selection.ids,
      honeypot: (form.elements.namedItem("company_url") as HTMLInputElement).value,
      startedAt,
      intake: {
        contactName: (form.elements.namedItem("contactName") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
        companyName: (form.elements.namedItem("companyName") as HTMLInputElement).value,
        role: (form.elements.namedItem("role") as HTMLInputElement).value,
        website: (form.elements.namedItem("website") as HTMLInputElement).value,
        cityState: (form.elements.namedItem("cityState") as HTMLInputElement).value,
        services: (form.elements.namedItem("services") as HTMLTextAreaElement).value,
        serviceAreas: (form.elements.namedItem("serviceAreas") as HTMLTextAreaElement).value,
        primaryGoal: (form.elements.namedItem("primaryGoal") as HTMLTextAreaElement).value,
        currentPain: (form.elements.namedItem("currentPain") as HTMLTextAreaElement).value,
        differentiators: (form.elements.namedItem("differentiators") as HTMLTextAreaElement).value,
        proofAssets: (form.elements.namedItem("proofAssets") as HTMLTextAreaElement).value,
        timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
        notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
      },
    };

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await response.json()) as {
        deliveryMode?: string;
        error?: string;
        message?: string;
        mode?: string;
        url?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "Unable to prepare the next step right now.");
      }

      if (body.mode === "manual_review") {
        setManualReviewMessage(
          body.message ||
            "Company brief captured. The next step is written scope review. If approved, Leadcraft sends a Stripe payment link or invoice manually."
        );
        form.reset();
        setStartedAt(Date.now().toString());
        setIsLoading(false);
        return;
      }

      if (!body.url) {
        throw new Error(body.error || "Unable to prepare the next step right now.");
      }

      window.location.assign(body.url);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to prepare the next step right now."
      );
      setIsLoading(false);
    }
  }

  if (selection.offers.length === 0) {
    return (
      <SiteShell>
        <section className="section-pad pt-32 sm:pt-40">
          <div className="section-shell max-w-4xl">
            <PointerCard className="lux-panel rounded-[2rem] p-8 sm:p-10">
              <p className="eyebrow">Offer not found</p>
              <h1 className="section-title mt-5 text-5xl text-stone-50 sm:text-6xl">
                Choose a valid pricing option first.
              </h1>
              <p className="muted-copy mt-5 max-w-2xl text-lg leading-8">
                The package intake needs a selected build, support lane, or both
                so the brief and scope review stay tied to the right plan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#package-finder"
                  className="button-primary px-6 py-4 text-sm"
                >
                  Return to Price Finder
                </Link>
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary px-6 py-4 text-sm"
                >
                  Book Strategy Call
                </a>
              </div>
            </PointerCard>
          </div>
        </section>
      </SiteShell>
    );
  }

  const buildOffers = selection.offers.filter(
    (offer) => !supportIds.has(offer.id)
  );
  const supportOffers = selection.offers.filter((offer) =>
    supportIds.has(offer.id)
  );

  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          <ScrollReveal direction="blur">
            <span className="eyebrow">Package Intake</span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-6">
                <div>
                  <h1 className="display-title text-[clamp(2.8rem,9vw,5.4rem)] text-stone-50">
                    Brief the business first, then move into clean scope review.
                  </h1>
                  <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
                    This step collects the company details needed to review the
                    selected package, whether it is a new site, support-only, or
                    a build plus ongoing monthly help. It is a scope-first step,
                    not an instant-buy checkout. If the scope is approved,
                    Leadcraft sends the payment request afterward.
                  </p>
                </div>

                <StarBorder className="max-w-xl" contentClassName="p-5 sm:p-6">
                  <p className="mini-label">Selected Package</p>
                  <h2 className="mt-3 text-3xl font-semibold text-stone-50">
                    {selection.label}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-stone-200">
                    Workflow: {selection.workflowLabel}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {selection.offers.map((offer) => (
                      <span
                        key={offer.id}
                        className="rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.08)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-strong)]"
                      >
                        {offer.name} · {formatCurrency(offer.priceLabel)}
                      </span>
                    ))}
                  </div>
                </StarBorder>

                <div className="lux-subtle rounded-[1.75rem] p-6">
                  <p className="mini-label">Package breakdown</p>
                  <div className="mt-5 space-y-4">
                    {buildOffers.length > 0 ? (
                      <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                            <Layers3 className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-stone-50">
                              Website build
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-300">
                              {buildOffers.map((offer) => offer.name).join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {supportOffers.length > 0 ? (
                      <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-stone-50">
                              Monthly support
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-300">
                              {supportOffers.map((offer) => offer.name).join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="lux-subtle rounded-[1.75rem] p-6">
                  <p className="mini-label">What this brief needs to answer</p>
                  <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
                    {requiredBriefPoints.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <ScrollReveal delay={0.12} direction="up">
                <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-8">
                  {manualReviewMessage ? (
                    <div className="py-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(216,170,115,0.28)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h2 className="mt-5 text-3xl font-semibold text-stone-50">
                        Brief received, manual review stays active.
                      </h2>
                      <p className="muted-copy mx-auto mt-4 max-w-xl text-sm leading-7">
                        {manualReviewMessage}
                      </p>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setManualReviewMessage("");
                            setError("");
                            setStartedAt(Date.now().toString());
                          }}
                          className="button-secondary px-5 py-3 text-sm"
                        >
                          Submit Another Brief
                        </button>
                        <a
                          href={siteConfig.calendlyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="button-primary px-5 py-3 text-sm"
                        >
                          Book Strategy Call
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <p className="mini-label">Dense company brief</p>
                        <p className="muted-copy mt-3 text-sm leading-7">
                          The more complete this is, the cleaner the package review,
                          scope confirmation, timeline, and payment step will be.
                        </p>
                      </div>

                      <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="absolute -left-[9999px]" aria-hidden="true">
                          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
                          <input type="hidden" name="startedAt" value={startedAt} readOnly />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label htmlFor="contactName" className="mb-2 block text-sm font-medium text-stone-200">
                              Contact name
                            </label>
                            <input
                              id="contactName"
                              name="contactName"
                              type="text"
                              autoComplete="name"
                              required
                              className="form-field"
                              placeholder="Owner or decision-maker"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-200">
                              Email
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="form-field"
                              placeholder="name@company.com"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-stone-200">
                              Phone
                            </label>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              autoComplete="tel"
                              className="form-field"
                              placeholder="Best callback number"
                            />
                          </div>
                          <div>
                            <label htmlFor="role" className="mb-2 block text-sm font-medium text-stone-200">
                              Role
                            </label>
                            <input
                              id="role"
                              name="role"
                              type="text"
                              className="form-field"
                              placeholder="Owner, ops manager, office manager"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-stone-200">
                              Company name
                            </label>
                            <input
                              id="companyName"
                              name="companyName"
                              type="text"
                              autoComplete="organization"
                              required
                              className="form-field"
                              placeholder="Business name"
                            />
                          </div>
                          <div>
                            <label htmlFor="cityState" className="mb-2 block text-sm font-medium text-stone-200">
                              City and state
                            </label>
                            <input
                              id="cityState"
                              name="cityState"
                              type="text"
                              required
                              className="form-field"
                              placeholder="Cincinnati, Ohio"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="website" className="mb-2 block text-sm font-medium text-stone-200">
                            Current website
                          </label>
                          <input
                            id="website"
                            name="website"
                            type="url"
                            className="form-field"
                            placeholder="https://yourcompany.com"
                          />
                        </div>

                        <div>
                          <label htmlFor="services" className="mb-2 block text-sm font-medium text-stone-200">
                            Core services
                          </label>
                          <textarea
                            id="services"
                            name="services"
                            required
                            rows={3}
                            className="form-field min-h-[8rem]"
                            placeholder="List the main services and the priority offers that should get pushed hardest."
                          />
                        </div>

                        <div>
                          <label htmlFor="serviceAreas" className="mb-2 block text-sm font-medium text-stone-200">
                            Service areas
                          </label>
                          <textarea
                            id="serviceAreas"
                            name="serviceAreas"
                            required
                            rows={3}
                            className="form-field min-h-[8rem]"
                            placeholder="Cities, counties, neighborhoods, or service radius details."
                          />
                        </div>

                        <div>
                          <label htmlFor="primaryGoal" className="mb-2 block text-sm font-medium text-stone-200">
                            Primary goal
                          </label>
                          <textarea
                            id="primaryGoal"
                            name="primaryGoal"
                            required
                            rows={4}
                            className="form-field min-h-[9rem]"
                            placeholder="What should this package improve right now, more calls, cleaner credibility, easier upkeep, hosting stability, backend support, or something else?"
                          />
                        </div>

                        <div>
                          <label htmlFor="currentPain" className="mb-2 block text-sm font-medium text-stone-200">
                            Current pain points
                          </label>
                          <textarea
                            id="currentPain"
                            name="currentPain"
                            required
                            rows={4}
                            className="form-field min-h-[9rem]"
                            placeholder="Explain what is broken now, weak design, no trust, low mobile quality, poor service structure, backend friction, hard updates, or no site at all."
                          />
                        </div>

                        <div>
                          <label htmlFor="differentiators" className="mb-2 block text-sm font-medium text-stone-200">
                            Why customers choose you
                          </label>
                          <textarea
                            id="differentiators"
                            name="differentiators"
                            required
                            rows={3}
                            className="form-field min-h-[8rem]"
                            placeholder="Certifications, guarantees, speed, financing, years in business, review strength, specialty work, or anything else that sets you apart."
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-[0.55fr_0.45fr]">
                          <div>
                            <label htmlFor="proofAssets" className="mb-2 block text-sm font-medium text-stone-200">
                              Proof assets
                            </label>
                            <textarea
                              id="proofAssets"
                              name="proofAssets"
                              rows={3}
                              className="form-field min-h-[8rem]"
                              placeholder="Optional. Reviews, before and after work, badges, memberships, backend requirements, integrations, or anything else available."
                            />
                          </div>
                          <div>
                            <label htmlFor="timeline" className="mb-2 block text-sm font-medium text-stone-200">
                              Timeline
                            </label>
                            <select
                              id="timeline"
                              name="timeline"
                              defaultValue=""
                              required
                              className="form-field"
                            >
                              <option value="" disabled>
                                Select one
                              </option>
                              {timelineOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-stone-200">
                            Extra notes
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="form-field min-h-[8rem]"
                            placeholder="Optional. Anything about approvals, brand direction, signer details, backend needs, or handoff expectations."
                          />
                        </div>

                        {error ? (
                          <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-7 text-rose-200">
                            {error}
                          </p>
                        ) : null}

                        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="button-primary w-full px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isLoading ? "Preparing next step..." : "Submit Brief For Scope Review"}
                          </button>
                          <Link
                            href="/#package-finder"
                            className="button-secondary w-full px-6 py-4 text-center text-sm sm:w-auto"
                          >
                            Back to price finder
                          </Link>
                        </div>

                        <p className="text-sm leading-7 text-stone-400">
                          This brief gives Leadcraft the details needed for scope,
                          timeline, signer review, and next-step planning. Payment
                          only follows the compliant path that gets chosen explicitly
                          after the brief is reviewed.
                        </p>
                      </form>
                    </>
                  )}
                </PointerCard>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteShell>
  );
}
