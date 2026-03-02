import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Miller Web Agency - Websites That Generate Leads",
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
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-navy text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
