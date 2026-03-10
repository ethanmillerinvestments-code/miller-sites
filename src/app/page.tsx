import CTABanner from "@/components/CTABanner";
import Hero from "@/components/Hero";
import HomeStory from "@/components/HomeStory";
import PackageFinder from "@/components/PackageFinder";
import Pricing from "@/components/Pricing";
import SiteShell from "@/components/SiteShell";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <HomeStory />
      <PackageFinder />
      <Pricing />
      <CTABanner />
    </SiteShell>
  );
}
