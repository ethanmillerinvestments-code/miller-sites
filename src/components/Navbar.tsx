"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import BrandLogo from "@/components/BrandLogo";
import MagneticButton from "@/components/MagneticButton";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { guidePages, siteConfig } from "@/lib/site";

const CartButton = dynamic(() => import("@/components/CartButton"), {
  ssr: false,
});

const navLinks = [
  { href: "#package-finder", label: "Quiz" },
  { href: "#pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const activeGuidePage =
    guidePages.find((page) => pathname === page.href) ?? null;
  useBodyScrollLock(mobileOpen);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const resolveHref = (href: string) =>
    href.startsWith("#") ? (pathname === "/" ? href : `/${href}`) : href;

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || mobileOpen
            ? "border-b border-white/10 bg-[rgba(8,9,12,0.86)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="section-shell">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href={pathname === "/" ? "#top" : "/"} className="focus-lux rounded-full px-1 py-1">
              <BrandLogo />
            </Link>

            {activeGuidePage ? (
              <div className="hidden rounded-full border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)] xl:inline-flex">
                {activeGuidePage.label}
              </div>
            ) : null}

            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  className="nav-link-slide focus-lux rounded-full px-1 py-1 text-sm text-stone-300 transition-colors duration-200 hover:text-[color:var(--accent-strong)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/client-products"
                className="nav-link-slide focus-lux rounded-full px-1 py-1 text-sm text-stone-300 transition-colors duration-200 hover:text-[color:var(--accent-strong)]"
              >
                Proof of Work
              </Link>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              {isHomeRoute ? <CartButton /> : null}
              <Link
                href={resolveHref("#package-finder")}
                data-analytics-event="cta_clicked"
                data-analytics-label="Find My Price"
                data-analytics-location="navbar_desktop"
                className="button-secondary px-4 py-2.5 text-sm"
              >
                Find My Price
              </Link>
              <MagneticButton>
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary px-5 py-2.5 text-sm"
                >
                  Book Strategy Call
                </a>
              </MagneticButton>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {isHomeRoute ? <CartButton compact /> : null}
              <button
                type="button"
                aria-controls="mobile-nav"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((current) => !current)}
                className="focus-lux inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-100"
              >
                <span className="sr-only">Toggle navigation</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M4 7h16M4 12h16M4 17h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-4 bottom-4 top-[5.5rem] z-50 lg:hidden"
          >
            <div className="lux-panel flex h-full flex-col overflow-hidden rounded-[1.75rem]">
              <div className="flex-1 overflow-y-auto overscroll-contain p-5">
                <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <BrandLogo compact />
                  <p className="mt-4 max-w-xs text-sm leading-7 text-stone-300">
                    Premium websites for home-service businesses, built around
                    booked calls, quote requests, and cleaner handoff.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={siteConfig.phoneHref}
                    onClick={() => setMobileOpen(false)}
                    className="lux-subtle focus-lux rounded-[1.2rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
                  >
                    <p className="mini-label">Phone</p>
                    <p className="mt-2">{siteConfig.phoneDisplay}</p>
                  </a>
                  <Link
                    href={resolveHref("#package-finder")}
                    onClick={() => setMobileOpen(false)}
                    data-analytics-event="cta_clicked"
                    data-analytics-label="Start The Quiz"
                    data-analytics-location="navbar_mobile_card"
                    className="lux-subtle focus-lux rounded-[1.2rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]"
                  >
                    <p className="mini-label">Start The Quiz</p>
                    <p className="mt-2">4-question package match</p>
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={resolveHref(link.href)}
                      onClick={() => setMobileOpen(false)}
                      className="focus-lux rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-stone-200 transition-colors duration-200 hover:border-[rgba(216,170,115,0.24)] hover:bg-white/5 hover:text-[color:var(--accent-strong)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="mini-label">Explore</p>
                  <div className="mt-3 grid gap-2">
                    {guidePages.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="focus-lux rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-stone-200 transition-colors duration-200 hover:border-[rgba(125,183,176,0.24)] hover:bg-white/5 hover:text-stone-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[1.3rem] border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)] p-4">
                  <p className="mini-label">Offer Ladder</p>
                  <p className="mt-3 text-sm leading-7 text-stone-200">
                    One-time builds from $1,650. Monthly support from $279/mo.
                  </p>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 p-5">
                <div className="flex flex-col gap-3">
                  {isHomeRoute ? (
                    <div className="sm:hidden">
                      <CartButton
                        onBeforeOpen={() => setMobileOpen(false)}
                        className="w-full justify-center px-4 py-3 text-sm"
                      />
                    </div>
                  ) : null}
                  <Link
                    href={resolveHref("#package-finder")}
                    onClick={() => setMobileOpen(false)}
                    className="button-secondary justify-center px-4 py-3 text-sm"
                  >
                    Find My Price
                  </Link>
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="button-primary justify-center px-4 py-3 text-sm"
                  >
                    Book Strategy Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
