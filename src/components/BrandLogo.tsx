import { useId } from "react";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  showText?: boolean;
  textClassName?: string;
  compact?: boolean;
};

export function BrandMark({ className }: { className?: string }) {
  const seed = useId().replace(/:/g, "");
  const frameId = `${seed}-frame`;
  const fillId = `${seed}-fill`;
  const auraId = `${seed}-aura`;
  const coolAuraId = `${seed}-cool-aura`;
  const sheenId = `${seed}-sheen`;
  const shadowId = `${seed}-shadow`;

  return (
    <svg
      viewBox="0 0 72 72"
      aria-hidden="true"
      className={cn("h-11 w-11", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={frameId} x1="12" y1="8.5" x2="60" y2="63.5">
          <stop offset="0%" stopColor="#F8E6C0" />
          <stop offset="52%" stopColor="#D8AA73" />
          <stop offset="100%" stopColor="#7DB7B0" />
        </linearGradient>
        <radialGradient
          id={fillId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18 13) rotate(41) scale(75 72)"
        >
          <stop offset="0%" stopColor="#222833" />
          <stop offset="56%" stopColor="#0E1118" />
          <stop offset="100%" stopColor="#06070A" />
        </radialGradient>
        <radialGradient
          id={auraId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(21 16) rotate(30) scale(36 30)"
        >
          <stop offset="0%" stopColor="#D8AA73" stopOpacity="0.3" />
          <stop offset="58%" stopColor="#D8AA73" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#D8AA73" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={coolAuraId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(53 54) rotate(12) scale(16 14)"
        >
          <stop offset="0%" stopColor="#7DB7B0" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#7DB7B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={sheenId} x1="20" y1="10" x2="42" y2="28">
          <stop offset="0%" stopColor="#FFF8EA" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#FFF8EA" stopOpacity="0" />
        </linearGradient>
        <filter id={shadowId} x="-18%" y="-18%" width="136%" height="136%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.26" />
        </filter>
      </defs>
      <ellipse cx="24.5" cy="18.5" rx="20.5" ry="16.5" fill={`url(#${auraId})`} />
      <ellipse cx="53.5" cy="54.5" rx="13.5" ry="11" fill={`url(#${coolAuraId})`} />
      <g filter={`url(#${shadowId})`}>
        <rect
          x="5"
          y="5"
          width="62"
          height="62"
          rx="23"
          fill={`url(#${fillId})`}
          stroke={`url(#${frameId})`}
          strokeWidth="1.8"
        />
        <rect
          x="8.5"
          y="8.5"
          width="55"
          height="55"
          rx="19.5"
          stroke="#FFFFFF"
          strokeOpacity="0.08"
        />
        <path
          d="M15 12.5C20.2 9.4 27.9 8.2 38.4 9.1C31 13.2 24.6 19 19.3 26.6C17.4 22.8 16 18.1 15 12.5Z"
          fill={`url(#${sheenId})`}
          opacity="0.58"
        />
      </g>
      <path
        d="M52.4 20.1C47.5 16.2 41.3 14.2 34.8 14.2C21.6 14.2 13.6 23.2 13.6 36.1C13.6 49 21.8 57.8 35.1 57.8C40.8 57.8 46.3 56.1 50.7 53.1"
        stroke={`url(#${frameId})`}
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M26.6 20.1V46.1H43.9"
        stroke="#F8F0E3"
        strokeWidth="4.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.8 35.2L50.2 20.8"
        stroke={`url(#${frameId})`}
        strokeWidth="4.15"
        strokeLinecap="round"
      />
      <path
        d="M42.5 20.8H50.2V28.5"
        stroke={`url(#${frameId})`}
        strokeWidth="4.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BrandLogo({
  className,
  compact = false,
  markClassName,
  showText = true,
  textClassName,
}: BrandLogoProps) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[1.35rem] border border-[rgba(247,215,164,0.16)] bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] shadow-[0_18px_34px_rgba(0,0,0,0.24)]",
          compact && "h-10 w-10 rounded-[1.1rem]",
          markClassName
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-[1px] rounded-[1.28rem] bg-[radial-gradient(circle_at_20%_18%,rgba(247,215,164,0.14),transparent_38%),radial-gradient(circle_at_82%_84%,rgba(125,183,176,0.1),transparent_34%)]",
            compact && "rounded-[1.03rem]"
          )}
        />
        <BrandMark className={cn(compact && "h-10 w-10")} />
      </span>

      {showText ? (
        <span className={cn("flex flex-col leading-none", textClassName)}>
          <span className="font-[family:var(--font-display)] text-[1.45rem] font-semibold tracking-[-0.055em] text-stone-50 sm:text-[1.62rem]">
            Leadcraft
          </span>
          <span className="mt-[0.14rem] pl-[0.15rem] text-[0.62rem] font-medium uppercase tracking-[0.38em] text-[color:var(--accent-strong)]">
            Agency
          </span>
        </span>
      ) : null}
    </span>
  );
}
