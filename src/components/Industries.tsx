const industries = [
  ["HVAC", "Emergency service, maintenance, replacements"],
  ["Plumbing", "Residential, commercial, and drain work"],
  ["Roofing", "Repair, storm work, replacement, inspections"],
  ["Landscaping", "Design, installs, and recurring maintenance"],
  ["Electrical", "Residential service, upgrades, troubleshooting"],
  ["Painting", "Interior, exterior, and commercial crews"],
  ["Pressure Washing", "Residential and commercial cleanup"],
  ["Garage Doors", "Repairs, installs, openers, and urgent service"],
] as const;

export default function Industries() {
  return (
    <section id="industries" className="section-pad section-rule">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="max-w-xl">
          <span className="eyebrow">Ideal Fit</span>
          <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
            Built for home-service businesses that win work from trust and speed.
          </h2>
          <p className="muted-copy mt-6 text-lg leading-8">
            Home-service buyers move fast. The site has to make the service
            offer obvious, the company credible, and the next step frictionless
            on a phone, not buried under generic agency copy.
          </p>

          <div className="mt-8 space-y-3 text-sm leading-7 text-stone-200">
            <p>Best fit for companies replacing a generic site that looks too cheap.</p>
            <p>Best fit for owners who need service pages mapped to real search intent.</p>
            <p>Best fit for teams ready to look more established before the first call.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {industries.map(([title, detail], index) => (
            <article
              key={title}
              className={`lux-panel rounded-[1.4rem] p-5 ${
                index === 0
                  ? "border-[rgba(216,170,115,0.18)]"
                  : index === 4
                    ? "border-[rgba(125,183,176,0.18)]"
                    : ""
              }`}
            >
              <p className="mini-label">Sector</p>
              <h3 className="mt-4 text-xl font-semibold text-stone-50">
                {title}
              </h3>
              <p className="muted-copy mt-3 text-sm leading-7">{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
