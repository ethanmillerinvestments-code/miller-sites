# Production Intake Go-Live Checklist

Date anchor:
- Current target launch window: before outreach begins on or after April 27, 2026

This checklist clears the final blocker reported by `npm run security:check`.

Exact copy-paste values live in:
- [PRODUCTION_SETUP_SNIPPETS.md](/Users/ethanmiller/business/miller sites/PRODUCTION_SETUP_SNIPPETS.md)

## Goal

Make both of these live:
- contact submissions
- checkout intake submissions

And make them pass through a real delivery path before outreach starts.

## Required Outcome

`npm run security:check` should stop failing on:
- `CONTACT_DELIVERY_READY`
- `CHECKOUT_INTAKE_DELIVERY_READY`

## Recommended Live Setup

Use both:
- primary delivery: signed webhook into the canonical CRM
- backup delivery: Resend inbox delivery

That gives:
- CRM write path
- inbox fallback
- the cleanest audit trail

Do not treat inbox-only delivery as launch ready.

## Exact Order

### 1. Prepare the CRM receiver

In the Google Apps Script project attached to the canonical CRM:

1. Save the latest `Code.gs`.
2. Run `setupSystem()` if the current spreadsheet has not been initialized with the canonical tab set.
3. Confirm these tabs exist:
   - `Leads_Master`
   - `Inbound_Requests`
   - `Config`
4. In `Config`, set:
   - `Inbound_Webhook_Secret`
   - recommended `Inbound_Default_Status` = `Qualify`

### 2. Deploy the Apps Script web app

1. Open `Deploy > New deployment`.
2. Choose `Web app`.
3. Execute as `Me`.
4. Access: choose the narrowest option that still allows site posts.
5. Copy the web app URL.

Use the same web app URL for:
- `LEADCRAFT_CONTACT_WEBHOOK_URL`
- `LEADCRAFT_CHECKOUT_WEBHOOK_URL`

### 3. Prepare the shared signing secret

Use one shared secret value.

It must match in both places:
- Apps Script `Config > Inbound_Webhook_Secret`
- Vercel env `LEADCRAFT_AUTOMATION_SECRET`

Do not deploy webhook URLs without the matching signing secret.

### 4. Set production env vars in Vercel

Set these for the production environment:

```bash
NEXT_PUBLIC_SITE_URL=https://miller-sites.vercel.app
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/ethanmillerinvestments
CONTACT_EMAIL_TO=leadcraftscale@gmail.com
CONTACT_FROM_EMAIL="Leadcraft Agency <onboarding@resend.dev>"
RESEND_API_KEY=re_xxxxxxxxxxxx
LEADCRAFT_CONTACT_WEBHOOK_URL=https://script.google.com/macros/s/your-web-app-id/exec
LEADCRAFT_CHECKOUT_WEBHOOK_URL=https://script.google.com/macros/s/your-web-app-id/exec
LEADCRAFT_AUTOMATION_SECRET=replace_with_shared_secret
LEADCRAFT_ENABLE_CHECKOUT=false
LEADCRAFT_CHECKOUT_GO_LIVE_DATE=2026-04-27T00:00:00-04:00
LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL=true
```

Stripe envs are not required yet if checkout stays manual-review only.

Do not enable direct checkout just to clear this checklist.

### 5. Redeploy the site

After the env vars are saved:

1. Trigger a production deploy in Vercel.
2. Wait for the deploy to finish.

### 6. Verify from the repo

Run:

```bash
cd '/Users/ethanmiller/business/miller sites'
npm run security:check
```

Expected result:
- `CONTACT_DELIVERY_READY` passes
- `CHECKOUT_INTAKE_DELIVERY_READY` passes

Warnings about explicit env fallbacks should also disappear once the public envs are set.

### 7. Verify the live receiver path

Do one manual live test for each flow:

1. Submit the contact form on production.
2. Confirm:
   - request accepted on site
   - event lands in `Inbound_Requests`
   - lead is created or updated in `Leads_Master`
   - `Next_Followup_Date` is populated for manual first review
   - `First_Ack_At` remains blank until an actual CRM review happens
3. Submit the checkout intake on production.
4. Confirm:
   - request accepted on site
   - event lands in `Inbound_Requests`
   - lead is created or updated in `Leads_Master`
   - intake remains manual-review only
   - `Next_Followup_Date` is populated for manual first review

### 8. Final pre-outreach check

Do not start outreach until all are true:

- contact route works
- checkout intake works
- CRM receives inbound events
- response standard is visible on site
- legal pages are live
- checkout still requires manual review
- proposal approval guard is still enabled

## If Security Check Still Fails

Use this order:

1. Confirm the env names are exact.
2. Confirm there is no trailing whitespace in copied URLs or secrets.
3. Confirm `LEADCRAFT_AUTOMATION_SECRET` exists when webhook URLs are set.
4. Confirm the Apps Script deployment URL is valid.
5. Re-run `npm run security:check`.
6. Do not rely on inbox-only delivery to force a pass. Fix the CRM webhook path first.
