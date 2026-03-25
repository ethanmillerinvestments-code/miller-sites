# Leadcraft Agency Site

Public-facing site for Leadcraft Agency.

Stack:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Resend
- Stripe

## Core Commands

```bash
npm run lint
npm run build
npm run security:check
```

Use `npm run security:check` before any production deploy that is meant to receive real contact or package-intake traffic.

## Production Readiness

The site is not considered outreach-ready until contact and checkout-intake delivery have a real live path.

Required docs:
- [PRODUCTION_INTAKE_GO_LIVE_CHECKLIST.md](/Users/ethanmiller/business/miller sites/PRODUCTION_INTAKE_GO_LIVE_CHECKLIST.md)
- [PRODUCTION_SETUP_SNIPPETS.md](/Users/ethanmiller/business/miller sites/PRODUCTION_SETUP_SNIPPETS.md)
- [INBOUND_AUTOMATION_SETUP.md](/Users/ethanmiller/business/leadcraft/docs/04-inbound-and-ops/INBOUND_AUTOMATION_SETUP.md)

## How This Repo Works

Customer flow:

1. Visitor lands on the site
2. Visitor chooses contact, package finder, or checkout-intake
3. Route validates and normalizes the request
4. Signed webhook delivery attempts the CRM first
5. Resend provides inbox backup when configured
6. Operator reviews scope, signer, and payment readiness
7. Verified Stripe webhooks confirm payment events when checkout is active

Source-of-truth files:

- pricing and offer ladder:
  [src/lib/offers.ts](/Users/ethanmiller/business/miller sites/src/lib/offers.ts)
- env contract:
  [src/lib/env.ts](/Users/ethanmiller/business/miller sites/src/lib/env.ts)
- contact intake:
  [src/app/api/contact/route.ts](/Users/ethanmiller/business/miller sites/src/app/api/contact/route.ts)
- checkout-intake:
  [src/app/api/stripe/checkout/route.ts](/Users/ethanmiller/business/miller sites/src/app/api/stripe/checkout/route.ts)
- payment confirmation:
  [src/app/api/stripe/webhook/route.ts](/Users/ethanmiller/business/miller sites/src/app/api/stripe/webhook/route.ts)
- intake layer overview:
  [src/lib/intake/README.md](/Users/ethanmiller/business/miller sites/src/lib/intake/README.md)

## Minimum Env Expectations

At least one delivery path must exist for both contact and checkout intake:

1. Preferred:
   signed webhook delivery into the CRM
2. Backup:
   Resend inbox delivery

Recommended launch setup:
- signed webhook delivery enabled
- Resend backup enabled
- checkout still manual-review only
- proposal approval guard still enabled

See [.env.example](/Users/ethanmiller/business/miller sites/.env.example) for the full env surface.
