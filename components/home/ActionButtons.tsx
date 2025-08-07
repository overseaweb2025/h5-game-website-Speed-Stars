"use client"

import Link from "next/link"
import { heroData } from "@/data/home/hero-data"

interface ActionButtonsProps {
  scrollToSection: (sectionId: string) => void
}

export default function ActionButtons({ scrollToSection }: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 justify-center mb-6 px-2">
      <button 
        onClick={() => scrollToSection("game-frame")} 
        className="btn-primary text-lg sm:text-xl md:text-2xl jello w-full max-w-sm mx-auto"
      >
        {heroData.buttons.primary}
      </button>
      <Link
        href="/games"
        className="btn-secondary text-lg sm:text-xl md:text-2xl jello w-full max-w-sm mx-auto"
        style={{ animationDelay: "0.5s" }}
      >
        {heroData.buttons.secondary}
      </Link>
    </div>
  )
}