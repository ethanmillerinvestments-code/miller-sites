import MiamiHousingExplorer from "@/components/housing/MiamiHousingExplorer";
import {
  formatHousingDate,
  miamiOxfordHousingOptions,
} from "@/lib/housing/miamiOxfordHousing";

const lastVerified = miamiOxfordHousingOptions[0]?.lastVerifiedAt ?? "2026-04-20";

export default function MiamiOxfordHousingPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <MiamiHousingExplorer options={miamiOxfordHousingOptions} />

      <section className="border-t border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Private family-share page for exemption-case planning. No public navigation and noindex
            metadata stay in place.
          </p>
          <p className="font-medium text-slate-700">Last verified {formatHousingDate(lastVerified)}</p>
        </div>
      </section>
    </main>
  );
}
