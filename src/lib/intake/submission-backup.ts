import "server-only";

import { createClient } from "@supabase/supabase-js";

export type SubmissionBackupResult = {
  attempted: boolean;
  persisted: boolean;
  reason: "stored" | "not_configured" | "insert_failed";
  error?: string;
};

type SubmissionBackupInput = {
  submissionId: string;
  route: string;
  source: string;
  submissionKind: string;
  workflowLabel: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  website: string;
  message: string;
  marketing: Record<string, string>;
  payload: Record<string, unknown>;
  delivery: Record<string, unknown>;
};

function readEnv(name: string) {
  return (process.env[name] || "").trim();
}

function getBackupConfig() {
  return {
    url: readEnv("SUPABASE_URL"),
    serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
    tableName: readEnv("SUPABASE_LEAD_FORM_TABLE") || "lead_form_submissions",
  };
}

export async function persistSubmissionBackup(
  input: SubmissionBackupInput
): Promise<SubmissionBackupResult> {
  const config = getBackupConfig();

  if (!config.url || !config.serviceRoleKey) {
    return {
      attempted: false,
      persisted: false,
      reason: "not_configured",
    };
  }

  try {
    const supabase = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabase.from(config.tableName).insert({
      submission_id: input.submissionId,
      route: input.route,
      source: input.source,
      submission_kind: input.submissionKind,
      workflow_label: input.workflowLabel,
      contact_name: input.name,
      contact_email: input.email,
      contact_phone: input.phone,
      business_name: input.business,
      website: input.website,
      message: input.message,
      source_page: input.marketing.sourcePage || "",
      referer: input.marketing.referer || "",
      utm_source: input.marketing.utmSource || "",
      utm_medium: input.marketing.utmMedium || "",
      utm_campaign: input.marketing.utmCampaign || "",
      utm_term: input.marketing.utmTerm || "",
      utm_content: input.marketing.utmContent || "",
      payload: input.payload,
      delivery_result: input.delivery,
      received_at: new Date().toISOString(),
    });

    if (error) {
      return {
        attempted: true,
        persisted: false,
        reason: "insert_failed",
        error: error.message,
      };
    }

    return {
      attempted: true,
      persisted: true,
      reason: "stored",
    };
  } catch (error) {
    return {
      attempted: true,
      persisted: false,
      reason: "insert_failed",
      error: error instanceof Error ? error.message : "Unknown Supabase error.",
    };
  }
}
