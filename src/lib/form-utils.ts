type CleanFieldOptions = {
  lowercase?: boolean;
  normalizeWhitespace?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{7,25}$/;

export function cleanField(
  value: unknown,
  maxLength: number,
  options: CleanFieldOptions = {}
) {
  if (typeof value !== "string") {
    return "";
  }

  const normalizeWhitespace = options.normalizeWhitespace ?? true;
  let next = value.trim();

  if (normalizeWhitespace) {
    next = next.replace(/\s+/g, " ");
  }

  if (options.lowercase) {
    next = next.toLowerCase();
  }

  return next.slice(0, maxLength);
}

export function cleanTextarea(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\r\n/g, "\n").slice(0, maxLength);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normalizeWebsite(value: string) {
  if (!value) {
    return "";
  }

  const candidate = value.startsWith("http") ? value : `https://${value}`;

  try {
    return new URL(candidate).toString();
  } catch {
    return "";
  }
}

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

export function isValidPhone(value: string) {
  return PHONE_PATTERN.test(value);
}

export function parseTimestamp(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  return NaN;
}
