import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://miller-sites.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Leadcraft Agency - Websites That Generate Leads for Home Service Businesses",
    template: "%s | Leadcraft Agency",
  },
  description:
    "We build high-converting websites for HVAC, plumbing, roofing, landscaping, and other home service businesses. Custom code, 7-day delivery, local SEO built in.",
  keywords: [
    "home service website",
    "HVAC website design",
    "plumbing website",
    "roofing website",
    "landscaping website",
    "local SEO",
    "lead generation website",
    "contractor website",
    "home service marketing",
    "small business website",
  ],
  authors: [{ name: "Leadcraft Agency" }],
  creator: "Leadcraft Agency",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Leadcraft Agency",
    title: "Leadcraft Agency - Websites That Generate Leads",
    description:
      "Custom websites for HVAC, plumbing, roofing, and home service businesses. Hand-coded, fast-loading, SEO-optimized. Get more leads.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Leadcraft Agency - Websites That Generate Leads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leadcraft Agency - Websites That Generate Leads",
    description:
      "Custom websites for home service businesses. Hand-coded, fast-loading, SEO-optimized.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Leadcraft Agency",
      description: "Websites that generate leads for home service businesses.",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: "Leadcraft Agency",
      url: siteUrl,
      telephone: "+15138151826",
      email: "ethanmillerinvestments@gmail.com",
      description:
        "We build high-converting websites for HVAC, plumbing, roofing, landscaping, and home service businesses.",
      areaServed: { "@type": "Country", name: "United States" },
      serviceType: [
        "Website Design",
        "Local SEO",
        "Lead Generation",
        "Website Maintenance",
      ],
      priceRange: "$797-$2997",
    },
    {
      "@type": "Service",
      name: "Website Design for Home Service Businesses",
      provider: { "@id": `${siteUrl}/#business` },
      description:
        "Hand-coded, mobile-first websites built to convert visitors into booked jobs.",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "797",
        highPrice: "2997",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.gamma.app" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${bricolage.variable} font-sans antialiased bg-navy text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
