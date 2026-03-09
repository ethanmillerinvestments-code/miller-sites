"use client";

import { type HTMLAttributes, useRef } from "react";

import { cn } from "@/lib/utils";

type PointerCardProps = HTMLAttributes<HTMLDivElement> & {
  overlayClassName?: string;
};

export default function PointerCard({
  children,
  className,
  overlayClassName,
  onMouseMove,
  onMouseLeave,
  ...props
}: PointerCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function setPointerPosition(clientX: number, clientY: number) {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((localY - centerY) / rect.height) * -3.6;
    const tiltY = ((localX - centerX) / rect.width) * 4;

    ref.current.style.setProperty("--pointer-x", `${localX}px`);
    ref.current.style.setProperty("--pointer-y", `${localY}px`);
    ref.current.style.setProperty("--pointer-tilt-x", `${tiltX.toFixed(2)}deg`);
    ref.current.style.setProperty("--pointer-tilt-y", `${tiltY.toFixed(2)}deg`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setPointerPosition(event.clientX, event.clientY);
        }

        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        if (ref.current) {
          ref.current.style.removeProperty("--pointer-x");
          ref.current.style.removeProperty("--pointer-y");
          ref.current.style.removeProperty("--pointer-tilt-x");
          ref.current.style.removeProperty("--pointer-tilt-y");
        }

        onMouseLeave?.(event);
      }}
      className={cn("pointer-card group relative isolate overflow-hidden", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          overlayClassName
        )}
      />
      {children}
    </div>
  );
}
