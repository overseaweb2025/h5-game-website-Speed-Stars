"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Features from "@/components/features"
import HowToPlay from "@/components/how-to-play"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

type Props = {
  params: { slug: string }
}

// This would typically come from a database or API
const gamesData = {
  "speed-stars": {
    title: "Speed Stars",
    description: "Master the rhythm in this physics-based sprinting game",
    longDescription:
      "Speed Stars is a dynamic track and field game that puts players in the fast lane of short-distance sprints. The game offers a satisfying mix of precision, timing, and high-speed thrills with various running competitions of different distances, rewarding skill and practice.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg",
    category: "Sports",
    gameUrl: "https://speedstars2.io/game/speed-stars/",
    featured: true,
    available: true,
  },
  "puzzle-quest": {
    title: "Puzzle Quest",
    description: "Challenge your brain with colorful puzzles",
    longDescription:
      "Puzzle Quest is a captivating puzzle game that combines match-3 mechanics with strategic gameplay. Solve increasingly challenging puzzles, unlock special power-ups, and compete with friends for the highest score.",
    image: "/placeholder.svg?height=300&width=400&query=cartoon puzzle game with colorful blocks",
    category: "Puzzle",
    gameUrl: "",
    featured: false,
    available: false,
  },
  "adventure-run": {
    title: "Adventure Run",
    description: "Run, jump and collect treasures in this endless runner",
    longDescription:
      "Adventure Run is an adrenaline-pumping endless runner game where you control a brave explorer navigating through dangerous terrains. Jump over obstacles, slide under barriers, and collect precious gems along the way.",
    image: "/placeholder.svg?height=300&width=400&query=cartoon character running and jumping over obstacles",
    category: "Action",
    gameUrl: "",
    featured: false,
    available: false,
  },
  "bubble-pop": {
    title: "Bubble Pop",
    description: "Pop colorful bubbles in this addictive matching game",
    longDescription:
      "Bubble Pop is a delightful bubble shooter game where you aim and pop colorful bubbles to clear the board. Match three or more bubbles of the same color to make them pop.",
    image: "/placeholder.svg?height=300&width=400&query=cartoon bubbles with faces in different colors",
    category: "Casual",
    gameUrl: "",
    featured: false,
    available: false,
  },
  "word-master": {
    title: "Word Master",
    description: "Test your vocabulary in this challenging word puzzle game",
    longDescription:
      "Word Master is the ultimate word puzzle game for vocabulary enthusiasts. Form words from a given set of letters, find hidden words in a grid, and solve word-based puzzles.",
    image: "/placeholder.svg?height=300&width=400&query=cartoon letters and word blocks in colorful design",
    category: "Word",
    gameUrl: "",
    featured: false,
    available: false,
  },
  "space-shooter": {
    title: "Space Shooter",
    description: "Defend Earth from alien invaders in this retro arcade game",
    longDescription:
      "Space Shooter is an action-packed arcade game where you pilot a spaceship defending Earth from waves of alien invaders. Dodge enemy fire, collect power-ups, and save the planet!",
    image: "/placeholder.svg?height=300&width=400&query=cartoon spaceship shooting at aliens in space",
    category: "Arcade",
    gameUrl: "",
    featured: false,
    available: false,
  },
}

export default function GamePageClient({ params }: Props) {
  const slug = params.slug
  const game = gamesData[slug as keyof typeof gamesData]

  if (!game) {
    notFound()
  }

  return (
    <main>
      <Header />

      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8">
            <div className="w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-text font-extrabold mb-6 leading-tight text-center">
                <span className="text-primary">{game.title}</span>
              </h1>

              {game.available ? (
                <div className="relative w-full rounded-xl overflow-hidden shadow-2xl mb-6" style={{ height: "600px" }}>
                  <iframe
                    src={game.gameUrl}
                    title={`${game.title} Game`}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="relative w-full rounded-xl overflow-hidden shadow-2xl mb-6" style={{ height: "600px" }}>
                  <Image src={game.image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl px-6 py-3 bg-primary/80 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                {game.available ? (
                  <button
                    onClick={() => {
                      const gameIframe = document.querySelector('iframe[title*="Game"]')
                      if (gameIframe) {
                        gameIframe.scrollIntoView({ behavior: "smooth", block: "center" })
                      }
                    }}
                    className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-center text-lg md:text-xl"
                  >
                    Play Now
                  </button>
                ) : (
                  <button
                    className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-center text-lg md:text-xl opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Coming Soon
                  </button>
                )}
                <Link
                  href="/"
                  className="bg-[#4ecdc4] hover:bg-[#3dbeb5] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-center text-lg md:text-xl"
                >
                  Back to Home
                </Link>
              </div>

              <div className="space-y-4 text-center max-w-3xl mx-auto">
                <p className="text-lg md:text-xl lg:text-2xl text-text/90 leading-relaxed">{game.description}</p>
                <p className="text-lg md:text-xl text-text/80 leading-relaxed">{game.longDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <HowToPlay />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
