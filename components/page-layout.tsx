import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Games from "@/components/games"
import HowToPlay from "@/components/how-to-play"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

interface Game {
  id: string
  title: string
  description: string
  image: string
  category: string
  iframeSrc?: string
  features?: string[]
  howToPlay?: string[]
}

interface PageLayoutProps {
  game?: Game
  showAllSections?: boolean
  heroTitle?: string
  heroDescription?: string
}

export default function PageLayout({ 
  game, 
  showAllSections = true,
  heroTitle,
  heroDescription 
}: PageLayoutProps) {
  return (
    <main>
      <Header />
      {/* Hero section - either game specific or default */}
      <Hero 
        game={game}
        title={heroTitle}
        description={heroDescription}
      />
      
      {/* Games section */}
      <Games />
      
      <Footer />
    </main>
  )
}