import Stripe from "stripe";

import { postAutomationWebhook } from "@/lib/automation";
import { normalizeCheckoutOfferIds } from "@/lib/checkout-intake";
import { getCheckoutRouteConfig } from "@/lib/env";
import { buildCheckoutPaymentEvent } from "@/lib/intake-events";
import { jsonNoStore } from "@/lib/security";
import { createStripeClient } from "@/lib/stripe-server";

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

async function relayPaymentEvent(
  payload: Record<string, unknown>,
  webhookUrl: string
) {
  const result = await postAutomationWebhook(webhookUrl, payload);

  console.info("Stripe webhook relay", {
    eventId: payload.eventId,
    eventType: payload.eventType,
    mode: result.reason,
    delivered: result.delivered,
    status: result.status,
  });

  return result;
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
          contactName: readMetadataValue(metadata, "contactName"),
          email:
            session.customer_details?.email ||
            session.customer_email ||
            readMetadataValue(metadata, "email"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          intakeEventId: readMetadataValue(metadata, "intakeEventId"),
          stripeEventId: event.id,
          stripeCustomerId: getStripeObjectId(session.customer),
          stripeSubscriptionId: getStripeObjectId(session.subscription),
          stripePaymentIntentId: getStripeObjectId(session.payment_intent),
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

        const relay = await relayPaymentEvent(payload, config.webhookUrl);
        if (!relay.delivered) {
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
          contactName: readMetadataValue(metadata, "contactName"),
          email: readMetadataValue(metadata, "email"),
          phone: readMetadataValue(metadata, "phone"),
          website: readMetadataValue(metadata, "website"),
          cityState: readMetadataValue(metadata, "cityState"),
          timeline: readMetadataValue(metadata, "timeline"),
          services: readMetadataValue(metadata, "services"),
          primaryGoal: readMetadataValue(metadata, "primaryGoal"),
          currentPain: readMetadataValue(metadata, "currentPain"),
          intakeEventId: readMetadataValue(metadata, "intakeEventId"),
          stripeEventId: event.id,
          stripeCustomerId: getStripeObjectId(paymentIntent.customer),
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

        const relay = await relayPaymentEvent(payload, config.webhookUrl);
        if (!relay.delivered) {
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
