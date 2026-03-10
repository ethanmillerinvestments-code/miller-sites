import { randomUUID } from "node:crypto";

import { buildCheckoutIntakeEvent } from "@/lib/intake-events";
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
import {
  getCheckoutRouteConfig,
  getRouteDeliveryReadiness,
} from "@/lib/env";
import { cleanField, parseTimestamp } from "@/lib/form-utils";
import { getRequestMarketingContext } from "@/lib/marketing-context";
import {
  getCheckoutOffer,
  getSupportPlan,
  getWebsitePlan,
  isScopeOnlyOffer,
  type SupportPlanId,
  type WebsitePlanId,
} from "@/lib/offers";
import {
  ensureJsonRequest,
  getClientAddress,
  getRateLimitHeaders,
  isSameOriginRequest,
  jsonNoStore,
  takeRateLimitHit,
} from "@/lib/security";
import { siteConfig } from "@/lib/site";
import { createStripeClient } from "@/lib/stripe-server";
import { deliverSubmission } from "@/lib/submission-routing";

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

function getManualReviewReason(options: {
  checkoutWindowOpen: boolean;
  checkoutEnabled: boolean;
  requireProposalApproval: boolean;
  paymentPathReady: boolean;
  hasMultipleOffers: boolean;
  hasScopeOnlyOffer: boolean;
}) {
  if (!options.checkoutWindowOpen) {
    return "Checkout is blocked until April 27, 2026 and requires manual scope review.";
  }

  if (!options.checkoutEnabled) {
    return "Checkout is disabled, so the request stays in manual scope review.";
  }

  if (options.requireProposalApproval) {
    return "Proposal approval is required before any payment request can be issued.";
  }

  if (!options.paymentPathReady) {
    return "Payment path is not fully configured, so the request stays in manual review.";
  }

  if (options.hasMultipleOffers) {
    return "Multiple offers were selected, so the request needs one combined scope review.";
  }

  if (options.hasScopeOnlyOffer) {
    return "The selected offer requires written scope review before any payment step.";
  }

  return "Manual scope review is required before any payment step.";
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
        { error: "Too many project brief attempts. Please try again shortly." },
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
    const deliveryReadiness = getRouteDeliveryReadiness(config);
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
        { error: "Please choose a valid offer before submitting the brief." },
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
        { error: "Too many project brief attempts. Please try again shortly." },
        {
          status: 429,
          headers: getRateLimitHeaders(emailRate.remaining, emailRate.resetAt),
        }
      );
    }

    if (!deliveryReadiness.hasWebhook && !deliveryReadiness.hasEmail) {
      console.error("Checkout intake delivery unavailable: no webhook or email route.");
      return jsonNoStore(
        {
          error:
            "Project brief routing is unavailable on this deployment. Please call or email directly until the intake path is configured.",
        },
        { status: 503 }
      );
    }

    const checkoutEnabled = config.checkoutEnabled;
    const checkoutGoLiveTimestamp = getCheckoutGoLiveTimestamp();
    const checkoutWindowOpen = Date.now() >= checkoutGoLiveTimestamp;
    const paymentPathReady = Boolean(
      config.stripeSecretKey && config.stripeWebhookSecret
    );
    const hasMultipleOffers = offerIds.length > 1;
    const hasScopeOnlyOffer = offerIds.some((offerId) => isScopeOnlyOffer(offerId));
    const manualReviewRequired =
      !checkoutWindowOpen ||
      !checkoutEnabled ||
      config.requireProposalApproval ||
      !paymentPathReady ||
      hasMultipleOffers ||
      hasScopeOnlyOffer;
    const manualReviewReason = getManualReviewReason({
      checkoutWindowOpen,
      checkoutEnabled,
      requireProposalApproval: config.requireProposalApproval,
      paymentPathReady,
      hasMultipleOffers,
      hasScopeOnlyOffer,
    });

    const packageWorkflowLabel = getCheckoutWorkflowLabel(offerIds);
    const packageLabel = getCheckoutSelectionLabel(offerIds);
    const htmlBody = formatCheckoutIntakeHtml(offerIds, intake);
    const textBody = formatCheckoutIntakeText(offerIds, intake);
    const manualSubject = `${packageWorkflowLabel} | ${intake.companyName} | ${packageLabel}`;
    const intakeEventId = randomUUID();
    const automationPayload = buildCheckoutIntakeEvent({
      eventId: intakeEventId,
      source: "leadcraft-site-checkout-intake",
      marketing,
      offerIds,
      packageLabel,
      workflowLabel: packageWorkflowLabel,
      checkoutWindowOpen,
      checkoutEnabled,
      manualReviewRequired,
      intake,
    });
    automationPayload.manualReviewReason = manualReviewReason;

    const delivery = await deliverSubmission(
      {
        webhookUrl: config.webhookUrl,
        email: config.resendApiKey
          ? {
              fromEmail: config.fromEmail,
              toEmail: config.toEmail,
              resendApiKey: config.resendApiKey,
              replyTo: intake.email,
              subject: manualSubject,
              html: htmlBody,
              text: textBody,
            }
          : undefined,
      },
      automationPayload
    );

    console.info("Checkout intake delivery", {
      eventId: intakeEventId,
      mode: delivery.mode,
      manualReviewRequired,
      webhookDelivered: delivery.webhook.delivered,
      emailDelivered: delivery.email.delivered,
    });

    if (!delivery.ok) {
      return jsonNoStore(
        {
          error:
            "Project brief routing could not be completed right now. Please try again shortly or contact Leadcraft directly.",
        },
        { status: 502 }
      );
    }

    if (manualReviewRequired || !config.stripeSecretKey) {
      return jsonNoStore({
        success: true,
        mode: "manual_review",
        deliveryMode: delivery.mode,
        message: !checkoutWindowOpen
          ? "Company brief captured. Before April 27, 2026, the next step is manual scope review, signer confirmation, and kickoff planning."
          : config.requireProposalApproval
            ? "Company brief captured. The next step is written scope review. If the scope is approved, Leadcraft sends a Stripe payment link or invoice manually."
            : "Company brief captured. The next step is manual scope review before any payment step.",
      });
    }

    const stripe = createStripeClient(config.stripeSecretKey);
    const baseUrl = getBaseUrl(request);
    const sessionMetadata = buildCheckoutMetadata(offerIds, intake, {
      intakeEventId,
      sourcePage: marketing.sourcePage,
      referer: marketing.referer,
      utmSource: marketing.utmSource,
      utmMedium: marketing.utmMedium,
      utmCampaign: marketing.utmCampaign,
      utmTerm: marketing.utmTerm,
      utmContent: marketing.utmContent,
    });

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
      metadata: sessionMetadata,
      ...(item.mode === "payment"
        ? {
            payment_intent_data: {
              metadata: sessionMetadata,
            },
          }
        : {
            subscription_data: {
              metadata: sessionMetadata,
            },
          }),
    });

    if (!session.url) {
      throw new Error("Stripe checkout URL was not created.");
    }

    console.info("Stripe checkout session created", {
      intakeEventId,
      stripeSessionId: session.id,
      packageLabel,
    });

    return jsonNoStore({
      success: true,
      mode: "checkout_redirect",
      deliveryMode: delivery.mode,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return jsonNoStore(
      {
        error:
          "The project brief was not routed cleanly into the next step. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
