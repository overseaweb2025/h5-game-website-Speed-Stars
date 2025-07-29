import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import NavigationArrow from "@/components/navigation-arrow"
import GameplaySection from "@/components/gameplay-section"
import Features from "@/components/features"
import CTA from "@/components/cta"
import HomepageTestimonials from "@/components/homepage-testimonials"
import FAQ from "@/components/faq"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HomepageTestimonials />
      <FAQ />
      <NavigationArrow />
      <Footer />
    </main>
  )
}
