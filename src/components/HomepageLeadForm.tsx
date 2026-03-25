"use client";

import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle2, Globe2, Mail, Phone, Send, Sparkles } from "lucide-react";

import { FormField } from "@/components/FormField";
import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function HomepageLeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now().toString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasTrackedFormStart = useRef(false);

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
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value?.trim() || "";

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
          | HTMLTextAreaElement
          | null
      )?.value || "";

    const payload = {
      name: readValue("name"),
      email: readValue("email"),
      phone: readValue("phone"),
      website: readValue("website"),
      message: readValue("message"),
      honeypot: readValue("company_url"),
      startedAt,
      submissionKind: "homepage_lead_capture",
      workflowLabel: "Homepage Lead Capture",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      trackEvent("contact_form_submitted", {
        submission_kind: "homepage_lead_capture",
        form_variant: "homepage_lead_capture",
      });

      setStatus("success");
      setSuccessMsg(
        body.message ||
          "Request received. The next reply should land within one business day with the right next step."
      );
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
    <section id="homepage-lead-form" className="section-pad section-rule section-bg-cool">
      <div className="section-shell grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <ScrollReveal direction="blur">
          <div className="max-w-xl">
            <span className="eyebrow">Quick Quote Request</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              Send the site. Get the right next step.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              Use the shorter homepage form if you want a fast review before the
              full audit intake. It is built for buyers who already know the site
              needs work and want the cleanest path to a reply.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-4 text-sm leading-7 text-stone-200">
                Short form on the homepage
              </div>
              <div className="rounded-[1.3rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] p-4 text-sm leading-7 text-stone-200">
                CRM-first routing plus durable backup
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-stone-200">
                Built for mobile first-touch traffic
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-stone-200">
                Need more context? The full audit intake still lives on
                {" "}
                <a
                  href="/contact"
                  className="font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-stone-50"
                >
                  /contact
                </a>
              </div>
            </div>

            <div className="mt-8 rounded-[1.7rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">Operator Standard</p>
                  <p className="mt-2 text-sm leading-7 text-stone-200">
                    Every request still routes into the CRM first, with email as
                    backup visibility and Supabase as the durable backup record.
                    This keeps the shorter homepage form useful without turning it
                    into a dead-end inbox.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <a
                href={siteConfig.emailHref}
                className="lux-subtle focus-lux rounded-[1.35rem] px-4 py-4 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
              >
                <Mail className="h-4 w-4" />
                <p className="mt-3">{siteConfig.email}</p>
              </a>
              <a
                href={siteConfig.phoneHref}
                className="lux-subtle focus-lux rounded-[1.35rem] px-4 py-4 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
              >
                <Phone className="h-4 w-4" />
                <p className="mt-3">{siteConfig.phoneDisplay}</p>
              </a>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="lux-subtle focus-lux rounded-[1.35rem] px-4 py-4 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
              >
                <Send className="h-4 w-4" />
                <p className="mt-3">Book strategy call</p>
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} direction="up">
          <PointerCard className="lux-panel rounded-[2rem] p-6 sm:p-8">
            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="py-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(125,183,176,0.28)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-3xl font-semibold text-stone-50">
                  Request received
                </h3>
                <p className="muted-copy mx-auto mt-4 max-w-lg text-sm leading-7">
                  {successMsg}
                </p>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-400">
                  Fit review within 1 business day. Scope direction within 48 hours for strong fits.
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
                    className="button-secondary px-5 py-3 text-sm"
                  >
                    Send another request
                  </button>
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary px-5 py-3 text-sm"
                  >
                    Book a call
                  </a>
                  <a
                    href="/client-products"
                    className="button-secondary px-5 py-3 text-sm"
                  >
                    View proof of work
                  </a>
                </div>
              </motion.div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={handleSubmit}
                onFocusCapture={() => {
                  if (hasTrackedFormStart.current) {
                    return;
                  }

                  trackEvent("contact_form_started", {
                    submission_kind: "homepage_lead_capture",
                    form_variant: "homepage_lead_capture",
                  });
                  hasTrackedFormStart.current = true;
                }}
              >
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
                  <input type="hidden" name="startedAt" value={startedAt} readOnly />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Name" htmlFor="homepage-name" required error={errors.name} data-error={!!errors.name}>
                    <input
                      id="homepage-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className={cn("form-field min-h-[44px]", errors.name && "border-red-400/40")}
                      placeholder="Jamie Taylor"
                      onChange={() => clearFieldError("name")}
                    />
                  </FormField>
                  <FormField label="Email" htmlFor="homepage-email" required error={errors.email} data-error={!!errors.email}>
                    <input
                      id="homepage-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={cn("form-field min-h-[44px]", errors.email && "border-red-400/40")}
                      placeholder="name@business.com"
                      onChange={() => clearFieldError("email")}
                    />
                  </FormField>
                  <FormField label="Phone" htmlFor="homepage-phone">
                    <input
                      id="homepage-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      className="form-field min-h-[44px]"
                      placeholder="(513) 555-0101"
                    />
                  </FormField>
                  <FormField label="Company website" htmlFor="homepage-website">
                    <div className="relative">
                      <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <input
                        id="homepage-website"
                        name="website"
                        type="url"
                        autoComplete="url"
                        className="form-field min-h-[44px] pl-11"
                        placeholder="https://yourdomain.com"
                      />
                    </div>
                  </FormField>
                </div>

                <FormField label="Message" htmlFor="homepage-message" required error={errors.message} data-error={!!errors.message}>
                  <textarea
                    id="homepage-message"
                    name="message"
                    rows={6}
                    required
                    enterKeyHint="send"
                    className={cn("form-field min-h-[44px] resize-none", errors.message && "border-red-400/40")}
                    placeholder="What feels weak on the site right now, and what should the next version improve first?"
                    onChange={() => clearFieldError("message")}
                  />
                </FormField>

                <div aria-live="polite" className="min-h-6 text-sm">
                  {status === "error" ? (
                    <p className="text-red-300">{errorMsg}</p>
                  ) : null}
                </div>

                <p className="text-sm leading-7 text-stone-400">
                  This shorter form is for fast first contact. If you already have
                  full scope details, the deeper audit intake on
                  {" "}
                  <a
                    href="/contact"
                    className="font-semibold text-[color:var(--accent-strong)] transition-colors hover:text-stone-50"
                  >
                    /contact
                  </a>
                  {" "}
                  is still the best route.
                </p>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="button-primary w-full justify-center px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending request...
                    </>
                  ) : "Send Quote Request"}
                </button>
              </form>
            )}
          </PointerCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
