"use client";

import { ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

type CartButtonProps = {
  className?: string;
  compact?: boolean;
};

export default function CartButton({
  className,
  compact = false,
}: CartButtonProps) {
  const { items, openCart } = useCart();
  const count = items.length;

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "focus-lux relative inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-stone-100 transition-colors duration-200 hover:border-[rgba(216,170,115,0.28)] hover:text-[color:var(--accent-strong)]",
        compact ? "h-11 w-11" : "min-h-11 px-4 py-2.5 text-sm font-semibold",
        className
      )}
      aria-label={count > 0 ? `Open cart with ${count} item${count > 1 ? "s" : ""}` : "Open cart"}
    >
      <ShoppingCart className={compact ? "h-4 w-4" : "h-4 w-4"} />
      {compact ? null : <span>Cart</span>}
      {count > 0 ? (
        <span
          className={cn(
            "inline-flex min-w-[1.35rem] items-center justify-center rounded-full border border-[rgba(216,170,115,0.24)] bg-[rgba(216,170,115,0.12)] px-1.5 text-[0.68rem] font-semibold text-[color:var(--accent-strong)]",
            compact && "absolute -right-1 -top-1 min-w-[1.2rem] px-1"
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
