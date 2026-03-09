import Link from "next/link";

const pitchViews = [
  {
    id: "trust",
    label: "Trust",
    title: "The site should make the company feel established before the call starts.",
    summary:
      "Buyers decide fast. If the site looks generic, trust drops, price pressure rises, and the company has to resell itself on the phone.",
    bullets: [
      "Sharper presentation increases confidence before contact",
      "Service clarity lowers confusion and wasted calls",
      "Cleaner structure makes higher-ticket work easier to present",
    ],
    ctaLabel: "See why it matters",
    ctaHref: "/why-leadcraft",
  },
  {
    id: "sales",
    label: "Sales Path",
    title: "The homepage should push visitors into the right next step fast.",
    summary:
      "The point is not a long homepage. The point is a clear overview, then controlled paths into pricing, deliverables, audit requests, and contact.",
    bullets: [
      "Overview first, deeper detail on deliberate clicks",
      "Pricing, services, FAQ, audit requests, and deliverables stay easy to reach",
      "The site carries buyers forward instead of making them hunt",
    ],
    ctaLabel: "See what you get",
    ctaHref: "#results",
  },
  {
    id: "ownership",
    label: "Ownership",
    title: "Clients should understand the split between one-time build and monthly support immediately.",
    summary:
      "One-time delivery, clean handoff, and optional monthly support should be obvious from the start. That reduces friction and weak objections later.",
    bullets: [
      "One-time builds stay separate from recurring support",
      "Monthly support is visible, optional, and specific",
      "Ownership, scope, and launch responsibilities stay clear",
    ],
    ctaLabel: "Find my price",
    ctaHref: "#package-finder",
  },
] as const;

export default function SalesPitchDeck() {
  return (
    <section className="section-shell pb-4 sm:pb-8">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Pitch Screens</p>
            <h2 className="mt-5 text-4xl font-semibold text-stone-50 sm:text-5xl">
              The sales pitch should land before the long explanation does.
            </h2>
            <p className="muted-copy mt-5 text-sm leading-7 sm:text-base">
              Buyers should understand trust, path, and ownership within a few
              seconds. The deeper pages can handle detail once the overview is
              already clear.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.07)] px-4 py-4 text-sm leading-7 text-stone-200 lg:max-w-sm">
            Keep the opening argument simple. Show fit, show what improves, and
            show the next useful action without stacking too many competing
            widgets.
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {pitchViews.map((view, index) => (
            <article
              key={view.id}
              className={`rounded-[1.6rem] border p-5 ${
                index === 0
                  ? "border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.06)]"
                  : index === 1
                    ? "border-[rgba(125,183,176,0.2)] bg-[rgba(125,183,176,0.07)]"
                    : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="mini-label">{view.label}</p>
              <h3 className="mt-4 text-2xl font-semibold text-stone-50">
                {view.title}
              </h3>
              <p className="muted-copy mt-4 text-sm leading-7">{view.summary}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                {view.bullets.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {view.ctaHref.startsWith("#") ? (
                <a
                  href={view.ctaHref}
                  className="button-secondary mt-6 w-full justify-center px-5 py-3 text-sm"
                >
                  {view.ctaLabel}
                </a>
              ) : (
                <Link
                  href={view.ctaHref}
                  className="button-secondary mt-6 w-full justify-center px-5 py-3 text-sm"
                >
                  {view.ctaLabel}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
