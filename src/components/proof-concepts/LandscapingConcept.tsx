import { Award, Leaf, Phone, Trees } from "lucide-react";

export default function LandscapingConcept() {
  return (
    <div className="flex h-full flex-col bg-[#faf6ef] text-[#1c1a16]">
      {/* Nav */}
      <div className="flex items-center justify-between border-b border-[#d8ccb8] px-3 py-2">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#2d4a2e]">
          Norris Landscaping
        </span>
        <div className="hidden items-center gap-2.5 sm:flex">
          {["About", "Services", "Gallery", "Contact"].map((item) => (
            <span
              key={item}
              className="text-[0.48rem] font-semibold uppercase tracking-wider text-[#5d5146] transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#2d4a2e] px-2 py-1 text-[0.48rem] font-bold uppercase tracking-wider text-white">
          Free consultation
        </span>
      </div>

      {/* Hero */}
      <div className="flex flex-1 items-start gap-3 px-3 pt-4 sm:gap-4 sm:px-4 sm:pt-5">
        {/* Left: headline + CTAs */}
        <div className="flex-[1.2] space-y-2">
          <p className="flex items-center gap-1 text-[0.48rem] font-semibold uppercase tracking-[0.2em] text-[#8ba67e]">
            <Leaf className="h-2.5 w-2.5" />
            Family-owned since 2003
          </p>
          <h1 className="font-serif text-sm font-bold leading-[1.15] tracking-tight text-[#1c1a16] sm:text-base">
            Raleigh landscapes designed to thrive.
          </h1>
          <p className="text-[0.55rem] leading-relaxed text-[#6b6258]">
            Full-service landscaping, hardscaping, and lawn maintenance for residential and commercial properties across the Triangle.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#2d4a2e] px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-wider text-white">
              View our work
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-[#2d4a2e]/25 px-2.5 py-1 text-[0.5rem] font-semibold uppercase tracking-wider text-[#2d4a2e]">
              <Phone className="h-2.5 w-2.5" />
              (919) 555-1234
            </span>
          </div>
        </div>

        {/* Right: project mosaic */}
        <div className="flex-1 grid grid-cols-2 gap-1.5">
          {[
            { label: "Patio design", bg: "from-[#8ba67e] to-[#6b8c5e]" },
            { label: "Full yard", bg: "from-[#c4b494] to-[#a89878]" },
            { label: "Planting", bg: "from-[#5a7a4e] to-[#3e5a36]" },
            { label: "Hardscape", bg: "from-[#9a8b74] to-[#7a6d5a]" },
          ].map(({ label, bg }) => (
            <div
              key={label}
              className={`flex items-end rounded-lg bg-gradient-to-br ${bg} p-1.5 aspect-square`}
            >
              <span className="rounded-sm bg-black/30 px-1 py-0.5 text-[0.4rem] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="mt-auto grid grid-cols-3 divide-x divide-[#d8ccb8] border-t border-[#d8ccb8]">
        {[
          { icon: Trees, label: "20+ years" },
          { icon: Award, label: "BBB A+ rated" },
          { icon: Leaf, label: "Full service" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-1 py-2">
            <Icon className="h-2.5 w-2.5 text-[#8ba67e]" />
            <span className="text-[0.42rem] font-semibold uppercase tracking-wider text-[#6b6258]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
