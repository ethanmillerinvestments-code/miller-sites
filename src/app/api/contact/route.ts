import { randomUUID } from "node:crypto";

import { buildContactIntakeEvent } from "@/lib/intake-events";
import {
  getContactRouteConfig,
  getRouteDeliveryReadiness,
} from "@/lib/env";
import {
  cleanField,
  cleanTextarea,
  escapeHtml,
  isValidEmail,
  isValidPhone,
  normalizeWebsite,
  parseTimestamp,
} from "@/lib/form-utils";
import { getRequestMarketingContext } from "@/lib/marketing-context";
import {
  ensureJsonRequest,
  getClientAddress,
  getRateLimitHeaders,
  isSameOriginRequest,
  jsonNoStore,
  takeRateLimitHit,
} from "@/lib/security";
import { deliverSubmission } from "@/lib/submission-routing";

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
    const timeline = cleanField(body.timeline, 80);
    const submissionKindInput = cleanField(body.submissionKind, 40, {
      lowercase: true,
    });
    const submissionKind =
      submissionKindInput === "package_inquiry"
        ? "package_inquiry"
        : "contact_inquiry";
    const packageInterest = cleanField(
      body.packageInterest || body.packageLabel || body.package,
      220
    );
    const workflowLabel = cleanField(body.workflowLabel, 120);
    const resolvedWorkflowLabel =
      workflowLabel ||
      (submissionKind === "package_inquiry"
        ? "Package Inquiry"
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

    if (!deliveryReadiness.hasWebhook && !deliveryReadiness.hasEmail) {
      console.error("Contact delivery unavailable: no webhook or email route.");
      return jsonNoStore(
        {
          error:
            "Lead routing is unavailable on this deployment. Please call or email directly until the intake path is configured.",
        },
        { status: 503 }
      );
    }

    const html = `
      <h2>New Leadcraft inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${business ? `<p><strong>Business:</strong> ${escapeHtml(business)}</p>` : ""}
      ${service ? `<p><strong>Need:</strong> ${escapeHtml(service)}</p>` : ""}
      ${
        packageInterest
          ? `<p><strong>Package Interest:</strong> ${escapeHtml(packageInterest)}</p>`
          : ""
      }
      ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ""}
      ${website ? `<p><strong>Website:</strong> ${escapeHtml(website)}</p>` : ""}
      ${marketing.sourcePage ? `<p><strong>Source Page:</strong> ${escapeHtml(marketing.sourcePage)}</p>` : ""}
      <p><strong>Project Details:</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
    `;

    const text = [
      "New Leadcraft inquiry",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      business ? `Business: ${business}` : "",
      service ? `Need: ${service}` : "",
      packageInterest ? `Package Interest: ${packageInterest}` : "",
      timeline ? `Timeline: ${timeline}` : "",
      website ? `Website: ${website}` : "",
      marketing.sourcePage ? `Source Page: ${marketing.sourcePage}` : "",
      marketing.utmSource ? `UTM Source: ${marketing.utmSource}` : "",
      marketing.utmMedium ? `UTM Medium: ${marketing.utmMedium}` : "",
      marketing.utmCampaign ? `UTM Campaign: ${marketing.utmCampaign}` : "",
      "",
      "Project details:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const eventId = randomUUID();
    const automationPayload = buildContactIntakeEvent({
      eventId,
      source: "leadcraft-site-contact-form",
      marketing,
      name,
      email,
      phone,
      business,
      service,
      timeline,
      website,
      message,
      submissionKind,
      workflowLabel: resolvedWorkflowLabel,
      packageInterest,
    });
    const subject = `${resolvedWorkflowLabel} | ${name}${business ? ` | ${business}` : ""}`;
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

    console.info("Contact submission delivery", {
      eventId,
      mode: delivery.mode,
      webhookDelivered: delivery.webhook.delivered,
      emailDelivered: delivery.email.delivered,
    });

    if (!delivery.ok) {
      return jsonNoStore(
        {
          error:
            "Lead routing could not be completed right now. Please try again shortly or contact Leadcraft directly.",
        },
        { status: 502 }
      );
    }

    return jsonNoStore({
      success: true,
      mode: "accepted",
      deliveryMode: delivery.mode,
      message:
        "Request received. If the project looks like a fit, the next reply moves into audit notes, scope, timeline, and the right build direction.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonNoStore(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
