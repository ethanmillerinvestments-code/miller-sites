import "server-only";

import { Resend } from "resend";

import {
  postAutomationWebhook,
  type AutomationWebhookResult,
} from "@/lib/intake/automation";

type EmailDeliveryInput = {
  fromEmail: string;
  toEmail: string;
  resendApiKey: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

type DeliveryConfig = {
  webhookUrl: string;
  email?: EmailDeliveryInput;
};

export type EmailDeliveryResult = {
  attempted: boolean;
  delivered: boolean;
  provider: "resend" | "none";
  reason:
    | "delivered"
    | "missing_email_config"
    | "send_failed";
  error?: string;
};

export type SubmissionDeliveryMode =
  | "crm_and_email"
  | "crm_only"
  | "email_only"
  | "unavailable";

export type SubmissionDeliveryResult = {
  ok: boolean;
  mode: SubmissionDeliveryMode;
  webhook: AutomationWebhookResult;
  email: EmailDeliveryResult;
};

function getUnavailableWebhookResult(): AutomationWebhookResult {
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

async function sendEmail(
  email: EmailDeliveryInput | undefined
): Promise<EmailDeliveryResult> {
  if (!email?.resendApiKey || !email.toEmail || !email.fromEmail) {
    return {
      attempted: false,
      delivered: false,
      provider: "none",
      reason: "missing_email_config",
    };
  }

  try {
    const resend = new Resend(email.resendApiKey);
    await resend.emails.send({
      from: email.fromEmail,
      to: [email.toEmail],
      replyTo: email.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    return {
      attempted: true,
      delivered: true,
      provider: "resend",
      reason: "delivered",
    };
  } catch (error) {
    return {
      attempted: true,
      delivered: false,
      provider: "resend",
      reason: "send_failed",
      error: error instanceof Error ? error.message : "Unknown email error.",
    };
  }
}

export async function deliverSubmission(
  config: DeliveryConfig,
  payload: Record<string, unknown>
): Promise<SubmissionDeliveryResult> {
  const webhookRequired = Boolean(config.webhookUrl);
  const webhookPromise = config.webhookUrl
    ? postAutomationWebhook(config.webhookUrl, payload)
    : Promise.resolve(getUnavailableWebhookResult());
  const emailPromise = sendEmail(config.email);

  const [webhook, email] = await Promise.all([webhookPromise, emailPromise]);

  const webhookDelivered = webhook.delivered;
  const emailDelivered = email.delivered;
  const mode: SubmissionDeliveryMode = webhookDelivered
    ? emailDelivered
      ? "crm_and_email"
      : "crm_only"
    : emailDelivered
      ? "email_only"
      : "unavailable";

  return {
    ok: webhookRequired ? webhookDelivered : mode !== "unavailable",
    mode,
    webhook,
    email,
  };
}
