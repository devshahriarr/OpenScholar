import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturedPapers from "@/components/landing/FeaturedPapers";
import MethodologySection from "@/components/landing/MethodologySection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturedPapers />
        <MethodologySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
