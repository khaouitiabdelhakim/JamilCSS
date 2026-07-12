import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { ColorPalette } from "@/components/landing/ColorPalette";
import { CodeExample } from "@/components/landing/CodeExample";
import { AnimationDemo } from "@/components/landing/AnimationDemo";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <ColorPalette />
        <CodeExample />
        <AnimationDemo />
      </main>
      <Footer />
    </>
  );
}
