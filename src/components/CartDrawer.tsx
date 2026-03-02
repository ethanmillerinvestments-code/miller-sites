"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";

// Replace with your real Calendly link
const CALENDLY_URL = "https://calendly.com/ethanmillerinvestments";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem } = useCart();

  const oneTime = items.filter((i) => i.type === "one-time");
  const monthly = items.filter((i) => i.type === "monthly");
  const monthlyTotal = monthly.reduce((s, i) => s + i.price, 0);
  const oneTimeTotal = oneTime.reduce((s, i) => s + i.price, 0);

  const checkoutUrl = `${CALENDLY_URL}?a1=${encodeURIComponent(
    items.map((i) => i.name).join(" + ")
  )}`;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ background: "#0d1424", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div>
                <h2 className="text-lg font-bold text-white">Your Order</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {items.length === 0 ? "No items yet" : `${items.length} item${items.length > 1 ? "s" : ""} selected`}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-5xl mb-4 opacity-20">🛒</div>
                  <p className="text-slate-400">Your cart is empty.</p>
                  <p className="text-slate-500 text-sm mt-1">Add a plan from the pricing section.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {oneTime.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Website Build
                      </p>
                      {oneTime.map((item) => (
                        <CartItemRow key={item.id} item={item} onRemove={removeItem} />
                      ))}
                    </div>
                  )}

                  {monthly.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Monthly Plan
                      </p>
                      {monthly.map((item) => (
                        <CartItemRow key={item.id} item={item} onRemove={removeItem} />
                      ))}
                    </div>
                  )}

                  {/* Bundle note */}
                  {oneTime.length > 0 && monthly.length > 0 && (
                    <div
                      className="rounded-lg p-3 text-sm flex items-start gap-2"
                      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      <span className="text-electric mt-0.5">✦</span>
                      <span className="text-slate-300">
                        Bundle discount applied — mention this on your call for{" "}
                        <span className="text-electric font-semibold">20% off</span> your monthly plan.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Summary + CTA */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/5 space-y-4">
                <div className="space-y-2 text-sm">
                  {oneTimeTotal > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Website build</span>
                      <span className="font-semibold">${oneTimeTotal.toLocaleString()}</span>
                    </div>
                  )}
                  {monthlyTotal > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Monthly plan</span>
                      <span className="font-semibold">${monthlyTotal}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/5">
                    <span>Due today</span>
                    <span>${oneTimeTotal.toLocaleString()}{monthlyTotal > 0 ? ` + $${monthlyTotal}/mo` : ""}</span>
                  </div>
                </div>

                <motion.a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="block text-center py-4 rounded-xl font-bold text-white text-lg"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    boxShadow: "0 0 30px rgba(99,102,241,0.35)",
                  }}
                >
                  Book a Call to Confirm Order
                </motion.a>
                <p className="text-center text-xs text-slate-500">
                  No payment today. We review your order on the call.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CartItemRow({
  item,
  onRemove,
}: {
  item: { id: string; name: string; price: number; type: string; description: string };
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="flex-1">
        <p className="text-white font-medium text-sm">{item.name}</p>
        <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white font-semibold text-sm">
          ${item.price.toLocaleString()}
          {item.type === "monthly" && <span className="text-slate-400 font-normal">/mo</span>}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
