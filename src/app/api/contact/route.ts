import { randomUUID } from "node:crypto";

import { buildContactIntakeEvent } from "@/lib/intake/intake-events";
import {
  getContactRouteConfig,
  getRouteDeliveryReadiness,
} from "@/lib/env";
import {
  cleanField,
  cleanTextarea,
  isValidEmail,
  isValidPhone,
  normalizeWebsite,
  parseTimestamp,
} from "@/lib/form-utils";
import {
  formatIntakeEmailHtml,
  formatIntakeEmailText,
} from "@/lib/intake/intake-email";
import { getRequestMarketingContext } from "@/lib/marketing-context";
import { persistSubmissionBackup } from "@/lib/intake/submission-backup";
import {
  ensureJsonRequest,
  getClientAddress,
  getRateLimitHeaders,
  isSameOriginRequest,
  jsonNoStore,
  takeRateLimitHit,
} from "@/lib/security";
import { deliverSubmission } from "@/lib/intake/submission-routing";

const CONTACT_RATE_LIMIT_MAX = 5;
const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX_BODY_BYTES = 12_000;
const MIN_FORM_COMPLETION_MS = 2_500;
const MAX_FORM_COMPLETION_MS = 12 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    if (!ensureJsonRequest(request, CONTACT_MAX_BODY_BYTES)) {
      return jsonNoStore({ error: "Invalid request." }, { status: 400 });
    }

    if (!isSameOriginRequest(request)) {
      return jsonNoStore(
        { error: "Request origin not allowed." },
        { status: 403 }
      );
    }

    const ip = getClientAddress(request);
    const ipRate = takeRateLimitHit(
      "contact-ip",
      ip,
      CONTACT_RATE_LIMIT_MAX,
      CONTACT_RATE_LIMIT_WINDOW_MS
    );

    if (ipRate.limited) {
      return jsonNoStore(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: getRateLimitHeaders(ipRate.remaining, ipRate.resetAt),
        }
      );
    }

    let rawBody: unknown;

    try {
      rawBody = await request.json();
    } catch {
      return jsonNoStore({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const body =
      typeof rawBody === "object" && rawBody !== null
        ? (rawBody as Record<string, unknown>)
        : ({} as Record<string, unknown>);
    const marketing = getRequestMarketingContext(request);
    const config = getContactRouteConfig();
    const deliveryReadiness = getRouteDeliveryReadiness(config);

    const name = cleanField(body.name, 80);
    const email = cleanField(body.email, 120, { lowercase: true });
    const phone = cleanField(body.phone, 30);
    const business = cleanField(body.business, 120);
    const service = cleanField(body.service || body.industry, 80);
    const serviceArea = cleanField(body.serviceArea || body.market, 120);
    const teamSize = cleanField(body.teamSize, 80);
    const primaryGoal = cleanField(body.primaryGoal, 120);
    const currentSiteIssue = cleanField(
      body.currentSiteIssue || body.auditFocus,
      120
    );
    const timeline = cleanField(body.timeline, 80);
    const submissionKindInput = cleanField(body.submissionKind, 40, {
      lowercase: true,
    });
    const submissionKind =
      submissionKindInput === "package_inquiry"
        ? "package_inquiry"
        : submissionKindInput === "homepage_lead_capture"
          ? "homepage_lead_capture"
        : "contact_inquiry";
    const isPackageInquiry = submissionKind === "package_inquiry";
    const isHomepageLeadCapture = submissionKind === "homepage_lead_capture";
    const packageInterest = cleanField(
      body.packageInterest || body.packageLabel || body.package,
      220
    );
    const workflowLabel = cleanField(body.workflowLabel, 120);
    const resolvedWorkflowLabel =
      workflowLabel ||
      (isPackageInquiry
        ? "Package Inquiry"
        : isHomepageLeadCapture
          ? "Homepage Lead Capture"
        : "Contact Inquiry");
    const websiteInput = cleanField(body.website, 180);
    const website = normalizeWebsite(websiteInput);
    const message = cleanTextarea(body.message, 3000);
    const honeypot = cleanField(body.honeypot, 120);
    const startedAt = parseTimestamp(body.startedAt);

    if (honeypot) {
      return jsonNoStore({ success: true });
    }

    if (
      !Number.isFinite(startedAt) ||
      Date.now() - startedAt < MIN_FORM_COMPLETION_MS ||
      Date.now() - startedAt > MAX_FORM_COMPLETION_MS
    ) {
      return jsonNoStore(
        { error: "Please review the form and try again." },
        { status: 400 }
      );
    }

    if (websiteInput && !website) {
      return jsonNoStore(
        { error: "Please enter a valid website URL." },
        { status: 400 }
      );
    }

    if (!name || !email || !message) {
      return jsonNoStore(
        { error: "Name, email, and project details are required." },
        { status: 400 }
      );
    }

    if (
      !isPackageInquiry &&
      !isHomepageLeadCapture &&
      (!business ||
        !service ||
        !serviceArea ||
        !primaryGoal ||
        !currentSiteIssue)
    ) {
      return jsonNoStore(
        {
          error:
            "Business, requested help, service area, biggest website issue, and primary goal are required for an audit intake.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return jsonNoStore(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone && !isValidPhone(phone)) {
      return jsonNoStore(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const emailRate = takeRateLimitHit(
      "contact-email",
      email.toLowerCase(),
      CONTACT_RATE_LIMIT_MAX + 1,
      CONTACT_RATE_LIMIT_WINDOW_MS
    );
    if (emailRate.limited) {
      return jsonNoStore(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: getRateLimitHeaders(emailRate.remaining, emailRate.resetAt),
        }
      );
    }

    if (!deliveryReadiness.hasWebhook) {
      console.error(
        "Contact delivery unavailable: canonical CRM webhook path is not configured."
      );
      return jsonNoStore(
        {
          error:
            "Lead routing is unavailable on this deployment until the CRM webhook path is configured. Please call or email directly until intake is restored.",
        },
        { status: 503 }
      );
    }

    const businessLabel = business || website || name;
    const serviceLabel = service || (isHomepageLeadCapture ? "Homepage lead capture" : "");
    const timelineLabel = timeline || (isHomepageLeadCapture ? "Not specified" : "");
    const emailEyebrow =
      isPackageInquiry
        ? "Leadcraft package inquiry"
        : isHomepageLeadCapture
          ? "Leadcraft homepage lead capture"
        : "Leadcraft audit intake";
    const emailTitle = businessLabel || packageInterest || name;
    const nextActionText =
      isPackageInquiry
        ? "Review package fit and reply with scope guidance, payment-path clarity, or a strategy-call path within one business day."
        : isHomepageLeadCapture
          ? "Review the website and send the strongest next step within one business day. Move the lead into the full audit intake, strategy call, or written scope path."
        : "Review fit, send the strongest site-direction notes first, and reply with the right build lane or strategy-call path within one business day.";

    const html = formatIntakeEmailHtml({
      eyebrow: emailEyebrow,
      title: emailTitle,
      summary: [
        { label: "Workflow", value: resolvedWorkflowLabel },
        { label: "Company", value: businessLabel },
        { label: "Need", value: serviceLabel },
        { label: "Market", value: serviceArea },
        { label: "Issue", value: currentSiteIssue },
        { label: "Goal", value: primaryGoal },
        { label: "Package interest", value: packageInterest },
        { label: "Timeline", value: timelineLabel },
      ],
      actions: [
        {
          label: "Next action",
          value: nextActionText,
        },
      ],
      links: website ? [{ label: "Business website", href: website }] : [],
      sections: [
        {
          title: "Contact",
          fields: [
            { label: "Name", value: name },
            { label: "Email", value: email },
            { label: "Phone", value: phone },
          ],
        },
        {
          title: "Company snapshot",
          fields: [
            { label: "Business", value: businessLabel },
            { label: "Website", value: website },
            { label: "Service area", value: serviceArea },
            { label: "Team size", value: teamSize },
            { label: "Biggest issue", value: currentSiteIssue },
            { label: "Primary goal", value: primaryGoal },
            { label: "Timeline", value: timelineLabel },
          ],
        },
        {
          title: "Brief",
          blocks: [{ label: "Project details", value: message }],
        },
        {
          title: "Tracking",
          fields: [
            { label: "Source page", value: marketing.sourcePage },
            { label: "Referer", value: marketing.referer },
            { label: "UTM source", value: marketing.utmSource },
            { label: "UTM medium", value: marketing.utmMedium },
            { label: "UTM campaign", value: marketing.utmCampaign },
            { label: "UTM term", value: marketing.utmTerm },
            { label: "UTM content", value: marketing.utmContent },
          ],
        },
      ],
    });

    const text = formatIntakeEmailText({
      eyebrow: emailEyebrow,
      title: emailTitle,
      summary: [
        { label: "Workflow", value: resolvedWorkflowLabel },
        { label: "Company", value: businessLabel },
        { label: "Need", value: serviceLabel },
        { label: "Market", value: serviceArea },
        { label: "Issue", value: currentSiteIssue },
        { label: "Goal", value: primaryGoal },
        { label: "Package interest", value: packageInterest },
        { label: "Timeline", value: timelineLabel },
      ],
      actions: [
        {
          label: "Next action",
          value: nextActionText,
        },
      ],
      links: website ? [{ label: "Business website", href: website }] : [],
      sections: [
        {
          title: "Contact",
          fields: [
            { label: "Name", value: name },
            { label: "Email", value: email },
            { label: "Phone", value: phone },
          ],
        },
        {
          title: "Company snapshot",
          fields: [
            { label: "Business", value: businessLabel },
            { label: "Website", value: website },
            { label: "Service area", value: serviceArea },
            { label: "Team size", value: teamSize },
            { label: "Biggest issue", value: currentSiteIssue },
            { label: "Primary goal", value: primaryGoal },
            { label: "Timeline", value: timelineLabel },
          ],
        },
        {
          title: "Brief",
          blocks: [{ label: "Project details", value: message }],
        },
        {
          title: "Tracking",
          fields: [
            { label: "Source page", value: marketing.sourcePage },
            { label: "Referer", value: marketing.referer },
            { label: "UTM source", value: marketing.utmSource },
            { label: "UTM medium", value: marketing.utmMedium },
            { label: "UTM campaign", value: marketing.utmCampaign },
            { label: "UTM term", value: marketing.utmTerm },
            { label: "UTM content", value: marketing.utmContent },
          ],
        },
      ],
    });

    const eventId = randomUUID();
    const automationPayload = buildContactIntakeEvent({
      eventId,
      source: "leadcraft-site-contact-form",
      marketing,
      name,
      email,
      phone,
      business: businessLabel,
      service: serviceLabel,
      serviceArea,
      teamSize,
      primaryGoal,
      currentSiteIssue,
      timeline: timelineLabel,
      website,
      message,
      submissionKind,
      workflowLabel: resolvedWorkflowLabel,
      packageInterest,
    });
    const subject =
      isPackageInquiry
        ? `Package Inquiry | ${businessLabel || name}${packageInterest ? ` | ${packageInterest}` : ""}`
        : isHomepageLeadCapture
          ? `Homepage Lead | ${businessLabel || name}${website ? ` | ${website}` : ""}`
          : `Audit Intake | ${businessLabel || name}${currentSiteIssue ? ` | ${currentSiteIssue}` : ""}${primaryGoal ? ` -> ${primaryGoal}` : ""}`;
    const delivery = await deliverSubmission(
      {
        webhookUrl: config.webhookUrl,
        email: config.resendApiKey
          ? {
              fromEmail: config.fromEmail,
              toEmail: config.toEmail,
              resendApiKey: config.resendApiKey,
              replyTo: email,
              subject,
              html,
              text,
            }
          : undefined,
      },
      automationPayload
    );
    const backup = await persistSubmissionBackup({
      submissionId: eventId,
      route: "/api/contact",
      source: "leadcraft-site-contact-form",
      submissionKind,
      workflowLabel: resolvedWorkflowLabel,
      name,
      email,
      phone,
      business: businessLabel,
      website,
      message,
      marketing,
      payload: automationPayload,
      delivery,
    });

    console.info("Contact submission delivery", {
      eventId,
      mode: delivery.mode,
      webhookReason: delivery.webhook.reason,
      webhookProcessingStatus: delivery.webhook.processingStatus,
      webhookExceptionCode: delivery.webhook.exceptionCode,
      webhookDelivered: delivery.webhook.delivered,
      emailDelivered: delivery.email.delivered,
      backupPersisted: backup.persisted,
      backupReason: backup.reason,
    });

    if (backup.attempted && !backup.persisted) {
      console.warn("Contact submission backup failed", {
        eventId,
        reason: backup.reason,
        error: backup.error,
      });
    }

    if (!delivery.ok) {
      return jsonNoStore(
        {
          error:
            "Lead routing into the CRM could not be completed right now. Please try again shortly or contact Leadcraft directly.",
        },
        { status: 502 }
      );
    }

    return jsonNoStore({
      success: true,
      mode: "accepted",
      deliveryMode: delivery.mode,
      message:
        isPackageInquiry
          ? "Package question received. If the fit looks right, the next reply should land within one business day with package guidance, scope direction, and the best next step."
          : isHomepageLeadCapture
            ? "Request received. If the project looks like a fit, the next reply should land within one business day with the cleanest next step."
          : "Audit intake received. If the project looks like a fit, the next reply should land within one business day with site-direction notes, scope guidance, and the right build direction.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonNoStore(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
