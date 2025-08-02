"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronUp } from "lucide-react"
import Link from "next/link"

interface NavigationArrowProps {
  isHomePage?: boolean;
}

export default function NavigationArrow({ isHomePage = true }: NavigationArrowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [drawerHeight, setDrawerHeight] = useState(40) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartHeight, setDragStartHeight] = useState(40)
  const drawerRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== "undefined") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsOpen(false)
  }

  // Handle drag start
  const handleDragStart = (clientY: number) => {
    setIsDragging(true)
    setDragStartY(clientY)
    setDragStartHeight(drawerHeight)
  }

  // Handle drag move
  const handleDragMove = (clientY: number) => {
    if (!isDragging) return
    
    const deltaY = dragStartY - clientY
    const viewportHeight = window.innerHeight
    const deltaPercent = (deltaY / viewportHeight) * 100
    
    let newHeight = dragStartHeight + deltaPercent
    
    // Constrain between 20% and 90%
    newHeight = Math.max(20, Math.min(90, newHeight))
    
    setDrawerHeight(newHeight)
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    // Snap to full screen if dragged above 70%
    if (drawerHeight > 70) {
      setDrawerHeight(90)
    } else if (drawerHeight < 30) {
      // Close if dragged too low
      setIsOpen(false)
      setDrawerHeight(40)
    } else {
      // Snap back to default
      setDrawerHeight(40)
    }
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientY)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleDragStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    handleDragMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragStartY, dragStartHeight, drawerHeight])

  // Close panel when clicking outside (with delay to prevent immediate closure)
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.navigation-arrow-container') && !target.closest('.mobile-drawer')) {
        setTimeout(() => setIsOpen(false), 100) // Small delay to prevent immediate closure
      }
    }

    // Add delay before attaching listener to prevent immediate trigger
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  // Prevent body scroll when mobile drawer is open and reset height
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setDrawerHeight(40) // Reset to default height when opened
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* PC Version - Right side arrow */}
      <div className="navigation-arrow-container fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        {/* Arrow Button - Pure white icon with slide animation */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative text-white hover:text-gray-200 transition-colors duration-300"
          style={{
            animation: isOpen ? 'none' : 'slideLeft 2s ease-in-out infinite'
          }}
        >
          <ChevronLeft 
            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* PC Slide-out Panel - Dark theme with proper sizing */}
        <div className={`
          absolute top-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 transform transition-all duration-300 ease-in-out min-w-max
          ${isOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'}
        `} style={{ 
          left: '-140px' // Position to the left of the arrow
        }}>
          <div className="px-4 py-3 whitespace-nowrap">
            <div className="space-y-2">
              {isHomePage ? (
                <>
                  <Link
                    href="#about"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 hover:text-gray-100 transition-colors rounded text-left"
                    style={{fontFamily: 'inherit'}}
                  >
                    About
                  </Link>
                  
                  <Link
                    href="#gameplay"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 hover:text-gray-100 transition-colors rounded text-left"
                    style={{fontFamily: 'inherit'}}
                  >
                    Gameplay
                  </Link>
                  
                  <Link
                    href="#what-players-say"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 hover:text-gray-100 transition-colors rounded text-left"
                    style={{fontFamily: 'inherit'}}
                  >
                    What Players Say
                  </Link>
                  
                  <Link
                    href="#faq"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 hover:text-gray-100 transition-colors rounded text-left"
                    style={{fontFamily: 'inherit'}}
                  >
                    FAQ
                  </Link>
                </>
              ) : (
                <Link
                  href="#what-players-say"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 hover:text-gray-100 transition-colors rounded text-left"
                  style={{fontFamily: 'inherit'}}
                >
                  What Players Say
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Bottom floating arrow */}
      <div className="fixed bottom-6 right-1/2 transform translate-x-1/2 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-gray-200 transition-colors duration-300"
          style={{
            animation: isOpen ? 'none' : 'slideUp 2s ease-in-out infinite'
          }}
        >
          <ChevronUp 
            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Drawer - Bottom slide up */}
      {isOpen && (
        <div className="mobile-drawer fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer - Dark theme with drag support */}
          <div 
            ref={drawerRef}
            className={`
              absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl shadow-xl border-t border-gray-600 transform ease-out
              ${isOpen ? 'translate-y-0' : 'translate-y-full'}
              ${isDragging ? '' : 'transition-all duration-300'}
            `} 
            style={{ height: `${drawerHeight}vh` }}
          >
            {/* Draggable Handle */}
            <div 
              className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4 h-full overflow-y-auto">
              <div className="space-y-4">
                {isHomePage ? (
                  <>
                    <Link
                      href="#about"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between w-full p-4 text-lg font-semibold text-white hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <span>About</span>
                      <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
                    </Link>
                    
                    <Link
                      href="#gameplay"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between w-full p-4 text-lg font-semibold text-white hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <span>Gameplay</span>
                      <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
                    </Link>
                    
                    <Link
                      href="#what-players-say"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between w-full p-4 text-lg font-semibold text-white hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <span>What Players Say</span>
                      <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
                    </Link>
                    
                    <Link
                      href="#faq"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between w-full p-4 text-lg font-semibold text-white hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <span>FAQ</span>
                      <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
                    </Link>
                  </>
                ) : (
                  <Link
                    href="#what-players-say"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between w-full p-4 text-lg font-semibold text-white hover:bg-gray-700 transition-colors rounded-lg"
                  >
                    <span>What Players Say</span>
                    <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideLeft {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-8px);
          }
        }
        
        @keyframes slideUp {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </>
  )
}