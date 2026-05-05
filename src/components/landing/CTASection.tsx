import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-24">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary/40" />

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
          Begin Your Research Journey
        </h2>
        <p className="text-base text-white/70 leading-relaxed max-w-xl mx-auto">
          Access the research dashboard to explore comprehensive data analysis tools, visualization
          capabilities, and collaborative features designed for academic excellence.
        </p>
        <Link href="/register">
          <Button
            variant="primary"
            size="lg"
            className="gap-2 shadow-lg"
            aria-label="Enter the Research Dashboard"
          >
            Enter Research Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
