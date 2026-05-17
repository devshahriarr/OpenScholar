import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
          {/* Left content */}
          <div className="flex-1 pt-10 pb-10 lg:pb-16 space-y-5 pr-0 lg:pr-12">
            <h1 className="text-4xl sm:text-[42px] font-semibold leading-tight text-text-primary">
              Step Into a Digital
              <br />
              Research Library
            </h1>
            <p className="text-[15px] text-text-secondary leading-relaxed w-full">
              Explore books, research papers, and academic resources — and
              interact through discussion, saving, and sharing.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/register">
                <Button
                  variant="primary"
                  size="md"
                  aria-label="Explore the Research Dashboard"
                >
                  Explore Research Dashboard
                </Button>
              </Link>
              <Link href="#featured">
                <Button variant="outline" size="md" aria-label="Learn more">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right image — flush top, large */}
          <div className="lg:w-[55%] flex-shrink-0">
            <div className="relative w-full aspect-[16/11] lg:rounded-none rounded-xl overflow-hidden lg:mt-0">
              <Image
                src="/hero-vortex.png"
                fill
                sizes="100vw"
                alt="Hero background"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
