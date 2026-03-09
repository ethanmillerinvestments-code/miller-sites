import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  showText?: boolean;
  textClassName?: string;
  compact?: boolean;
};

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      aria-hidden="true"
      className={cn("h-11 w-11", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leadcraft-stroke" x1="12" y1="9" x2="60" y2="63">
          <stop offset="0%" stopColor="#F7D7A4" />
          <stop offset="52%" stopColor="#D8AA73" />
          <stop offset="100%" stopColor="#7DB7B0" />
        </linearGradient>
        <radialGradient
          id="leadcraft-fill"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18 15) rotate(45) scale(72 72)"
        >
          <stop offset="0%" stopColor="#1A1C22" />
          <stop offset="100%" stopColor="#090A0D" />
        </radialGradient>
        <radialGradient
          id="leadcraft-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18 13) rotate(33) scale(48 38)"
        >
          <stop offset="0%" stopColor="#D8AA73" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D8AA73" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="60" height="60" rx="22" fill="url(#leadcraft-glow)" />
      <rect
        x="4"
        y="4"
        width="64"
        height="64"
        rx="24"
        fill="url(#leadcraft-fill)"
        stroke="url(#leadcraft-stroke)"
        strokeWidth="1.5"
      />
      <path
        d="M52 20.5C47.2 16.6 41.2 14.5 34.9 14.5C21.8 14.5 13.5 23.3 13.5 36C13.5 48.7 21.8 57.5 35 57.5C40.8 57.5 46.1 55.9 50.5 52.8"
        stroke="url(#leadcraft-stroke)"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M26.5 20.5V46H43.5"
        stroke="#F7EEE1"
        strokeWidth="4.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.5 35L49.5 21"
        stroke="url(#leadcraft-stroke)"
        strokeWidth="4.1"
        strokeLinecap="round"
      />
      <path
        d="M42 21H49.5V28.5"
        stroke="url(#leadcraft-stroke)"
        strokeWidth="4.1"
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
          "relative flex h-11 w-11 items-center justify-center rounded-[1.35rem] border border-[rgba(216,170,115,0.14)] bg-[rgba(255,255,255,0.02)] shadow-[0_18px_34px_rgba(0,0,0,0.24)]",
          compact && "h-10 w-10 rounded-[1.1rem]",
          markClassName
        )}
      >
        <BrandMark className={cn(compact && "h-10 w-10")} />
      </span>

      {showText ? (
        <span className={cn("flex flex-col leading-none", textClassName)}>
          <span className="text-lg font-semibold tracking-[-0.02em] text-stone-50 sm:text-xl">
            Leadcraft
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.34em] text-stone-400">
            Agency
          </span>
        </span>
      ) : null}
    </span>
  );
}
