import { Header } from "./_components/Header";
import { HeroSection } from "./_components/HeroSection";
import { TrustSection } from "./_components/TrustSection";
import { PainPointSection } from "./_components/PainPointSection";
import { DualVerificationSection } from "./_components/DualVerificationSection";
import { ProcessSection } from "./_components/ProcessSection";
import { ServiceCardSection } from "./_components/ServiceCardSection";
import { PreviewSection } from "./_components/PreviewSection";
import { PricingSection } from "./_components/PricingSection";
import { ReviewSlider } from "./_components/ReviewSlider";
import { FaqSection } from "./_components/FaqSection";
import { CtaSection } from "./_components/CtaSection";
import { Footer } from "./_components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <PainPointSection />
        <DualVerificationSection />
        <ProcessSection />
        <ServiceCardSection />
        <PreviewSection />
        <PricingSection />
        <ReviewSlider />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
