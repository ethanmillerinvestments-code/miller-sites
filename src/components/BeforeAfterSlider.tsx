"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
};

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
}: BeforeAfterSliderProps) {
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newPos: number | null = null;
    if (e.key === "ArrowLeft") {
      newPos = Math.max(0, position - 2);
    } else if (e.key === "ArrowRight") {
      newPos = Math.min(100, position + 2);
    } else if (e.key === "Home") {
      newPos = 0;
    } else if (e.key === "End") {
      newPos = 100;
    }
    if (newPos !== null) {
      e.preventDefault();
      setPosition(newPos);
    }
  }, [position]);

  // Clean up dragging state if pointer leaves the window
  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, [isDragging]);

  // Reduced motion: show two images side by side
  if (reduceMotion) {
    return (
      <div className={cn("grid grid-cols-2 gap-2", className)}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-stone-900">
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            quality={80}
            sizes="(max-width: 1024px) 50vw, 16vw"
            className="object-cover object-top"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-300">
            Before
          </span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-stone-900">
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            quality={80}
            sizes="(max-width: 1024px) 50vw, 16vw"
            className="object-cover object-top"
          />
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-300">
            After
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] overflow-hidden bg-stone-900 select-none",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* After image (fills container) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        quality={80}
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover object-top"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          quality={80}
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover object-top"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-10 w-[2px]"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
        }}
      />

      {/* Slider handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
        style={{ left: `${position}%` }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4.5 3L1.5 7L4.5 11"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 3L12.5 7L9.5 11"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Labels */}
      <span className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-300 backdrop-blur-sm">
        Before
      </span>
      <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-300 backdrop-blur-sm">
        After
      </span>
    </div>
  );
}
