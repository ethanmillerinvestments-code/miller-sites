"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

import {
  analyticsConfig,
  trackCalendlyClick,
  trackEvent,
  trackPageView,
  type AnalyticsEventName,
} from "@/lib/analytics";

function isCalendlyLink(href: string) {
  try {
    const url = new URL(href, window.location.origin);
    return url.hostname.includes("calendly.com");
  } catch {
    return false;
  }
}

function readAnchorText(element: HTMLAnchorElement) {
  return element.dataset.analyticsLabel || element.textContent?.trim() || "Link";
}

function readAnalyticsLocation(element: HTMLElement, fallback: string) {
  return (
    element.dataset.analyticsLocation ||
    element.closest<HTMLElement>("[data-analytics-location]")?.dataset.analyticsLocation ||
    (element.closest("nav")
      ? "navbar"
      : element.closest("footer")
        ? "footer"
        : fallback)
  );
}

export default function AnalyticsRoot() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() || "";

  useEffect(() => {
    const pagePath = pathname ? `${pathname}${search ? `?${search}` : ""}` : "";

    trackPageView({
      page_path: pagePath,
    });
  }, [pathname, search]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const analyticsTarget = target.closest<HTMLElement>("[data-analytics-event]");
      if (analyticsTarget) {
        const analyticsEvent = analyticsTarget.dataset.analyticsEvent as
          | AnalyticsEventName
          | undefined;

        if (!analyticsEvent) {
          return;
        }

        trackEvent(analyticsEvent, {
          cta_label: analyticsTarget.dataset.analyticsLabel || analyticsTarget.textContent?.trim() || "",
          cta_location:
            analyticsTarget.dataset.analyticsLocation || pathname || "site",
          offer_ids: analyticsTarget.dataset.analyticsOfferIds || "",
          package_label: analyticsTarget.dataset.analyticsPackageLabel || "",
          submission_kind: analyticsTarget.dataset.analyticsSubmissionKind || "",
        });
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !isCalendlyLink(anchor.href)) {
        return;
      }

      trackCalendlyClick({
        cta_label: readAnchorText(anchor),
        cta_location: readAnalyticsLocation(anchor, pathname || "site"),
      });
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return (
    <>
      {analyticsConfig.fbPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analyticsConfig.fbPixelId}');
          `}
        </Script>
      ) : null}

      {analyticsConfig.hotjarId ? (
        <Script id="hotjar" strategy="lazyOnload">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${analyticsConfig.hotjarId},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      ) : null}
    </>
  );
}
