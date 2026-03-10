import "server-only";

import Stripe from "stripe";

export const STRIPE_API_VERSION: Stripe.LatestApiVersion =
  "2026-02-25.clover";

export function createStripeClient(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
  });
}
