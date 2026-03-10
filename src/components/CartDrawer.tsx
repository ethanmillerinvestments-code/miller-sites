"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Layers3, ShoppingCart, X } from "lucide-react";

import { useCart, type CartItem, type CartOfferId } from "@/store/cart";

function formatCurrency(priceCents: number) {
  return `$${(priceCents / 100).toLocaleString()}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clearCart, checkoutHref } = useCart();

  const buildItem = items.find((item) => item.category === "website");
  const supportItem = items.find((item) => item.category === "support");
  const oneTimeTotal = items
    .filter((item) => item.billing === "one-time")
    .reduce((sum, item) => sum + item.priceCents, 0);
  const monthlyTotal = items
    .filter((item) => item.billing === "monthly")
    .reduce((sum, item) => sum + item.priceCents, 0);
  const hasBundle = Boolean(buildItem && supportItem);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(18,19,24,0.98),rgba(11,12,15,1))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="mini-label">Selected package</p>
                <h2 className="mt-2 text-lg font-semibold text-stone-50">
                  {items.length === 0
                    ? "Cart is empty"
                    : `${items.length} selection${items.length > 1 ? "s" : ""} ready`}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="focus-lux inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-stone-300 transition-colors hover:border-[rgba(216,170,115,0.24)] hover:text-[color:var(--accent-strong)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-stone-400">
                    <ShoppingCart className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-stone-50">
                    Build your package
                  </h3>
                  <p className="muted-copy mt-3 max-w-sm text-sm leading-7">
                    Add one website build, one monthly support lane, or just a
                    support plan if you already have a site and need hosting or
                    ongoing upkeep.
                  </p>
                  <Link
                    href="/#package-finder"
                    onClick={closeCart}
                    className="button-secondary mt-6 px-5 py-3 text-sm"
                  >
                    Use Price Finder
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[1.5rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] text-[color:var(--accent-strong)]">
                        <Layers3 className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="mini-label">How this works</p>
                        <p className="mt-2 text-sm leading-7 text-stone-200">
                          The cart builds the package you want reviewed. It can
                          be a new site, support-only, or one of each before
                          moving into the company brief.
                        </p>
                      </div>
                    </div>
                  </div>

                  {buildItem ? (
                    <CartSection
                      title="Website build"
                      subtitle="One build plan max"
                      item={buildItem}
                      onRemove={removeItem}
                    />
                  ) : (
                    <EmptySection
                      title="Website build"
                      body="No build plan selected yet. Add one if this is a new site or redesign."
                    />
                  )}

                  {supportItem ? (
                    <CartSection
                      title="Monthly support"
                      subtitle="Support-only is allowed"
                      item={supportItem}
                      onRemove={removeItem}
                    />
                  ) : (
                    <EmptySection
                      title="Monthly support"
                      body="No recurring support lane selected yet. Add one if you want hosting, upkeep, or ongoing help."
                    />
                  )}

                  {hasBundle ? (
                    <div className="rounded-[1.4rem] border border-[rgba(125,183,176,0.22)] bg-[rgba(125,183,176,0.08)] p-4 text-sm leading-7 text-stone-200">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(125,183,176,0.24)] bg-[rgba(125,183,176,0.12)] text-[color:var(--teal)]">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="mini-label">Bundle-ready</p>
                          <p className="mt-2">
                            This package combines a build with ongoing support,
                            so the brief can cover both launch scope and what
                            happens after the site goes live.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {items.length > 0 ? (
              <div className="border-t border-white/10 px-6 py-5">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <div className="space-y-2 text-sm">
                    {oneTimeTotal > 0 ? (
                      <div className="flex items-center justify-between text-stone-300">
                        <span>One-time build</span>
                        <span className="font-semibold text-stone-100">
                          {formatCurrency(oneTimeTotal)}
                        </span>
                      </div>
                    ) : null}
                    {monthlyTotal > 0 ? (
                      <div className="flex items-center justify-between text-stone-300">
                        <span>Monthly support</span>
                        <span className="font-semibold text-stone-100">
                          {formatCurrency(monthlyTotal)}/mo
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="mini-label">Next step</p>
                    <p className="mt-2 text-sm leading-7 text-stone-300">
                      No payment happens in the cart. The selected package moves
                      into a company brief and written scope review first. If
                      approved, Leadcraft sends the Stripe payment step after
                      that.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    href={checkoutHref()}
                    onClick={closeCart}
                    className="button-primary w-full px-5 py-3.5 text-sm"
                  >
                    Continue To Company Brief
                  </Link>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/#pricing"
                      onClick={closeCart}
                      className="button-secondary w-full px-5 py-3 text-sm"
                    >
                      Add More
                    </Link>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="button-secondary w-full px-5 py-3 text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function CartSection({
  title,
  subtitle,
  item,
  onRemove,
}: {
  title: string;
  subtitle: string;
  item: CartItem;
  onRemove: (id: CartOfferId) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-100">{title}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="pr-3">
            <p className="text-sm font-semibold text-stone-50">{item.name}</p>
            <p className="mt-2 text-sm leading-7 text-stone-300">
              {item.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-stone-100">
              {formatCurrency(item.priceCents)}
              {item.billing === "monthly" ? "/mo" : ""}
            </p>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-500 transition-colors hover:text-rose-300"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptySection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.02] p-4">
      <p className="text-sm font-semibold text-stone-100">{title}</p>
      <p className="mt-2 text-sm leading-7 text-stone-400">{body}</p>
    </div>
  );
}
