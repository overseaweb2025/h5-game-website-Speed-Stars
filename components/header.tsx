"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, MoreHorizontal, GamepadIcon as GameController, UserCircleIcon, LogInIcon, LogOutIcon, Sidebar, ChevronDown } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import toast from "react-hot-toast"
import MobileSidebar from "./mobile-sidebar"
import LanguageSelector from "./LanguageSelector"
import { SearchBox } from "./search"
import { useGameData } from "@/hooks/useGameData"
import { useWebsiteData } from "@/hooks/useWebsiteData"
import { websiteUtill } from "@/lib/website/websiteUtill"
import { getNavLanguage } from "@/app/api/nav_language"
import { useNavgationLanguage } from "@/hooks/Navigation_value/use-navigation-language"
import { top_navigation } from "@/app/api/types/Get/nav"
import { langSequence } from "@/lib/lang/utils"
import {  Locale } from "@/lib/lang/dictionaraies"
import { useLangGameList } from "@/hooks/LangGamelist_value"
interface HeaderProps {
  onSidebarToggle?: () => void
  showSidebarToggle?: boolean
  t?:any
  lang: Locale;
}

export default function Header({ onSidebarToggle, showSidebarToggle = false ,t,lang}: HeaderProps) {
  
  
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [hasShownLoginSuccess, setHasShownLoginSuccess] = useState(false)
  const { websiteData} = useWebsiteData();
  const { data: session, status } = useSession()
  const pathname = usePathname()
  // 获取 nav 的数据
  const { navState, updateLanguage } = useNavgationLanguage();
  const {autoGetData} = useLangGameList() 
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

  // Helper function to check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Get active link classes
  const getLinkClasses = (href: string) => {
    const baseClasses = "font-bold text-base hover:scale-105 transition-all cursor-pointer drop-shadow-md whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-lg";
    const isActive = isActiveLink(href);
    if (isActive) {
      return `${baseClasses} text-purple-400`;
    }
    return `${baseClasses} text-gray-300 hover:text-purple-400 hover:bg-gray-800/50`;
  }

  // Handle login success
  useEffect(() => {
    if (session && !hasShownLoginSuccess && status === "authenticated") {
      // Show success toast
      toast.success((t?.login?.welcome_back || "Welcome back, {name}! 🎮").replace("{name}", session.user?.name || session.user?.email || t?.login?.gamer || 'Gamer'), {
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
  //更新 navgation 的多语言数值
  useEffect(()=>{
    // 只更新一次
    getNavLanguage().then(res=>{
        updateLanguage(res.data.data)
      })
      autoGetData(lang)
  },[])
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
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isMoreMenuOpen])


  //navigation 首页top 顶部 导航栏信息
  const MyComponent = ({ navItems }:{navItems:top_navigation[]}) => {
  return (
    <>
       <Link
         href={createLocalizedLink('/')}
         className={getLinkClasses("/")}
       >
         {t?.header?.home || "Home"}
       </Link>
      {navItems.map((item,index) => ( // <--- 注意这里是 map
        <Link
          href={createLocalizedLink(item.url)}
          className={getLinkClasses("/" + item.text)}
           key={index + item.url}
        >
          {item.text}
        </Link>
      ))}
   </>
  );
};

  return (
    <>
      <header className="bg-gray-900/95 backdrop-blur-sm py-2 sm:py-3 sticky top-0 z-40 border-b border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="flex justify-between items-center min-h-[52px] sm:min-h-[56px] w-full">
            <div className="flex items-center">
              {/* Sidebar toggle button - only on games page */}
              {showSidebarToggle && (
                <button
                  onClick={(e) => {
                    // Add rotation animation
                    const currentRotation = e.currentTarget.style.transform.includes('rotate(180deg)') ? 0 : 180
                    e.currentTarget.style.transform = `rotate(${currentRotation}deg)`
                    // Call the toggle function
                    onSidebarToggle?.()
                  }}
                  aria-label="Toggle sidebar display mode"
                  title="Toggle sidebar between full and icon mode"
                  className="mr-2 p-1.5 text-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:scale-110 active:scale-95 group"
                  style={{
                    transform: 'rotate(0deg)',
                    transition: 'transform 0.3s ease, background-color 0.2s ease, filter 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0,0,0,0.1))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none'
                  }}
                >
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-accent transition-colors">
                    <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M19 4C19.5523 4 20 3.55229 20 3C20 2.44772 19.5523 2 19 2L3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4L19 4ZM20.47 7.95628L15.3568 11.152C14.7301 11.5437 14.7301 12.4564 15.3568 12.848L20.47 16.0438C21.136 16.4601 22 15.9812 22 15.1958V8.80427C22 8.01884 21.136 7.54 20.47 7.95628ZM11 13C11.5523 13 12 12.5523 12 12C12 11.4477 11.5523 11 11 11L3 11C2.44771 11 2 11.4477 2 12C2 12.5523 2.44771 13 3 13L11 13ZM20 21C20 21.5523 19.5523 22 19 22L3 22C2.44771 22 2 21.5523 2 21C2 20.4477 2.44771 20 3 20L19 20C19.5523 20 20 20.4477 20 21Z" fill="currentColor"/>
                  </svg>
                </button>
              )}
              
              {/* Brand */}
              <Link href={createLocalizedLink('/')} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mr-3 sm:mr-6">
              <GameController className="h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-purple-400 drop-shadow-lg swing flex-shrink-0" />
                <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-black text-white whitespace-nowrap" style={{fontFamily: 'inherit'}}>
                 {websiteData &&  websiteUtill(websiteData,'site-name')}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Adaptive */}
            <div className="hidden lg:flex items-center flex-1 justify-center max-w-4xl mx-2 space-x-4">
              
              {/* Navigation Links */}
              <nav className="flex items-center space-x-2 xl:space-x-4">
                {navState &&   <MyComponent navItems={langSequence(navState?.top_navigation, lang) || []} />
}
                
              </nav>
              
              {/* Search Box */}
              <div className="flex-1 max-w-md">
                <SearchBox
                  games={allGames}
                  placeholder={t?.search?.placeholder || "Search games..."}
                  variant="compact"
                  t={t}
                />
              </div>
              
            </div>

            {/* Right Side - Language + Auth + Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
              {/* Desktop Language Selector */}
              <div className="hidden lg:block">
                <LanguageSelector variant="desktop" />
              </div>
              
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                {status === "loading" ? (
                  <div className="bg-accent-3 text-white font-bold py-2 px-3 xl:px-4 rounded-full border-2 border-white whitespace-nowrap text-xs xl:text-sm">
                    {t?.header?.loading || "Loading..."}
                  </div>
                ) : session ? (
                  <div className="flex items-center space-x-1 xl:space-x-2">
                    <Link href="/user">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-2 xl:px-3 py-1 xl:py-2 border-2 border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-blue-500/30 transition-all cursor-pointer">
                        <UserCircleIcon className="w-4 h-4 xl:w-5 xl:h-5 text-purple-400 flex-shrink-0" />
                        <span className="text-white font-bold text-xs whitespace-nowrap max-w-[60px] xl:max-w-[80px] truncate">
                          {session.user?.name || session.user?.email}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
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
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 xl:py-2 px-2 xl:px-3 rounded-full transition-all transform hover:scale-105 border-2 border-gray-600 flex items-center whitespace-nowrap text-xs xl:text-sm"
                    >
                      <LogOutIcon className="w-3 h-3 xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                      <span className="hidden xl:inline">{t?.header?.out || "Out"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 xl:py-2 px-3 xl:px-4 rounded-full transition-all transform hover:scale-105 border-2 border-gray-600 flex items-center whitespace-nowrap text-xs xl:text-sm"
                  >
                    <LogInIcon className="w-3 h-3 xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                    <span className="hidden xl:inline">{t?.login?.signIn || "Sign In"}</span>
                    <span className="xl:hidden">{t?.login?.in || "In"}</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white bg-gray-800/50 p-2 rounded-full border-2 border-gray-600/50 hover:bg-gray-700/70 transition-all flex-shrink-0 touch-target flex items-center justify-center"
                onClick={() => setIsSidebarOpen(true)}
                aria-label={t?.header?.openMenu || "Open menu"}
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
        t={t}
        lang={lang as Locale}
      />

    </>
  )
}
