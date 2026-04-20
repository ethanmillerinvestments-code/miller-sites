import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "leaflet/dist/leaflet.css";

import AnalyticsRoot from "@/components/AnalyticsRoot";
import { analyticsConfig } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Leadcraft Agency | Editorial Websites For Home-Service Companies",
    template: "%s | Leadcraft Agency",
  },
  description:
    "Leadcraft Agency designs editorial, conversion-focused websites for HVAC, plumbing, roofing, landscaping, electrical, painting, and other home-service companies.",
  keywords: [
    "home service website design",
    "home service website",
    "HVAC website design",
    "plumbing website design",
    "roofing website design",
    "contractor website design",
    "search-ready website structure",
    "lead generation website",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: "Leadcraft Agency | Websites That Generate Leads",
    description:
      "Editorial-grade websites for home-service companies, built around trust, booked calls, and stronger market position.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Leadcraft Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadcraft Agency | Websites That Generate Leads",
    description:
      "Editorial-grade websites for home-service companies, built for trust, booked calls, and cleaner scope review.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.siteUrl}/#website`,
      url: siteConfig.siteUrl,
      name: siteConfig.name,
      description: siteConfig.tagline,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.siteUrl}/#business`,
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      telephone: "+15138151826",
      email: siteConfig.email,
      description:
        "Leadcraft Agency designs editorial, conversion-focused websites for home-service companies.",
      areaServed: { "@type": "Country", name: "United States" },
      serviceType: [
        "Website Design",
        "Landing Page Design",
        "Website Audit",
        "Search-Ready Website Structure",
        "Website Maintenance",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsEnabled = Boolean(
    analyticsConfig.gtmId ||
      analyticsConfig.ga4MeasurementId ||
      analyticsConfig.fbPixelId ||
      analyticsConfig.hotjarId
  );

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0b0c0f" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {analyticsConfig.gtmId ? (
          <Script id="gtm-loader" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
              (function(w,d,s,l,i){w[l]=w[l]||[];var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${analyticsConfig.gtmId}');
            `}
          </Script>
        ) : null}
        {!analyticsConfig.gtmId && analyticsConfig.ga4MeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4MeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-loader" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${analyticsConfig.ga4MeasurementId}', {
                  send_page_view: false
                });
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body
        className={`${bricolage.variable} ${cormorant.variable} bg-[#0b0c0f] font-sans text-stone-100 antialiased`}
      >
        {analyticsConfig.gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analyticsConfig.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {analyticsEnabled ? <AnalyticsRoot /> : null}
        {children}
      </body>
    </html>
  );
}
