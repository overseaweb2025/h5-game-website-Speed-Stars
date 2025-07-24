import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Games from "@/components/games"
import HowToPlay from "@/components/how-to-play"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import SpeedStarsSection from "@/components/speed-stars-section"
import GameplaySection from "@/components/gameplay-section"
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Games />
      <SpeedStarsSection />
      <GameplaySection />
      <Features />
      <HowToPlay />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
