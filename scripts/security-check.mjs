import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const defaultSiteUrl = "https://miller-sites.vercel.app";
const defaultCalendlyUrl = "https://calendly.com/ethanmillerinvestments";
const defaultContactEmail = "ethanmillerinvestments@gmail.com";
const defaultFromEmail = "Leadcraft Agency <onboarding@resend.dev>";
const defaultGoLiveDate = "2026-04-27T00:00:00-04:00";
const requestTimeoutMs = 8000;
const requiredHeaders = [
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

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
  const explicitContactEmail = readEnv("CONTACT_EMAIL_TO");
  const explicitFromEmail = readEnv("CONTACT_FROM_EMAIL");
  const resendApiKey = readEnv("RESEND_API_KEY");
  const contactWebhookUrl = readEnv("LEADCRAFT_CONTACT_WEBHOOK_URL");
  const checkoutWebhookUrl = readEnv("LEADCRAFT_CHECKOUT_WEBHOOK_URL");
  const automationSecret = readEnv("LEADCRAFT_AUTOMATION_SECRET");
  const stripeSecretKey = readEnv("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  const checkoutEnabled = parseBoolean(readEnv("LEADCRAFT_ENABLE_CHECKOUT"));
  const checkoutGoLiveDate = readEnv("LEADCRAFT_CHECKOUT_GO_LIVE_DATE");
  const requireProposalApproval = parseBooleanDefaultTrue(
    readEnv("LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL")
  );

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
      : "Missing. CRM webhook can still receive submissions, but email backup is unavailable."
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
      : "Missing. Contact submissions rely on inbox delivery only."
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
      : "Missing. Checkout intake relies on inbox delivery only."
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
    contactWebhookUrl || resendApiKey ? "pass" : "fail",
    contactWebhookUrl || resendApiKey
      ? contactWebhookUrl && resendApiKey
        ? "Contact has CRM primary delivery and inbox backup."
        : contactWebhookUrl
          ? "Contact has CRM delivery only. Inbox backup is missing."
          : "Contact has inbox delivery only. CRM primary delivery is missing."
      : "Contact has no live delivery path. Configure webhook or Resend before production use."
  );
  addCheck(
    checks,
    "CHECKOUT_INTAKE_DELIVERY_READY",
    checkoutWebhookUrl || resendApiKey ? "pass" : "fail",
    checkoutWebhookUrl || resendApiKey
      ? checkoutWebhookUrl && resendApiKey
        ? "Checkout intake has CRM primary delivery and inbox backup."
        : checkoutWebhookUrl
          ? "Checkout intake has CRM delivery only. Inbox backup is missing."
          : "Checkout intake has inbox delivery only. CRM primary delivery is missing."
      : "Checkout intake has no live delivery path. Configure webhook or Resend before production use."
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

function formatCheck({ key, level, summary }) {
  return `${level.toUpperCase()}  ${key}: ${summary}`;
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
