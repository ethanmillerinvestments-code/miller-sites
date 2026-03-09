import Link from "next/link";

import type { SupportPlanId, WebsitePlanId } from "@/lib/offers";
import { cn } from "@/lib/utils";

type StripeCheckoutButtonProps = {
  itemId: WebsitePlanId | SupportPlanId;
  className?: string;
  label: string;
  note?: string;
};

export default function StripeCheckoutButton({
  itemId,
  className,
  label,
  note = "Brief first, written scope next. No instant checkout.",
}: StripeCheckoutButtonProps) {
  return (
    <div className="space-y-2">
      <Link
        href={`/checkout/intake?item=${encodeURIComponent(itemId)}`}
        className={cn(
          "button-secondary w-full justify-center px-5 py-3.5 text-sm",
          className
        )}
      >
        {label}
      </Link>
      <p className="text-center text-[0.72rem] uppercase tracking-[0.18em] text-stone-500">
        {note}
      </p>
    </div>
  );
}
