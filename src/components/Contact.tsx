"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { CalendarCheck2, FileText, Send, ShieldCheck } from "lucide-react";

import PointerCard from "@/components/PointerCard";
import ScrollReveal from "@/components/ScrollReveal";
import { supportOffer } from "@/lib/offers";
import { siteConfig } from "@/lib/site";

const nextSteps = [
  {
    title: "Send the site",
    body: "Share the business, current site, and what feels weak right now.",
    icon: Send,
  },
  {
    title: "Get the direction",
    body: "The reply moves into fixes, budget range, and the right build path.",
    icon: FileText,
  },
  {
    title: "Book the scope call",
    body: "If it is a fit, the call moves into scope, timeline, and launch planning.",
    icon: CalendarCheck2,
  },
] as const;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now().toString());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      business: (form.elements.namedItem("business") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      honeypot: (form.elements.namedItem("company_url") as HTMLInputElement).value,
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

      setSuccessMsg(
        body.message ||
          "The details came through. If the request looks like a fit, the next reply will move into audit notes, scope, timeline, and the right build direction."
      );
      setStatus("success");
      form.reset();
      setStartedAt(Date.now().toString());
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
            <span className="eyebrow">Contact</span>
            <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
              Send the site. Get the direction.
            </h2>
            <p className="muted-copy mt-6 text-lg leading-8">
              Share the business, current site, and main gap. If it looks like
              a fit, the reply moves straight into audit notes, scope, and
              timing.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-stone-200">
                Home-service only
              </div>
              <div className="rounded-[1.3rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] px-4 py-4 text-sm text-stone-200">
                Builds from $1,650
              </div>
              <div className="rounded-[1.3rem] border border-[rgba(125,183,176,0.18)] bg-[rgba(125,183,176,0.07)] px-4 py-4 text-sm text-stone-200">
                Support starts at {supportOffer.priceLabel}
              </div>
            </div>

            <div className="mt-8 rounded-[1.7rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="mini-label">What Happens Next</p>
                  <p className="mt-2 text-sm leading-7 text-stone-200">
                    The form is meant to move into a real next step, not a
                    vague waiting line.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {nextSteps.map((step) => {
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
                    }}
                    className="button-secondary w-full px-5 py-3 text-sm sm:w-auto"
                  >
                    Send Another Request
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
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
                  <input type="hidden" name="startedAt" value={startedAt} readOnly />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-200">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="form-field"
                      placeholder="Ethan Miller…"
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
                      spellCheck={false}
                      required
                      className="form-field"
                      placeholder="name@business.com…"
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
                      inputMode="tel"
                      className="form-field"
                      placeholder="(513) 815-1826…"
                    />
                  </div>
                  <div>
                    <label htmlFor="business" className="mb-2 block text-sm font-medium text-stone-200">
                      Business
                    </label>
                    <input
                      id="business"
                      name="business"
                      type="text"
                      autoComplete="organization"
                      className="form-field"
                      placeholder="Leadcraft Agency…"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="mb-2 block text-sm font-medium text-stone-200">
                      What do you need?
                    </label>
                    <select
                      id="service"
                      name="service"
                      defaultValue=""
                      className="form-field"
                    >
                      <option value="" disabled>
                        Select one…
                      </option>
                      <option value="new-website">New website</option>
                      <option value="redesign">Redesign / upgrade</option>
                      <option value="site-audit">5-point site audit</option>
                      <option value="landing-page">Landing page</option>
                      <option value="search-ready-structure">Search-ready structure</option>
                      <option value="hosted-core">Hosted Core</option>
                      <option value="managed-site-care">Managed Site Care</option>
                      <option value="search-conversion-support">
                        Search and Conversion Support
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="mb-2 block text-sm font-medium text-stone-200">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      defaultValue=""
                      className="form-field"
                    >
                      <option value="" disabled>
                        Select one…
                      </option>
                      <option value="asap">As soon as possible</option>
                      <option value="2-weeks">Within 2 weeks</option>
                      <option value="this-month">This month</option>
                      <option value="planning">Still planning</option>
                    </select>
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
                    autoComplete="url"
                    spellCheck={false}
                    className="form-field"
                    placeholder="https://yourdomain.com…"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-stone-200">
                    Project details or audit request
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="form-field resize-none"
                    placeholder="What feels too basic right now, what you offer, and what the site needs to do next. If you want an audit, include the site and what you think is costing calls."
                  />
                </div>

                <div aria-live="polite" className="min-h-6 text-sm">
                  {status === "error" ? (
                    <p className="text-red-300">{errorMsg}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="button-primary w-full justify-center px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? "Sending…" : "Send Audit Or Project Request"}
                </button>
              </form>
            )}
          </PointerCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
