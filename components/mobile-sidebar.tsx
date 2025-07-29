"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Home, GamepadIcon as GameController, BookOpen, Star, HelpCircle, MessageCircle, Zap, Target, UserCircleIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import toast from "react-hot-toast"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  scrollToSection: (sectionId: string) => void
}

export default function MobileSidebar({ isOpen, onClose, scrollToSection }: MobileSidebarProps) {
  const { data: session, status } = useSession()
  const [isAnimating, setIsAnimating] = useState(false)
  const pathname = usePathname()

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/",
      action: () => { window.location.href = '/'; onClose() }
    },
    { 
      icon: GameController, 
      label: "All Games", 
      path: "/games",
      action: () => { window.location.href = '/games'; onClose() }
    },
    { 
      icon: Zap, 
      label: "Hot Games", 
      path: "/", // This is a section on home page
      action: () => { scrollToSection("explore-games"); onClose() }
    },
    { 
      icon: BookOpen, 
      label: "Blog", 
      path: "/blog",
      action: () => { window.location.href = '/blog'; onClose() }
    },
    { 
      icon: Star, 
      label: "Features", 
      path: "/", // This is a section on home page
      action: () => { scrollToSection("features"); onClose() }
    },
    { 
      icon: Target, 
      label: "How to Play", 
      path: "/", // This is a section on home page
      action: () => { scrollToSection("how-to-play"); onClose() }
    },
    { 
      icon: MessageCircle, 
      label: "Testimonials", 
      path: "/", // This is a section on home page
      action: () => { scrollToSection("testimonials"); onClose() }
    },
    { 
      icon: HelpCircle, 
      label: "FAQ", 
      path: "/", // This is a section on home page
      action: () => { scrollToSection("faq"); onClose() }
    }
  ]

  if (!isOpen && !isAnimating) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-400 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ willChange: 'opacity' }}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl z-50 transform transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Header - Fixed */}
        <div className={`flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-accent via-primary to-secondary border-b-4 border-gray-700 flex-shrink-0 transition-all duration-400 transform ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
        style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}>
          <div className="flex items-center space-x-3">
            <GameController className="h-7 w-7 sm:h-8 sm:w-8 text-white drop-shadow-lg flex-shrink-0" />
            <span className="text-lg sm:text-xl font-black text-white text-stroke">GameHub</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 touch-target"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
        </div>

        {/* User Section - Fixed */}
        <div className={`p-4 sm:p-6 border-b-2 border-gray-700/50 flex-shrink-0 transition-all duration-400 transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}>
          {status === "loading" ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <span className="ml-3 text-white font-medium">Loading...</span>
            </div>
          ) : session ? (
            <div className="space-y-3 sm:space-y-4">
              <Link href="/user" onClick={onClose}>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl px-3 sm:px-4 py-3 border-2 border-gray-600/50 hover:bg-gradient-to-r hover:from-gray-600/50 hover:to-gray-700/50 transition-all cursor-pointer">
                  <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-accent-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-gray-300 text-xs truncate">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  signOut()
                  onClose()
                  toast.success("Successfully signed out! See you next time! 👋", {
                    duration: 3000,
                    style: {
                      background: '#f59e0b',
                      color: '#fff',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      border: '3px solid #d97706'
                    }
                  })
                }}
                className="w-full bg-accent-2 hover:bg-accent text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center touch-target"
              >
                <LogOutIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                signIn()
                onClose()
              }}
              className="w-full bg-accent-3 hover:bg-accent-4 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center touch-target"
            >
              <LogInIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span>Sign In to GameHub</span>
            </button>
          )}
        </div>

        {/* Navigation Menu - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="px-3 sm:px-4 py-4 space-y-1 sm:space-y-2">
            {menuItems.map((item, index) => {
              const isActive = isActivePath(item.path)
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 text-left rounded-xl transition-all duration-200 group hover:scale-[1.02] hover:shadow-md touch-target transform ${
                    isActive 
                      ? '' 
                      : 'hover:bg-accent/10'
                  } ${
                    isOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                    transitionDuration: '300ms'
                  }}
                >
                  <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors flex-shrink-0 ${
                    isActive 
                      ? 'text-accent' 
                      : 'text-accent-3 group-hover:text-primary'
                  }`} />
                  <span className={`font-semibold transition-colors text-sm sm:text-base ${
                    isActive 
                      ? 'text-accent font-bold' 
                      : 'text-white group-hover:text-primary'
                  }`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
          
          {/* Extra space for better scrolling */}
          <div className="h-20"></div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 sm:p-6 border-t-2 border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 flex-shrink-0">
          <div className="text-center">
            <p className="text-gray-300 text-sm font-medium">
              © 2024 GameHub Central
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Your ultimate gaming destination
            </p>
          </div>
        </div>
      </div>
    </>
  )
}