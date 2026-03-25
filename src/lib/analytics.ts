export const analyticsConfig = {
  gtmId: (process.env.NEXT_PUBLIC_GTM_ID || "").trim(),
  ga4MeasurementId: (process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "").trim(),
  fbPixelId: (process.env.NEXT_PUBLIC_FB_PIXEL_ID || "").trim(),
  hotjarId: (process.env.NEXT_PUBLIC_HOTJAR_ID || "").trim(),
} as const;

export type AnalyticsEventName =
  | "page_view"
  | "calendly_click"
  | "cta_clicked"
  | "pricing_cta_clicked"
  | "package_finder_started"
  | "package_finder_step_completed"
  | "package_finder_completed"
  | "contact_form_started"
  | "contact_form_submitted"
  | "checkout_intake_started"
  | "checkout_intake_submitted";

type AnalyticsValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type AnalyticsEventProperties = Record<string, AnalyticsValue>;

type DataLayerEvent = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    fbq?: (
      command: "init" | "track" | "trackCustom" | "consent",
      eventNameOrId: string,
      params?: Record<string, string | number | boolean>
    ) => void;
    gtag?: (
      command: "config" | "event",
      targetIdOrEventName: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

function hasAnalyticsDestination() {
  return Boolean(
    analyticsConfig.gtmId ||
      analyticsConfig.ga4MeasurementId ||
      analyticsConfig.fbPixelId ||
      analyticsConfig.hotjarId
  );
}

function readCurrentPath() {
  if (!isBrowser()) {
    return "";
  }

  return `${window.location.pathname}${window.location.search}`;
}

function readCurrentLocation() {
  if (!isBrowser()) {
    return "";
  }

  return window.location.href;
}

function readCurrentTitle() {
  if (!isBrowser()) {
    return "";
  }

  return document.title;
}

function readCurrentReferrer() {
  if (!isBrowser()) {
    return "";
  }

  return document.referrer || "";
}

function readUtmValue(key: string) {
  if (!isBrowser()) {
    return "";
  }

  return new URLSearchParams(window.location.search).get(key) || "";
}

function normalizeValue(value: AnalyticsValue) {
  if (Array.isArray(value)) {
    return value.join("|");
  }

  if (value === null || value === undefined) {
    return "";
  }

  return value;
}

function buildBasePayload() {
  return {
    page_title: readCurrentTitle(),
    page_path: readCurrentPath(),
    page_location: readCurrentLocation(),
    referrer: readCurrentReferrer(),
    utm_source: readUtmValue("utm_source"),
    utm_medium: readUtmValue("utm_medium"),
    utm_campaign: readUtmValue("utm_campaign"),
    utm_term: readUtmValue("utm_term"),
    utm_content: readUtmValue("utm_content"),
  };
}

function buildPayload(
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {}
) {
  const payload: DataLayerEvent = {
    event: eventName,
    event_name: eventName,
    ...buildBasePayload(),
  };

  for (const [key, value] of Object.entries(properties)) {
    payload[key] = normalizeValue(value);
  }

  return payload;
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {}
) {
  if (!isBrowser() || !hasAnalyticsDestination()) {
    return;
  }

  const payload = buildPayload(eventName, properties);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (!analyticsConfig.gtmId && analyticsConfig.ga4MeasurementId && window.gtag) {
    const ga4Payload = { ...payload };
    delete ga4Payload.event;
    window.gtag("event", eventName, ga4Payload);
  }

  if (analyticsConfig.fbPixelId && window.fbq) {
    const pixelPayload = { ...payload };
    delete pixelPayload.event;
    window.fbq("trackCustom", eventName, pixelPayload);
  }
}

export function trackPageView(properties: AnalyticsEventProperties = {}) {
  trackEvent("page_view", properties);

  if (isBrowser() && analyticsConfig.fbPixelId && window.fbq) {
    window.fbq("track", "PageView");
  }
}

export function trackCalendlyClick(properties: AnalyticsEventProperties = {}) {
  trackEvent("calendly_click", properties);
}

export function trackCtaClick(properties: AnalyticsEventProperties = {}) {
  trackEvent("cta_clicked", properties);
}

export function trackPricingCtaClick(properties: AnalyticsEventProperties = {}) {
  trackEvent("pricing_cta_clicked", properties);
}
