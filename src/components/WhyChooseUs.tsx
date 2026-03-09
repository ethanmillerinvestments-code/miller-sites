const standards = [
  {
    kicker: "Visual Authority",
    title: "A site that looks established before the first sales call starts.",
    body:
      "Typography, spacing, hierarchy, and interaction design are treated like positioning tools, not decoration.",
  },
  {
    kicker: "Conversion Architecture",
    title: "Every section has a job and points toward one next step.",
    body:
      "Primary CTA placement, trust proof, service clarity, FAQs, and objection handling are all planned around booked calls.",
  },
  {
    kicker: "Backend Reliability",
    title: "Lead capture is wired with validation, spam resistance, and a real inbox path.",
    body:
      "No silent failures, no dead buttons, and no launch without testing the main conversion path end to end.",
  },
  {
    kicker: "Ownership & Handoff",
    title: "Custom code, deploy-ready structure, and a cleaner handoff for future growth.",
    body:
      "Pages, metadata, forms, and launch settings are built so the site can be handed off cleanly when there is no monthly plan, or actively managed when hosting and maintenance are added.",
  },
] as const;

export default function WhyChooseUs() {
  return (
    <section id="standards" className="section-pad section-rule">
      <div className="section-shell">
        <div className="max-w-3xl">
          <span className="eyebrow">Build Standards</span>
          <h2 className="section-title mt-7 text-5xl text-stone-50 sm:text-6xl">
            Built to make a home-service company look serious.
          </h2>
          <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
            High-ticket perception comes from clarity, restraint, and a cleaner
            buying path. That is the standard the Leadcraft offer is built
            around for home-service buyers.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {standards.map((item, index) => (
            <article
              key={item.title}
              className={`lux-panel rounded-[1.65rem] p-6 sm:p-7 ${
                index === 1
                  ? "border-[rgba(125,183,176,0.16)]"
                  : index === 2
                    ? "border-[rgba(216,170,115,0.18)]"
                    : ""
              }`}
            >
              <p className="mini-label">{item.kicker}</p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight text-stone-50">
                {item.title}
              </h3>
              <p className="muted-copy mt-4 text-sm leading-7">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
