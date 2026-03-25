# Leadcraft Production Setup Snippets

Date anchor:
- Prepared on March 11, 2026
- Intended for the pre-outreach go-live path before or on April 27, 2026

Use this file when you want the exact copy-paste setup values and deployment order.

## Recommended Production Setup

This is the preferred live configuration:
- Apps Script webhook is the primary delivery path
- Resend is the inbox backup path
- checkout stays manual-review only
- proposal approval stays enabled
- inbox-only intake is not launch ready

## 1. Generate The Shared Secret

Use one shared secret value in both Apps Script and Vercel.

Example:

```bash
openssl rand -hex 32
```

Copy the result and use it as:
- `Inbound_Webhook_Secret` in the CRM `Config` tab
- `LEADCRAFT_AUTOMATION_SECRET` in Vercel

## 2. Vercel Production Env Block

Set these in the Vercel production environment for `miller-sites`.

Replace:
- `YOUR_APPS_SCRIPT_WEB_APP_URL`
- `YOUR_SHARED_SECRET`
- `YOUR_RESEND_API_KEY`

```dotenv
NEXT_PUBLIC_SITE_URL=https://miller-sites.vercel.app
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/ethanmillerinvestments
CONTACT_EMAIL_TO=leadcraftscale@gmail.com
CONTACT_FROM_EMAIL="Leadcraft Agency <onboarding@resend.dev>"
RESEND_API_KEY=YOUR_RESEND_API_KEY
LEADCRAFT_CONTACT_WEBHOOK_URL=YOUR_APPS_SCRIPT_WEB_APP_URL
LEADCRAFT_CHECKOUT_WEBHOOK_URL=YOUR_APPS_SCRIPT_WEB_APP_URL
LEADCRAFT_AUTOMATION_SECRET=YOUR_SHARED_SECRET
LEADCRAFT_ENABLE_CHECKOUT=false
LEADCRAFT_CHECKOUT_GO_LIVE_DATE=2026-04-27T00:00:00-04:00
LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL=true
```

Do not enable direct checkout here.

## 3. Apps Script Deployment Checklist

Use this exact order in the CRM Apps Script project:

1. Open the script project attached to the canonical CRM sheet.
2. Save the latest `Code.gs`.
3. Run `setupSystem()` if the canonical tabs do not exist yet.
4. Confirm these tabs exist:
   - `Leads_Master`
   - `Inbound_Requests`
   - `Config`
5. In `Config`, set:
   - `Inbound_Webhook_Secret=YOUR_SHARED_SECRET`
   - recommended `Inbound_Default_Status=Qualify`
6. Open `Deploy > New deployment`.
7. Choose:
   - Type: `Web app`
   - Execute as: `Me`
   - Access: narrowest setting that still allows live site posts
8. Deploy the web app.
9. Copy the web app URL.
10. Paste that same URL into both:
   - `LEADCRAFT_CONTACT_WEBHOOK_URL`
   - `LEADCRAFT_CHECKOUT_WEBHOOK_URL`

## 4. Redeploy Sequence

After the Vercel env vars are saved:

1. Trigger a production deploy for `miller-sites`
2. Wait for the deploy to finish
3. Run:

```bash
cd '/Users/ethanmiller/business/miller sites'
npm run security:check
```

Expected:
- `CONTACT_DELIVERY_READY` passes
- `CHECKOUT_INTAKE_DELIVERY_READY` passes

## 5. Live Verification Sequence

Do these immediately after deploy:

### Contact form test

1. Open the live site
2. Submit the contact form with a real test inquiry
3. Confirm:
   - the site accepts the request
   - the event lands in `Inbound_Requests`
   - the lead appears in `Leads_Master`
   - `Next_Followup_Date` is populated
   - `First_Ack_At` is still blank until review actually happens

### Checkout intake test

1. Open the live checkout intake flow
2. Submit a real test brief
3. Confirm:
   - the site accepts the request
   - the event lands in `Inbound_Requests`
   - the lead appears in `Leads_Master`
   - the result remains manual-review only
   - `Next_Followup_Date` is populated

## 6. Pre-Outreach Go/No-Go

Go only if all are true:

- Vercel envs are set
- Apps Script web app is live
- shared secret matches in both systems
- `npm run security:check` passes delivery coverage
- contact test works
- checkout intake test works
- response standard is visible on site
- legal pages are live
- proposal approval is still enabled
- direct checkout is still disabled unless you intentionally change that later

## 7. If You Want To Use Vercel CLI Later

Verified against Vercel CLI `50.31.0` on March 11, 2026.

If you choose to set envs by CLI instead of the dashboard, use this order.

### Link the local project first

```bash
cd '/Users/ethanmiller/business/miller sites'
npx vercel link
```

### Add production env vars by CLI

Replace:
- `YOUR_APPS_SCRIPT_WEB_APP_URL`
- `YOUR_SHARED_SECRET`
- `YOUR_RESEND_API_KEY`

```bash
cd '/Users/ethanmiller/business/miller sites'
npx vercel env add NEXT_PUBLIC_SITE_URL production --value "https://miller-sites.vercel.app" --yes
npx vercel env add NEXT_PUBLIC_CALENDLY_URL production --value "https://calendly.com/ethanmillerinvestments" --yes
npx vercel env add CONTACT_EMAIL_TO production --value "leadcraftscale@gmail.com" --yes
npx vercel env add CONTACT_FROM_EMAIL production --value "Leadcraft Agency <onboarding@resend.dev>" --yes
npx vercel env add RESEND_API_KEY production --value "YOUR_RESEND_API_KEY" --yes
npx vercel env add LEADCRAFT_CONTACT_WEBHOOK_URL production --value "YOUR_APPS_SCRIPT_WEB_APP_URL" --yes
npx vercel env add LEADCRAFT_CHECKOUT_WEBHOOK_URL production --value "YOUR_APPS_SCRIPT_WEB_APP_URL" --yes
npx vercel env add LEADCRAFT_AUTOMATION_SECRET production --value "YOUR_SHARED_SECRET" --yes
npx vercel env add LEADCRAFT_ENABLE_CHECKOUT production --value "false" --yes
npx vercel env add LEADCRAFT_CHECKOUT_GO_LIVE_DATE production --value "2026-04-27T00:00:00-04:00" --yes
npx vercel env add LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL production --value "true" --yes
```

### Redeploy from CLI

```bash
cd '/Users/ethanmiller/business/miller sites'
npx vercel --prod
```

Then verify:

```bash
cd '/Users/ethanmiller/business/miller sites'
npm run security:check
```

The important thing is not the method. The important thing is that the deployed production env exactly matches the values in this file.
