"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  FileText,
  MapPin,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { FormField } from "@/components/FormField";
import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const contactNextSteps = [
  {
    title: "Send the site and market",
    body: "Share the business, current site, market, biggest issue, and what the site needs to fix first.",
    icon: Send,
  },
  {
    title: "Get the strongest direction",
    body: "The reply should move into audit notes, fit, budget range, and the right build path fast.",
    icon: FileText,
  },
  {
    title: "Book the scope call",
    body: "If it is a fit, the call moves into scope, timeline, and launch planning.",
    icon: CalendarCheck2,
  },
] as const;

const packageNextSteps = [
  {
    title: "Send the package question",
    body: "Point to the package and the part that feels unclear before you commit to the full brief.",
    icon: Send,
  },
  {
    title: "Get the fit answer",
    body: "The reply should clarify fit, scope, timing, or the payment path without forcing a blind checkout step.",
    icon: FileText,
  },
  {
    title: "Move into brief or call",
    body: "If the lane still looks right, the next move is the package brief or a strategy call.",
    icon: CalendarCheck2,
  },
] as const;

type ContactProps = {
  packageInterest?: string;
  submissionKind?: "contact_inquiry" | "package_inquiry";
};

export default function Contact({
  packageInterest = "",
  submissionKind = "contact_inquiry",
}: ContactProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now().toString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasTrackedFormStart = useRef(false);
  const selectedPackage = packageInterest.trim();
  const isPackageInquiry =
    submissionKind === "package_inquiry" || Boolean(selectedPackage);
  const resolvedWorkflowLabel = isPackageInquiry
    ? "Package Inquiry"
    : "Contact Inquiry";
  const introTitle =
    isPackageInquiry && selectedPackage
      ? `Ask about ${selectedPackage} before checkout.`
      : "Send the site. Get the strongest direction.";
  const introCopy = isPackageInquiry
    ? "Use this shorter lane if you want package fit, scope, timing, or payment clarified before you send the full brief."
    : "This intake is built to give Leadcraft the minimum real context needed to reply with sharper audit direction, better fit judgment, and the right build lane.";
  const activeNextSteps = isPackageInquiry ? packageNextSteps : contactNextSteps;

  function clearFieldError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateForm(form: HTMLFormElement): boolean {
    const readValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.value?.trim() || "";

    const next: Record<string, string> = {};
    if (!readValue("name")) next.name = "Name is required.";
    if (!readValue("email")) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(readValue("email"))) next.email = "Enter a valid email address.";
    if (!readValue("message")) next.message = "Message is required.";

    setErrors(next);

    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        const firstErrorField = document.querySelector('[data-error="true"]');
        if (firstErrorField) firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!validateForm(form)) return;

    setStatus("loading");
    setErrorMsg("");
    const readValue = (name: string) =>
      (
        form.elements.namedItem(name) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
          | null
      )?.value || "";
    const data = {
      name: readValue("name"),
      email: readValue("email"),
      phone: readValue("phone"),
      business: readValue("business"),
      service: readValue("service"),
      serviceArea: readValue("serviceArea"),
      teamSize: readValue("teamSize"),
      primaryGoal: readValue("primaryGoal"),
      currentSiteIssue: readValue("currentSiteIssue"),
      website: readValue("website"),
      timeline: readValue("timeline"),
      message: readValue("message"),
      submissionKind: isPackageInquiry ? "package_inquiry" : "contact_inquiry",
      packageInterest: selectedPackage,
      workflowLabel: resolvedWorkflowLabel,
      honeypot: readValue("company_url"),
      startedAt,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await response.json()) as {
        deliveryMode?: string;
        error?: string;
        message?: string;
        mode?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      trackEvent("contact_form_submitted", {
        submission_kind: isPackageInquiry ? "package_inquiry" : "contact_inquiry",
        package_label: selectedPackage,
        workflow_label: resolvedWorkflowLabel,
        service: data.service,
        timeline: data.timeline,
      });

      setSuccessMsg(
        body.message ||
          (isPackageInquiry
            ? "The package question came through. If the fit looks right, the next reply should land within one business day with package guidance, scope direction, and the best next step."
            : "The details came through. If the request looks like a fit, the next reply should land within one business day with audit notes, scope direction, and the right build lane.")
      );
      setStatus("success");
      form.reset();
      setStartedAt(Date.now().toString());
      hasTrackedFormStart.current = false;
    } catch (error) {
      setStatus("error");
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section id="contact" className="section-pad section-rule">
      <div className="section-shell grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <ScrollReveal direction="blur">
          <div className="max-w-xl">
            <span className="eyebrow">
              {isPackageInquiry ? "Package Question" : "Contact"}
            </span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              {introTitle}
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              {introCopy}
            </p>

            {isPackageInquiry ? (
              <div className="mt-8 rounded-[1.65rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-5">
                <p className="mini-label">Selected package</p>
                <p className="mt-3 text-2xl font-semibold text-stone-50">
                  {selectedPackage || "Package question"}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-200">
                  Ask here if you want clarity before the full package brief.
                  The reply should move you toward a confident yes, a tighter
                  scope lane, or a strategy call.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact-form"
                    className="button-primary px-5 py-3 text-sm"
                  >
                    Ask The Question
                  </a>
                  <Link href="/contact" className="button-secondary px-5 py-3 text-sm">
                    Switch To General Inquiry
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-stone-200">
                {isPackageInquiry ? "Package-aware reply" : "Audit-led reply"}
              </div>
              <div className="rounded-[1.3rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] px-4 py-4 text-sm text-stone-200">
                {isPackageInquiry ? "Scope-first answer" : "Qualified in one pass"}
              </div>
              <div className="rounded-[1.3rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] px-4 py-4 text-sm text-stone-200">
                Fit review in 1 business day
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-100">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-50">
                      Direct operator contact
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-300">
                      You are contacting Ethan directly, not a generic sales desk.
                      The reply should be specific about fit, visual direction,
                      scope, and the right path.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.35rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-50">
                      Based in {siteConfig.locationDisplay}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-300">
                      Leadcraft works with US home-service companies, but the
                      operating model stays local-feeling, direct, audit-aware,
                      and scope-first.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isPackageInquiry ? (
              <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="mini-label">What This Intake Captures</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.15rem] border border-[rgba(216,170,115,0.14)] bg-[rgba(216,170,115,0.05)] px-4 py-3 text-sm leading-7 text-stone-200">
                    Market, service area, and current site context
                  </div>
                  <div className="rounded-[1.15rem] border border-white/10 bg-black/15 px-4 py-3 text-sm leading-7 text-stone-200">
                    Biggest website issue and what should improve first
                  </div>
                  <div className="rounded-[1.15rem] border border-[rgba(125,183,176,0.16)] bg-[rgba(125,183,176,0.06)] px-4 py-3 text-sm leading-7 text-stone-200">
                    Primary growth goal and rough team size
                  </div>
                  <div className="rounded-[1.15rem] border border-white/10 bg-black/15 px-4 py-3 text-sm leading-7 text-stone-200">
                    Enough detail to reply with real direction instead of generic next steps
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-[1.7rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">What Happens Next</p>
                  <p className="mt-2 text-sm leading-7 text-stone-200">
                    The form is meant to move into a real next step, not a vague
                    waiting line. The standard is an initial fit review within one
                    business day.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {activeNextSteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-stone-50">
                            {step.title}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-stone-300">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={siteConfig.phoneHref}
                className="lux-subtle focus-lux rounded-[1.4rem] px-5 py-4 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
              >
                <p className="mini-label">Phone</p>
                <p className="mt-2">{siteConfig.phoneDisplay}</p>
              </a>
              <a
                href={siteConfig.emailHref}
                className="lux-subtle focus-lux rounded-[1.4rem] px-5 py-4 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
              >
                <p className="mini-label">Email</p>
                <p className="mt-2 break-words">{siteConfig.email}</p>
              </a>
            </div>

            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary mt-5 w-full px-5 py-3.5 text-sm sm:w-auto"
            >
              Book Strategy Call
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} direction="up">
          <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-8">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(125,183,176,0.28)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-5 text-3xl font-semibold text-stone-50">
                  Request received
                </h3>
                <p className="muted-copy mx-auto mt-4 max-w-lg text-sm leading-7">
                  {successMsg}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setSuccessMsg("");
                      setStartedAt(Date.now().toString());
                      hasTrackedFormStart.current = false;
                    }}
                    className="button-secondary w-full px-5 py-3 text-sm sm:w-auto"
                  >
                    {isPackageInquiry
                      ? "Send Another Package Question"
                      : "Send Another Request"}
                  </button>
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary w-full px-5 py-3 text-sm sm:w-auto"
                  >
                    Book Strategy Call
                  </a>
                </div>
              </motion.div>
            ) : (
              <form
                id="contact-form"
                className="space-y-5"
                onSubmit={handleSubmit}
                onFocusCapture={() => {
                  if (hasTrackedFormStart.current) {
                    return;
                  }

                  trackEvent("contact_form_started", {
                    submission_kind: isPackageInquiry
                      ? "package_inquiry"
                      : "contact_inquiry",
                    package_label: selectedPackage,
                    workflow_label: resolvedWorkflowLabel,
                  });
                  hasTrackedFormStart.current = true;
                }}
              >
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
                  <input type="hidden" name="startedAt" value={startedAt} readOnly />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Name" htmlFor="name" required error={errors.name} data-error={!!errors.name}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className={cn("form-field min-h-[44px]", errors.name && "border-red-400/40")}
                      placeholder="Ethan Miller…"
                      onChange={() => clearFieldError("name")}
                    />
                  </FormField>
                  <FormField label="Email" htmlFor="email" required error={errors.email} data-error={!!errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      className={cn("form-field min-h-[44px]", errors.email && "border-red-400/40")}
                      placeholder="name@business.com…"
                      onChange={() => clearFieldError("email")}
                    />
                  </FormField>
                  <FormField label="Phone" htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      className="form-field min-h-[44px]"
                      placeholder="(513) 815-1826…"
                    />
                  </FormField>
                  <FormField label="Business" htmlFor="business" required={!isPackageInquiry}>
                    <input
                      id="business"
                      name="business"
                      type="text"
                      autoComplete="organization"
                      required={!isPackageInquiry}
                      className="form-field min-h-[44px]"
                      placeholder="Leadcraft Agency…"
                    />
                  </FormField>
                  <FormField label="What do you need?" htmlFor="service" required={!isPackageInquiry}>
                    <select
                      id="service"
                      name="service"
                      defaultValue=""
                      required={!isPackageInquiry}
                      className="form-field min-h-[44px]"
                    >
                      <option value="" disabled>
                        Select one…
                      </option>
                      <option value="New website">New website</option>
                      <option value="Redesign / upgrade">Redesign / upgrade</option>
                      <option value="5-point site audit">5-point site audit</option>
                      <option value="Landing page">Landing page</option>
                      <option value="Search-ready structure">Search-ready structure</option>
                      <option value="Hosted Core">Hosted Core</option>
                      <option value="Managed Site Care">Managed Site Care</option>
                      <option value="Search and Conversion Support">
                        Search and Conversion Support
                      </option>
                    </select>
                  </FormField>
                  <FormField label="Timeline" htmlFor="timeline">
                    <select
                      id="timeline"
                      name="timeline"
                      defaultValue=""
                      className="form-field min-h-[44px]"
                    >
                      <option value="" disabled>
                        Select one…
                      </option>
                      <option value="As soon as possible">As soon as possible</option>
                      <option value="Within 2 weeks">Within 2 weeks</option>
                      <option value="This month">This month</option>
                      <option value="Still planning">Still planning</option>
                    </select>
                  </FormField>
                </div>

                {!isPackageInquiry ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Service area" htmlFor="serviceArea" required>
                        <input
                          id="serviceArea"
                          name="serviceArea"
                          type="text"
                          required
                          className="form-field"
                          placeholder="Cincinnati, Dayton, Northern Kentucky…"
                        />
                      </FormField>
                      <FormField label="Team size" htmlFor="teamSize">
                        <select
                          id="teamSize"
                          name="teamSize"
                          defaultValue=""
                          className="form-field"
                        >
                          <option value="" disabled>
                            Select one…
                          </option>
                          <option value="Solo operator">Solo operator</option>
                          <option value="2-5 people">2-5 people</option>
                          <option value="6-15 people">6-15 people</option>
                          <option value="16+ people">16+ people</option>
                        </select>
                      </FormField>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Biggest website issue" htmlFor="currentSiteIssue" required>
                        <select
                          id="currentSiteIssue"
                          name="currentSiteIssue"
                          defaultValue=""
                          required
                          className="form-field"
                        >
                          <option value="" disabled>
                            Select one…
                          </option>
                          <option value="No real site yet">No real site yet</option>
                          <option value="Looks outdated or cheap">Looks outdated or cheap</option>
                          <option value="Weak mobile trust">Weak mobile trust</option>
                          <option value="Weak service clarity">Weak service clarity</option>
                          <option value="Weak quote path">Weak quote path</option>
                          <option value="Poor search foundation">Poor search foundation</option>
                        </select>
                      </FormField>
                      <FormField label="Primary goal" htmlFor="primaryGoal" required>
                        <select
                          id="primaryGoal"
                          name="primaryGoal"
                          defaultValue=""
                          required
                          className="form-field"
                        >
                          <option value="" disabled>
                            Select one…
                          </option>
                          <option value="More booked calls">More booked calls</option>
                          <option value="More qualified leads">More qualified leads</option>
                          <option value="Look more established">Look more established</option>
                          <option value="Launch a real site">Launch a real site</option>
                          <option value="Build a stronger search-ready foundation">
                            Build a stronger search-ready foundation
                          </option>
                        </select>
                      </FormField>
                    </div>
                  </>
                ) : null}

                <FormField label="Current website" htmlFor="website">
                  <input
                    id="website"
                    name="website"
                    type="url"
                    autoComplete="url"
                    spellCheck={false}
                    className="form-field"
                    placeholder="https://yourdomain.com…"
                  />
                </FormField>

                <FormField
                  label={isPackageInquiry ? "Package question or missing detail" : "Project details or audit request"}
                  htmlFor="message"
                  required
                  error={errors.message}
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className={cn("form-field resize-none", errors.message && "border-red-400/40")}
                    placeholder={
                      isPackageInquiry
                        ? `What do you want clarified about ${selectedPackage || "this package"}? Mention fit, scope, timeline, payment, or support.`
                        : "What does the business do, what feels weak right now, and what should the next site improve first? If there is a current site, explain what is costing trust, leads, or booked calls."
                    }
                    onChange={() => clearFieldError("message")}
                  />
                </FormField>

                <div aria-live="polite" className="min-h-6 text-sm">
                  {status === "error" ? (
                    <p className="text-red-300">{errorMsg}</p>
                  ) : null}
                </div>

                <p className="text-sm leading-7 text-stone-400">
                  If the form ever fails, call, email, or book the strategy call
                  directly. Leadcraft does not rely on a silent inbox.
                </p>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="button-primary w-full justify-center px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading"
                    ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {isPackageInquiry
                          ? "Sending package question..."
                          : "Sending request..."}
                      </>
                    )
                    : isPackageInquiry
                      ? "Send Package Question"
                      : "Send Audit Intake"}
                </button>
              </form>
            )}
          </PointerCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
