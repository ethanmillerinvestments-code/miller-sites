import { createHmac, randomUUID } from "node:crypto";

import { getAutomationSigningConfig } from "@/lib/env";

const WEBHOOK_TIMEOUT_MS = 5000;
const WEBHOOK_MAX_ATTEMPTS = 3;
const WEBHOOK_SCHEMA_VERSION = "2026-03-08";
const WEBHOOK_SIGNATURE_VERSION = "hmac-sha256-v1";

export type AutomationWebhookResult = {
  attempted: boolean;
  delivered: boolean;
  attempts: number;
  status: number | null;
  target: string;
  reason:
    | "delivered"
    | "missing_webhook_url"
    | "missing_signing_secret"
    | "response_not_ok"
    | "network_error";
  error?: string;
};

function cleanWebhookUrl(value: string | undefined) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }
    return url.toString();
  } catch {
    return "";
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSignedEnvelope(payload: Record<string, unknown>, secret: string) {
  const eventId =
    typeof payload.eventId === "string" && payload.eventId
      ? payload.eventId
      : randomUUID();
  const signedAt = new Date().toISOString();
  const envelopeBase = {
    eventId,
    signedAt,
    schemaVersion: WEBHOOK_SCHEMA_VERSION,
    signatureVersion: WEBHOOK_SIGNATURE_VERSION,
    payload: {
      ...payload,
      eventId,
      sentAt:
        typeof payload.sentAt === "string" && payload.sentAt
          ? payload.sentAt
          : signedAt,
    },
  };

  const signature = createHmac("sha256", secret)
    .update(`${signedAt}.${JSON.stringify(envelopeBase)}`)
    .digest("hex");

  return JSON.stringify({
    ...envelopeBase,
    signature,
  });
}

export async function postAutomationWebhook(
  webhookUrl: string | undefined,
  payload: Record<string, unknown>
): Promise<AutomationWebhookResult> {
  const target = cleanWebhookUrl(webhookUrl);
  const { automationSecret } = getAutomationSigningConfig();

  if (!target) {
    return {
      attempted: false,
      delivered: false,
      attempts: 0,
      status: null,
      target: "",
      reason: "missing_webhook_url",
    };
  }

  if (!automationSecret) {
    console.warn(
      "Automation webhook skipped: LEADCRAFT_AUTOMATION_SECRET is missing."
    );
    return {
      attempted: false,
      delivered: false,
      attempts: 0,
      status: null,
      target,
      reason: "missing_signing_secret",
    };
  }

  const body = buildSignedEnvelope(payload, automationSecret);

  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body,
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (response.ok) {
        return {
          attempted: true,
          delivered: true,
          attempts: attempt,
          status: response.status,
          target,
          reason: "delivered",
        };
      }

      if (attempt === WEBHOOK_MAX_ATTEMPTS) {
        console.warn("Automation webhook failed:", response.status, target);
        return {
          attempted: true,
          delivered: false,
          attempts: attempt,
          status: response.status,
          target,
          reason: "response_not_ok",
          error: `Received HTTP ${response.status}.`,
        };
      }
    } catch (error) {
      if (attempt === WEBHOOK_MAX_ATTEMPTS) {
        console.warn("Automation webhook error:", error);
        return {
          attempted: true,
          delivered: false,
          attempts: attempt,
          status: null,
          target,
          reason: "network_error",
          error:
            error instanceof Error ? error.message : "Unknown network error.",
        };
      }
    }

    await wait(300 * attempt);
  }

  return {
    attempted: true,
    delivered: false,
    attempts: WEBHOOK_MAX_ATTEMPTS,
    status: null,
    target,
    reason: "network_error",
    error: "Webhook delivery exhausted all attempts.",
  };
}
