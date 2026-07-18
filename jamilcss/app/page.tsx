import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { Playground } from "@/components/landing/Playground";
import { StatsComparison } from "@/components/landing/StatsComparison";
import { ThemeDemo } from "@/components/landing/ThemeDemo";
import { Community } from "@/components/landing/Community";
import { ColorPalette } from "@/components/landing/ColorPalette";
import { AnimationDemo } from "@/components/landing/AnimationDemo";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <Playground />
        <StatsComparison />
        <ThemeDemo />
        <Community />
        <ColorPalette />
        <AnimationDemo />
      </main>
      <Footer />
    </>
  );
}
