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
  crmOk: boolean | null;
  processingStatus: string;
  exceptionCode: string;
  reason:
    | "delivered"
    | "missing_webhook_url"
    | "missing_signing_secret"
    | "crm_rejected"
    | "invalid_response_body"
    | "response_not_ok"
    | "network_error";
  error?: string;
};

type AutomationWebhookResponseBody = {
  ok?: boolean;
  error?: string;
  result?: {
    processingStatus?: string;
    exceptionCode?: string;
  };
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

async function readWebhookResponse(
  response: Response
): Promise<AutomationWebhookResponseBody | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as AutomationWebhookResponseBody;
  } catch {
    return null;
  }
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
      crmOk: null,
      processingStatus: "",
      exceptionCode: "",
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
      crmOk: null,
      processingStatus: "",
      exceptionCode: "",
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

      const responseBody = await readWebhookResponse(response);
      const crmOk = responseBody?.ok === true;
      const processingStatus =
        typeof responseBody?.result?.processingStatus === "string"
          ? responseBody.result.processingStatus
          : "";
      const exceptionCode =
        typeof responseBody?.result?.exceptionCode === "string"
          ? responseBody.result.exceptionCode
          : "";
      const responseError =
        typeof responseBody?.error === "string" ? responseBody.error : "";

      if (response.ok && crmOk) {
        return {
          attempted: true,
          delivered: true,
          attempts: attempt,
          status: response.status,
          target,
          crmOk: true,
          processingStatus,
          exceptionCode,
          reason: "delivered",
        };
      }

      if (attempt === WEBHOOK_MAX_ATTEMPTS) {
        console.warn(
          "Automation webhook failed:",
          JSON.stringify({
            status: response.status,
            target,
            crmOk,
            processingStatus,
            exceptionCode,
            responseError,
            hasResponseBody: Boolean(responseBody),
          })
        );
        return {
          attempted: true,
          delivered: false,
          attempts: attempt,
          status: response.status,
          target,
          crmOk,
          processingStatus,
          exceptionCode,
          reason: !response.ok
            ? "response_not_ok"
            : responseBody
              ? "crm_rejected"
              : "invalid_response_body",
          error:
            responseError ||
            (!response.ok
              ? `Received HTTP ${response.status}.`
              : responseBody
                ? "CRM webhook rejected the event."
                : "CRM webhook returned an invalid response body."),
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
          crmOk: null,
          processingStatus: "",
          exceptionCode: "",
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
    crmOk: null,
    processingStatus: "",
    exceptionCode: "",
    reason: "network_error",
    error: "Webhook delivery exhausted all attempts.",
  };
}
