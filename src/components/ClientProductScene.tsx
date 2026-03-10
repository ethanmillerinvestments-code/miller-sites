import { type CSSProperties } from "react";

import { ArrowUpRight, PhoneCall } from "lucide-react";

import type { ClientProduct } from "@/lib/client-products";
import { cn } from "@/lib/utils";

type ClientProductSceneProps = {
  product: ClientProduct;
  compact?: boolean;
  className?: string;
};

function SceneFrame({
  product,
  compact = false,
  className,
  children,
}: ClientProductSceneProps & { children: React.ReactNode }) {
  const style = {
    "--scene-accent": product.theme.accent,
    "--scene-secondary": product.theme.secondary,
    "--scene-panel": product.theme.panel,
    "--scene-outline": product.theme.outline,
    "--scene-glow": product.theme.glow,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.9rem] border p-4",
        compact ? "min-h-[260px]" : "min-h-[420px] sm:min-h-[500px]",
        className
      )}
      style={{
        ...style,
        borderColor: "var(--scene-outline)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
        boxShadow: `0 28px 80px ${product.theme.glow}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at 18% 14%, ${product.theme.glow}, transparent 30%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.08), transparent 24%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function IndustrialScene({
  product,
  compact = false,
  className,
}: ClientProductSceneProps) {
  return (
    <SceneFrame product={product} compact={compact} className={className}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-[rgba(5,10,16,0.82)] px-4 py-3">
          <div>
            <p className="mini-label">Emergency response</p>
            <p className="mt-2 text-sm font-semibold text-stone-100">
              Call routing stays visible from the first screen.
            </p>
          </div>
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: product.theme.accent, color: "#1c140b" }}
          >
            <PhoneCall aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,15,25,0.92),rgba(18,13,18,0.88))] p-5">
            <p className="mini-label">Hero treatment</p>
            <div className="mt-5 space-y-3">
              <div className="h-3 w-20 rounded-full bg-white/20" />
              <div className="h-7 w-[72%] rounded-full bg-white/90" />
              <div className="h-7 w-[60%] rounded-full bg-white/70" />
              <div className="h-3 w-[82%] rounded-full bg-white/20" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Call now", "Request service"].map((label, index) => (
                <div
                  key={label}
                  className="rounded-[1.1rem] px-4 py-3 text-sm font-semibold"
                  style={{
                    backgroundColor:
                      index === 0 ? product.theme.accent : "rgba(255,255,255,0.08)",
                    color: index === 0 ? "#1b130c" : "#f5efe6",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {["Cooling", "Heating", "Financing"].map((item, index) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-white/10 px-4 py-4"
                style={{
                  background:
                    index === 1
                      ? "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
                      : "rgba(255,255,255,0.03)",
                }}
              >
                <p className="mini-label">{item}</p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  Structured to keep category choice and next action obvious.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}

function StormScene({
  product,
  compact = false,
  className,
}: ClientProductSceneProps) {
  return (
    <SceneFrame product={product} compact={compact} className={className}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-[rgba(15,17,22,0.9)] px-4 py-3">
          <div>
            <p className="mini-label">Storm inspection flow</p>
            <p className="mt-2 text-sm font-semibold text-stone-100">
              Inspection booking comes before replacement detail.
            </p>
          </div>
          <span
            className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ backgroundColor: product.theme.accent, color: "#18120b" }}
          >
            Inspection first
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            {["Damage signs", "Claim questions", "Roof replacement"].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-[1.4rem] border border-white/10 px-4 py-4",
                  index === 0
                    ? "bg-[linear-gradient(150deg,rgba(240,179,93,0.18),rgba(255,255,255,0.03))]"
                    : "bg-white/[0.03]"
                )}
                style={{
                  transform: compact ? undefined : `skewY(${index === 1 ? "-2deg" : "0deg"})`,
                }}
              >
                <p className="mini-label">{item}</p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  Stronger category framing for a higher-trust high-ticket sales path.
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
            <div className="flex items-center justify-between">
              <p className="mini-label">Homepage composition</p>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-stone-400" />
            </div>
            <div className="mt-5 grid gap-3">
              <div className="h-24 rounded-[1.3rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))]" />
              <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                <div className="h-24 rounded-[1.25rem] bg-white/[0.05]" />
                <div className="h-24 rounded-[1.25rem] bg-[rgba(240,179,93,0.13)]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 rounded-[1.15rem] bg-white/[0.04]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}

function GardenScene({
  product,
  compact = false,
  className,
}: ClientProductSceneProps) {
  return (
    <SceneFrame product={product} compact={compact} className={className}>
      <div className="grid gap-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mini-label">Gallery-led story</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-stone-200">
                Editorial pacing with a quote path that stays in sight.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-stone-300">
              Concept preview
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[1.08fr_0.92fr]">
            <div className="relative h-40 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(186,195,155,0.35),rgba(255,255,255,0.04))]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_38%)]" />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.1rem] border border-white/10 bg-[rgba(28,26,22,0.5)] px-4 py-3 backdrop-blur-sm">
                <p className="mini-label text-stone-300">Outdoor living focus</p>
                <p className="mt-2 text-sm font-medium text-stone-100">
                  Layered structure with calmer quote entry.
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[1.2rem] border border-white/10 bg-[rgba(216,181,138,0.2)] px-4 py-4">
                <p className="mini-label text-stone-300">Patio rhythm</p>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  Material tone, circulation, and entertaining cues.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                <p className="mini-label text-stone-300">Planting layer</p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  Softer visual texture without losing project discipline.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {["Outdoor living", "Hardscape", "Planting", "Maintenance"].map((item, index) => (
            <div
              key={item}
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{
                borderColor:
                  index === 0 ? product.theme.outline : "rgba(255,255,255,0.12)",
                backgroundColor:
                  index === 0 ? "rgba(186,195,155,0.16)" : "rgba(255,255,255,0.03)",
                color: index === 0 ? "#f3f0e8" : "#d8d1c5",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            "Design direction",
            "Category browse",
            "Request quote",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4"
            >
              <p className="mini-label">{item}</p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                A calmer pathway from visual interest to scoped contact.
              </p>
            </div>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

export default function ClientProductScene(props: ClientProductSceneProps) {
  switch (props.product.style) {
    case "industrial":
      return <IndustrialScene {...props} />;
    case "storm":
      return <StormScene {...props} />;
    case "garden":
      return <GardenScene {...props} />;
    default:
      return null;
  }
}
