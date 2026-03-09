"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

type AutoPresentTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export default function AutoPresentTrigger({
  children = "Guided presentation",
  className,
  type = "button",
  onClick,
  ...props
}: AutoPresentTriggerProps) {
  return (
    <button
      type={type}
      onClick={(event) => {
        window.dispatchEvent(new Event("leadcraft:auto-present:stop"));
        window.dispatchEvent(new Event("leadcraft:auto-present:start"));
        onClick?.(event);
      }}
      className={cn(
        "focus-lux inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-stone-200 transition-colors hover:border-[rgba(216,170,115,0.24)] hover:bg-[rgba(216,170,115,0.08)] hover:text-stone-50",
        className
      )}
      {...props}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(216,170,115,0.2)] bg-[rgba(216,170,115,0.08)] text-[color:var(--accent-strong)]">
        <Play className="ml-0.5 h-3.5 w-3.5" />
      </span>
      <span>{children}</span>
    </button>
  );
}
