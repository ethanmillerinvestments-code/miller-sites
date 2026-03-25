import { ArrowRight, Phone, Star } from "lucide-react";

export default function ConcreteConcept() {
  return (
    <div className="flex h-full flex-col bg-[#f4efe8] text-[#1a1714]">
      {/* Nav */}
      <div className="flex items-center justify-between border-b border-black/8 px-3 py-2">
        <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[#1a1714]">
          Rocking S Concrete
        </span>
        <div className="hidden items-center gap-3 sm:flex">
          {["Residential", "Commercial", "Gallery"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-black/8 px-2 py-0.5 text-[0.48rem] font-semibold uppercase tracking-wider text-[#4a4137]"
            >
              {item}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#c0623a] px-2 py-1 text-[0.48rem] font-bold uppercase tracking-wider text-white">
          <Phone className="h-2.5 w-2.5" />
          Call
        </span>
      </div>

      {/* Hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#e8e0d5] to-[#d9cfc2] px-4 text-center">
        <p className="text-[0.48rem] font-bold uppercase tracking-[0.3em] text-[#c0623a]">
          Serving San Antonio since 1998
        </p>
        <h1 className="mt-2 font-serif text-base font-bold leading-[1.1] tracking-tight text-[#1a1714] sm:text-lg">
          San Antonio concrete.
          <br />
          Built to last.
        </h1>
        <p className="mt-1.5 max-w-[260px] text-[0.55rem] leading-relaxed text-[#5a5147]">
          Driveways, patios, foundations, stamped concrete, and commercial flatwork. Three decades of quality work across South Texas.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-[#c0623a] px-3 py-1.5 text-[0.5rem] font-bold uppercase tracking-wider text-white">
          Get your free estimate
          <ArrowRight className="h-2.5 w-2.5" />
        </span>
      </div>

      {/* Overlapping stat bar */}
      <div className="-mt-3 mx-3 relative z-10 grid grid-cols-3 divide-x divide-[#d4c9bc] overflow-hidden rounded-xl border border-[#c8baa8] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {[
          { value: "25+", label: "Years experience", accent: false },
          { value: "1,200+", label: "Projects completed", accent: true },
          {
            value: "4.9",
            label: "Google rating",
            accent: false,
            star: true,
          },
        ].map(({ value, label, accent, star }) => (
          <div key={label} className="px-2 py-2.5 text-center sm:px-3">
            <div className="flex items-center justify-center gap-0.5">
              <p
                className={`text-sm font-extrabold ${accent ? "text-[#c0623a]" : "text-[#1a1714]"}`}
              >
                {value}
              </p>
              {star && <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />}
            </div>
            <p className="mt-0.5 text-[0.4rem] font-semibold uppercase tracking-wider text-[#8a7e72]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom spacer */}
      <div className="h-3" />
    </div>
  );
}
