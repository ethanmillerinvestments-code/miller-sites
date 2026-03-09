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

const DEFAULT_SITE_URL = "https://miller-sites.vercel.app";
const DEFAULT_CALENDLY_URL = "https://calendly.com/ethanmillerinvestments";
const DEFAULT_CONTACT_EMAIL = "ethanmillerinvestments@gmail.com";
const DEFAULT_FROM_EMAIL = "Leadcraft Agency <onboarding@resend.dev>";
const DEFAULT_CHECKOUT_GO_LIVE_DATE = "2026-04-27T00:00:00-04:00";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function parseBoolean(value: string) {
  return value.toLowerCase() === "true";
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
    checkoutEnabled: parseBoolean(readEnv("LEADCRAFT_ENABLE_CHECKOUT")),
    checkoutGoLiveDate: goLiveDate || DEFAULT_CHECKOUT_GO_LIVE_DATE,
  };
}

export function getAutomationSigningConfig() {
  return {
    automationSecret: readEnv("LEADCRAFT_AUTOMATION_SECRET"),
  };
}

export function getSecurityConfigChecks(): SecurityConfigCheck[] {
  const explicitSiteUrl = readEnv("NEXT_PUBLIC_SITE_URL");
  const explicitCalendlyUrl = readEnv("NEXT_PUBLIC_CALENDLY_URL");
  const explicitContactEmail = readEnv("CONTACT_EMAIL_TO");
  const explicitFromEmail = readEnv("CONTACT_FROM_EMAIL");
  const resendApiKey = readEnv("RESEND_API_KEY");
  const contactWebhookUrl = readEnv("LEADCRAFT_CONTACT_WEBHOOK_URL");
  const checkoutWebhookUrl = readEnv("LEADCRAFT_CHECKOUT_WEBHOOK_URL");
  const automationSecret = readEnv("LEADCRAFT_AUTOMATION_SECRET");
  const stripeSecretKey = readEnv("STRIPE_SECRET_KEY");
  const checkoutEnabled = parseBoolean(readEnv("LEADCRAFT_ENABLE_CHECKOUT"));
  const checkoutGoLiveDate = readEnv("LEADCRAFT_CHECKOUT_GO_LIVE_DATE");
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
      ? "Configured. Contact and checkout emails can send normally."
      : "Missing. Contact falls back to mailto and checkout falls back to manual review.",
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
          summary: "Missing. Contact webhook fan-out is disabled.",
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
          summary: "Missing. Checkout webhook fan-out is disabled.",
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
    key: "LEADCRAFT_ENABLE_CHECKOUT",
    level: "pass",
    summary: checkoutEnabled
      ? "Checkout is enabled."
      : "Checkout is disabled. Manual review remains active.",
  });

  if (checkoutEnabled) {
    checks.push({
      key: "STRIPE_SECRET_KEY",
      level: stripeSecretKey ? "pass" : "fail",
      summary: stripeSecretKey
        ? "Configured for live checkout session creation."
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
        ? "Configured, but checkout is disabled."
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
