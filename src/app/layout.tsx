import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
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
      <body className={`${bricolage.variable} font-sans antialiased bg-navy text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
