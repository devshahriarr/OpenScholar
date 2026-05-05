import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturedPapers from "@/components/landing/FeaturedPapers";
import MethodologySection from "@/components/landing/MethodologySection";
import CTASection from "@/components/landing/CTASection";

export const metadata = {
  title: "OpenScholar — Digital Research Library",
  description:
    "Explore books, research papers, and academic resources. Interact through discussion, saving, and sharing.",
};

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
