import MiamiHousingExplorer from "@/components/housing/MiamiHousingExplorer";
import { miamiOxfordHousingOptions } from "@/lib/housing/miamiOxfordHousing";

export default function MiamiOxfordHousingPage() {
  return (
    <main className="min-h-screen bg-[#f4efe6] text-[#28251f]">
      <MiamiHousingExplorer options={miamiOxfordHousingOptions} />
    </main>
  );
}
