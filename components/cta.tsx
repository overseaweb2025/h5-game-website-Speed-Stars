"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface CTAProps {
  t?: any;
}

export default function CTA({ t }: CTAProps = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const scrollToGame = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Scroll to game frame
    const gameFrame = document.getElementById("game-frame")
    if (gameFrame) {
      gameFrame.scrollIntoView({ behavior: "smooth" })
    }

    const scrollDuration = 1000 // Fixed duration for consistency

    // Reset loading state after scrolling is complete
    setTimeout(() => {
      setIsLoading(false)
    }, scrollDuration)
  }

  return (
    <section id="play-now" className="py-8 md:py-12 relative overflow-hidden">
      {/* Decorative confetti */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 left-10 text-4xl pop-in">🎉</div>
        <div className="absolute top-20 right-20 text-3xl pop-in" style={{ animationDelay: "0.3s" }}>
          🎊
        </div>
        <div className="absolute bottom-10 left-1/2 text-4xl pop-in" style={{ animationDelay: "0.6s" }}>
          🎈
        </div>
        <div className="absolute bottom-20 right-10 text-3xl pop-in" style={{ animationDelay: "0.9s" }}>
          ✨
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h2 className="text-white mb-4 font-black pop-in text-shadow-lg">
              {t?.cta?.readyToJoin || "Ready to Join the  Championship?"}
            </h2>
            <p className="text-gray-200 mb-6 text-xl font-bold">
              {t?.cta?.ctaDescription || "Experience the thrill of physics-based sprinting in this free online game. No downloads, no restrictions - just instant fun! Challenge friends, represent your country, and climb the global leaderboards."}
            </p>
            <Link
              href="#"
              onClick={scrollToGame}
              className="bg-gradient-to-r from-primary to-accent-2 hover:from-accent-2 hover:to-primary text-white font-black py-4 px-10 rounded-full transition-all transform hover:scale-110 hover:rotate-3 shadow-cartoon-lg text-center inline-flex items-center justify-center min-w-[250px] text-xl border-4 border-white jello"
              aria-label={isLoading ? (t?.cta?.loadingGame || "Loading game...") : (t?.cta?.playSpeedStarsNow || "Play  Now")}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t?.cta?.loadingGame || "Loading Game..."}
                </>
              ) : (
                {t?.cta?.playSpeedStarsNow || "Play  Now - It's Free!"}
              )}
            </Link>
          </div>

          <div className="md:w-1/2">
            <div className="relative h-[300px] w-full transform hover:scale-105 transition-transform">
              <Image
                src="https://play-lh.googleusercontent.com/034GbR6y0xK4StG-uiYgc9bL2ZhiOA8ktcLjIUF0pNmMovpGwF8hXYBbd8zGG-TQCbxx=w526-h296-rw"
                alt={t?.hero?.speedStarUnblocked || " game screenshot"}
                fill
                className="object-contain swing"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
