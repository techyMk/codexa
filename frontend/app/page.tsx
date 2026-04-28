import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Showcase } from "@/components/landing/showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
