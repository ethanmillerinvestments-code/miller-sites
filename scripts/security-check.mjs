import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const defaultSiteUrl = "https://miller-sites.vercel.app";
const defaultCalendlyUrl = "https://calendly.com/ethanmillerinvestments";
const defaultContactEmail = "leadcraftscale@gmail.com";
const defaultFromEmail = "Leadcraft Agency <onboarding@resend.dev>";
const defaultGoLiveDate = "2026-04-27T00:00:00-04:00";
const requestTimeoutMs = 8000;
const gtmIdPattern = /^GTM-[A-Z0-9]+$/i;
const ga4MeasurementIdPattern = /^G-[A-Z0-9]+$/i;
const numericIdPattern = /^\d+$/;
const requiredHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // `vercel env pull` may encode trailing newlines as `\n` inside quoted values.
    value = value
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t");

    process.env[key] = value;
  }
}

function loadProjectEnv() {
  const candidates = [
    ".env",
    ".env.production",
    ".env.local",
    ".env.production.local",
  ];

  candidates.forEach((fileName) => {
    loadEnvFile(path.join(projectRoot, fileName));
  });
}

loadProjectEnv();

function readEnv(name) {
  return (process.env[name] || "").trim();
}

function isValidUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidGtmId(value) {
  return gtmIdPattern.test(value);
}

function isValidGa4MeasurementId(value) {
  return ga4MeasurementIdPattern.test(value);
}

function isNumericId(value) {
  return numericIdPattern.test(value);
}

function parseBoolean(value) {
  return value.toLowerCase() === "true";
}

function parseBooleanDefaultTrue(value) {
  return value ? value.toLowerCase() !== "false" : true;
}

function addCheck(checks, key, level, summary) {
  checks.push({ key, level, summary });
}

function buildEnvChecks() {
  const checks = [];
  const explicitSiteUrl = readEnv("NEXT_PUBLIC_SITE_URL");
  const explicitCalendlyUrl = readEnv("NEXT_PUBLIC_CALENDLY_URL");
  const explicitGtmId = readEnv("NEXT_PUBLIC_GTM_ID");
  const explicitGa4MeasurementId = readEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID");
  const explicitFbPixelId = readEnv("NEXT_PUBLIC_FB_PIXEL_ID");
  const explicitHotjarId = readEnv("NEXT_PUBLIC_HOTJAR_ID");
  const explicitContactEmail = readEnv("CONTACT_EMAIL_TO");
  const explicitFromEmail = readEnv("CONTACT_FROM_EMAIL");
  const resendApiKey = readEnv("RESEND_API_KEY");
  const contactWebhookUrl = readEnv("LEADCRAFT_CONTACT_WEBHOOK_URL");
  const checkoutWebhookUrl = readEnv("LEADCRAFT_CHECKOUT_WEBHOOK_URL");
  const automationSecret = readEnv("LEADCRAFT_AUTOMATION_SECRET");
  const stripeSecretKey = readEnv("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = readEnv("SUPABASE_URL");
  const supabaseServiceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseLeadFormTable = readEnv("SUPABASE_LEAD_FORM_TABLE");
  const checkoutEnabled = parseBoolean(readEnv("LEADCRAFT_ENABLE_CHECKOUT"));
  const checkoutGoLiveDate = readEnv("LEADCRAFT_CHECKOUT_GO_LIVE_DATE");
  const requireProposalApproval = parseBooleanDefaultTrue(
    readEnv("LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL")
  );
  const contactWebhookReady =
    isValidUrl(contactWebhookUrl) && Boolean(automationSecret);
  const checkoutWebhookReady =
    isValidUrl(checkoutWebhookUrl) && Boolean(automationSecret);

  addCheck(
    checks,
    "NEXT_PUBLIC_SITE_URL",
    explicitSiteUrl ? (isValidUrl(explicitSiteUrl) ? "pass" : "fail") : "warn",
    explicitSiteUrl
      ? isValidUrl(explicitSiteUrl)
        ? "Configured with an explicit site URL."
        : "Configured but not a valid http(s) URL."
      : `Using code fallback (${defaultSiteUrl}).`
  );
  addCheck(
    checks,
    "NEXT_PUBLIC_CALENDLY_URL",
    explicitCalendlyUrl
      ? isValidUrl(explicitCalendlyUrl)
        ? "pass"
        : "fail"
      : "warn",
    explicitCalendlyUrl
      ? isValidUrl(explicitCalendlyUrl)
        ? "Configured with an explicit Calendly URL."
        : "Configured but not a valid http(s) URL."
      : `Using code fallback (${defaultCalendlyUrl}).`
  );
  addCheck(
    checks,
    "NEXT_PUBLIC_GTM_ID",
    explicitGtmId ? (isValidGtmId(explicitGtmId) ? "pass" : "fail") : "warn",
    explicitGtmId
      ? isValidGtmId(explicitGtmId)
        ? "Configured with a GTM container ID."
        : "Configured but not a valid GTM container ID."
      : "Missing. GTM-based analytics is disabled."
  );
  addCheck(
    checks,
    "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
    explicitGa4MeasurementId
      ? isValidGa4MeasurementId(explicitGa4MeasurementId)
        ? "pass"
        : "fail"
      : "warn",
    explicitGa4MeasurementId
      ? isValidGa4MeasurementId(explicitGa4MeasurementId)
        ? "Configured with a GA4 measurement ID."
        : "Configured but not a valid GA4 measurement ID."
      : "Missing. Direct GA4 fallback is disabled."
  );
  addCheck(
    checks,
    "NEXT_PUBLIC_FB_PIXEL_ID",
    explicitFbPixelId ? (isNumericId(explicitFbPixelId) ? "pass" : "fail") : "warn",
    explicitFbPixelId
      ? isNumericId(explicitFbPixelId)
        ? "Configured with a Meta Pixel ID."
        : "Configured but not a valid numeric Pixel ID."
      : "Missing. Meta Pixel is disabled."
  );
  addCheck(
    checks,
    "NEXT_PUBLIC_HOTJAR_ID",
    explicitHotjarId ? (isNumericId(explicitHotjarId) ? "pass" : "fail") : "warn",
    explicitHotjarId
      ? isNumericId(explicitHotjarId)
        ? "Configured with a Hotjar site ID."
        : "Configured but not a valid numeric Hotjar ID."
      : "Missing. Hotjar is disabled."
  );
  addCheck(
    checks,
    "CONTACT_EMAIL_TO",
    explicitContactEmail
      ? isValidEmail(explicitContactEmail)
        ? "pass"
        : "fail"
      : "warn",
    explicitContactEmail
      ? isValidEmail(explicitContactEmail)
        ? "Configured with an explicit inbox target."
        : "Configured but not a valid email address."
      : `Using code fallback (${defaultContactEmail}).`
  );
  addCheck(
    checks,
    "CONTACT_FROM_EMAIL",
    explicitFromEmail ? "pass" : "warn",
    explicitFromEmail
      ? "Configured with an explicit sender identity."
      : `Using code fallback (${defaultFromEmail}).`
  );
  addCheck(
    checks,
    "RESEND_API_KEY",
    resendApiKey ? "pass" : "warn",
    resendApiKey
      ? "Configured. Inbox backup delivery is available."
      : "Missing. CRM delivery can still run, but inbox backup is unavailable."
  );

  addCheck(
    checks,
    "LEADCRAFT_CONTACT_WEBHOOK_URL",
    contactWebhookUrl
      ? isValidUrl(contactWebhookUrl) && automationSecret
        ? "pass"
        : "fail"
      : "warn",
    contactWebhookUrl
      ? isValidUrl(contactWebhookUrl)
        ? automationSecret
          ? "Configured with signing secret coverage."
          : "Configured without LEADCRAFT_AUTOMATION_SECRET."
        : "Configured but not a valid http(s) URL."
      : "Missing. Contact submissions cannot go live without CRM delivery."
  );
  addCheck(
    checks,
    "LEADCRAFT_CHECKOUT_WEBHOOK_URL",
    checkoutWebhookUrl
      ? isValidUrl(checkoutWebhookUrl) && automationSecret
        ? "pass"
        : "fail"
      : "warn",
    checkoutWebhookUrl
      ? isValidUrl(checkoutWebhookUrl)
        ? automationSecret
          ? "Configured with signing secret coverage."
          : "Configured without LEADCRAFT_AUTOMATION_SECRET."
        : "Configured but not a valid http(s) URL."
      : "Missing. Checkout intake cannot go live without CRM delivery."
  );
  addCheck(
    checks,
    "LEADCRAFT_AUTOMATION_SECRET",
    contactWebhookUrl || checkoutWebhookUrl
      ? automationSecret
        ? "pass"
        : "fail"
      : "warn",
    contactWebhookUrl || checkoutWebhookUrl
      ? automationSecret
        ? "Configured for webhook signing."
        : "Missing. Signed webhook delivery cannot run securely."
      : automationSecret
        ? "Configured, but no webhook URLs are enabled."
        : "Missing. No webhook signing secret is configured."
  );
  addCheck(
    checks,
    "CONTACT_DELIVERY_READY",
    contactWebhookReady ? "pass" : "fail",
    contactWebhookReady
      ? resendApiKey
        ? "Contact has CRM primary delivery and inbox backup."
        : "Contact has canonical CRM delivery. Inbox backup is missing."
      : "Contact cannot go live until the signed CRM webhook path is configured."
  );
  addCheck(
    checks,
    "CHECKOUT_INTAKE_DELIVERY_READY",
    checkoutWebhookReady ? "pass" : "fail",
    checkoutWebhookReady
      ? resendApiKey
        ? "Checkout intake has CRM primary delivery and inbox backup."
        : "Checkout intake has canonical CRM delivery. Inbox backup is missing."
        : "Checkout intake cannot go live until the signed CRM webhook path is configured."
  );
  addCheck(
    checks,
    "SUPABASE_URL",
    supabaseUrl ? (isValidUrl(supabaseUrl) ? "pass" : "fail") : "warn",
    supabaseUrl
      ? isValidUrl(supabaseUrl)
        ? "Configured for durable submission backups."
        : "Configured but not a valid http(s) URL."
      : "Missing. Durable submission backups are disabled."
  );
  addCheck(
    checks,
    "SUPABASE_SERVICE_ROLE_KEY",
    supabaseServiceRoleKey ? "pass" : "warn",
    supabaseServiceRoleKey
      ? "Configured for server-side submission backup writes."
      : "Missing. Durable submission backups are disabled."
  );
  addCheck(
    checks,
    "SUPABASE_LEAD_FORM_TABLE",
    "pass",
    supabaseLeadFormTable
      ? "Configured with an explicit lead backup table."
      : "Using code fallback (lead_form_submissions)."
  );
  addCheck(
    checks,
    "LEADCRAFT_ENABLE_CHECKOUT",
    "pass",
    checkoutEnabled
      ? requireProposalApproval
        ? "Checkout route is enabled, but the proposal-approval guard keeps intake in manual review."
        : "Checkout is enabled."
      : "Checkout is disabled. Manual review remains active."
  );
  addCheck(
    checks,
    "LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL",
    requireProposalApproval ? "pass" : "warn",
    requireProposalApproval
      ? "Written scope approval is required before any direct checkout redirect."
      : "Proposal approval guard is disabled. Use this only when direct checkout is intentionally allowed."
  );
  addCheck(
    checks,
    "STRIPE_SECRET_KEY",
    checkoutEnabled ? (stripeSecretKey ? "pass" : "fail") : stripeSecretKey ? "warn" : "pass",
    checkoutEnabled
      ? stripeSecretKey
        ? requireProposalApproval
          ? "Configured, but the proposal-approval guard still keeps intake manual-review."
          : "Configured for live checkout session creation."
        : "Missing while checkout is enabled."
      : stripeSecretKey
        ? requireProposalApproval
          ? "Configured, but checkout is disabled and proposal approval still keeps intake manual-review."
          : "Configured, but checkout is disabled."
        : "Not configured, which is expected while checkout is disabled."
  );
  addCheck(
    checks,
    "STRIPE_WEBHOOK_SECRET",
    checkoutEnabled
      ? stripeWebhookSecret
        ? "pass"
        : "fail"
      : stripeSecretKey
        ? stripeWebhookSecret
          ? "pass"
          : "warn"
        : "pass",
    checkoutEnabled
      ? stripeWebhookSecret
        ? requireProposalApproval
          ? "Configured for verified Stripe processing, but direct checkout stays blocked by the proposal-approval guard."
          : "Configured for verified Stripe webhook processing."
        : "Missing while checkout is enabled."
      : stripeSecretKey
        ? stripeWebhookSecret
          ? "Configured for verified Stripe webhook processing."
          : "Missing. Add this before exposing live checkout."
        : "Not configured, which is expected while checkout is disabled."
  );
  addCheck(
    checks,
    "LEADCRAFT_CHECKOUT_GO_LIVE_DATE",
    checkoutGoLiveDate
      ? Number.isNaN(Date.parse(checkoutGoLiveDate))
        ? "fail"
        : "pass"
      : "warn",
    checkoutGoLiveDate
      ? Number.isNaN(Date.parse(checkoutGoLiveDate))
        ? "Configured but not a valid ISO date."
        : "Configured with an explicit go-live date."
      : `Using code fallback (${defaultGoLiveDate}).`
  );

  return checks;
}

function getResolvedSiteUrl() {
  const overrideUrl = readEnv("SECURITY_CHECK_URL");

  if (overrideUrl) {
    return overrideUrl;
  }

  return readEnv("NEXT_PUBLIC_SITE_URL") || defaultSiteUrl;
}

function runNpmAudit() {
  try {
    const output = execFileSync("npm", ["audit", "--omit=dev", "--json"], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    const parsed = JSON.parse(output);
    return parsed.metadata?.vulnerabilities?.total || 0;
  } catch (error) {
    const stdout = error.stdout || error.stderr;

    if (!stdout) {
      throw error;
    }

    const parsed = JSON.parse(String(stdout));
    return parsed.metadata?.vulnerabilities?.total || 0;
  }
}

async function fetchWithTimeout(url, init = {}) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(requestTimeoutMs),
  });
}

async function checkLiveHeaders(siteUrl) {
  const response = await fetchWithTimeout(siteUrl, { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Live site check failed with status ${response.status}.`);
  }

  const missingHeaders = requiredHeaders.filter(
    (headerName) => !response.headers.get(headerName)
  );

  if (missingHeaders.length > 0) {
    throw new Error(
      `Live site is missing required headers: ${missingHeaders.join(", ")}.`
    );
  }
}

async function assertApiBehavior(siteUrl, path, allowedBody) {
  const crossOriginResponse = await fetchWithTimeout(`${siteUrl}${path}`, {
    method: "POST",
    headers: {
      origin: "https://example.com",
      referer: "https://example.com/",
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (crossOriginResponse.status !== 403) {
    throw new Error(`${path} should reject cross-site requests with 403.`);
  }

  const sameOriginResponse = await fetchWithTimeout(`${siteUrl}${path}`, {
    method: "POST",
    headers: {
      origin: siteUrl,
      referer: `${siteUrl}/`,
      "content-type": "application/json",
    },
    body: JSON.stringify(allowedBody),
  });

  if (sameOriginResponse.status !== 400) {
    throw new Error(`${path} should reject invalid same-origin payloads with 400.`);
  }
}

function checkWebhookHealth(label, webhookUrl) {
  let body = "";

  try {
    body = execFileSync("curl", ["-sSL", webhookUrl], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw new Error(
      `${label} health check failed: ${String(error.stderr || error.message || error).trim()}`
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error(
      `${label} did not return JSON health output. The configured webhook target does not look like a public Apps Script web app.`
    );
  }

  if (!parsed || parsed.ok !== true || parsed.webhook !== "online") {
    throw new Error(`${label} did not confirm ok: true and webhook: "online".`);
  }
}

function formatCheck({ key, level, summary }) {
  return `${level.toUpperCase()}  ${key}: ${summary}`;
}

function printRemediationHints(failures) {
  const joined = failures.join("\n");
  const needsContactDelivery =
    joined.includes("CONTACT_DELIVERY_READY") ||
    joined.includes("LEADCRAFT_CONTACT_WEBHOOK_URL");
  const needsCheckoutDelivery =
    joined.includes("CHECKOUT_INTAKE_DELIVERY_READY") ||
    joined.includes("LEADCRAFT_CHECKOUT_WEBHOOK_URL");
  const needsSigningSecret = joined.includes("LEADCRAFT_AUTOMATION_SECRET");

  if (!(needsContactDelivery || needsCheckoutDelivery || needsSigningSecret)) {
    return;
  }

  console.log("");
  console.log("Recommended next steps");
  console.log(
    "- Set signed webhook delivery in production with LEADCRAFT_CONTACT_WEBHOOK_URL, LEADCRAFT_CHECKOUT_WEBHOOK_URL, and LEADCRAFT_AUTOMATION_SECRET."
  );
  console.log(
    "- Set Resend backup with RESEND_API_KEY, CONTACT_EMAIL_TO, and CONTACT_FROM_EMAIL."
  );
  console.log(
    "- Redeploy the site, then rerun npm run security:check."
  );
  console.log(
    "- Use /Users/ethanmiller/business/miller sites/PRODUCTION_INTAKE_GO_LIVE_CHECKLIST.md as the source of truth."
  );
}

async function main() {
  const envChecks = buildEnvChecks();
  const siteUrl = getResolvedSiteUrl();
  const failures = [];
  const warnings = envChecks.filter((check) => check.level === "warn");
  const hardFailures = envChecks.filter((check) => check.level === "fail");

  console.log("Security configuration checks");
  envChecks.forEach((check) => console.log(formatCheck(check)));
  console.log("");

  if (!isValidUrl(siteUrl)) {
    failures.push(`SECURITY_CHECK_URL or NEXT_PUBLIC_SITE_URL is not a valid http(s) URL: ${siteUrl}`);
  }

  const vulnerabilityTotal = runNpmAudit();
  console.log(
    vulnerabilityTotal === 0
      ? "PASS  npm audit: No production dependency vulnerabilities found."
      : `FAIL  npm audit: Found ${vulnerabilityTotal} production vulnerabilities.`
  );
  console.log("");

  if (vulnerabilityTotal > 0) {
    failures.push(`npm audit reported ${vulnerabilityTotal} production vulnerabilities.`);
  }

  if (hardFailures.length > 0) {
    failures.push(...hardFailures.map((check) => `${check.key}: ${check.summary}`));
  }

  if (failures.length === 0) {
    const contactWebhookUrl = readEnv("LEADCRAFT_CONTACT_WEBHOOK_URL");
    const checkoutWebhookUrl = readEnv("LEADCRAFT_CHECKOUT_WEBHOOK_URL");

    if (isValidUrl(contactWebhookUrl)) {
      checkWebhookHealth("CONTACT_WEBHOOK_HEALTH", contactWebhookUrl);
      console.log("PASS  Contact webhook health: configured receiver responded with the expected CRM health JSON.");
    }

    if (isValidUrl(checkoutWebhookUrl) && checkoutWebhookUrl !== contactWebhookUrl) {
      checkWebhookHealth("CHECKOUT_WEBHOOK_HEALTH", checkoutWebhookUrl);
      console.log("PASS  Checkout webhook health: configured receiver responded with the expected CRM health JSON.");
    }

    await checkLiveHeaders(siteUrl);
    console.log(`PASS  Live headers: ${siteUrl} exposes the required security headers.`);

    await assertApiBehavior(siteUrl, "/api/contact", { startedAt: 0 });
    console.log("PASS  API probe: /api/contact blocks cross-site requests and rejects invalid same-origin payloads.");

    await assertApiBehavior(siteUrl, "/api/stripe/checkout", { startedAt: 0 });
    console.log("PASS  API probe: /api/stripe/checkout blocks cross-site requests and rejects invalid same-origin payloads.");
  }

  if (warnings.length > 0) {
    console.log("");
    console.log("Warnings");
    warnings.forEach((check) => console.log(formatCheck(check)));
  }

  if (failures.length > 0) {
    console.log("");
    console.error("Security check failed");
    failures.forEach((failure) => console.error(`- ${failure}`));
    printRemediationHints(failures);
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log("Security check passed");
}

main().catch((error) => {
  console.error("Security check failed");
  console.error(`- ${error.message}`);
  process.exitCode = 1;
});
