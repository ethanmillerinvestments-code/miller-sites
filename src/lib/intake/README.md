# Intake Layer

This folder contains the full inbound pipeline for Leadcraft's public site.

Use it in this order:

1. `intake-events.ts`
   Builds the normalized CRM/event payloads for contact, checkout-intake, and confirmed payment events.
2. `checkout-intake.ts`
   Validates checkout-intake data, billing choices, labels, and operator email content.
3. `automation.ts`
   Signs and sends webhook envelopes to the CRM receiver.
4. `submission-routing.ts`
   Orchestrates CRM delivery plus Resend backup delivery.
5. `submission-backup.ts`
   Writes a durable backup to Supabase when that path is configured.
6. `intake-email.ts`
   Renders the operator-facing email HTML and text layouts.

Primary flows:

- Contact form:
  `src/app/api/contact/route.ts` -> `intake-events.ts` -> `submission-routing.ts`
- Checkout intake:
  `src/app/api/stripe/checkout/route.ts` -> `checkout-intake.ts` -> `intake-events.ts` -> `submission-routing.ts`
- Payment confirmation:
  `src/app/api/stripe/webhook/route.ts` -> `checkout-intake.ts` -> `intake-events.ts` -> `submission-routing.ts`

Operational rules:

- CRM webhook delivery is the primary success condition.
- Resend is backup visibility only.
- Verified Stripe webhooks confirm payment events.
- Checkout remains scope-first and manual-review-first unless env controls are intentionally relaxed.
