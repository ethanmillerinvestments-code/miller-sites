import Stripe from "stripe";

import {
  formatCheckoutPaymentHtml,
  formatCheckoutPaymentText,
  normalizeCheckoutOfferIds,
} from "@/lib/intake/checkout-intake";
import { getCheckoutRouteConfig } from "@/lib/env";
import { buildCheckoutPaymentEvent } from "@/lib/intake/intake-events";
import { jsonNoStore } from "@/lib/security";
import { createStripeClient } from "@/lib/stripe-server";
import { deliverSubmission } from "@/lib/intake/submission-routing";

export const runtime = "nodejs";

function readMetadataValue(
  metadata: Stripe.Metadata | null | undefined,
  key: string
) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

function getStripeObjectId(
  value:
    | string
    | Stripe.Customer
    | Stripe.DeletedCustomer
    | Stripe.PaymentIntent
    | Stripe.Subscription
    | null
    | undefined
) {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value : value.id;
}

function getStripeDashboardBaseUrl(livemode: boolean) {
  return livemode
    ? "https://dashboard.stripe.com"
    : "https://dashboard.stripe.com/test";
}

function buildStripeDashboardLinks(options: {
  livemode: boolean;
  customerId?: string;
  paymentIntentId?: string;
  subscriptionId?: string;
}) {
  const baseUrl = getStripeDashboardBaseUrl(options.livemode);
  const links: Array<{ label: string; href: string }> = [];

  if (options.paymentIntentId) {
    links.push({
      label: "Stripe payment",
      href: `${baseUrl}/payments/${options.paymentIntentId}`,
    });
  }

  if (options.subscriptionId) {
    links.push({
      label: "Stripe subscription",
      href: `${baseUrl}/subscriptions/${options.subscriptionId}`,
    });
  }

  if (options.customerId) {
    links.push({
      label: "Stripe customer",
      href: `${baseUrl}/customers/${options.customerId}`,
    });
  }

  return links;
}

function readPaymentPathDisplay(
  metadata: Stripe.Metadata | null | undefined
) {
  return (
    readMetadataValue(metadata, "paymentPathDetail") ||
    readMetadataValue(metadata, "paymentPath")
  );
}

export async function POST(request: Request) {
  const config = getCheckoutRouteConfig();

  if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
    console.error(
      "Stripe webhook misconfigured: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is missing."
    );
    return jsonNoStore(
      { error: "Stripe webhook is not configured." },
      { status: 500 }
    );
  }

  if (!config.webhookUrl || !config.automationSecret) {
    console.error(
      "Stripe webhook misconfigured: CRM webhook URL or automation secret is missing."
    );
    return jsonNoStore(
      { error: "CRM intake receiver is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return jsonNoStore(
      { error: "Missing Stripe signature header." },
      { status: 400 }
    );
  }

  const rawBody = await request.text();
  const stripe = createStripeClient(config.stripeSecretKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripeWebhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return jsonNoStore(
      { error: "Invalid Stripe signature." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;
        const customerId = getStripeObjectId(session.customer);
        const subscriptionId = getStripeObjectId(session.subscription);
        const paymentIntentId = getStripeObjectId(session.payment_intent);
        const payload = buildCheckoutPaymentEvent({
          eventId: `stripe:${event.id}`,
          eventType: "leadcraft.checkout_payment_confirmed",
          source: "leadcraft-stripe-webhook",
          workflowLabel: "Stripe Payment Confirmed",
          packageLabel: readMetadataValue(metadata, "offerLabel"),
          offerIds: normalizeCheckoutOfferIds(readMetadataValue(metadata, "offerIds")),
          sessionId: session.id,
          sessionMode: session.mode || "",
          paymentStatus: session.payment_status || "",
          status: session.status || "",
          companyName: readMetadataValue(metadata, "companyName"),
          legalBusinessName: readMetadataValue(metadata, "legalBusinessName"),
          contactName: readMetadataValue(metadata, "contactName"),
          signerName: readMetadataValue(metadata, "signerName"),
          signerRole: readMetadataValue(metadata, "signerRole"),
          email:
            session.customer_details?.email ||
            session.customer_email ||
            readMetadataValue(metadata, "email"),
          billingEmail: readMetadataValue(metadata, "billingEmail"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          approvalMethod: readMetadataValue(metadata, "approvalMethod"),
          sitePaymentMethod: readMetadataValue(metadata, "sitePaymentMethod"),
          sitePaymentTiming: readMetadataValue(metadata, "sitePaymentTiming"),
          monthlyBillingMethod: readMetadataValue(
            metadata,
            "monthlyBillingMethod"
          ),
          paymentPath: readMetadataValue(metadata, "paymentPath"),
          intakeEventId: readMetadataValue(metadata, "intakeEventId"),
          stripeEventId: event.id,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePaymentIntentId: paymentIntentId,
          marketing: {
            referer: readMetadataValue(metadata, "referer"),
            sourcePage: readMetadataValue(metadata, "sourcePage"),
            utmSource: readMetadataValue(metadata, "utmSource"),
            utmMedium: readMetadataValue(metadata, "utmMedium"),
            utmCampaign: readMetadataValue(metadata, "utmCampaign"),
            utmTerm: readMetadataValue(metadata, "utmTerm"),
            utmContent: readMetadataValue(metadata, "utmContent"),
          },
        });

        const html = formatCheckoutPaymentHtml({
          eventLabel: "Payment Confirmed",
          eventTitle: readMetadataValue(metadata, "companyName") || "Leadcraft payment",
          packageLabel: readMetadataValue(metadata, "offerLabel"),
          workflowLabel: "Stripe Payment Confirmed",
          companyName: readMetadataValue(metadata, "companyName"),
          legalBusinessName: readMetadataValue(metadata, "legalBusinessName"),
          contactName: readMetadataValue(metadata, "contactName"),
          signerName: readMetadataValue(metadata, "signerName"),
          signerRole: readMetadataValue(metadata, "signerRole"),
          email:
            session.customer_details?.email ||
            session.customer_email ||
            readMetadataValue(metadata, "email"),
          billingEmail: readMetadataValue(metadata, "billingEmail"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          approvalMethod: readMetadataValue(metadata, "approvalMethod"),
          paymentPath: readPaymentPathDisplay(metadata),
          sessionId: session.id,
          sessionMode: session.mode || "",
          paymentStatus: session.payment_status || "",
          stripeStatus: session.status || "",
          amountCents: session.amount_total,
          currency: session.currency || "usd",
          tracking: {
            referer: readMetadataValue(metadata, "referer"),
            sourcePage: readMetadataValue(metadata, "sourcePage"),
            utmSource: readMetadataValue(metadata, "utmSource"),
            utmMedium: readMetadataValue(metadata, "utmMedium"),
            utmCampaign: readMetadataValue(metadata, "utmCampaign"),
            utmTerm: readMetadataValue(metadata, "utmTerm"),
            utmContent: readMetadataValue(metadata, "utmContent"),
          },
          links: buildStripeDashboardLinks({
            livemode: event.livemode,
            customerId,
            paymentIntentId,
            subscriptionId,
          }),
          nextAction:
            "Verify written scope, signer, and billing controls, then move the deal into onboarding if the close controls are complete.",
        });
        const text = formatCheckoutPaymentText({
          eventLabel: "Payment Confirmed",
          eventTitle: readMetadataValue(metadata, "companyName") || "Leadcraft payment",
          packageLabel: readMetadataValue(metadata, "offerLabel"),
          workflowLabel: "Stripe Payment Confirmed",
          companyName: readMetadataValue(metadata, "companyName"),
          legalBusinessName: readMetadataValue(metadata, "legalBusinessName"),
          contactName: readMetadataValue(metadata, "contactName"),
          signerName: readMetadataValue(metadata, "signerName"),
          signerRole: readMetadataValue(metadata, "signerRole"),
          email:
            session.customer_details?.email ||
            session.customer_email ||
            readMetadataValue(metadata, "email"),
          billingEmail: readMetadataValue(metadata, "billingEmail"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          approvalMethod: readMetadataValue(metadata, "approvalMethod"),
          paymentPath: readPaymentPathDisplay(metadata),
          sessionId: session.id,
          sessionMode: session.mode || "",
          paymentStatus: session.payment_status || "",
          stripeStatus: session.status || "",
          amountCents: session.amount_total,
          currency: session.currency || "usd",
          tracking: {
            referer: readMetadataValue(metadata, "referer"),
            sourcePage: readMetadataValue(metadata, "sourcePage"),
            utmSource: readMetadataValue(metadata, "utmSource"),
            utmMedium: readMetadataValue(metadata, "utmMedium"),
            utmCampaign: readMetadataValue(metadata, "utmCampaign"),
            utmTerm: readMetadataValue(metadata, "utmTerm"),
            utmContent: readMetadataValue(metadata, "utmContent"),
          },
          links: buildStripeDashboardLinks({
            livemode: event.livemode,
            customerId,
            paymentIntentId,
            subscriptionId,
          }),
          nextAction:
            "Verify written scope, signer, and billing controls, then move the deal into onboarding if the close controls are complete.",
        });

        const delivery = await deliverSubmission(
          {
            webhookUrl: config.webhookUrl,
            email: config.resendApiKey
              ? {
                  fromEmail: config.fromEmail,
                  toEmail: config.toEmail,
                  resendApiKey: config.resendApiKey,
                  replyTo:
                    readMetadataValue(metadata, "billingEmail") ||
                    session.customer_details?.email ||
                    session.customer_email ||
                    readMetadataValue(metadata, "email"),
                  subject: `Payment Confirmed | ${readMetadataValue(metadata, "companyName") || "Leadcraft"} | ${readMetadataValue(metadata, "offerLabel") || "Project"}`,
                  html,
                  text,
                }
              : undefined,
          },
          payload
        );

        console.info("Stripe webhook delivery", {
          eventId: payload.eventId,
          eventType: payload.eventType,
          mode: delivery.mode,
          webhookReason: delivery.webhook.reason,
          webhookDelivered: delivery.webhook.delivered,
          emailDelivered: delivery.email.delivered,
          processingStatus: delivery.webhook.processingStatus,
          exceptionCode: delivery.webhook.exceptionCode,
        });

        if (!delivery.ok) {
          return jsonNoStore(
            { error: "Payment confirmation relay failed." },
            { status: 500 }
          );
        }

        return jsonNoStore({ received: true, relayed: true });
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const metadata = paymentIntent.metadata;
        const customerId = getStripeObjectId(paymentIntent.customer);
        const payload = buildCheckoutPaymentEvent({
          eventId: `stripe:${event.id}`,
          eventType: "leadcraft.checkout_payment_failed",
          source: "leadcraft-stripe-webhook",
          workflowLabel: "Stripe Payment Failed",
          packageLabel: readMetadataValue(metadata, "offerLabel"),
          offerIds: normalizeCheckoutOfferIds(readMetadataValue(metadata, "offerIds")),
          sessionId: "",
          sessionMode: "payment",
          paymentStatus: "failed",
          status: paymentIntent.status,
          companyName: readMetadataValue(metadata, "companyName"),
          legalBusinessName: readMetadataValue(metadata, "legalBusinessName"),
          contactName: readMetadataValue(metadata, "contactName"),
          signerName: readMetadataValue(metadata, "signerName"),
          signerRole: readMetadataValue(metadata, "signerRole"),
          email: readMetadataValue(metadata, "email"),
          billingEmail: readMetadataValue(metadata, "billingEmail"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          approvalMethod: readMetadataValue(metadata, "approvalMethod"),
          sitePaymentMethod: readMetadataValue(metadata, "sitePaymentMethod"),
          sitePaymentTiming: readMetadataValue(metadata, "sitePaymentTiming"),
          monthlyBillingMethod: readMetadataValue(
            metadata,
            "monthlyBillingMethod"
          ),
          paymentPath: readMetadataValue(metadata, "paymentPath"),
          intakeEventId: readMetadataValue(metadata, "intakeEventId"),
          stripeEventId: event.id,
          stripeCustomerId: customerId,
          stripePaymentIntentId: paymentIntent.id,
          marketing: {
            referer: readMetadataValue(metadata, "referer"),
            sourcePage: readMetadataValue(metadata, "sourcePage"),
            utmSource: readMetadataValue(metadata, "utmSource"),
            utmMedium: readMetadataValue(metadata, "utmMedium"),
            utmCampaign: readMetadataValue(metadata, "utmCampaign"),
            utmTerm: readMetadataValue(metadata, "utmTerm"),
            utmContent: readMetadataValue(metadata, "utmContent"),
          },
        });

        const html = formatCheckoutPaymentHtml({
          eventLabel: "Payment Failed",
          eventTitle: readMetadataValue(metadata, "companyName") || "Leadcraft payment",
          packageLabel: readMetadataValue(metadata, "offerLabel"),
          workflowLabel: "Stripe Payment Failed",
          companyName: readMetadataValue(metadata, "companyName"),
          legalBusinessName: readMetadataValue(metadata, "legalBusinessName"),
          contactName: readMetadataValue(metadata, "contactName"),
          signerName: readMetadataValue(metadata, "signerName"),
          signerRole: readMetadataValue(metadata, "signerRole"),
          email: readMetadataValue(metadata, "email"),
          billingEmail: readMetadataValue(metadata, "billingEmail"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          approvalMethod: readMetadataValue(metadata, "approvalMethod"),
          paymentPath: readPaymentPathDisplay(metadata),
          sessionMode: "payment",
          paymentStatus: "failed",
          stripeStatus: paymentIntent.status,
          amountCents: paymentIntent.amount,
          currency: paymentIntent.currency || "usd",
          tracking: {
            referer: readMetadataValue(metadata, "referer"),
            sourcePage: readMetadataValue(metadata, "sourcePage"),
            utmSource: readMetadataValue(metadata, "utmSource"),
            utmMedium: readMetadataValue(metadata, "utmMedium"),
            utmCampaign: readMetadataValue(metadata, "utmCampaign"),
            utmTerm: readMetadataValue(metadata, "utmTerm"),
            utmContent: readMetadataValue(metadata, "utmContent"),
          },
          links: buildStripeDashboardLinks({
            livemode: event.livemode,
            customerId,
            paymentIntentId: paymentIntent.id,
          }),
          nextAction:
            "Review the billing path, confirm whether a new invoice or payment link is needed, and follow up manually.",
        });
        const text = formatCheckoutPaymentText({
          eventLabel: "Payment Failed",
          eventTitle: readMetadataValue(metadata, "companyName") || "Leadcraft payment",
          packageLabel: readMetadataValue(metadata, "offerLabel"),
          workflowLabel: "Stripe Payment Failed",
          companyName: readMetadataValue(metadata, "companyName"),
          legalBusinessName: readMetadataValue(metadata, "legalBusinessName"),
          contactName: readMetadataValue(metadata, "contactName"),
          signerName: readMetadataValue(metadata, "signerName"),
          signerRole: readMetadataValue(metadata, "signerRole"),
          email: readMetadataValue(metadata, "email"),
          billingEmail: readMetadataValue(metadata, "billingEmail"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          approvalMethod: readMetadataValue(metadata, "approvalMethod"),
          paymentPath: readPaymentPathDisplay(metadata),
          sessionMode: "payment",
          paymentStatus: "failed",
          stripeStatus: paymentIntent.status,
          amountCents: paymentIntent.amount,
          currency: paymentIntent.currency || "usd",
          tracking: {
            referer: readMetadataValue(metadata, "referer"),
            sourcePage: readMetadataValue(metadata, "sourcePage"),
            utmSource: readMetadataValue(metadata, "utmSource"),
            utmMedium: readMetadataValue(metadata, "utmMedium"),
            utmCampaign: readMetadataValue(metadata, "utmCampaign"),
            utmTerm: readMetadataValue(metadata, "utmTerm"),
            utmContent: readMetadataValue(metadata, "utmContent"),
          },
          links: buildStripeDashboardLinks({
            livemode: event.livemode,
            customerId,
            paymentIntentId: paymentIntent.id,
          }),
          nextAction:
            "Review the billing path, confirm whether a new invoice or payment link is needed, and follow up manually.",
        });

        const delivery = await deliverSubmission(
          {
            webhookUrl: config.webhookUrl,
            email: config.resendApiKey
              ? {
                  fromEmail: config.fromEmail,
                  toEmail: config.toEmail,
                  resendApiKey: config.resendApiKey,
                  replyTo:
                    readMetadataValue(metadata, "billingEmail") ||
                    readMetadataValue(metadata, "email"),
                  subject: `Payment Failed | ${readMetadataValue(metadata, "companyName") || "Leadcraft"} | ${readMetadataValue(metadata, "offerLabel") || "Project"}`,
                  html,
                  text,
                }
              : undefined,
          },
          payload
        );

        console.info("Stripe webhook delivery", {
          eventId: payload.eventId,
          eventType: payload.eventType,
          mode: delivery.mode,
          webhookReason: delivery.webhook.reason,
          webhookDelivered: delivery.webhook.delivered,
          emailDelivered: delivery.email.delivered,
          processingStatus: delivery.webhook.processingStatus,
          exceptionCode: delivery.webhook.exceptionCode,
        });

        if (!delivery.ok) {
          return jsonNoStore(
            { error: "Payment failure relay failed." },
            { status: 500 }
          );
        }

        return jsonNoStore({ received: true, relayed: true });
      }

      default:
        return jsonNoStore({ received: true, ignored: true });
    }
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return jsonNoStore(
      { error: "Stripe webhook processing failed." },
      { status: 500 }
    );
  }
}
