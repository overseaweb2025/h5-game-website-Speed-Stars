"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { heroData } from "@/data/home/hero-data"

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

interface HeroProps {
  game?: Game
  title?: string
  description?: string
}

export default function Hero({ game, title, description }: HeroProps) {
  const [iframeHeight, setIframeHeight] = useState("600px")

  useEffect(() => {
    const updateHeight = () => {
      // Calculate height based on viewport width to maintain aspect ratio
      const width = window.innerWidth
      let containerWidth
      
      if (width >= 1024) {
        // Desktop: use game frame width (900px)
        containerWidth = 900
      } else if (width >= 640) {
        // Tablet: use available width minus padding (sm: 16px margins)
        containerWidth = Math.min(width - 32, 900)
      } else {
        // Mobile: use available width minus minimal padding (2px margins = 4px total)
        containerWidth = Math.min(width - 8, 900)
      }
      
      // 16:9 aspect ratio for the game
      const height = Math.floor(containerWidth * 0.5625)
      
      // Dynamic minimum height based on screen size
      let minHeight = 200
      if (width < 400) minHeight = 180
      if (width < 320) minHeight = 160
      
      setIframeHeight(`${Math.max(height, minHeight)}px`)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-4 md:py-6 bg-white relative overflow-hidden">
      {/* Decorative cartoon clouds */}
      <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-80 pop-in"></div>
      <div
        className="absolute top-20 right-20 w-40 h-24 bg-white rounded-full opacity-70 pop-in"
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/4 w-36 h-22 bg-white rounded-full opacity-75 pop-in"
        style={{ animationDelay: "0.6s" }}
      ></div>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
              {game ? (
                <span className="gradient-text">{game.title}</span>
              ) : title ? (
                <span className="gradient-text">{title}</span>
              ) : (
                <>
                  <span className="gradient-text">{heroData.title.main}</span>
                  <span className="text-accent-2 text-stroke">{heroData.title.subtitle}</span>
                </>
              )}
            </h1>

            {/* Game container with side panels - Desktop layout */}
            <div className="hidden lg:flex justify-center items-start gap-6 mb-6 mx-auto" style={{ width: "1312px", maxWidth: "calc(100vw - 32px)" }}>
              {/* Left side panel */}
              <div 
                className="bg-gradient-to-b from-primary/20 to-secondary/20 rounded-3xl border-4 border-accent/30 cartoon-shadow flex-shrink-0"
                style={{ 
                  width: "200px", 
                  height: iframeHeight,
                  minHeight: "400px"
                }}
              >
                <div className="p-5 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="text-lg font-bold text-text mb-2">Game Tips</h3>
                  <p className="text-sm text-text/80 leading-tight">Master the timing to achieve the best scores!</p>
                </div>
              </div>

              {/* Game frame (center) */}
              <div
                id="game-frame"
                className="relative rounded-3xl overflow-hidden cartoon-shadow border-8 border-white transform hover:scale-[1.02] transition-transform flex-shrink-0"
                style={{ 
                  width: "900px", 
                  height: iframeHeight,
                  minHeight: "400px"
                }}
              >
                {(game?.iframeSrc || heroData.gameIframeSrc) ? (
                  <iframe
                    src={game?.iframeSrc || heroData.gameIframeSrc}
                    title={game?.title || "Speed Stars Game"}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎮</div>
                      <h3 className="text-3xl font-black text-text mb-3">Coming Soon!</h3>
                      <p className="text-text/80 text-lg">This awesome game will be available soon.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side panel */}
              <div 
                className="bg-gradient-to-b from-accent/20 to-accent-2/20 rounded-3xl border-4 border-primary/30 cartoon-shadow flex-shrink-0"
                style={{ 
                  width: "200px", 
                  height: iframeHeight,
                  minHeight: "400px"
                }}
              >
                <div className="p-5 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="text-lg font-bold text-text mb-2">High Score</h3>
                  <p className="text-sm text-text/80 leading-tight">Challenge yourself and beat your best time!</p>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet layout - stacked vertically */}
            <div className="lg:hidden mb-6">
              {/* Game frame (mobile) - responsive sizing */}
              <div className="mx-1 sm:mx-2 mb-4">
                <div
                  id="game-frame-mobile"
                  className="relative w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden cartoon-shadow border-2 sm:border-4 md:border-6 border-white transform hover:scale-[1.01] transition-transform"
                  style={{ 
                    height: iframeHeight
                  }}
                >
                  {(game?.iframeSrc || heroData.gameIframeSrc) ? (
                    <iframe
                      src={game?.iframeSrc || heroData.gameIframeSrc}
                      title={game?.title || "Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🎮</div>
                        <h3 className="text-2xl font-black text-text mb-2">Coming Soon!</h3>
                        <p className="text-text/80">This game will be available soon.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side panels for mobile - responsive layout */}
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 justify-center items-stretch mx-1 sm:mx-2">
                {/* For very small screens, stack vertically. For 480px+, use horizontal */}
                <div className="flex flex-col min-[480px]:flex-row gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-3 border-accent/30 cartoon-shadow">
                    <div className="p-2 sm:p-3 md:p-4 text-center">
                      <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🎮</div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-text mb-1 leading-tight">Game Tips</h3>
                      <p className="text-xs sm:text-sm text-text/80 leading-tight break-words">Master timing!</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 bg-gradient-to-b from-accent/20 to-accent-2/20 rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-3 border-primary/30 cartoon-shadow">
                    <div className="p-2 sm:p-3 md:p-4 text-center">
                      <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🏆</div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-text mb-1 leading-tight">High Score</h3>
                      <p className="text-xs sm:text-sm text-text/80 leading-tight break-words">Beat best!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom panel - aligned with game container */}
            <div className="flex justify-center mb-6">
              <div 
                className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 sm:border-3 lg:border-4 border-accent-4/30 cartoon-shadow mx-2 sm:mx-4 lg:mx-0"
                style={{ 
                  width: "1312px",
                  maxWidth: "calc(100vw - 32px)"
                }}
              >
                <div className="p-3 sm:p-4 md:p-6 lg:p-8 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4">⚡</div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-text mb-2 sm:mb-3 leading-tight">Play Speed Stars Now!</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-text/80 leading-relaxed px-1 sm:px-2">Experience the ultimate physics-based running game with stunning graphics and addictive gameplay.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 px-2">
              <button onClick={() => scrollToSection("game-frame")} className="btn-primary text-lg sm:text-xl md:text-2xl jello w-full sm:w-auto">
                {heroData.buttons.primary}
              </button>
              <Link
                href="/games"
                className="btn-secondary text-lg sm:text-xl md:text-2xl jello w-full sm:w-auto"
                style={{ animationDelay: "0.5s" }}
              >
                {heroData.buttons.secondary}
              </Link>
            </div>

            <div className="space-y-2 text-center max-w-3xl mx-auto mb-2">
              <p className="text-xl md:text-2xl lg:text-3xl text-text font-bold leading-relaxed">
                {heroData.description.main}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-text/90 font-bold leading-relaxed">
                {heroData.description.sub}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
