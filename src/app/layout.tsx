import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MillerSites - Professional Websites for Home Service Businesses",
  description:
    "We build high-converting websites for HVAC, plumbing, roofing, landscaping, and other home service businesses. Get more leads with a professional online presence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-navy text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
