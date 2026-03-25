# AGENTS.md

Leadcraft website subsystem contract.

Use this file for work inside `business/miller sites/`.

Primary contract order:
1. `business/miller sites/AGENTS.md`
2. `/Users/ethanmiller/WORKSPACE_CONTRACT.md`
3. any deeper project file if one exists

## 1. Mission

This repo exists to turn Leadcraft's public site into a clean conversion and intake machine.

Every meaningful change should improve at least one of:
- package clarity
- CTA clarity
- mobile conversion
- intake reliability
- operator visibility
- close control discipline

## 2. Non-negotiable rules

1. Mobile quality is mandatory.
2. CRM delivery is the primary success condition for contact, checkout intake, and payment events.
3. Resend is backup visibility only, not the system of record.
4. Manual-review checkout remains the default until scope, signer, and payment controls are intentionally relaxed.
5. Stripe redirect success pages are not payment confirmation. Verified Stripe webhooks are.
6. Public pricing must stay aligned with `/Users/ethanmiller/WORKSPACE_CONTRACT.md`.
7. Do not imply fake urgency, fake proof, fake guarantees, or fake instant approval.
8. Every important inbound event should create a concise, operator-grade email when email backup is configured.

## 3. Source of truth inside this repo

- Public offer ladder: `src/lib/offers.ts`
- Site env contract and readiness rules: `src/lib/env.ts`
- Contact route: `src/app/api/contact/route.ts`
- Checkout-intake route: `src/app/api/stripe/checkout/route.ts`
- Verified payment events: `src/app/api/stripe/webhook/route.ts`
- Shared intake layer overview: `src/lib/intake/README.md`
- Signed webhook logic: `src/lib/intake/automation.ts`
- Shared email layout: `src/lib/intake/intake-email.ts`
- Shared delivery orchestration: `src/lib/intake/submission-routing.ts`

## 4. Canonical customer-facing flow

1. Buyer lands on homepage
2. Buyer chooses quiz, pricing, contact, or strategy call
3. Buyer submits contact inquiry or package-intake brief
4. Site validates and signs the event
5. CRM webhook must accept the event
6. Operator receives concise email backup if Resend is configured
7. Operator reviews fit, scope, signer, and billing path
8. If checkout is allowed later, verified Stripe webhook still confirms payment events

## 5. Notification standard

Every important inbound email should include:
- clear subject line
- event summary
- contact identity
- package or payment context
- concise request summary
- next recommended action
- useful internal or admin links when available

Do not send raw payload dumps as the main body.

## 6. Verification

```bash
cd '/Users/ethanmiller/business/miller sites' && npm run lint
cd '/Users/ethanmiller/business/miller sites' && npm run build
cd '/Users/ethanmiller/business/miller sites' && npm run security:check
```

## 7. Skills for site work

The shared skill policy lives in `/Users/ethanmiller/WORKSPACE_CONTRACT.md`. For work in this repo, use these automatically:

| Task | Skill |
|---|---|
| New pages, sections, components | `frontend-design` |
| Framer Motion animation | `ui-animation` |
| UI accessibility or design audit | `web-design-guidelines` |
| React/Next.js patterns | `vercel-react-best-practices` |
| Stripe checkout or webhooks | `stripe-best-practices` |
| Figma design implementation | `figma-implement-design` |
| Copy rewrites | `copywriting` |
| CTA or trust signal optimization | `marketing-psychology` |
| Analytics setup | `analytics-tracking` |
| Browser testing or screenshots | `playwright` |
| Bug investigation | `systematic-debugging` |
| Pre-commit verification | `verification-before-completion` |

## 8. MCP servers for site work

The shared MCP policy lives in `/Users/ethanmiller/WORKSPACE_CONTRACT.md`. For work in this repo, use these automatically:

| Task | MCP server |
|---|---|
| Design-to-code from Figma URL | **Figma** (`get_design_context`, `get_screenshot`) |
| Deploy or check deployment status | **Vercel** (`deploy_to_vercel`, `get_deployment`, `get_deployment_build_logs`) |
| Stripe checkout or webhook work | **Supabase** (if client backend) or local Stripe CLI |
| Adding UI components | **shadcn** (`search_items_in_registries`, `get_add_command_for_items`) |
| Domain availability check | **Vercel** (`check_domain_availability_and_price`) |
| Reading Cloudflare docs for edge config | **cloudflare-docs** (`search_cloudflare_documentation`) |
