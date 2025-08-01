"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Home, GamepadIcon as GameController, BookOpen, Star, HelpCircle, MessageCircle, Zap, Target, UserCircleIcon, LogInIcon, LogOutIcon, ChevronLeft, Globe } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import toast from "react-hot-toast"
import LanguageSelector from "./LanguageSelector"
import { SearchBox } from "./search"
import { useGameData } from "@/hooks/useGameData"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  scrollToSection: (sectionId: string) => void
  t?: any
}

type SidebarView = 'main' | 'language'

export default function MobileSidebar({ isOpen, onClose, scrollToSection, t }: MobileSidebarProps) {
  const { data: session, status } = useSession()
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentView, setCurrentView] = useState<SidebarView>('main')
  const pathname = usePathname()
  
  // 获取游戏数据用于搜索
  const { allGames } = useGameData()

  // Get current language from pathname
  const getCurrentLang = () => {
    const pathSegments = pathname.split('/')
    const lang = pathSegments[1]
    return (lang === 'en' || lang === 'zh') ? lang : 'en'
  }

  // Create localized link
  const createLocalizedLink = (path: string) => {
    const currentLang = getCurrentLang()
    if (path === '/') {
      return `/${currentLang}`
    }
    return `/${currentLang}${path}`
  }

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
      setCurrentView('main') // Reset to main view when closed
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle view switching
  const switchToLanguageView = () => {
    setCurrentView('language')
  }

  const switchToMainView = () => {
    setCurrentView('main')
  }

  const menuItems = [
    { 
      icon: Home, 
      label: t?.mobileSidebar?.home || t?.header?.home || "Home", 
      path: "/",
      action: () => { window.location.href = createLocalizedLink('/'); onClose() }
    },
    { 
      icon: GameController, 
      label: t?.navigation?.allGames || t?.mobileSidebar?.allGames || "All Games", 
      path: "/games",
      action: () => { window.location.href = createLocalizedLink('/games'); onClose() }
    },
    { 
      icon: Zap, 
      label: t?.navigation?.hotGames || t?.mobileSidebar?.hotGames || "Hot Games", 
      path: "/", // This is a section on home page
      action: () => { scrollToSection("explore-games"); onClose() }
    },
    { 
      icon: BookOpen, 
      label: t?.navigation?.blog || t?.mobileSidebar?.blog || "Blog", 
      path: "/blog",
      action: () => { window.location.href = createLocalizedLink('/blog'); onClose() }
    },
    { 
      icon: Globe, 
      label: t?.mobileSidebar?.language || "Language", 
      path: "",
      action: switchToLanguageView
    }
  ]

  if (!isOpen && !isAnimating) return null

  return (
    <>
      {/* Full Screen Sidebar for Mobile/Small Screens */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Full Screen Content */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
          
          {/* Main View */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
            currentView === 'main' ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent via-primary to-secondary border-b-4 border-gray-700 flex-shrink-0" style={{ height: '80px' }}>
              <div className="flex items-center space-x-3">
                <GameController className="h-8 w-8 text-white drop-shadow-lg flex-shrink-0" />
                <span className="text-xl font-black text-white text-stroke">
                  {t?.header?.gameHub || "GameHub"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 touch-target"
                aria-label={t?.header?.closeMenu || "Close menu"}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Search Section */}
            <div className="p-4 border-b-2 border-gray-700/50 flex-shrink-0">
              <SearchBox
                games={allGames}
                placeholder={t?.search?.placeholder || "Search games..."}
                variant="default"
                t={t}
                onResultClick={onClose} // 搜索结果点击后关闭侧边栏
              />
            </div>

            {/* User Section */}
            <div className="p-6 border-b-2 border-gray-700/50 flex-shrink-0">
              {status === "loading" ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <span className="ml-3 text-white font-medium">{t?.common?.loading || "Loading..."}</span>
                </div>
              ) : session ? (
                <div className="space-y-4">
                  <Link href={createLocalizedLink('/user')} onClick={onClose}>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl px-4 py-3 border-2 border-gray-600/50 hover:bg-gradient-to-r hover:from-gray-600/50 hover:to-gray-700/50 transition-all cursor-pointer">
                      <UserCircleIcon className="w-10 h-10 text-accent-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                          {session.user?.name || (t?.mobileSidebar?.user || t?.login?.gamer || "User")}
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
                      toast.success(t?.login?.signOut_success || "Successfully signed out! See you next time! 👋", {
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
                    className="w-full bg-accent-2 hover:bg-accent text-white font-bold py-2.5 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center touch-target"
                  >
                    <LogOutIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{t?.login?.signOut || "Sign Out"}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn()
                    onClose()
                  }}
                  className="w-full bg-accent-3 hover:bg-accent-4 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center touch-target"
                >
                  <LogInIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{t?.login?.signInToGameHub || t?.mobileSidebar?.signInToGameHub || "Sign In to GameHub"}</span>
                </button>
              )}
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto">
              <nav className="px-6 py-4 space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = item.path && isActivePath(item.path)
                  return (
                    <button
                      key={index}
                      onClick={item.action}
                      className={`w-full flex items-center space-x-3 p-3 text-left rounded-xl transition-all duration-200 group hover:scale-[1.02] hover:shadow-md touch-target transform ${
                        isActive 
                          ? 'bg-accent/20 border-2 border-accent/30' 
                          : 'hover:bg-accent/10 border-2 border-transparent'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${
                        isActive 
                          ? 'text-accent' 
                          : 'text-accent-3 group-hover:text-primary'
                      }`} />
                      <span className={`font-semibold transition-colors text-sm ${
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
            </div>

            {/* Footer */}
            <div className="p-6 border-t-2 border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 flex-shrink-0">
              <div className="text-center">
                <p className="text-gray-300 text-base font-medium">
                  © 2024 {t?.header?.gameHubCentral || "GameHub Central"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {t?.footer?.gamingDestination || t?.mobileSidebar?.gamingDestination || "Your ultimate gaming destination"}
                </p>
              </div>
            </div>
          </div>

          {/* Language View */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-out ${
            currentView === 'language' ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Language Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent via-primary to-secondary border-b-4 border-gray-700 flex-shrink-0" style={{ height: '80px' }}>
              <div className="flex items-center space-x-3">
                <button
                  onClick={switchToMainView}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 touch-target"
                  aria-label={t?.common?.back || "Back"}
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <Globe className="h-8 w-8 text-white drop-shadow-lg flex-shrink-0" />
                <span className="text-xl font-black text-white text-stroke">
                  {t?.mobileSidebar?.language || t?.common?.language || "Language"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 touch-target"
                aria-label={t?.header?.closeMenu || "Close menu"}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Language Options */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-gray-300 text-lg font-semibold mb-4">
                    {t?.mobileSidebar?.selectLanguage || t?.common?.selectLanguage || "Select Language"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {t?.mobileSidebar?.languageDescription || t?.common?.languageDescription || "Choose your preferred language for the interface"}
                  </p>
                </div>
                
                {/* Enhanced Language Selector for fullscreen */}
                <div className="space-y-4">
                  <LanguageSelector variant="fullscreen" onLanguageChange={onClose} />
                </div>
              </div>
            </div>

            {/* Language Footer */}
            <div className="p-6 border-t-2 border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 flex-shrink-0">
              <button
                onClick={switchToMainView}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center touch-target"
              >
                <ChevronLeft className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{t?.common?.back || "Back"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar (for larger screens) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-400 ease-out hidden lg:block ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        style={{ willChange: 'opacity' }}
      />
      
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl z-50 transform transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex-col hidden lg:flex ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Desktop version content (keep existing design for desktop) */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-accent via-primary to-secondary border-b-4 border-gray-700" style={{ height: '80px' }}>
          <div className="flex items-center space-x-3">
            <GameController className="h-8 w-8 text-white drop-shadow-lg" />
            <span className="text-xl font-black text-white text-stroke">GameHub</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1.5">
            {menuItems.slice(0, -1).map((item, index) => ( // Exclude language item for desktop
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center space-x-2.5 p-2.5 text-left rounded-xl hover:bg-accent/10 transition-all"
              >
                <item.icon className="w-4 h-4 text-accent-3" />
                <span className="text-white font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <LanguageSelector variant="mobile" />
          </div>
        </div>
      </div>
    </>
  )
}