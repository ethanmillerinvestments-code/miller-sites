import {
  getCheckoutOffer,
  getSupportPlan,
  type SupportPlanId,
  type WebsitePlanId,
} from "@/lib/offers";
import {
  cleanField,
  cleanTextarea,
  isValidEmail,
  isValidPhone,
  normalizeWebsite,
} from "@/lib/form-utils";
import {
  formatIntakeEmailHtml,
  formatIntakeEmailText,
} from "@/lib/intake/intake-email";

export type CheckoutOfferId = WebsitePlanId | SupportPlanId;

export type SanitizedCheckoutIntake = {
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  legalBusinessName: string;
  role: string;
  signerName: string;
  signerRole: string;
  billingEmail: string;
  approvalMethod: string;
  sitePaymentMethod: string;
  sitePaymentTiming: string;
  monthlyBillingMethod: string;
  website: string;
  cityState: string;
  services: string;
  serviceAreas: string;
  primaryGoal: string;
  currentPain: string;
  differentiators: string;
  proofAssets: string;
  timeline: string;
  notes: string;
};

type CheckoutOffer = NonNullable<ReturnType<typeof getCheckoutOffer>>;

export type CheckoutBillingProfile = {
  hasBuild: boolean;
  hasSupport: boolean;
  isBundle: boolean;
  summary: string;
  detail: string;
  sitePaymentMethodLabel: string;
  sitePaymentTimingLabel: string;
  monthlyBillingLabel: string;
  sitePaymentMethodOptions: string[];
  sitePaymentTimingOptions: string[];
  monthlyBillingMethodOptions: string[];
};

type IntakeTrackingContext = {
  sourcePage?: string;
  referer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type CheckoutPaymentNotificationInput = {
  eventLabel: string;
  eventTitle: string;
  packageLabel: string;
  workflowLabel: string;
  companyName: string;
  legalBusinessName?: string;
  contactName: string;
  signerName?: string;
  signerRole?: string;
  email: string;
  billingEmail?: string;
  phone?: string;
  website?: string;
  cityState?: string;
  timeline?: string;
  services?: string;
  primaryGoal?: string;
  currentPain?: string;
  approvalMethod?: string;
  paymentPath?: string;
  sessionId?: string;
  sessionMode?: string;
  paymentStatus?: string;
  stripeStatus?: string;
  amountCents?: number | null;
  currency?: string;
  tracking?: IntakeTrackingContext;
  links?: Array<{ label: string; href: string }>;
  nextAction: string;
};

const SITE_PAYMENT_METHOD_OPTIONS = [
  "Venmo",
  "Manual Stripe invoice",
  "Manual Stripe payment link",
  "Need to confirm after scope review",
] as const;

const SITE_PAYMENT_TIMING_OPTIONS = [
  "50% deposit, 50% before launch",
  "Pay the full site amount upfront",
  "Need to confirm after scope review",
] as const;

const MONTHLY_BILLING_METHOD_OPTIONS = [
  "Manual Stripe invoice",
  "Manual Stripe payment link",
  "Need to confirm after scope review",
] as const;

const CRM_PAYMENT_PATH_OPTIONS = [
  "Manual Stripe invoice",
  "Manual Stripe payment link",
  "Need to confirm after scope review",
] as const;

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function formatMoney(amountCents: number | null | undefined, currency?: string) {
  if (!Number.isFinite(amountCents)) {
    return "";
  }

  const resolvedCurrency = (currency || "usd").toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: resolvedCurrency,
    }).format((amountCents || 0) / 100);
  } catch {
    return `${resolvedCurrency} ${((amountCents || 0) / 100).toFixed(2)}`;
  }
}

function renderOfferLines(offers: CheckoutOffer[]) {
  return offers.map((offer) => {
    const suffix = getSupportPlan(offer.id as SupportPlanId) ? "/mo" : "";
    return `${offer.name} (${offer.priceLabel}${suffix})`;
  });
}

function splitOffers(offerIds: CheckoutOfferId[]) {
  const offers = getCheckoutOffers(offerIds);
  const supportOffers = offers.filter((offer) =>
    Boolean(getSupportPlan(offer.id as SupportPlanId))
  );
  const buildOffers = offers.filter(
    (offer) => !getSupportPlan(offer.id as SupportPlanId)
  );

  return { offers, buildOffers, supportOffers };
}

function isAllowedOption(value: string, options: readonly string[]) {
  return options.includes(value);
}

export function getCrmPaymentPath(
  offerIds: CheckoutOfferId[],
  intake: Pick<
    SanitizedCheckoutIntake,
    "sitePaymentMethod" | "sitePaymentTiming" | "monthlyBillingMethod"
  > & {
    paymentPath?: string;
  }
) {
  const billing = getCheckoutBillingProfile(offerIds);
  const directCandidates = [
    intake.paymentPath,
    billing.hasBuild ? intake.sitePaymentMethod : "",
    billing.hasSupport ? intake.monthlyBillingMethod : "",
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  const directMatch = directCandidates.find((candidate) =>
    isAllowedOption(candidate, CRM_PAYMENT_PATH_OPTIONS)
  );

  if (directMatch) {
    return directMatch;
  }

  return "Need to confirm after scope review";
}

export function normalizeCheckoutOfferIds(value: unknown): CheckoutOfferId[] {
  const rawValues = Array.isArray(value)
    ? value.flatMap((entry) =>
        typeof entry === "string" ? entry.split(",") : []
      )
    : typeof value === "string"
      ? value.split(",")
      : [];

  const ids: CheckoutOfferId[] = [];

  rawValues.forEach((rawValue) => {
    const candidate = rawValue.trim() as CheckoutOfferId;

    if (!candidate || ids.includes(candidate)) {
      return;
    }

    if (!getCheckoutOffer(candidate)) {
      return;
    }

    ids.push(candidate);
  });

  return ids;
}

export function getCheckoutOffers(offerIds: CheckoutOfferId[]) {
  return normalizeCheckoutOfferIds(offerIds)
    .map((offerId) => getCheckoutOffer(offerId))
    .filter((offer): offer is CheckoutOffer => Boolean(offer));
}

export function getCheckoutSelectionLabel(offerIds: CheckoutOfferId[]) {
  const offers = getCheckoutOffers(offerIds);

  if (offers.length === 0) {
    return "";
  }

  if (offers.length === 1) {
    return offers[0].name;
  }

  return offers.map((offer) => offer.name).join(" + ");
}

export function getCheckoutWorkflowLabel(offerIds: CheckoutOfferId[]) {
  const { buildOffers, supportOffers } = splitOffers(offerIds);

  if (buildOffers.length > 0 && supportOffers.length > 0) {
    return "Build + Monthly Support Package";
  }

  if (supportOffers.length > 0) {
    return "Monthly Support Intake";
  }

  return "Build New Client Site";
}

export function getCheckoutBillingProfile(
  offerIds: CheckoutOfferId[]
): CheckoutBillingProfile {
  const { buildOffers, supportOffers } = splitOffers(offerIds);
  const hasBuild = buildOffers.length > 0;
  const hasSupport = supportOffers.length > 0;
  const isBundle = hasBuild && hasSupport;

  if (isBundle) {
    return {
      hasBuild,
      hasSupport,
      isBundle,
      summary:
        "Website work can be paid by Venmo or Stripe, either 50/50 or in full upfront. Monthly support is billed through Stripe.",
      detail:
        "Choose the website payment path and the monthly billing method separately. The site portion can use Venmo or manual Stripe. The monthly portion stays manual Stripe only.",
      sitePaymentMethodLabel: "How should the website be paid?",
      sitePaymentTimingLabel: "For the website, do you want 50/50 or full upfront?",
      monthlyBillingLabel: "How should monthly support be billed?",
      sitePaymentMethodOptions: [...SITE_PAYMENT_METHOD_OPTIONS],
      sitePaymentTimingOptions: [...SITE_PAYMENT_TIMING_OPTIONS],
      monthlyBillingMethodOptions: [...MONTHLY_BILLING_METHOD_OPTIONS],
    };
  }

  if (hasBuild) {
    return {
      hasBuild,
      hasSupport,
      isBundle,
      summary:
        "Website work can be paid by Venmo or Stripe, either 50/50 or in full upfront.",
      detail:
        "Pick the payment method and whether the website should run 50/50 or be paid in full upfront. Payment instructions are still sent after scope approval.",
      sitePaymentMethodLabel: "How should the website be paid?",
      sitePaymentTimingLabel: "Do you want 50/50 or full upfront?",
      monthlyBillingLabel: "How should monthly support be billed?",
      sitePaymentMethodOptions: [...SITE_PAYMENT_METHOD_OPTIONS],
      sitePaymentTimingOptions: [...SITE_PAYMENT_TIMING_OPTIONS],
      monthlyBillingMethodOptions: [],
    };
  }

  return {
    hasBuild,
    hasSupport,
    isBundle,
    summary: "Monthly support is billed through Stripe only.",
    detail:
      "Choose the Stripe billing method for the monthly plan. This flow does not offer Venmo for recurring support.",
    sitePaymentMethodLabel: "How should the website be paid?",
    sitePaymentTimingLabel: "Do you want 50/50 or full upfront?",
    monthlyBillingLabel: "How should monthly support be billed?",
    sitePaymentMethodOptions: [],
    sitePaymentTimingOptions: [],
    monthlyBillingMethodOptions: [...MONTHLY_BILLING_METHOD_OPTIONS],
  };
}

export function describeCheckoutBillingSelection(
  offerIds: CheckoutOfferId[],
  intake: Pick<
    SanitizedCheckoutIntake,
    "sitePaymentMethod" | "sitePaymentTiming" | "monthlyBillingMethod"
  >
) {
  const billing = getCheckoutBillingProfile(offerIds);
  const parts: string[] = [];

  if (billing.hasBuild) {
    const siteParts = [intake.sitePaymentMethod, intake.sitePaymentTiming].filter(
      Boolean
    );
    if (siteParts.length > 0) {
      parts.push(`Website: ${siteParts.join(" / ")}`);
    }
  }

  if (billing.hasSupport && intake.monthlyBillingMethod) {
    parts.push(`Monthly: ${intake.monthlyBillingMethod}`);
  }

  return parts.join(" | ");
}

export function sanitizeCheckoutIntake(
  offerIds: CheckoutOfferId[],
  payload: Record<string, unknown>
): { data?: SanitizedCheckoutIntake; error?: string } {
  const billing = getCheckoutBillingProfile(offerIds);
  const contactName = cleanField(payload.contactName, 80);
  const email = cleanField(payload.email, 120).toLowerCase();
  const phone = cleanField(payload.phone, 30);
  const companyName = cleanField(payload.companyName, 120);
  const legalBusinessName = cleanField(payload.legalBusinessName, 140);
  const role = cleanField(payload.role, 80);
  const signerName = cleanField(payload.signerName, 120);
  const signerRole = cleanField(payload.signerRole, 80);
  const billingEmail = cleanField(payload.billingEmail, 120).toLowerCase();
  const approvalMethod = cleanField(payload.approvalMethod, 120);
  let sitePaymentMethod = cleanField(payload.sitePaymentMethod, 120);
  let sitePaymentTiming = cleanField(payload.sitePaymentTiming, 120);
  let monthlyBillingMethod = cleanField(payload.monthlyBillingMethod, 120);
  const website = normalizeWebsite(cleanField(payload.website, 180));
  const cityState = cleanField(payload.cityState, 140);
  const services = cleanTextarea(payload.services, 320);
  const serviceAreas = cleanTextarea(payload.serviceAreas, 320);
  const primaryGoal = cleanTextarea(payload.primaryGoal, 700);
  const currentPain = cleanTextarea(payload.currentPain, 700);
  const differentiators = cleanTextarea(payload.differentiators, 500);
  const proofAssets = cleanTextarea(payload.proofAssets, 500);
  const timeline = cleanField(payload.timeline, 120);
  const notes = cleanTextarea(payload.notes, 700);

  if (!billing.hasBuild) {
    sitePaymentMethod = "";
    sitePaymentTiming = "";
  }

  if (!billing.hasSupport) {
    monthlyBillingMethod = "";
  }

  if (
    !contactName ||
    !email ||
    !companyName ||
    !legalBusinessName ||
    !signerName ||
    !signerRole ||
    !billingEmail ||
    !approvalMethod ||
    !cityState ||
    !services ||
    !serviceAreas ||
    !primaryGoal ||
    !currentPain ||
    !differentiators ||
    !timeline
  ) {
    return {
      error:
        "Please complete the required company details and project goals before continuing.",
    };
  }

  if (billing.hasBuild && (!sitePaymentMethod || !sitePaymentTiming)) {
    return {
      error:
        "Please choose how the website should be paid and whether it is 50/50 or full upfront.",
    };
  }

  if (billing.hasSupport && !monthlyBillingMethod) {
    return {
      error:
        "Please choose how the monthly support should be billed through Stripe.",
    };
  }

  if (sitePaymentMethod && !isAllowedOption(sitePaymentMethod, SITE_PAYMENT_METHOD_OPTIONS)) {
    return { error: "Please choose a valid website payment method." };
  }

  if (sitePaymentTiming && !isAllowedOption(sitePaymentTiming, SITE_PAYMENT_TIMING_OPTIONS)) {
    return { error: "Please choose a valid website payment timing." };
  }

  if (
    monthlyBillingMethod &&
    !isAllowedOption(monthlyBillingMethod, MONTHLY_BILLING_METHOD_OPTIONS)
  ) {
    return { error: "Please choose a valid monthly billing method." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!isValidEmail(billingEmail)) {
    return { error: "Please enter a valid billing email address." };
  }

  if (phone && !isValidPhone(phone)) {
    return { error: "Please enter a valid phone number." };
  }

  if (payload.website && !website) {
    return { error: "Please enter a valid website URL." };
  }

  return {
    data: {
      contactName,
      email,
      phone,
      companyName,
      legalBusinessName,
      role,
      signerName,
      signerRole,
      billingEmail,
      approvalMethod,
      sitePaymentMethod,
      sitePaymentTiming,
      monthlyBillingMethod,
      website,
      cityState,
      services,
      serviceAreas,
      primaryGoal,
      currentPain,
      differentiators,
      proofAssets,
      timeline,
      notes,
    },
  };
}

export function formatCheckoutIntakeHtml(
  offerIds: CheckoutOfferId[],
  intake: SanitizedCheckoutIntake,
  tracking?: IntakeTrackingContext
) {
  const { offers, buildOffers, supportOffers } = splitOffers(offerIds);
  const workflowLabel = getCheckoutWorkflowLabel(offerIds);
  const selectionLabel = getCheckoutSelectionLabel(offerIds);
  const billing = getCheckoutBillingProfile(offerIds);
  const billingSelection = describeCheckoutBillingSelection(offerIds, intake);

  return formatIntakeEmailHtml({
    eyebrow: "Leadcraft package intake",
    title: intake.companyName,
    summary: [
      { label: "Workflow", value: workflowLabel },
      { label: "Selected package", value: selectionLabel },
      {
        label: "Build selection",
        value:
          buildOffers.length > 0
            ? renderOfferLines(buildOffers).join(", ")
            : undefined,
      },
      {
        label: "Monthly support",
        value:
          supportOffers.length > 0
            ? renderOfferLines(supportOffers).join(", ")
            : undefined,
      },
      { label: "Billing rules", value: billing.summary },
      { label: "Selected billing", value: billingSelection },
    ],
    actions: [
      {
        label: "Next action",
        value:
          "Review scope, signer, billing path, and timeline before any payment request is issued.",
      },
      {
        label: "Control standard",
        value:
          "Keep this in manual review until written scope is approved and the payment path is confirmed.",
      },
    ],
    links: intake.website
      ? [{ label: "Business website", href: intake.website }]
      : [],
    sections: [
      {
        title: "Company and signer",
        fields: [
          { label: "Public business name", value: intake.companyName },
          { label: "Legal business name", value: intake.legalBusinessName },
          { label: "Role", value: intake.role },
          { label: "Signer", value: intake.signerName },
          { label: "Signer role", value: intake.signerRole },
          { label: "Approval method", value: intake.approvalMethod },
        ],
      },
      {
        title: "Contact and billing",
        fields: [
          { label: "Contact", value: intake.contactName },
          { label: "Email", value: intake.email },
          { label: "Phone", value: intake.phone },
          { label: "Billing email", value: intake.billingEmail },
          { label: "Website payment method", value: intake.sitePaymentMethod },
          { label: "Website payment timing", value: intake.sitePaymentTiming },
          { label: "Monthly billing", value: intake.monthlyBillingMethod },
        ],
      },
      {
        title: "Business context",
        fields: [
          { label: "City / State", value: intake.cityState },
          { label: "Website", value: intake.website },
          { label: "Timeline", value: intake.timeline },
        ],
        blocks: [
          { label: "Services", value: intake.services },
          { label: "Service areas", value: intake.serviceAreas },
          { label: "Differentiators", value: intake.differentiators },
          { label: "Proof assets", value: intake.proofAssets },
        ],
      },
      {
        title: "Project brief",
        blocks: [
          { label: "Primary goal", value: intake.primaryGoal },
          { label: "Current pain", value: intake.currentPain },
          { label: "Extra notes", value: intake.notes },
          {
            label: "Bundle note",
            value:
              offers.length > 1
                ? "The client selected multiple offers and wants one combined scope review."
                : undefined,
          },
        ],
      },
      {
        title: "Tracking",
        fields: [
          { label: "Source page", value: tracking?.sourcePage },
          { label: "Referer", value: tracking?.referer },
          { label: "UTM source", value: tracking?.utmSource },
          { label: "UTM medium", value: tracking?.utmMedium },
          { label: "UTM campaign", value: tracking?.utmCampaign },
          { label: "UTM term", value: tracking?.utmTerm },
          { label: "UTM content", value: tracking?.utmContent },
        ],
      },
    ],
  });
}

export function formatCheckoutIntakeText(
  offerIds: CheckoutOfferId[],
  intake: SanitizedCheckoutIntake,
  tracking?: IntakeTrackingContext
) {
  const { buildOffers, supportOffers, offers } = splitOffers(offerIds);
  const workflowLabel = getCheckoutWorkflowLabel(offerIds);
  const selectionLabel = getCheckoutSelectionLabel(offerIds);
  const billing = getCheckoutBillingProfile(offerIds);
  const billingSelection = describeCheckoutBillingSelection(offerIds, intake);

  return formatIntakeEmailText({
    eyebrow: "Leadcraft package intake",
    title: intake.companyName,
    summary: [
      { label: "Workflow", value: workflowLabel },
      { label: "Selected package", value: selectionLabel },
      {
        label: "Build selection",
        value:
          buildOffers.length > 0
            ? renderOfferLines(buildOffers).join(", ")
            : undefined,
      },
      {
        label: "Monthly support",
        value:
          supportOffers.length > 0
            ? renderOfferLines(supportOffers).join(", ")
            : undefined,
      },
      { label: "Billing rules", value: billing.summary },
      { label: "Selected billing", value: billingSelection },
    ],
    actions: [
      {
        label: "Next action",
        value:
          "Review scope, signer, billing path, and timeline before any payment request is issued.",
      },
      {
        label: "Control standard",
        value:
          "Keep this in manual review until written scope is approved and the payment path is confirmed.",
      },
    ],
    links: intake.website
      ? [{ label: "Business website", href: intake.website }]
      : [],
    sections: [
      {
        title: "Company and signer",
        fields: [
          { label: "Public business name", value: intake.companyName },
          { label: "Legal business name", value: intake.legalBusinessName },
          { label: "Role", value: intake.role },
          { label: "Signer", value: intake.signerName },
          { label: "Signer role", value: intake.signerRole },
          { label: "Approval method", value: intake.approvalMethod },
        ],
      },
      {
        title: "Contact and billing",
        fields: [
          { label: "Contact", value: intake.contactName },
          { label: "Email", value: intake.email },
          { label: "Phone", value: intake.phone },
          { label: "Billing email", value: intake.billingEmail },
          { label: "Website payment method", value: intake.sitePaymentMethod },
          { label: "Website payment timing", value: intake.sitePaymentTiming },
          { label: "Monthly billing", value: intake.monthlyBillingMethod },
        ],
      },
      {
        title: "Business context",
        fields: [
          { label: "City / State", value: intake.cityState },
          { label: "Website", value: intake.website },
          { label: "Timeline", value: intake.timeline },
        ],
        blocks: [
          { label: "Services", value: intake.services },
          { label: "Service areas", value: intake.serviceAreas },
          { label: "Differentiators", value: intake.differentiators },
          { label: "Proof assets", value: intake.proofAssets },
        ],
      },
      {
        title: "Project brief",
        blocks: [
          { label: "Primary goal", value: intake.primaryGoal },
          { label: "Current pain", value: intake.currentPain },
          { label: "Extra notes", value: intake.notes },
          {
            label: "Bundle note",
            value:
              offers.length > 1
                ? "The client selected multiple offers and wants one combined scope review."
                : undefined,
          },
        ],
      },
      {
        title: "Tracking",
        fields: [
          { label: "Source page", value: tracking?.sourcePage },
          { label: "Referer", value: tracking?.referer },
          { label: "UTM source", value: tracking?.utmSource },
          { label: "UTM medium", value: tracking?.utmMedium },
          { label: "UTM campaign", value: tracking?.utmCampaign },
          { label: "UTM term", value: tracking?.utmTerm },
          { label: "UTM content", value: tracking?.utmContent },
        ],
      },
    ],
  });
}

export function formatCheckoutPaymentHtml(
  input: CheckoutPaymentNotificationInput
) {
  const amountLabel = formatMoney(input.amountCents, input.currency);

  return formatIntakeEmailHtml({
    eyebrow: input.eventLabel,
    title: input.eventTitle,
    summary: [
      { label: "Workflow", value: input.workflowLabel },
      { label: "Package", value: input.packageLabel },
      { label: "Amount", value: amountLabel },
      { label: "Payment status", value: input.paymentStatus },
      { label: "Stripe status", value: input.stripeStatus },
    ],
    actions: [
      { label: "Next action", value: input.nextAction },
      {
        label: "Control standard",
        value:
          "Do not treat payment alone as a clean close. Verify written scope, signer, and billing controls before moving the deal forward.",
      },
    ],
    links: input.links,
    sections: [
      {
        title: "Company and signer",
        fields: [
          { label: "Business", value: input.companyName },
          { label: "Legal business name", value: input.legalBusinessName },
          { label: "Contact", value: input.contactName },
          { label: "Signer", value: input.signerName },
          { label: "Signer role", value: input.signerRole },
          { label: "Approval method", value: input.approvalMethod },
        ],
      },
      {
        title: "Payment and contact",
        fields: [
          { label: "Email", value: input.email },
          { label: "Billing email", value: input.billingEmail },
          { label: "Phone", value: input.phone },
          { label: "Payment path", value: input.paymentPath },
          { label: "Session mode", value: input.sessionMode },
          { label: "Checkout session", value: input.sessionId },
        ],
      },
      {
        title: "Business context",
        fields: [
          { label: "City / State", value: input.cityState },
          { label: "Website", value: input.website },
          { label: "Timeline", value: input.timeline },
        ],
        blocks: [
          { label: "Services", value: input.services },
          { label: "Primary goal", value: input.primaryGoal },
          { label: "Current pain", value: input.currentPain },
        ],
      },
      {
        title: "Tracking",
        fields: [
          { label: "Source page", value: input.tracking?.sourcePage },
          { label: "Referer", value: input.tracking?.referer },
          { label: "UTM source", value: input.tracking?.utmSource },
          { label: "UTM medium", value: input.tracking?.utmMedium },
          { label: "UTM campaign", value: input.tracking?.utmCampaign },
          { label: "UTM term", value: input.tracking?.utmTerm },
          { label: "UTM content", value: input.tracking?.utmContent },
        ],
      },
    ],
  });
}

export function formatCheckoutPaymentText(
  input: CheckoutPaymentNotificationInput
) {
  const amountLabel = formatMoney(input.amountCents, input.currency);

  return formatIntakeEmailText({
    eyebrow: input.eventLabel,
    title: input.eventTitle,
    summary: [
      { label: "Workflow", value: input.workflowLabel },
      { label: "Package", value: input.packageLabel },
      { label: "Amount", value: amountLabel },
      { label: "Payment status", value: input.paymentStatus },
      { label: "Stripe status", value: input.stripeStatus },
    ],
    actions: [
      { label: "Next action", value: input.nextAction },
      {
        label: "Control standard",
        value:
          "Do not treat payment alone as a clean close. Verify written scope, signer, and billing controls before moving the deal forward.",
      },
    ],
    links: input.links,
    sections: [
      {
        title: "Company and signer",
        fields: [
          { label: "Business", value: input.companyName },
          { label: "Legal business name", value: input.legalBusinessName },
          { label: "Contact", value: input.contactName },
          { label: "Signer", value: input.signerName },
          { label: "Signer role", value: input.signerRole },
          { label: "Approval method", value: input.approvalMethod },
        ],
      },
      {
        title: "Payment and contact",
        fields: [
          { label: "Email", value: input.email },
          { label: "Billing email", value: input.billingEmail },
          { label: "Phone", value: input.phone },
          { label: "Payment path", value: input.paymentPath },
          { label: "Session mode", value: input.sessionMode },
          { label: "Checkout session", value: input.sessionId },
        ],
      },
      {
        title: "Business context",
        fields: [
          { label: "City / State", value: input.cityState },
          { label: "Website", value: input.website },
          { label: "Timeline", value: input.timeline },
        ],
        blocks: [
          { label: "Services", value: input.services },
          { label: "Primary goal", value: input.primaryGoal },
          { label: "Current pain", value: input.currentPain },
        ],
      },
      {
        title: "Tracking",
        fields: [
          { label: "Source page", value: input.tracking?.sourcePage },
          { label: "Referer", value: input.tracking?.referer },
          { label: "UTM source", value: input.tracking?.utmSource },
          { label: "UTM medium", value: input.tracking?.utmMedium },
          { label: "UTM campaign", value: input.tracking?.utmCampaign },
          { label: "UTM term", value: input.tracking?.utmTerm },
          { label: "UTM content", value: input.tracking?.utmContent },
        ],
      },
    ],
  });
}

export function buildCheckoutMetadata(
  offerIds: CheckoutOfferId[],
  intake: SanitizedCheckoutIntake,
  extra?: {
    intakeEventId?: string;
    sourcePage?: string;
    referer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
  }
) {
  const billingSelection = describeCheckoutBillingSelection(offerIds, intake);

  return {
    intakeEventId: truncate(extra?.intakeEventId || "", 120),
    offerIds: normalizeCheckoutOfferIds(offerIds).join(","),
    offerLabel: truncate(getCheckoutSelectionLabel(offerIds), 220),
    workflowLabel: truncate(getCheckoutWorkflowLabel(offerIds), 120),
    companyName: truncate(intake.companyName, 120),
    legalBusinessName: truncate(intake.legalBusinessName, 140),
    contactName: truncate(intake.contactName, 80),
    signerName: truncate(intake.signerName, 120),
    signerRole: truncate(intake.signerRole, 80),
    email: truncate(intake.email, 120),
    billingEmail: truncate(intake.billingEmail, 120),
    phone: truncate(intake.phone, 40),
    approvalMethod: truncate(intake.approvalMethod, 120),
    paymentPath: truncate(getCrmPaymentPath(offerIds, intake), 220),
    paymentPathDetail: truncate(billingSelection, 220),
    sitePaymentMethod: truncate(intake.sitePaymentMethod, 120),
    sitePaymentTiming: truncate(intake.sitePaymentTiming, 120),
    monthlyBillingMethod: truncate(intake.monthlyBillingMethod, 120),
    cityState: truncate(intake.cityState, 120),
    website: truncate(intake.website, 220),
    timeline: truncate(intake.timeline, 120),
    sourcePage: truncate(extra?.sourcePage || "", 220),
    referer: truncate(extra?.referer || "", 220),
    utmSource: truncate(extra?.utmSource || "", 120),
    utmMedium: truncate(extra?.utmMedium || "", 120),
    utmCampaign: truncate(extra?.utmCampaign || "", 160),
    utmTerm: truncate(extra?.utmTerm || "", 160),
    utmContent: truncate(extra?.utmContent || "", 160),
    services: truncate(intake.services.replace(/\n/g, " "), 350),
    primaryGoal: truncate(intake.primaryGoal.replace(/\n/g, " "), 350),
    currentPain: truncate(intake.currentPain.replace(/\n/g, " "), 350),
  };
}
