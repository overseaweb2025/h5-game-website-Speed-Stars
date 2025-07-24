"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsAnimating(false), 300)
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
      action: () => { window.location.href = '/'; onClose() }
    },
    { 
      icon: GameController, 
      label: "All Games", 
      action: () => { window.location.href = '/games'; onClose() }
    },
    { 
      icon: Zap, 
      label: "Hot Games", 
      action: () => { scrollToSection("explore-games"); onClose() }
    },
    { 
      icon: BookOpen, 
      label: "Blog", 
      action: () => { window.location.href = '/blog'; onClose() }
    },
    { 
      icon: Star, 
      label: "Features", 
      action: () => { scrollToSection("features"); onClose() }
    },
    { 
      icon: Target, 
      label: "How to Play", 
      action: () => { scrollToSection("how-to-play"); onClose() }
    },
    { 
      icon: MessageCircle, 
      label: "Testimonials", 
      action: () => { scrollToSection("testimonials"); onClose() }
    },
    { 
      icon: HelpCircle, 
      label: "FAQ", 
      action: () => { scrollToSection("faq"); onClose() }
    }
  ]

  if (!isOpen && !isAnimating) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-accent via-primary to-secondary border-b-4 border-white flex-shrink-0">
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
        <div className="p-4 sm:p-6 border-b-2 border-accent/20 flex-shrink-0">
          {status === "loading" ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <span className="ml-3 text-text font-medium">Loading...</span>
            </div>
          ) : session ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-accent-3/20 to-primary/20 rounded-xl px-3 sm:px-4 py-3 border-2 border-accent-3/30">
                <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-accent-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-text font-bold text-sm truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-text/70 text-xs truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
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
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 text-left hover:bg-accent/10 rounded-xl transition-all duration-200 group hover:scale-[1.02] hover:shadow-md touch-target"
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-3 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="text-text font-semibold group-hover:text-primary transition-colors text-sm sm:text-base">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
          
          {/* Extra space for better scrolling */}
          <div className="h-20"></div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 sm:p-6 border-t-2 border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5 flex-shrink-0">
          <div className="text-center">
            <p className="text-text/70 text-sm font-medium">
              © 2024 GameHub Central
            </p>
            <p className="text-text/60 text-xs mt-1">
              Your ultimate gaming destination
            </p>
          </div>
        </div>
      </div>
    </>
  )
}