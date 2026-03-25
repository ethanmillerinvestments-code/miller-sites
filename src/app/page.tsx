import CTABanner from "@/components/CTABanner";
import Hero from "@/components/Hero";
import HomepageLeadForm from "@/components/HomepageLeadForm";
import PackageFinder from "@/components/PackageFinder";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import ProofOfWork from "@/components/ProofOfWork";
import ScrollDepthCTA from "@/components/ScrollDepthCTA";
import SiteShell from "@/components/SiteShell";
import TrustApproach from "@/components/TrustApproach";
import TrustBar from "@/components/TrustBar";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <TrustBar />
      <PackageFinder />
      <Pricing />
      <Process />
      <HomepageLeadForm />
      <ProofOfWork />
      <TrustApproach />
      <CTABanner />
      <ScrollDepthCTA />
    </SiteShell>
  );
}
