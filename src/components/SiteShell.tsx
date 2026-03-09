import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import SiteAtmosphere from "@/components/SiteAtmosphere";
import SiteChrome from "@/components/SiteChrome";
import { cn } from "@/lib/utils";

type SiteShellProps = {
  children: ReactNode;
  mainClassName?: string;
  showBackToTop?: boolean;
  showStickyCTA?: boolean;
};

export default function SiteShell({
  children,
  mainClassName,
  showBackToTop = true,
  showStickyCTA = true,
}: SiteShellProps) {
  return (
    <>
      <SiteChrome
        showBackToTop={showBackToTop}
        showStickyCTA={showStickyCTA}
      />
      <main id="top" className={cn("relative z-10 overflow-hidden", mainClassName)}>
        <SiteAtmosphere />
        <div className="relative z-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}
