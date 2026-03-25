import { Clock, MapPin, Phone, Shield, ShieldCheck, Wrench } from "lucide-react";

export default function PlumbingConcept() {
  return (
    <div className="flex h-full flex-col bg-[#0b1621] text-white">
      {/* Nav */}
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-300">
          C&L Plumbing
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-red-400/30 bg-red-500/15 px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-wider text-red-300">
            <span className="h-1 w-1 animate-pulse rounded-full bg-red-400" />
            24/7 Emergency
          </span>
          <span className="hidden items-center gap-1 text-[0.55rem] font-semibold text-[#c4845a] sm:inline-flex">
            <Phone className="h-2.5 w-2.5" />
            (804) 555-1234
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-1 items-start gap-3 px-3 pt-4 sm:gap-4 sm:px-4 sm:pt-5">
        {/* Left: headline + CTAs */}
        <div className="flex-[1.4] space-y-2.5">
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-[#c4845a]">
            Serving Richmond since 1993
          </p>
          <h1 className="font-sans text-sm font-extrabold leading-[1.15] tracking-tight text-white sm:text-base">
            Richmond&apos;s same-day plumbing, done right.
          </h1>
          <p className="text-[0.55rem] leading-relaxed text-slate-400 sm:text-[0.6rem]">
            From emergency repairs to full remodels. Licensed, insured, and backed by thousands of homeowners across the metro.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#c4845a] to-[#d4996e] px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-wider text-[#1a0e06]">
              <Phone className="h-2.5 w-2.5" />
              Call now
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1 text-[0.5rem] font-semibold uppercase tracking-wider text-slate-300">
              Book online
            </span>
          </div>
        </div>

        {/* Right: dispatch card */}
        <div className="flex-1 space-y-2">
          <div className="rounded-xl border border-cyan-400/15 bg-[#0f1d2d] p-2.5 sm:p-3">
            <p className="text-[0.48rem] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
              Dispatch status
            </p>
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2 py-1.5">
              <Clock className="h-3 w-3 text-emerald-400" />
              <div>
                <p className="text-[0.55rem] font-bold text-white">Next available: Today</p>
                <p className="text-[0.45rem] text-slate-400">2:00 - 4:00 PM window</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[0.45rem] text-slate-400">
              <MapPin className="h-2.5 w-2.5" />
              Richmond, VA metro area
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { icon: Shield, label: "Licensed" },
              { icon: ShieldCheck, label: "Insured" },
              { icon: Wrench, label: "20+ Yrs" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-0.5 rounded-lg border border-white/8 bg-white/[0.03] py-1.5"
              >
                <Icon className="h-2.5 w-2.5 text-[#c4845a]" />
                <span className="text-[0.42rem] font-semibold uppercase tracking-wider text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="mt-auto grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
        {[
          { value: "30+", label: "Years" },
          { value: "5,000+", label: "Jobs" },
          { value: "4.8", label: "Google" },
        ].map(({ value, label }) => (
          <div key={label} className="py-2 text-center">
            <p className="text-[0.65rem] font-bold text-white">{value}</p>
            <p className="text-[0.4rem] uppercase tracking-wider text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
