import {
  getCheckoutOffer,
  getSupportPlan,
  type SupportPlanId,
  type WebsitePlanId,
} from "@/lib/offers";
import {
  cleanField,
  cleanTextarea,
  escapeHtml,
  isValidEmail,
  isValidPhone,
  normalizeWebsite,
} from "@/lib/form-utils";

export type CheckoutOfferId = WebsitePlanId | SupportPlanId;

export type SanitizedCheckoutIntake = {
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
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

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function renderOfferLines(offers: CheckoutOffer[]) {
  return offers.map((offer) => {
    const suffix = getSupportPlan(offer.id as SupportPlanId) ? "/mo" : "";
    return `${offer.name} (${offer.priceLabel}${suffix ? "" : ""})`;
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

export function sanitizeCheckoutIntake(
  payload: Record<string, unknown>
): { data?: SanitizedCheckoutIntake; error?: string } {
  const contactName = cleanField(payload.contactName, 80);
  const email = cleanField(payload.email, 120).toLowerCase();
  const phone = cleanField(payload.phone, 30);
  const companyName = cleanField(payload.companyName, 120);
  const role = cleanField(payload.role, 80);
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

  if (
    !contactName ||
    !email ||
    !companyName ||
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
        "Please complete the required company brief fields before continuing.",
    };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
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
      role,
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
  intake: SanitizedCheckoutIntake
) {
  const { offers, buildOffers, supportOffers } = splitOffers(offerIds);
  const workflowLabel = getCheckoutWorkflowLabel(offerIds);
  const selectionLabel = getCheckoutSelectionLabel(offerIds);

  return `
    <h2>Leadcraft package intake</h2>
    <p><strong>Workflow:</strong> ${escapeHtml(workflowLabel)}</p>
    <p><strong>Selected package:</strong> ${escapeHtml(selectionLabel)}</p>
    ${
      buildOffers.length > 0
        ? `<p><strong>Build selection:</strong> ${escapeHtml(renderOfferLines(buildOffers).join(", "))}</p>`
        : ""
    }
    ${
      supportOffers.length > 0
        ? `<p><strong>Monthly support:</strong> ${escapeHtml(renderOfferLines(supportOffers).join(", "))}</p>`
        : ""
    }
    <p><strong>Contact:</strong> ${escapeHtml(intake.contactName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(intake.email)}</p>
    ${intake.phone ? `<p><strong>Phone:</strong> ${escapeHtml(intake.phone)}</p>` : ""}
    <p><strong>Company:</strong> ${escapeHtml(intake.companyName)}</p>
    ${intake.role ? `<p><strong>Role:</strong> ${escapeHtml(intake.role)}</p>` : ""}
    <p><strong>City / State:</strong> ${escapeHtml(intake.cityState)}</p>
    ${intake.website ? `<p><strong>Website:</strong> ${escapeHtml(intake.website)}</p>` : ""}
    <p><strong>Services:</strong><br />${escapeHtml(intake.services).replaceAll("\n", "<br />")}</p>
    <p><strong>Service areas:</strong><br />${escapeHtml(intake.serviceAreas).replaceAll("\n", "<br />")}</p>
    <p><strong>Primary goal:</strong><br />${escapeHtml(intake.primaryGoal).replaceAll("\n", "<br />")}</p>
    <p><strong>Current pain:</strong><br />${escapeHtml(intake.currentPain).replaceAll("\n", "<br />")}</p>
    <p><strong>Differentiators:</strong><br />${escapeHtml(intake.differentiators).replaceAll("\n", "<br />")}</p>
    ${intake.proofAssets ? `<p><strong>Proof assets:</strong><br />${escapeHtml(intake.proofAssets).replaceAll("\n", "<br />")}</p>` : ""}
    <p><strong>Timeline:</strong> ${escapeHtml(intake.timeline)}</p>
    ${intake.notes ? `<p><strong>Extra notes:</strong><br />${escapeHtml(intake.notes).replaceAll("\n", "<br />")}</p>` : ""}
    ${
      offers.length > 1
        ? `<p><strong>Bundle note:</strong> The client selected multiple offers and wants one combined scope review.</p>`
        : ""
    }
  `;
}

export function formatCheckoutIntakeText(
  offerIds: CheckoutOfferId[],
  intake: SanitizedCheckoutIntake
) {
  const { buildOffers, supportOffers, offers } = splitOffers(offerIds);
  const workflowLabel = getCheckoutWorkflowLabel(offerIds);
  const selectionLabel = getCheckoutSelectionLabel(offerIds);

  return [
    "Leadcraft package intake",
    `Workflow: ${workflowLabel}`,
    `Selected package: ${selectionLabel}`,
    buildOffers.length > 0
      ? `Build selection: ${renderOfferLines(buildOffers).join(", ")}`
      : "",
    supportOffers.length > 0
      ? `Monthly support: ${renderOfferLines(supportOffers).join(", ")}`
      : "",
    `Contact: ${intake.contactName}`,
    `Email: ${intake.email}`,
    intake.phone ? `Phone: ${intake.phone}` : "",
    `Company: ${intake.companyName}`,
    intake.role ? `Role: ${intake.role}` : "",
    `City / State: ${intake.cityState}`,
    intake.website ? `Website: ${intake.website}` : "",
    "",
    "Services:",
    intake.services,
    "",
    "Service areas:",
    intake.serviceAreas,
    "",
    "Primary goal:",
    intake.primaryGoal,
    "",
    "Current pain:",
    intake.currentPain,
    "",
    "Differentiators:",
    intake.differentiators,
    intake.proofAssets ? `\nProof assets:\n${intake.proofAssets}` : "",
    "",
    `Timeline: ${intake.timeline}`,
    intake.notes ? `\nExtra notes:\n${intake.notes}` : "",
    offers.length > 1
      ? "\nBundle note:\nThe client selected multiple offers and wants one combined scope review."
      : "",
  ]
    .filter(Boolean)
    .join("\n");
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
  return {
    intakeEventId: truncate(extra?.intakeEventId || "", 120),
    offerIds: normalizeCheckoutOfferIds(offerIds).join(","),
    offerLabel: truncate(getCheckoutSelectionLabel(offerIds), 220),
    workflowLabel: truncate(getCheckoutWorkflowLabel(offerIds), 120),
    companyName: truncate(intake.companyName, 120),
    contactName: truncate(intake.contactName, 80),
    email: truncate(intake.email, 120),
    phone: truncate(intake.phone, 40),
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
