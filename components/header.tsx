"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, MoreHorizontal, GamepadIcon as GameController, UserCircleIcon, LogInIcon, LogOutIcon } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import toast from "react-hot-toast"
import MobileSidebar from "./mobile-sidebar"

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [hasShownLoginSuccess, setHasShownLoginSuccess] = useState(false)
  const { data: session, status } = useSession()

  // Handle login success
  useEffect(() => {
    if (session && !hasShownLoginSuccess && status !== "loading") {
      // Log user data to console
      console.log("🎉 Login successful! User data:", {
        user: session.user,
        expires: session.expires,
        fullSession: session
      })
      
      // Show success toast
      toast.success(`Welcome back, ${session.user?.name || session.user?.email || 'Gamer'}! 🎮`, {
        duration: 4000,
        style: {
          background: '#4ade80',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '12px',
          border: '3px solid #22c55e'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#4ade80',
        },
      })
      
      setHasShownLoginSuccess(true)
    }
  }, [session, status, hasShownLoginSuccess])

  // Reset login success flag when user logs out
  useEffect(() => {
    if (!session && hasShownLoginSuccess) {
      setHasShownLoginSuccess(false)
    }
  }, [session, hasShownLoginSuccess])

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== "undefined") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsMoreMenuOpen(false)
  }

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMoreMenuOpen(false)
    }
    
    if (isMoreMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMoreMenuOpen])

  // Close more menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsMoreMenuOpen(false)
    }
    
    if (isMoreMenuOpen) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isMoreMenuOpen])

  return (
    <>
      <header className="bg-gradient-to-r from-accent via-primary to-secondary shadow-cartoon-lg py-2 sm:py-3 sticky top-0 z-40 border-b-4 border-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="flex justify-between items-center min-h-[52px] sm:min-h-[56px] w-full">
            {/* Brand */}
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mr-3 sm:mr-6">
              <GameController className="h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-white drop-shadow-lg swing flex-shrink-0" />
              <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-black text-white text-stroke whitespace-nowrap">
                <span className="hidden sm:inline">GameHub Central</span>
                <span className="sm:hidden">GameHub</span>
              </span>
            </Link>

            {/* Desktop Navigation - Adaptive */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-center max-w-3xl mx-2">
              {/* Always visible core items */}
              <Link
                href="/games"
                className="text-white hover:text-accent font-bold text-sm xl:text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Games
              </Link>
              <button
                onClick={() => scrollToSection("explore-games")}
                className="text-white hover:text-accent font-bold text-sm xl:text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Hot Games
              </button>
              <Link
                href="/blog"
                className="text-white hover:text-accent font-bold text-sm xl:text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Blog
              </Link>
              
              {/* Show all items on very large screens */}
              <div className="hidden 2xl:flex items-center space-x-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-white hover:text-accent font-bold text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-to-play")}
                  className="text-white hover:text-accent font-bold text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  How to Play
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-white hover:text-accent font-bold text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-white hover:text-accent font-bold text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  FAQ
                </button>
              </div>
              
              {/* More Menu for smaller desktop screens */}
              <div className="relative 2xl:hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMoreMenuOpen(!isMoreMenuOpen)
                  }}
                  className="text-white hover:text-accent font-bold text-sm xl:text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10 flex items-center"
                >
                  <MoreHorizontal className="w-4 h-4 mr-1" />
                  More
                </button>
                
                {/* Dropdown Menu - Fixed positioning */}
                {isMoreMenuOpen && (
                  <div className="dropdown-menu top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border-4 border-accent py-2">
                    <div className="px-2">
                      <button
                        onClick={() => scrollToSection("features")}
                        className="w-full text-left px-4 py-3 text-text hover:text-primary hover:bg-accent/10 transition-colors font-medium rounded-lg flex items-center"
                      >
                        <span className="mr-3">✨</span>
                        <span>Features</span>
                      </button>
                      <button
                        onClick={() => scrollToSection("how-to-play")}
                        className="w-full text-left px-4 py-3 text-text hover:text-primary hover:bg-accent/10 transition-colors font-medium rounded-lg flex items-center"
                      >
                        <span className="mr-3">🎯</span>
                        <span>How to Play</span>
                      </button>
                      <button
                        onClick={() => scrollToSection("testimonials")}
                        className="w-full text-left px-4 py-3 text-text hover:text-primary hover:bg-accent/10 transition-colors font-medium rounded-lg flex items-center"
                      >
                        <span className="mr-3">💬</span>
                        <span>Testimonials</span>
                      </button>
                      <button
                        onClick={() => scrollToSection("faq")}
                        className="w-full text-left px-4 py-3 text-text hover:text-primary hover:bg-accent/10 transition-colors font-medium rounded-lg flex items-center"
                      >
                        <span className="mr-3">❓</span>
                        <span>FAQ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side - Auth + Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                {status === "loading" ? (
                  <div className="bg-accent-3 text-white font-bold py-2 px-3 xl:px-4 rounded-full border-2 border-white whitespace-nowrap text-xs xl:text-sm">
                    Loading...
                  </div>
                ) : session ? (
                  <div className="flex items-center space-x-1 xl:space-x-2">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-accent-3/20 to-primary/20 rounded-full px-2 xl:px-3 py-1 xl:py-2 border-2 border-accent-3/30">
                      <UserCircleIcon className="w-4 h-4 xl:w-5 xl:h-5 text-accent-3 flex-shrink-0" />
                      <span className="text-text font-bold text-xs whitespace-nowrap max-w-[60px] xl:max-w-[80px] truncate">
                        {session.user?.name || session.user?.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        signOut()
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
                      className="bg-accent-2 hover:bg-accent text-white font-bold py-1 xl:py-2 px-2 xl:px-3 rounded-full transition-all transform hover:scale-105 border-2 border-white flex items-center whitespace-nowrap text-xs xl:text-sm"
                    >
                      <LogOutIcon className="w-3 h-3 xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                      <span className="hidden xl:inline">Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="bg-accent-3 hover:bg-accent-4 text-white font-bold py-1 xl:py-2 px-3 xl:px-4 rounded-full transition-all transform hover:scale-105 border-2 border-white flex items-center whitespace-nowrap text-xs xl:text-sm"
                  >
                    <LogInIcon className="w-3 h-3 xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                    <span className="hidden xl:inline">Sign In</span>
                    <span className="xl:hidden">In</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white bg-accent/30 p-2 rounded-full border-2 border-white/50 hover:bg-accent/50 transition-all flex-shrink-0 touch-target"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        scrollToSection={scrollToSection}
      />

    </>
  )
}
