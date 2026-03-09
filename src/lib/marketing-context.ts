export function getRequestMarketingContext(request: Request) {
  const referer = request.headers.get("referer") || "";

  if (!referer) {
    return {
      referer: "",
      sourcePage: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    };
  }

  try {
    const url = new URL(referer);
    return {
      referer,
      sourcePage: `${url.pathname}${url.search}`,
      utmSource: url.searchParams.get("utm_source") || "",
      utmMedium: url.searchParams.get("utm_medium") || "",
      utmCampaign: url.searchParams.get("utm_campaign") || "",
      utmTerm: url.searchParams.get("utm_term") || "",
      utmContent: url.searchParams.get("utm_content") || "",
    };
  } catch {
    return {
      referer,
      sourcePage: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    };
  }
}
