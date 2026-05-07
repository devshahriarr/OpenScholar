import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturedPapers from "@/components/landing/FeaturedPapers";
import MethodologySection from "@/components/landing/MethodologySection";
import CTASection from "@/components/landing/CTASection";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (token) {
    redirect("/search");
  }

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
