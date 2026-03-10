import {
  ArrowRight,
  ClipboardList,
  Compass,
  DollarSign,
  FileSearch,
  Layers3,
  Users,
} from "lucide-react";

const quickAccessItems = [
  {
    href: "#package-finder",
    label: "Find My Price",
    title: "Get the likely package fast",
    description: "Five questions. Clear recommendation.",
    icon: DollarSign,
  },
  {
    href: "#services",
    label: "Services",
    title: "See what gets built",
    description: "Website structure, service pages, and lead capture.",
    icon: ClipboardList,
  },
  {
    href: "#pricing",
    label: "Pricing",
    title: "Compare build and support",
    description: "One-time build first. Support stays optional.",
    icon: Layers3,
  },
  {
    href: "#process",
    label: "Process",
    title: "See how launch works",
    description: "Scope, build, QA, and handoff in order.",
    icon: Compass,
  },
  {
    href: "#faq",
    label: "FAQ",
    title: "Get fast answers",
    description: "Timeline, copy, ownership, and support rules.",
    icon: FileSearch,
  },
  {
    href: "#contact",
    label: "Contact",
    title: "Send the site and main issue",
    description: "Get audit notes and next-step direction.",
    icon: Users,
  },
] as const;

export default function QuickAccess() {
  return (
    <section id="start-here" className="section-shell pb-4 sm:pb-8">
      <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.025)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Start Here</p>
            <h2 className="mt-5 text-3xl font-semibold text-stone-50 sm:text-4xl">
              Jump straight to the part you care about.
            </h2>
            <p className="muted-copy mt-4 max-w-xl text-sm leading-7">
              Price, scope, timeline, and contact should be easy to find in one
              pass.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[rgba(216,170,115,0.16)] bg-[rgba(216,170,115,0.06)] px-4 py-4 lg:max-w-sm">
            <p className="mini-label">Fast Facts</p>
            <div className="mt-3 grid gap-2 text-sm leading-7 text-stone-200">
              <p>Builds from $1,650</p>
              <p>Support from $279/mo</p>
              <p>Smaller scopes typically launch in 2-4 weeks</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            const className = "group relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-[rgba(216,170,115,0.22)] hover:bg-white/[0.05]";

            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(216,170,115,0.18)] bg-[rgba(216,170,115,0.08)] text-[color:var(--accent-strong)] transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mini-label">{item.label}</p>
                  </div>
                  <ArrowRight className="mt-2 h-4 w-4 text-stone-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[color:var(--accent-strong)]" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-stone-50">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  {item.description}
                </p>
                <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-300">
                  Open this path
                </div>
              </>
            );

            return (
              <a key={item.href} href={item.href} className={className}>
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
