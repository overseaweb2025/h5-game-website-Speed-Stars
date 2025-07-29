"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NavigationArrow() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== "undefined") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsOpen(false)
  }

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.navigation-arrow-container')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="navigation-arrow-container fixed right-0 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      {/* Arrow Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 p-2 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200
          ${isOpen ? 'translate-x-0' : 'hover:-translate-x-1'}
        `}
        style={{
          animation: isOpen ? 'none' : 'slideLeft 2s ease-in-out infinite'
        }}
      >
        <ChevronLeft 
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Slide-out Panel */}
      <div className={`
        absolute right-0 top-0 bg-white rounded-l-lg shadow-xl border border-gray-200 transform transition-transform duration-300 ease-in-out min-h-fit
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `} style={{ width: '200px', marginTop: '-120px' }}>
        <div className="p-3">
          <div className="space-y-1">
            <Link 
              href="/games"
              onClick={() => setIsOpen(false)}
              className="block w-full p-2 text-base font-semibold text-[#22223b] hover:bg-primary/10 hover:text-primary transition-colors rounded text-left"
              style={{fontFamily: 'inherit'}}
            >
              All Games
            </Link>
            
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full p-2 text-base font-semibold text-[#22223b] hover:bg-primary/10 hover:text-primary transition-colors rounded text-left"
              style={{fontFamily: 'inherit'}}
            >
              Features
            </button>
            
            <button
              onClick={() => scrollToSection("how-to-play")}
              className="block w-full p-2 text-base font-semibold text-[#22223b] hover:bg-primary/10 hover:text-primary transition-colors rounded text-left"
              style={{fontFamily: 'inherit'}}
            >
              How to Play
            </button>
            
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full p-2 text-base font-semibold text-[#22223b] hover:bg-primary/10 hover:text-primary transition-colors rounded text-left"
              style={{fontFamily: 'inherit'}}
            >
              Reviews
            </button>
            
            <button
              onClick={() => scrollToSection("faq")}
              className="block w-full p-2 text-base font-semibold text-[#22223b] hover:bg-primary/10 hover:text-primary transition-colors rounded text-left"
              style={{fontFamily: 'inherit'}}
            >
              FAQ
            </button>
            
            <Link 
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block w-full p-2 text-base font-semibold text-[#22223b] hover:bg-primary/10 hover:text-primary transition-colors rounded text-left"
              style={{fontFamily: 'inherit'}}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}