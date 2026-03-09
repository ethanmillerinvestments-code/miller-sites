"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";

const AutoPresent = dynamic(() => import("@/components/AutoPresent"), {
  ssr: false,
});
const BackToTop = dynamic(() => import("@/components/BackToTop"), {
  ssr: false,
});
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});
const MobileStickyCTA = dynamic(() => import("@/components/MobileStickyCTA"), {
  ssr: false,
});

type SiteChromeProps = {
  showBackToTop: boolean;
  showStickyCTA: boolean;
};

export default function SiteChrome({
  showBackToTop,
  showStickyCTA,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const isCheckoutRoute = pathname.startsWith("/checkout");

  return (
    <>
      <Navbar />
      {isHomeRoute ? <AutoPresent /> : null}
      {isHomeRoute ? <CartDrawer /> : null}
      {showStickyCTA && !isCheckoutRoute ? <MobileStickyCTA /> : null}
      {showBackToTop ? <BackToTop /> : null}
    </>
  );
}
