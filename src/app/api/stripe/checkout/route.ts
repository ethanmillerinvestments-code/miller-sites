import { after } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

import { postAutomationWebhook } from "@/lib/automation";
import { getCheckoutRouteConfig } from "@/lib/env";
import {
  buildCheckoutMetadata,
  formatCheckoutIntakeHtml,
  formatCheckoutIntakeText,
  getCheckoutSelectionLabel,
  getCheckoutWorkflowLabel,
  normalizeCheckoutOfferIds,
  sanitizeCheckoutIntake,
  type CheckoutOfferId,
} from "@/lib/checkout-intake";
import { cleanField, parseTimestamp } from "@/lib/form-utils";
import {
  getCheckoutOffer,
  getSupportPlan,
  getWebsitePlan,
  isScopeOnlyOffer,
  type SupportPlanId,
  type WebsitePlanId,
} from "@/lib/offers";
import { getRequestMarketingContext } from "@/lib/marketing-context";
import {
  ensureJsonRequest,
  getClientAddress,
  getRateLimitHeaders,
  isSameOriginRequest,
  jsonNoStore,
  takeRateLimitHit,
} from "@/lib/security";
import { siteConfig } from "@/lib/site";

type CheckoutBody = {
  itemId?: CheckoutOfferId;
  itemIds?: CheckoutOfferId[];
  intake?: Record<string, unknown>;
  honeypot?: string;
  startedAt?: number | string;
};

const STRIPE_RATE_LIMIT_MAX = 6;
const STRIPE_EMAIL_RATE_LIMIT_MAX = 4;
const STRIPE_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const STRIPE_MAX_BODY_BYTES = 24_000;
const MIN_INTAKE_COMPLETION_MS = 3_000;
const MAX_INTAKE_COMPLETION_MS = 12 * 60 * 60 * 1000;
const DEFAULT_CHECKOUT_GO_LIVE_DATE = "2026-04-27T00:00:00-04:00";

function getBaseUrl(request: Request) {
  const config = getCheckoutRouteConfig();

  return (
    request.headers.get("origin") ||
    new URL(request.url).origin ||
    config.siteUrl ||
    siteConfig.siteUrl
  );
}

function getCheckoutItem(itemId: CheckoutOfferId | undefined) {
  if (!itemId) {
    return null;
  }

  const supportPlan = getSupportPlan(itemId as SupportPlanId);

  if (supportPlan) {
    return {
      mode: "subscription" as const,
      amount: supportPlan.priceCents,
      name: supportPlan.name,
      description: supportPlan.summary,
      recurring: { interval: "month" as const },
      support: true,
    };
  }

  const plan = getWebsitePlan(itemId as WebsitePlanId);
  if (!plan) {
    return null;
  }

  return {
    mode: "payment" as const,
    amount: plan.priceCents,
    name:
      plan.pricingMode === "custom" ? `${plan.name} Scope Review` : plan.name,
    description:
      plan.pricingMode === "custom"
        ? `${plan.summary} The next step is written scope review before any payment path is chosen.`
        : `${plan.summary} Final scope still gets confirmed before kickoff.`,
    support: false,
  };
}

function resolveCheckoutOfferIds(body: CheckoutBody) {
  if (Array.isArray(body.itemIds) && body.itemIds.length > 0) {
    return normalizeCheckoutOfferIds(body.itemIds);
  }

  if (body.itemId) {
    return normalizeCheckoutOfferIds([body.itemId]);
  }

  return [];
}

function getCheckoutGoLiveTimestamp() {
  const { checkoutGoLiveDate } = getCheckoutRouteConfig();
  const configuredDate = checkoutGoLiveDate || DEFAULT_CHECKOUT_GO_LIVE_DATE;
  const parsed = Date.parse(configuredDate);

  return Number.isFinite(parsed)
    ? parsed
    : Date.parse(DEFAULT_CHECKOUT_GO_LIVE_DATE);
}

function buildMailtoLink(to: string, subject: string, body: string) {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export async function POST(request: Request) {
  try {
    if (!ensureJsonRequest(request, STRIPE_MAX_BODY_BYTES)) {
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
      "stripe-checkout-ip",
      ip,
      STRIPE_RATE_LIMIT_MAX,
      STRIPE_RATE_LIMIT_WINDOW_MS
    );

    if (ipRate.limited) {
      return jsonNoStore(
        { error: "Too many checkout attempts. Please try again shortly." },
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
        ? (rawBody as CheckoutBody)
        : ({} as CheckoutBody);
    const marketing = getRequestMarketingContext(request);
    const config = getCheckoutRouteConfig();
    const honeypot = cleanField(body.honeypot, 120);
    const startedAt = parseTimestamp(body.startedAt);
    const intakeStartAge = Date.now() - startedAt;

    if (honeypot) {
      return jsonNoStore({ success: true });
    }

    if (
      !Number.isFinite(startedAt) ||
      intakeStartAge < MIN_INTAKE_COMPLETION_MS ||
      intakeStartAge > MAX_INTAKE_COMPLETION_MS
    ) {
      return jsonNoStore(
        { error: "Please review the company brief and try again." },
        { status: 400 }
      );
    }

    const offerIds = resolveCheckoutOfferIds(body);
    const primaryOfferId = offerIds[0];
    const primaryOffer = primaryOfferId
      ? getCheckoutOffer(primaryOfferId)
      : null;
    const item = getCheckoutItem(primaryOfferId);

    if (!primaryOffer || !item || offerIds.length === 0 || !primaryOfferId) {
      return jsonNoStore(
        { error: "Please choose a valid offer before checkout." },
        { status: 400 }
      );
    }

    const sanitized = sanitizeCheckoutIntake(body.intake || {});
    if (!sanitized.data) {
      return jsonNoStore(
        { error: sanitized.error || "Please complete the intake." },
        { status: 400 }
      );
    }

    const intake = sanitized.data;
    const emailRate = takeRateLimitHit(
      "stripe-checkout-email",
      intake.email,
      STRIPE_EMAIL_RATE_LIMIT_MAX,
      STRIPE_RATE_LIMIT_WINDOW_MS
    );

    if (emailRate.limited) {
      return jsonNoStore(
        { error: "Too many checkout attempts. Please try again shortly." },
        {
          status: 429,
          headers: getRateLimitHeaders(emailRate.remaining, emailRate.resetAt),
        }
      );
    }

    const secretKey = config.stripeSecretKey;
    const resendApiKey = config.resendApiKey;
    const checkoutEnabled = config.checkoutEnabled;
    const checkoutGoLiveTimestamp = getCheckoutGoLiveTimestamp();
    const checkoutWindowOpen = Date.now() >= checkoutGoLiveTimestamp;
    const manualReviewRequired =
      !checkoutWindowOpen ||
      !checkoutEnabled ||
      offerIds.length > 1 ||
      offerIds.some((offerId) => isScopeOnlyOffer(offerId));

    const packageWorkflowLabel = getCheckoutWorkflowLabel(offerIds);
    const packageLabel = getCheckoutSelectionLabel(offerIds);
    const textBody = formatCheckoutIntakeText(offerIds, intake);
    const manualSubject = `${packageWorkflowLabel} | ${intake.companyName} | ${packageLabel}`;
    const automationPayload = {
      eventType: "leadcraft.checkout_intake",
      occurredAt: new Date().toISOString(),
      source: "leadcraft-site-checkout-intake",
      workflowLabel: packageWorkflowLabel,
      packageLabel,
      offerIds,
      intake,
      checkoutWindowOpen,
      checkoutEnabled,
      manualReviewRequired,
      sourcePage: marketing.sourcePage,
      referer: marketing.referer,
      utmSource: marketing.utmSource,
      utmMedium: marketing.utmMedium,
      utmCampaign: marketing.utmCampaign,
      utmTerm: marketing.utmTerm,
      utmContent: marketing.utmContent,
    };

    if (!resendApiKey) {
      after(async () => {
        await postAutomationWebhook(
          config.webhookUrl,
          {
            ...automationPayload,
            deliveryMode: "manual_review_mailto_fallback",
            inboxTarget: config.toEmail,
          }
        );
      });
      return jsonNoStore({
        success: true,
        mode: "manual_review",
        mailto: buildMailtoLink(config.toEmail, manualSubject, textBody),
        message:
          "Company brief captured. Open the drafted email so the request can move into manual scope review.",
      });
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: config.fromEmail,
      to: [config.toEmail],
      replyTo: intake.email,
      subject: manualSubject,
      html: formatCheckoutIntakeHtml(offerIds, intake),
      text: textBody,
    });

    if (manualReviewRequired || !secretKey) {
      after(async () => {
        await postAutomationWebhook(
          config.webhookUrl,
          {
            ...automationPayload,
            deliveryMode: "manual_review",
            inboxTarget: config.toEmail,
          }
        );
      });
      return jsonNoStore({
        success: true,
        mode: "manual_review",
        mailto: buildMailtoLink(config.toEmail, manualSubject, textBody),
        message: !checkoutWindowOpen
          ? "Company brief captured. Before April 27, 2026, the next step is manual scope review and kickoff planning."
          : "Company brief captured. The next step is manual scope review before any payment step.",
      });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-02-25.clover",
    });
    const baseUrl = getBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: item.mode,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_email: intake.email,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: item.amount,
            product_data: {
              name: item.name,
              description: item.description,
            },
            ...(item.mode === "subscription"
              ? { recurring: item.recurring }
              : {}),
          },
        },
      ],
      metadata: buildCheckoutMetadata(offerIds, intake),
    });

    if (!session.url) {
      throw new Error("Stripe checkout URL was not created.");
    }

    after(async () => {
      await postAutomationWebhook(
        config.webhookUrl,
        {
          ...automationPayload,
          deliveryMode: "stripe_checkout_created",
          stripeSessionId: session.id,
        }
      );
    });

    return jsonNoStore({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return jsonNoStore(
      { error: "Secure checkout is unavailable right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
