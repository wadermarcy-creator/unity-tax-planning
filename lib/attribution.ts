"use client";

export type LeadAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
  device_type?: string;
  browser_name?: string;
  attribution_json?: Record<string, unknown>;
};

function getParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function getDeviceType() {
  if (typeof navigator === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (/mobile|iphone|android/.test(userAgent)) return "mobile";
  if (/ipad|tablet/.test(userAgent)) return "tablet";
  return "desktop";
}

function getBrowserName() {
  if (typeof navigator === "undefined") return "unknown";

  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edg")) return "Edge";
  return "Other";
}

export function captureAttribution() {
  if (typeof window === "undefined") return;

  const searchParams = new URLSearchParams(window.location.search);

  const attribution: LeadAttribution = {
    utm_source: getParam(searchParams, "utm_source"),
    utm_medium: getParam(searchParams, "utm_medium"),
    utm_campaign: getParam(searchParams, "utm_campaign"),
    utm_term: getParam(searchParams, "utm_term"),
    utm_content: getParam(searchParams, "utm_content"),
    gclid: getParam(searchParams, "gclid"),
    fbclid: getParam(searchParams, "fbclid"),
    landing_page: window.location.pathname,
    referrer: document.referrer || undefined,
    device_type: getDeviceType(),
    browser_name: getBrowserName(),
  };

  const hasTracking =
    attribution.utm_source ||
    attribution.utm_medium ||
    attribution.utm_campaign ||
    attribution.utm_term ||
    attribution.utm_content ||
    attribution.gclid ||
    attribution.fbclid;

  const existing = getStoredAttribution();

  const merged: LeadAttribution = {
    ...existing,
    ...Object.fromEntries(
      Object.entries(attribution).filter(([, value]) => value !== undefined),
    ),
  };

  merged.attribution_json = {
    captured_at: new Date().toISOString(),
    first_landing_page: existing?.attribution_json?.first_landing_page || window.location.pathname,
    latest_landing_page: window.location.pathname,
    referrer: attribution.referrer || existing?.referrer,
    user_agent: navigator.userAgent,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    has_tracking_parameters: Boolean(hasTracking),
    raw_query: window.location.search,
  };

  window.localStorage.setItem("unity_tax_attribution", JSON.stringify(merged));
}

export function getStoredAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("unity_tax_attribution");
    if (!raw) return {};
    return JSON.parse(raw) as LeadAttribution;
  } catch {
    return {};
  }
}

export function clearStoredAttribution() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("unity_tax_attribution");
}
