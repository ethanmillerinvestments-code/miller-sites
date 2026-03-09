import Contact from "@/components/Contact";
import CTABanner from "@/components/CTABanner";
import Hero from "@/components/Hero";
import HomeAbout from "@/components/HomeAbout";
import PackageFinder from "@/components/PackageFinder";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import QuickAccess from "@/components/QuickAccess";
import Services from "@/components/Services";
import FAQ from "@/components/FAQ";
import SiteShell from "@/components/SiteShell";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <QuickAccess />
      <HomeAbout />
      <PackageFinder />
      <Services />
      <WhyChooseUs />
      <Pricing />
      <Process />
      <FAQ />
      <CTABanner />
      <Contact />
    </SiteShell>
  );
}
