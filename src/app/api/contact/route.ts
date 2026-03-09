import { after } from "next/server";
import { Resend } from "resend";

import { postAutomationWebhook } from "@/lib/automation";
import { getContactRouteConfig } from "@/lib/env";
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

const CONTACT_RATE_LIMIT_MAX = 5;
const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX_BODY_BYTES = 12_000;
const MIN_FORM_COMPLETION_MS = 2_500;
const MAX_FORM_COMPLETION_MS = 12 * 60 * 60 * 1000;

function buildMailtoLink(to: string, subject: string, body: string) {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export async function POST(request: Request) {
  try {
    if (!ensureJsonRequest(request, CONTACT_MAX_BODY_BYTES)) {
      return jsonNoStore(
        { error: "Invalid request." },
        { status: 400 }
      );
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

    const name = cleanField(body.name, 80);
    const email = cleanField(body.email, 120, { lowercase: true });
    const phone = cleanField(body.phone, 30);
    const business = cleanField(body.business, 120);
    const service = cleanField(body.service || body.industry, 80);
    const timeline = cleanField(body.timeline, 80);
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

    const html = `
      <h2>New Leadcraft inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${business ? `<p><strong>Business:</strong> ${escapeHtml(business)}</p>` : ""}
      ${service ? `<p><strong>Need:</strong> ${escapeHtml(service)}</p>` : ""}
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

    const automationPayload = {
      eventType: "leadcraft.contact_inquiry",
      occurredAt: new Date().toISOString(),
      source: "leadcraft-site-contact-form",
      name,
      email,
      phone,
      business,
      service,
      timeline,
      website,
      message,
      sourcePage: marketing.sourcePage,
      referer: marketing.referer,
      utmSource: marketing.utmSource,
      utmMedium: marketing.utmMedium,
      utmCampaign: marketing.utmCampaign,
      utmTerm: marketing.utmTerm,
      utmContent: marketing.utmContent,
    };
    const subject = `Leadcraft inquiry | ${name}${business ? ` | ${business}` : ""}`;

    if (!config.resendApiKey) {
      const mailto = buildMailtoLink(config.toEmail, subject, text);

      console.warn("Contact form email provider is not configured. Falling back to mailto.");
      after(async () => {
        await postAutomationWebhook(
          config.webhookUrl,
          {
            ...automationPayload,
            deliveryMode: "mailto_fallback",
            fallbackEmail: config.toEmail,
          }
        );
      });
      return jsonNoStore({
        success: true,
        mode: "mailto",
        mailto,
        message:
          "Lead routing is using a manual fallback right now. Open the drafted email or call directly.",
      });
    }

    const resend = new Resend(config.resendApiKey);

    await resend.emails.send({
      from: config.fromEmail,
      to: [config.toEmail],
      replyTo: email,
      subject,
      html,
      text,
    });

    after(async () => {
      await postAutomationWebhook(
        config.webhookUrl,
        {
          ...automationPayload,
          deliveryMode: "resend_email",
          inboxTarget: config.toEmail,
        }
      );
    });

    return jsonNoStore({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return jsonNoStore(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
