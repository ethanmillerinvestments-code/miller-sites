"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import SiteShell from "@/components/SiteShell";
import StarBorder from "@/components/reactbits/Animations/StarBorder";
import { trackEvent } from "@/lib/analytics";
import {
  getCheckoutBillingProfile,
  getCheckoutOffers,
  getCheckoutSelectionLabel,
  getCheckoutWorkflowLabel,
  normalizeCheckoutOfferIds,
  type SanitizedCheckoutIntake,
} from "@/lib/intake/checkout-intake";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type CheckoutIntakePageProps = {
  itemId?: string;
  itemIds?: string[];
};

type StepId = "package" | "business" | "payment" | "project" | "review";

const steps = [
  {
    id: "package" as const,
    title: "Review your package",
    body: "Confirm the package mix, the billing split, and the next step before you enter anything else.",
  },
  {
    id: "business" as const,
    title: "Business details",
    body: "Tell Leadcraft who this is for, who approves it, and where the payment step should go.",
  },
  {
    id: "payment" as const,
    title: "Choose how to pay",
    body: "Pick the payment path that fits the package. Website work and monthly support can be split cleanly.",
  },
  {
    id: "project" as const,
    title: "Project essentials",
    body: "Give the core service, goal, and timing details needed to shape the scope fast.",
  },
  {
    id: "review" as const,
    title: "Review and send",
    body: "Check the package, payment setup, and company details. Then send it through for the next step.",
  },
] as const;

const approvalMethodOptions = [
  "Reply to proposal email",
  "Signed PDF or e-sign",
  "Need to confirm on the scope call",
] as const;

const timelineOptions = [
  "ASAP",
  "Within 2 weeks",
  "This month",
  "Next month",
  "Just planning ahead",
] as const;

const supportIds = new Set([
  "hosted-core",
  "managed-site-care",
  "search-conversion-support",
]);

const launchRules = [
  "Written scope still comes before the payment step",
  "One-time site work can run 50/50 or full upfront",
  "Monthly support always stays Stripe-billed",
] as const;

const hostingNotes = [
  "Leadcraft-hosted launch stays the default recommendation after the build",
  "Hosted Core and higher monthly lanes keep post-launch upkeep cleaner",
  "If you want handoff or self-hosting, say it early so the scope reflects it",
] as const;

function getSelection(itemId?: string, itemIds?: string[]) {
  const ids = normalizeCheckoutOfferIds(
    itemIds?.length ? itemIds : itemId ? [itemId] : []
  );
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

function createInitialFormState(): SanitizedCheckoutIntake {
  return {
    contactName: "",
    email: "",
    phone: "",
    companyName: "",
    legalBusinessName: "",
    role: "",
    signerName: "",
    signerRole: "",
    billingEmail: "",
    approvalMethod: "",
    sitePaymentMethod: "",
    sitePaymentTiming: "",
    monthlyBillingMethod: "",
    website: "",
    cityState: "",
    services: "",
    serviceAreas: "",
    primaryGoal: "",
    currentPain: "",
    differentiators: "",
    proofAssets: "",
    timeline: "",
    notes: "",
  };
}

function getStepValidationError(
  stepId: StepId,
  form: SanitizedCheckoutIntake,
  hasBuild: boolean,
  hasSupport: boolean
) {
  if (stepId === "business") {
    if (!form.contactName || !form.email) {
      return "Add the main contact name and email first.";
    }

    if (!form.companyName || !form.legalBusinessName || !form.cityState) {
      return "Add the business name, legal entity, and city/state.";
    }

    if (!form.signerName || !form.signerRole || !form.billingEmail) {
      return "Add the signer and billing details before moving on.";
    }

    if (!form.approvalMethod) {
      return "Choose how written approval should happen.";
    }
  }

  if (stepId === "payment") {
    if (hasBuild && !form.sitePaymentMethod) {
      return "Choose how the website should be paid.";
    }

    if (hasBuild && !form.sitePaymentTiming) {
      return "Choose whether the website should run 50/50 or full upfront.";
    }

    if (hasSupport && !form.monthlyBillingMethod) {
      return "Choose how monthly support should be billed through Stripe.";
    }
  }

  if (stepId === "project") {
    if (!form.services || !form.serviceAreas) {
      return "Add the core services and service areas first.";
    }

    if (!form.primaryGoal || !form.currentPain || !form.differentiators) {
      return "Add the goal, pain points, and reason customers choose you.";
    }

    if (!form.timeline) {
      return "Choose the timing for the project.";
    }
  }

  return "";
}

export default function CheckoutIntakePage({
  itemId,
  itemIds,
}: CheckoutIntakePageProps) {
  const selection = getSelection(itemId, itemIds);
  const [startedAt, setStartedAt] = useState(() => Date.now().toString());
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<SanitizedCheckoutIntake>(() =>
    createInitialFormState()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualReviewMessage, setManualReviewMessage] = useState("");
  const lastTrackedSelectionKey = useRef("");
  const selectionKey = selection.ids.join("|");

  useEffect(() => {
    if (!selectionKey || selection.offers.length === 0) {
      return;
    }

    if (lastTrackedSelectionKey.current === selectionKey) {
      return;
    }

    trackEvent("checkout_intake_started", {
      offer_ids: selection.ids,
      package_label: selection.label,
      workflow_label: selection.workflowLabel,
    });
    lastTrackedSelectionKey.current = selectionKey;
  }, [selection.ids, selection.label, selection.offers.length, selection.workflowLabel, selectionKey]);

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
                so the next step stays tied to the right plan.
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
  const billing = getCheckoutBillingProfile(selection.ids);
  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const oneTimeTotal = buildOffers.map((offer) => offer.priceLabel).join(", ");
  const monthlyTotal = supportOffers.map((offer) => offer.priceLabel).join(", ");
  const billingSummary = [
    billing.hasBuild && form.sitePaymentMethod
      ? `Website: ${form.sitePaymentMethod}${form.sitePaymentTiming ? ` · ${form.sitePaymentTiming}` : ""}`
      : "",
    billing.hasSupport && form.monthlyBillingMethod
      ? `Monthly: ${form.monthlyBillingMethod}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  function updateField<K extends keyof SanitizedCheckoutIntake>(
    key: K,
    value: SanitizedCheckoutIntake[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function goNext() {
    const stepError = getStepValidationError(
      currentStep.id,
      form,
      billing.hasBuild,
      billing.hasSupport
    );

    if (stepError) {
      setError(stepError);
      return;
    }

    setError("");
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setError("");
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stepError = getStepValidationError(
      "project",
      form,
      billing.hasBuild,
      billing.hasSupport
    );

    if (stepError) {
      setError(stepError);
      setStepIndex(3);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemIds: selection.ids,
          honeypot: "",
          startedAt,
          intake: form,
        }),
      });

      const body = (await response.json()) as {
        error?: string;
        message?: string;
        mode?: string;
        url?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "Unable to prepare the next step right now.");
      }

      trackEvent("checkout_intake_submitted", {
        offer_ids: selection.ids,
        package_label: selection.label,
        workflow_label: selection.workflowLabel,
        response_mode: body.mode || "redirect",
        manual_review: body.mode === "manual_review",
        timeline: form.timeline,
      });

      if (body.mode === "manual_review") {
        setManualReviewMessage(
          body.message ||
            `Project details received. If the package is approved, Leadcraft sends the next payment step manually. ${billing.summary}`
        );
        setForm(createInitialFormState());
        setStepIndex(0);
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

  return (
    <SiteShell>
      <section className="section-pad pt-32 sm:pt-40">
        <div className="section-shell max-w-6xl">
          <ScrollReveal direction="blur">
            <span className="eyebrow">Package Checkout</span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="space-y-6">
                <div>
                  <h1 className="display-title text-[clamp(2.9rem,9vw,5.2rem)] text-stone-50">
                    Make the buying decision now. Lock the details in next.
                  </h1>
                  <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
                    Pick the package, choose the payment path, and send the
                    essentials. Leadcraft keeps the close path tight, but this
                    should still feel easy to buy from.
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
                  <p className="mini-label">Buying summary</p>
                  <div className="mt-5 grid gap-4">
                    {billing.hasBuild ? (
                      <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                            <Layers3 className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-stone-50">
                              Website total
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-300">
                              {oneTimeTotal}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-400">
                              Venmo or manual Stripe. Choose 50/50 or full upfront.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {billing.hasSupport ? (
                      <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-stone-50">
                              Monthly total
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-300">
                              {monthlyTotal}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-400">
                              Manual Stripe only for recurring billing.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] p-6">
                  <p className="mini-label text-[color:var(--accent-strong)]">
                    Simple rules
                  </p>
                  <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
                    {launchRules.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.75rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] p-6">
                  <p className="mini-label text-[color:var(--teal)]">
                    Hosting after launch
                  </p>
                  <ul className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
                    {hostingNotes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
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
                        Next step locked in.
                      </h2>
                      <p className="muted-copy mx-auto mt-4 max-w-xl text-sm leading-7">
                        {manualReviewMessage}
                      </p>
                      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-400">
                        If the package is a fit, the next reply should land within
                        one business day with scope direction and the payment step.
                      </p>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setManualReviewMessage("");
                            setError("");
                            setForm(createInitialFormState());
                            setStepIndex(0);
                            setStartedAt(Date.now().toString());
                          }}
                          className="button-secondary px-5 py-3 text-sm"
                        >
                          Start Another Package
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
                        <p className="mini-label">Easy buying flow</p>
                        <h2 className="mt-3 text-3xl font-semibold text-stone-50">
                          {currentStep.title}
                        </h2>
                        <p className="muted-copy mt-3 text-sm leading-7">
                          {currentStep.body}
                        </p>
                      </div>

                      <div className="mb-6 grid gap-3 sm:grid-cols-5">
                        {steps.map((step, index) => (
                          <div
                            key={step.id}
                            className={cn(
                              "rounded-[1.1rem] border px-3 py-3 text-xs leading-5",
                              index === stepIndex
                                ? "border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-stone-100"
                                : index < stepIndex
                                  ? "border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-stone-200"
                                  : "border-white/10 bg-white/[0.03] text-stone-400"
                            )}
                          >
                            <p className="font-semibold">{index + 1}</p>
                            <p className="mt-1">{step.title}</p>
                          </div>
                        ))}
                      </div>

                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="startedAt" value={startedAt} readOnly />

                        {currentStep.id === "package" ? (
                          <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                              {billing.hasBuild ? (
                                <div className="rounded-[1.5rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] p-5">
                                  <p className="mini-label text-[color:var(--accent-strong)]">
                                    Website payment
                                  </p>
                                  <p className="mt-3 text-lg font-semibold text-stone-50">
                                    Venmo or manual Stripe
                                  </p>
                                  <p className="mt-3 text-sm leading-7 text-stone-300">
                                    Choose 50/50 or pay the whole website up front.
                                  </p>
                                </div>
                              ) : null}

                              {billing.hasSupport ? (
                                <div className="rounded-[1.5rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)] p-5">
                                  <p className="mini-label text-[color:var(--teal)]">
                                    Monthly billing
                                  </p>
                                  <p className="mt-3 text-lg font-semibold text-stone-50">
                                    Manual Stripe only
                                  </p>
                                  <p className="mt-3 text-sm leading-7 text-stone-300">
                                    Recurring support stays on Stripe even when the website uses Venmo.
                                  </p>
                                </div>
                              ) : null}
                            </div>

                            <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5">
                              <p className="mini-label">What happens next</p>
                              <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
                                <li>Send the package details and payment preferences.</li>
                                <li>Leadcraft reviews the package fit and scope.</li>
                                <li>If approved, you get the right payment step within one business day.</li>
                              </ul>
                            </div>
                          </div>
                        ) : null}

                        {currentStep.id === "business" ? (
                          <div className="grid gap-5">
                            <div className="grid gap-4 md:grid-cols-2">
                              <FieldInput
                                label="Contact name"
                                value={form.contactName}
                                onChange={(value) => updateField("contactName", value)}
                                placeholder="Owner or decision-maker"
                              />
                              <FieldInput
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(value) => updateField("email", value)}
                                placeholder="name@company.com"
                              />
                              <FieldInput
                                label="Phone"
                                value={form.phone}
                                onChange={(value) => updateField("phone", value)}
                                placeholder="Best callback number"
                              />
                              <FieldInput
                                label="Role"
                                value={form.role}
                                onChange={(value) => updateField("role", value)}
                                placeholder="Owner, ops manager, office manager"
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <FieldInput
                                label="Public business name"
                                value={form.companyName}
                                onChange={(value) => updateField("companyName", value)}
                                placeholder="Brand or public-facing name"
                              />
                              <FieldInput
                                label="Legal business name"
                                value={form.legalBusinessName}
                                onChange={(value) =>
                                  updateField("legalBusinessName", value)
                                }
                                placeholder="Entity on scope and invoice"
                              />
                              <FieldInput
                                label="City and state"
                                value={form.cityState}
                                onChange={(value) => updateField("cityState", value)}
                                placeholder="Cincinnati, Ohio"
                              />
                              <FieldInput
                                label="Current website"
                                type="url"
                                value={form.website}
                                onChange={(value) => updateField("website", value)}
                                placeholder="https://yourcompany.com"
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <FieldInput
                                label="Signer full name"
                                value={form.signerName}
                                onChange={(value) => updateField("signerName", value)}
                                placeholder="Who approves the scope"
                              />
                              <FieldInput
                                label="Signer role"
                                value={form.signerRole}
                                onChange={(value) => updateField("signerRole", value)}
                                placeholder="Owner, partner, GM"
                              />
                              <FieldInput
                                label="Billing email"
                                type="email"
                                value={form.billingEmail}
                                onChange={(value) => updateField("billingEmail", value)}
                                placeholder="Where payment should go"
                              />
                              <FieldSelect
                                label="Written approval method"
                                value={form.approvalMethod}
                                onChange={(value) => updateField("approvalMethod", value)}
                                options={approvalMethodOptions}
                              />
                            </div>
                          </div>
                        ) : null}

                        {currentStep.id === "payment" ? (
                          <div className="space-y-5">
                            <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5">
                              <p className="mini-label">Billing rules</p>
                              <p className="mt-3 text-sm leading-7 text-stone-200">
                                {billing.summary}
                              </p>
                              <p className="mt-3 text-sm leading-7 text-stone-400">
                                {billing.detail}
                              </p>
                            </div>

                            {billing.hasBuild ? (
                              <div className="space-y-5 rounded-[1.6rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] p-5">
                                <div>
                                  <p className="mini-label text-[color:var(--accent-strong)]">
                                    Website payment
                                  </p>
                                  <p className="mt-3 text-lg font-semibold text-stone-50">
                                    Choose the site payment method
                                  </p>
                                </div>
                                <ChoiceGrid
                                  value={form.sitePaymentMethod}
                                  onChange={(value) =>
                                    updateField("sitePaymentMethod", value)
                                  }
                                  options={billing.sitePaymentMethodOptions}
                                />

                                <div className="border-t border-white/10 pt-5">
                                  <p className="text-sm font-semibold text-stone-100">
                                    Choose the website payment timing
                                  </p>
                                  <p className="mt-2 text-sm leading-7 text-stone-400">
                                    50/50 keeps the normal deposit flow. Full upfront is allowed if the client wants it.
                                  </p>
                                  <div className="mt-4">
                                    <ChoiceGrid
                                      value={form.sitePaymentTiming}
                                      onChange={(value) =>
                                        updateField("sitePaymentTiming", value)
                                      }
                                      options={billing.sitePaymentTimingOptions}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : null}

                            {billing.hasSupport ? (
                              <div className="space-y-5 rounded-[1.6rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.08)] p-5">
                                <div>
                                  <p className="mini-label text-[color:var(--teal)]">
                                    Monthly billing
                                  </p>
                                  <p className="mt-3 text-lg font-semibold text-stone-50">
                                    Choose the Stripe billing method
                                  </p>
                                </div>
                                <ChoiceGrid
                                  value={form.monthlyBillingMethod}
                                  onChange={(value) =>
                                    updateField("monthlyBillingMethod", value)
                                  }
                                  options={billing.monthlyBillingMethodOptions}
                                  accent="teal"
                                />
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {currentStep.id === "project" ? (
                          <div className="grid gap-5">
                            <FieldTextArea
                              label="Core services"
                              value={form.services}
                              onChange={(value) => updateField("services", value)}
                              placeholder="List the main services and priority offers that should be pushed hardest."
                              rows={3}
                            />
                            <FieldTextArea
                              label="Service areas"
                              value={form.serviceAreas}
                              onChange={(value) =>
                                updateField("serviceAreas", value)
                              }
                              placeholder="Cities, counties, neighborhoods, or service radius details."
                              rows={3}
                            />
                            <FieldTextArea
                              label="Primary goal"
                              value={form.primaryGoal}
                              onChange={(value) =>
                                updateField("primaryGoal", value)
                              }
                              placeholder="What should this package improve right now?"
                              rows={4}
                            />
                            <FieldTextArea
                              label="Current pain points"
                              value={form.currentPain}
                              onChange={(value) =>
                                updateField("currentPain", value)
                              }
                              placeholder="What is broken or underperforming today?"
                              rows={4}
                            />
                            <FieldTextArea
                              label="Why customers choose you"
                              value={form.differentiators}
                              onChange={(value) =>
                                updateField("differentiators", value)
                              }
                              placeholder="Reviews, speed, specialty work, guarantees, certifications, financing, or anything that builds trust."
                              rows={3}
                            />

                            <div className="grid gap-4 md:grid-cols-[0.6fr_0.4fr]">
                              <FieldTextArea
                                label="Proof assets"
                                value={form.proofAssets}
                                onChange={(value) =>
                                  updateField("proofAssets", value)
                                }
                                placeholder="Optional. Reviews, before/after work, badges, memberships, backend requirements, or integrations."
                                rows={3}
                              />
                              <FieldSelect
                                label="Timeline"
                                value={form.timeline}
                                onChange={(value) => updateField("timeline", value)}
                                options={timelineOptions}
                              />
                            </div>

                            <FieldTextArea
                              label="Extra notes"
                              value={form.notes}
                              onChange={(value) => updateField("notes", value)}
                              placeholder="Optional. Anything about approvals, handoff, hosting concerns, or brand direction."
                              rows={3}
                            />
                          </div>
                        ) : null}

                        {currentStep.id === "review" ? (
                          <div className="space-y-5">
                            <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5">
                              <p className="mini-label">Package</p>
                              <p className="mt-3 text-lg font-semibold text-stone-50">
                                {selection.label}
                              </p>
                              <p className="mt-2 text-sm leading-7 text-stone-300">
                                {selection.workflowLabel}
                              </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <ReviewCard
                                title="Business"
                                lines={[
                                  form.companyName,
                                  form.legalBusinessName,
                                  form.cityState,
                                  `${form.signerName}${form.signerRole ? ` · ${form.signerRole}` : ""}`,
                                ]}
                              />
                              <ReviewCard
                                title="Billing"
                                lines={[
                                  billingSummary || "Billing details not chosen yet.",
                                  form.billingEmail,
                                  form.approvalMethod,
                                ]}
                              />
                            </div>

                            <ReviewCard
                              title="Project focus"
                              lines={[
                                form.services,
                                form.primaryGoal,
                                form.currentPain,
                                form.timeline,
                              ]}
                            />

                            <div className="rounded-[1.55rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] p-5 text-sm leading-7 text-stone-200">
                              Leadcraft still reviews the package before sending
                              the payment step, but the goal is simple: package
                              selected, billing path chosen, details locked in.
                            </div>
                          </div>
                        ) : null}

                        {error ? (
                          <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-7 text-rose-200">
                            {error}
                          </p>
                        ) : null}

                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm leading-7 text-stone-400">
                            Step {stepIndex + 1} of {steps.length}
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            {stepIndex > 0 ? (
                              <button
                                type="button"
                                onClick={goBack}
                                className="button-secondary px-5 py-3 text-sm"
                              >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                              </button>
                            ) : null}

                            {isLastStep ? (
                              <button
                                type="submit"
                                disabled={isLoading}
                                className="button-primary px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {isLoading ? "Sending package..." : "Send Package Details"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={goNext}
                                className="button-primary px-6 py-3 text-sm"
                              >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-sm leading-7 text-stone-400">
                          If the package cannot be sent right now, use direct
                          contact or a strategy call so the scope step does not stall.
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

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="form-field"
        placeholder={placeholder}
      />
    </div>
  );
}

function FieldTextArea({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-200">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        rows={rows}
        className="form-field min-h-[8rem]"
        placeholder={placeholder}
      />
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-200">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="form-field"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChoiceGrid({
  value,
  onChange,
  options,
  accent = "accent",
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  accent?: "accent" | "teal";
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isActive = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-[1.25rem] border px-4 py-4 text-left text-sm leading-7 transition-colors",
              isActive
                ? accent === "teal"
                  ? "border-[rgba(125,183,176,0.28)] bg-[rgba(125,183,176,0.16)] text-stone-100"
                  : "border-[rgba(216,170,115,0.28)] bg-[rgba(216,170,115,0.16)] text-stone-100"
                : "border-white/10 bg-black/20 text-stone-300 hover:border-white/20 hover:text-stone-100"
            )}
          >
            <span className="block font-medium">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

function ReviewCard({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="mini-label">{title}</p>
      <div className="mt-4 space-y-3 text-sm leading-7 text-stone-200">
        {lines.filter(Boolean).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
