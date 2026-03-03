import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Industries from "@/components/Industries";
import Process from "@/components/Process";
import CTABanner from "@/components/CTABanner";
import Results from "@/components/Results";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";
import CartDrawer from "@/components/CartDrawer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ParallaxBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Services />
        <WhyChooseUs />
        <Industries />
        <Process />
        <CTABanner />
        <Results />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  );
}
