import "server-only";

import type { SanitizedCheckoutIntake, CheckoutOfferId } from "@/lib/checkout-intake";

type MarketingContext = {
  referer: string;
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

type BaseEventOptions = {
  eventId: string;
  occurredAt?: string;
  source: string;
  marketing?: MarketingContext;
};

type ContactSubmissionKind = "contact_inquiry" | "package_inquiry";

type ContactEventOptions = BaseEventOptions & {
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  timeline: string;
  website: string;
  message: string;
  submissionKind?: ContactSubmissionKind;
  workflowLabel?: string;
  packageInterest?: string;
};

type CheckoutIntakeEventOptions = BaseEventOptions & {
  offerIds: CheckoutOfferId[];
  packageLabel: string;
  workflowLabel: string;
  checkoutWindowOpen: boolean;
  checkoutEnabled: boolean;
  manualReviewRequired: boolean;
  intake: SanitizedCheckoutIntake;
};

type CheckoutPaymentEventOptions = BaseEventOptions & {
  eventType:
    | "leadcraft.checkout_payment_confirmed"
    | "leadcraft.checkout_payment_failed";
  workflowLabel: string;
  packageLabel: string;
  offerIds: CheckoutOfferId[];
  sessionId: string;
  sessionMode: string;
  paymentStatus: string;
  status: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  cityState?: string;
  timeline?: string;
  services?: string;
  primaryGoal?: string;
  currentPain?: string;
  intakeEventId?: string;
  stripeEventId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
};

function getOccurredAt(occurredAt?: string) {
  return occurredAt || new Date().toISOString();
}

function getMarketingFields(marketing?: MarketingContext) {
  return {
    referer: marketing?.referer || "",
    sourcePage: marketing?.sourcePage || "",
    utmSource: marketing?.utmSource || "",
    utmMedium: marketing?.utmMedium || "",
    utmCampaign: marketing?.utmCampaign || "",
    utmTerm: marketing?.utmTerm || "",
    utmContent: marketing?.utmContent || "",
  };
}

export function buildContactIntakeEvent(options: ContactEventOptions) {
  const occurredAt = getOccurredAt(options.occurredAt);
  const marketing = getMarketingFields(options.marketing);
  const submissionKind = options.submissionKind || "contact_inquiry";
  const eventType =
    submissionKind === "package_inquiry"
      ? "leadcraft.package_inquiry"
      : "leadcraft.contact_inquiry";
  const workflowLabel =
    options.workflowLabel ||
    (submissionKind === "package_inquiry" ? "Package Inquiry" : "Contact Inquiry");

  return {
    eventId: options.eventId,
    eventType,
    occurredAt,
    source: options.source,
    submissionKind,
    workflowLabel,
    deliveryPreference: "crm_primary_email_backup",
    name: options.name,
    email: options.email,
    phone: options.phone,
    business: options.business,
    service: options.service,
    serviceType: options.service,
    timeline: options.timeline,
    website: options.website,
    message: options.message,
    packageInterest: options.packageInterest || "",
    packageLabel: options.packageInterest || "",
    contactName: options.name,
    contactEmail: options.email,
    contactPhone: options.phone,
    businessName: options.business,
    notes: options.message,
    contact: {
      name: options.name,
      email: options.email,
      phone: options.phone,
      business: options.business,
      service: options.service,
      timeline: options.timeline,
      website: options.website,
      message: options.message,
    },
    ...marketing,
    marketing,
  };
}

export function buildCheckoutIntakeEvent(options: CheckoutIntakeEventOptions) {
  const occurredAt = getOccurredAt(options.occurredAt);
  const marketing = getMarketingFields(options.marketing);

  return {
    eventId: options.eventId,
    eventType: "leadcraft.checkout_intake",
    occurredAt,
    source: options.source,
    submissionKind: "checkout_intake",
    workflowLabel: options.workflowLabel,
    packageLabel: options.packageLabel,
    offerIds: options.offerIds,
    checkoutWindowOpen: options.checkoutWindowOpen,
    checkoutEnabled: options.checkoutEnabled,
    manualReviewRequired: options.manualReviewRequired,
    manualReviewReason: options.manualReviewRequired
      ? "Checkout intake requires manual scope and signer review."
      : "",
    paymentClearanceState: "Blocked Until Scope",
    deliveryPreference: "crm_primary_email_backup",
    contactName: options.intake.contactName,
    contactEmail: options.intake.email,
    contactPhone: options.intake.phone,
    companyName: options.intake.companyName,
    businessName: options.intake.companyName,
    email: options.intake.email,
    phone: options.intake.phone,
    website: options.intake.website,
    cityState: options.intake.cityState,
    packageInterest: options.packageLabel,
    serviceType: options.intake.services,
    timeline: options.intake.timeline,
    services: options.intake.services,
    serviceAreas: options.intake.serviceAreas,
    primaryGoal: options.intake.primaryGoal,
    currentPain: options.intake.currentPain,
    differentiators: options.intake.differentiators,
    proofAssets: options.intake.proofAssets,
    notes: options.intake.notes,
    intake: options.intake,
    ...marketing,
    marketing,
  };
}

export function buildCheckoutPaymentEvent(options: CheckoutPaymentEventOptions) {
  const occurredAt = getOccurredAt(options.occurredAt);
  const marketing = getMarketingFields(options.marketing);
  const paymentConfirmed =
    options.eventType === "leadcraft.checkout_payment_confirmed";

  return {
    eventId: options.eventId,
    eventType: options.eventType,
    occurredAt,
    source: options.source,
    submissionKind:
      options.eventType === "leadcraft.checkout_payment_confirmed"
        ? "checkout_payment_confirmed"
        : "checkout_payment_failed",
    workflowLabel: options.workflowLabel,
    packageLabel: options.packageLabel,
    packageInterest: options.packageLabel,
    offerIds: options.offerIds,
    intakeEventId: options.intakeEventId || "",
    manualReviewRequired: true,
    manualReviewReason: paymentConfirmed
      ? "Payment confirmation requires manual scope and signer review."
      : "Payment failure requires manual review before any follow-up.",
    paymentClearanceState: paymentConfirmed
      ? "Received Pending Review"
      : "Pending Manual Review",
    contactName: options.contactName,
    contactEmail: options.email,
    contactPhone: options.phone || "",
    companyName: options.companyName,
    businessName: options.companyName,
    email: options.email,
    phone: options.phone || "",
    website: options.website || "",
    cityState: options.cityState || "",
    serviceType: options.services || "",
    timeline: options.timeline || "",
    services: options.services || "",
    primaryGoal: options.primaryGoal || "",
    currentPain: options.currentPain || "",
    paymentStatus: options.paymentStatus,
    stripeStatus: options.status,
    stripeEventId: options.stripeEventId,
    stripeSessionId: options.sessionId,
    stripeSessionMode: options.sessionMode,
    stripeCustomerId: options.stripeCustomerId || "",
    stripeSubscriptionId: options.stripeSubscriptionId || "",
    stripePaymentIntentId: options.stripePaymentIntentId || "",
    ...marketing,
    marketing,
  };
}
