import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitNamespaces = new Map<string, Map<string, RateLimitEntry>>();
const DEV_ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const LOCAL_DEV_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function getOriginSet(request?: Request) {
  const origins = new Set<string>([new URL(siteConfig.siteUrl).origin]);

  if (request) {
    try {
      origins.add(new URL(request.url).origin);
    } catch {
      // Ignore malformed request URLs and fall back to configured origins.
    }
  }

  if (process.env.NODE_ENV !== "production") {
    DEV_ALLOWED_ORIGINS.forEach((origin) => origins.add(origin));
  }

  return origins;
}

function isAllowedOrigin(value: string | null, request?: Request) {
  if (!value) {
    return false;
  }

  try {
    const origin = new URL(value);

    if (getOriginSet(request).has(origin.origin)) {
      return true;
    }

    return (
      process.env.NODE_ENV !== "production" &&
      LOCAL_DEV_HOSTNAMES.has(origin.hostname)
    );
  } catch {
    return false;
  }
}

function getNamespaceStore(namespace: string) {
  const store = rateLimitNamespaces.get(namespace);

  if (store) {
    return store;
  }

  const nextStore = new Map<string, RateLimitEntry>();
  rateLimitNamespaces.set(namespace, nextStore);
  return nextStore;
}

function clearExpired(store: Map<string, RateLimitEntry>, now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function getClientAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function ensureJsonRequest(request: Request, maxBytes: number) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return false;
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return false;
  }

  return true;
}

export function isSameOriginRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return isAllowedOrigin(origin, request);
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return isAllowedOrigin(referer, request);
  }

  return process.env.NODE_ENV !== "production";
}

export function takeRateLimitHit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();
  const store = getNamespaceStore(namespace);
  clearExpired(store, now);

  const existing = store.get(key);
  if (!existing) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }

  existing.count += 1;

  return {
    limited: existing.count > limit,
    remaining: Math.max(limit - existing.count, 0),
    resetAt: existing.resetAt,
  };
}

export function getRateLimitHeaders(remaining: number, resetAt: number) {
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((resetAt - Date.now()) / 1000)
  );

  return {
    "Retry-After": String(retryAfterSeconds),
    "X-RateLimit-Remaining": String(Math.max(remaining, 0)),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}

export function jsonNoStore(
  body: Record<string, unknown>,
  init?: ResponseInit
) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Pragma", "no-cache");

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}
