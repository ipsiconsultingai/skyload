import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { ReviewSlider } from "../_components/ReviewSlider";
import { AboutHeroSection } from "./_components/AboutHeroSection";
import { ProblemSection } from "./_components/ProblemSection";
import { SolutionSection } from "./_components/SolutionSection";
import { DifferenceSection } from "./_components/DifferenceSection";
import { TargetSection } from "./_components/TargetSection";
import { AboutCtaSection } from "./_components/AboutCtaSection";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHeroSection />
        <ProblemSection />
        <SolutionSection />
        <DifferenceSection />
        <ReviewSlider />
        <TargetSection />
        <AboutCtaSection />
      </main>
      <Footer />
    </>
  );
}
