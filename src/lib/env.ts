import "server-only";

type SecurityConfigLevel = "pass" | "warn" | "fail";

export type SecurityConfigCheck = {
  key: string;
  level: SecurityConfigLevel;
  summary: string;
};

type RouteConfig = {
  toEmail: string;
  fromEmail: string;
  resendApiKey: string;
  webhookUrl: string;
  automationSecret: string;
};

type DeliveryReadiness = {
  hasWebhook: boolean;
  hasEmail: boolean;
};

const DEFAULT_SITE_URL = "https://miller-sites.vercel.app";
const DEFAULT_CALENDLY_URL = "https://calendly.com/ethanmillerinvestments";
const DEFAULT_CONTACT_EMAIL = "leadcraftscale@gmail.com";
const DEFAULT_FROM_EMAIL = "Leadcraft Agency <onboarding@resend.dev>";
const DEFAULT_CHECKOUT_GO_LIVE_DATE = "2026-04-27T00:00:00-04:00";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i;
const GA4_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;
const NUMERIC_ID_PATTERN = /^\d+$/;

function readEnv(name: string) {
  return (process.env[name] || "").trim();
}

function isValidUrl(value: string) {
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

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

function isValidGtmId(value: string) {
  return GTM_ID_PATTERN.test(value);
}

function isValidGa4MeasurementId(value: string) {
  return GA4_MEASUREMENT_ID_PATTERN.test(value);
}

function isNumericId(value: string) {
  return NUMERIC_ID_PATTERN.test(value);
}

function parseBoolean(value: string) {
  return value.toLowerCase() === "true";
}

function parseBooleanDefaultTrue(value: string) {
  return value ? value.toLowerCase() !== "false" : true;
}

function getValidatedUrl(name: string) {
  const value = readEnv(name);
  return isValidUrl(value) ? value : "";
}

function getValidatedEmail(name: string) {
  const value = readEnv(name);
  return isValidEmail(value) ? value : "";
}

function getBaseRouteConfig(webhookEnvKey: string): RouteConfig {
  return {
    toEmail: getValidatedEmail("CONTACT_EMAIL_TO") || DEFAULT_CONTACT_EMAIL,
    fromEmail: readEnv("CONTACT_FROM_EMAIL") || DEFAULT_FROM_EMAIL,
    resendApiKey: readEnv("RESEND_API_KEY"),
    webhookUrl: getValidatedUrl(webhookEnvKey),
    automationSecret: readEnv("LEADCRAFT_AUTOMATION_SECRET"),
  };
}

export function getSiteUrl() {
  return getValidatedUrl("NEXT_PUBLIC_SITE_URL") || DEFAULT_SITE_URL;
}

export function getCalendlyUrl() {
  return getValidatedUrl("NEXT_PUBLIC_CALENDLY_URL") || DEFAULT_CALENDLY_URL;
}

export function getContactRouteConfig() {
  return getBaseRouteConfig("LEADCRAFT_CONTACT_WEBHOOK_URL");
}

export function getCheckoutRouteConfig() {
  const base = getBaseRouteConfig("LEADCRAFT_CHECKOUT_WEBHOOK_URL");
  const goLiveDate = readEnv("LEADCRAFT_CHECKOUT_GO_LIVE_DATE");

  return {
    ...base,
    siteUrl: getSiteUrl(),
    stripeSecretKey: readEnv("STRIPE_SECRET_KEY"),
    stripeWebhookSecret: readEnv("STRIPE_WEBHOOK_SECRET"),
    checkoutEnabled: parseBoolean(readEnv("LEADCRAFT_ENABLE_CHECKOUT")),
    checkoutGoLiveDate: goLiveDate || DEFAULT_CHECKOUT_GO_LIVE_DATE,
    requireProposalApproval: parseBooleanDefaultTrue(
      readEnv("LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL")
    ),
  };
}

export function getAutomationSigningConfig() {
  return {
    automationSecret: readEnv("LEADCRAFT_AUTOMATION_SECRET"),
  };
}

export function getSubmissionBackupConfig() {
  return {
    url: getValidatedUrl("SUPABASE_URL"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
    tableName: readEnv("SUPABASE_LEAD_FORM_TABLE") || "lead_form_submissions",
  };
}

export function getRouteDeliveryReadiness(config: RouteConfig): DeliveryReadiness {
  return {
    hasWebhook: Boolean(config.webhookUrl && config.automationSecret),
    hasEmail: Boolean(config.resendApiKey),
  };
}

export function getSecurityConfigChecks(): SecurityConfigCheck[] {
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
  const checks: SecurityConfigCheck[] = [];

  checks.push(
    explicitSiteUrl
      ? {
          key: "NEXT_PUBLIC_SITE_URL",
          level: isValidUrl(explicitSiteUrl) ? "pass" : "fail",
          summary: isValidUrl(explicitSiteUrl)
            ? "Configured with an explicit site URL."
            : "Configured but not a valid http(s) URL.",
        }
      : {
          key: "NEXT_PUBLIC_SITE_URL",
          level: "warn",
          summary: `Using code fallback (${DEFAULT_SITE_URL}).`,
        }
  );

  checks.push(
    explicitCalendlyUrl
      ? {
          key: "NEXT_PUBLIC_CALENDLY_URL",
          level: isValidUrl(explicitCalendlyUrl) ? "pass" : "fail",
          summary: isValidUrl(explicitCalendlyUrl)
            ? "Configured with an explicit Calendly URL."
            : "Configured but not a valid http(s) URL.",
        }
      : {
          key: "NEXT_PUBLIC_CALENDLY_URL",
          level: "warn",
          summary: `Using code fallback (${DEFAULT_CALENDLY_URL}).`,
        }
  );

  checks.push(
    explicitGtmId
      ? {
          key: "NEXT_PUBLIC_GTM_ID",
          level: isValidGtmId(explicitGtmId) ? "pass" : "fail",
          summary: isValidGtmId(explicitGtmId)
            ? "Configured with a GTM container ID."
            : "Configured but not a valid GTM container ID.",
        }
      : {
          key: "NEXT_PUBLIC_GTM_ID",
          level: "warn",
          summary: "Missing. GTM-based analytics is disabled.",
        }
  );

  checks.push(
    explicitGa4MeasurementId
      ? {
          key: "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
          level: isValidGa4MeasurementId(explicitGa4MeasurementId)
            ? "pass"
            : "fail",
          summary: isValidGa4MeasurementId(explicitGa4MeasurementId)
            ? "Configured with a GA4 measurement ID."
            : "Configured but not a valid GA4 measurement ID.",
        }
      : {
          key: "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
          level: "warn",
          summary: "Missing. Direct GA4 fallback is disabled.",
      }
  );

  checks.push(
    explicitFbPixelId
      ? {
          key: "NEXT_PUBLIC_FB_PIXEL_ID",
          level: isNumericId(explicitFbPixelId) ? "pass" : "fail",
          summary: isNumericId(explicitFbPixelId)
            ? "Configured with a Meta Pixel ID."
            : "Configured but not a valid numeric Pixel ID.",
        }
      : {
          key: "NEXT_PUBLIC_FB_PIXEL_ID",
          level: "warn",
          summary: "Missing. Meta Pixel is disabled.",
        }
  );

  checks.push(
    explicitHotjarId
      ? {
          key: "NEXT_PUBLIC_HOTJAR_ID",
          level: isNumericId(explicitHotjarId) ? "pass" : "fail",
          summary: isNumericId(explicitHotjarId)
            ? "Configured with a Hotjar site ID."
            : "Configured but not a valid numeric Hotjar ID.",
        }
      : {
          key: "NEXT_PUBLIC_HOTJAR_ID",
          level: "warn",
          summary: "Missing. Hotjar is disabled.",
        }
  );

  checks.push(
    explicitContactEmail
      ? {
          key: "CONTACT_EMAIL_TO",
          level: isValidEmail(explicitContactEmail) ? "pass" : "fail",
          summary: isValidEmail(explicitContactEmail)
            ? "Configured with an explicit inbox target."
            : "Configured but not a valid email address.",
        }
      : {
          key: "CONTACT_EMAIL_TO",
          level: "warn",
          summary: `Using code fallback (${DEFAULT_CONTACT_EMAIL}).`,
        }
  );

  checks.push(
    explicitFromEmail
      ? {
          key: "CONTACT_FROM_EMAIL",
          level: "pass",
          summary: "Configured with an explicit sender identity.",
        }
      : {
          key: "CONTACT_FROM_EMAIL",
          level: "warn",
          summary: `Using code fallback (${DEFAULT_FROM_EMAIL}).`,
        }
  );

  checks.push({
    key: "RESEND_API_KEY",
    level: resendApiKey ? "pass" : "warn",
    summary: resendApiKey
      ? "Configured. Inbox backup delivery is available."
      : "Missing. CRM delivery can still run, but inbox backup is unavailable.",
  });

  checks.push(
    contactWebhookUrl
      ? {
          key: "LEADCRAFT_CONTACT_WEBHOOK_URL",
          level:
            !isValidUrl(contactWebhookUrl) || !automationSecret ? "fail" : "pass",
          summary: !isValidUrl(contactWebhookUrl)
            ? "Configured but not a valid http(s) URL."
            : automationSecret
              ? "Configured with signing secret coverage."
              : "Configured without LEADCRAFT_AUTOMATION_SECRET.",
        }
      : {
          key: "LEADCRAFT_CONTACT_WEBHOOK_URL",
          level: "warn",
          summary: "Missing. Contact submissions cannot go live without CRM delivery.",
        }
  );

  checks.push(
    checkoutWebhookUrl
      ? {
          key: "LEADCRAFT_CHECKOUT_WEBHOOK_URL",
          level:
            !isValidUrl(checkoutWebhookUrl) || !automationSecret ? "fail" : "pass",
          summary: !isValidUrl(checkoutWebhookUrl)
            ? "Configured but not a valid http(s) URL."
            : automationSecret
              ? "Configured with signing secret coverage."
              : "Configured without LEADCRAFT_AUTOMATION_SECRET.",
        }
      : {
          key: "LEADCRAFT_CHECKOUT_WEBHOOK_URL",
          level: "warn",
          summary: "Missing. Checkout intake cannot go live without CRM delivery.",
        }
  );

  if (!contactWebhookUrl && !checkoutWebhookUrl) {
    checks.push({
      key: "LEADCRAFT_AUTOMATION_SECRET",
      level: "warn",
      summary: automationSecret
        ? "Configured, but no webhook URLs are enabled."
        : "Missing. No webhook signing secret is configured.",
    });
  } else {
    checks.push({
      key: "LEADCRAFT_AUTOMATION_SECRET",
      level: automationSecret ? "pass" : "fail",
      summary: automationSecret
        ? "Configured for webhook signing."
        : "Missing. Signed webhook delivery cannot run securely.",
    });
  }

  checks.push({
    key: "CONTACT_DELIVERY_READY",
    level: contactWebhookReady ? "pass" : "fail",
    summary:
      contactWebhookReady
        ? resendApiKey
          ? "Contact has CRM primary delivery and inbox backup."
          : "Contact has canonical CRM delivery. Inbox backup is missing."
        : "Contact cannot go live until the signed CRM webhook path is configured.",
  });

  checks.push({
    key: "CHECKOUT_INTAKE_DELIVERY_READY",
    level: checkoutWebhookReady ? "pass" : "fail",
    summary:
      checkoutWebhookReady
        ? resendApiKey
          ? "Checkout intake has CRM primary delivery and inbox backup."
          : "Checkout intake has canonical CRM delivery. Inbox backup is missing."
        : "Checkout intake cannot go live until the signed CRM webhook path is configured.",
  });

  checks.push({
    key: "SUPABASE_URL",
    level: supabaseUrl ? (isValidUrl(supabaseUrl) ? "pass" : "fail") : "warn",
    summary: supabaseUrl
      ? isValidUrl(supabaseUrl)
        ? "Configured for durable submission backups."
        : "Configured but not a valid http(s) URL."
      : "Missing. Durable submission backups are disabled.",
  });

  checks.push({
    key: "SUPABASE_SERVICE_ROLE_KEY",
    level: supabaseServiceRoleKey ? "pass" : "warn",
    summary: supabaseServiceRoleKey
      ? "Configured for server-side submission backup writes."
      : "Missing. Durable submission backups are disabled.",
  });

  checks.push({
    key: "SUPABASE_LEAD_FORM_TABLE",
    level: "pass",
    summary: supabaseLeadFormTable
      ? "Configured with an explicit lead backup table."
      : "Using code fallback (lead_form_submissions).",
  });

  checks.push({
    key: "LEADCRAFT_ENABLE_CHECKOUT",
    level: "pass",
    summary: checkoutEnabled
      ? requireProposalApproval
        ? "Checkout route is enabled, but the proposal-approval guard keeps intake in manual review."
        : "Checkout is enabled for direct payment sessions."
      : "Checkout is disabled. Manual review remains active.",
  });

  checks.push({
    key: "LEADCRAFT_REQUIRE_PROPOSAL_APPROVAL",
    level: requireProposalApproval ? "pass" : "warn",
    summary: requireProposalApproval
      ? "Written scope approval is required before any direct checkout redirect."
      : "Proposal approval guard is disabled. Use this only when direct checkout is intentionally allowed.",
  });

  if (checkoutEnabled) {
    checks.push({
      key: "STRIPE_SECRET_KEY",
      level: stripeSecretKey ? "pass" : "fail",
      summary: stripeSecretKey
        ? requireProposalApproval
          ? "Configured, but the proposal-approval guard still keeps intake manual-review."
          : "Configured for live checkout session creation."
        : "Missing while checkout is enabled.",
    });
    checks.push({
      key: "STRIPE_WEBHOOK_SECRET",
      level: stripeWebhookSecret ? "pass" : "fail",
      summary: stripeWebhookSecret
        ? requireProposalApproval
          ? "Configured for verified Stripe processing, but direct checkout stays blocked by the proposal-approval guard."
          : "Configured for verified Stripe webhook processing."
        : "Missing while checkout is enabled.",
    });
    checks.push({
      key: "LEADCRAFT_CHECKOUT_GO_LIVE_DATE",
      level:
        checkoutGoLiveDate && Number.isNaN(Date.parse(checkoutGoLiveDate))
          ? "fail"
          : checkoutGoLiveDate
            ? "pass"
            : "warn",
      summary:
        checkoutGoLiveDate && Number.isNaN(Date.parse(checkoutGoLiveDate))
          ? "Configured but not a valid ISO date."
          : checkoutGoLiveDate
            ? "Configured with an explicit go-live date."
            : `Using code fallback (${DEFAULT_CHECKOUT_GO_LIVE_DATE}).`,
    });
  } else {
    checks.push({
      key: "STRIPE_SECRET_KEY",
      level: stripeSecretKey ? "warn" : "pass",
      summary: stripeSecretKey
        ? requireProposalApproval
          ? "Configured, but checkout is disabled and proposal approval still keeps intake manual-review."
          : "Configured, but checkout is disabled."
        : "Not configured, which is expected while checkout is disabled.",
    });
    checks.push({
      key: "STRIPE_WEBHOOK_SECRET",
      level: stripeSecretKey
        ? stripeWebhookSecret
          ? "pass"
          : "warn"
        : "pass",
      summary: stripeSecretKey
        ? stripeWebhookSecret
          ? "Configured for verified Stripe webhook processing."
          : "Missing. Add this before exposing live checkout."
        : "Not configured, which is expected while checkout is disabled.",
    });
    checks.push({
      key: "LEADCRAFT_CHECKOUT_GO_LIVE_DATE",
      level:
        checkoutGoLiveDate && Number.isNaN(Date.parse(checkoutGoLiveDate))
          ? "fail"
          : checkoutGoLiveDate
            ? "pass"
            : "warn",
      summary:
        checkoutGoLiveDate && Number.isNaN(Date.parse(checkoutGoLiveDate))
          ? "Configured but not a valid ISO date."
          : checkoutGoLiveDate
            ? "Configured for future checkout activation."
            : `Using code fallback (${DEFAULT_CHECKOUT_GO_LIVE_DATE}).`,
    });
  }

  return checks;
}
