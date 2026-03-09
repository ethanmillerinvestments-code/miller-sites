const operatingMarkers = [
  "Direct operator-to-owner communication",
  "Built for home-service companies only",
  "Written scope before any payment step",
] as const;

const aboutPoints = [
  {
    title: "Sales-first structure",
    body:
      "The site is meant to earn trust faster, explain the service clearly, and push visitors toward the right next step.",
  },
  {
    title: "Cleaner mobile trust",
    body:
      "CTA placement, hierarchy, and proof are built for phone screens first because that is where local buyers judge fast.",
  },
  {
    title: "Clear ownership after launch",
    body:
      "One-time build, handoff, and optional monthly support stay separated so the business knows exactly what it owns.",
  },
] as const;

export default function HomeAbout() {
  return (
    <section id="about-leadcraft" className="section-shell pb-4 sm:pb-8">
      <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.025)] p-5 sm:p-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p className="eyebrow">About Leadcraft</p>
          <h2 className="section-title mt-5 text-4xl text-stone-50 sm:text-5xl">
            Direct, conversion-led website builds for home-service companies.
          </h2>
          <p className="muted-copy mt-5 max-w-2xl text-lg leading-8">
            Leadcraft stays narrow on purpose. The goal is a stronger first
            impression, cleaner service messaging, and a site that makes the
            company look established before the office ever answers the phone.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {operatingMarkers.map((item) => (
              <div key={item} className="stat-pill text-sm leading-6">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {aboutPoints.map((item, index) => (
            <article
              key={item.title}
              className={`rounded-[1.6rem] border p-5 ${
                index === 0
                  ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                  : index === 1
                    ? "border-[rgba(125,183,176,0.2)] bg-[rgba(125,183,176,0.07)]"
                    : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="mini-label">Why It Works</p>
              <h3 className="mt-4 text-xl font-semibold text-stone-50">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-300">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
