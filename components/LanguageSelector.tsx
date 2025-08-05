"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, Globe, Check } from "lucide-react"
import { Locale } from "@/lib/lang/dictionaraies"
import { getSupportedLocales, getLocaleDisplayName, getLocalizedPath, getLocaleFromPath } from "@/lib/lang/utils"

interface Language {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

interface LanguageSelectorProps {
  className?: string
  variant?: "desktop" | "mobile" | "fullscreen"
  onLanguageChange?: () => void
}

export default function LanguageSelector({ 
  className = "", 
  variant = "desktop",
  onLanguageChange
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // 获取支持的语言列表
  const languages: Language[] = getSupportedLocales().map(locale => ({
    code: locale,
    ...getLocaleDisplayName(locale)
  }))
  
  // 从当前路径获取语言
  const currentLocale = getLocaleFromPath(pathname)
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-language-selector]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false)
    }
    
    if (isOpen) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  const handleLanguageChange = (language: Language) => {
    setIsOpen(false)
    
    // 获取新的本地化路径并导航
    const newPath = getLocalizedPath(pathname, language.code)
    router.push(newPath)
    
    // 调用回调函数（用于关闭侧边栏等）
    if (onLanguageChange) {
      onLanguageChange()
    }
  }

  if (variant === "mobile") {
    return (
      <div className={`relative ${className}`} data-language-selector>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
          aria-label="Select language"
        >
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
              <span className="text-xs text-gray-400">{currentLanguage.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentLanguage.flag}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-400">{language.name}</span>
                  </div>
                </div>
                {currentLanguage.code === language.code && (
                  <Check className="w-4 h-4 text-purple-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === "fullscreen") {
    return (
      <div className={`${className}`}>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`w-full flex items-center justify-between p-4 mb-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md border-2 ${
              currentLanguage.code === language.code
                ? 'bg-accent/20 border-accent/30 shadow-lg'
                : 'bg-gray-700/30 border-gray-600/30 hover:bg-accent/10 hover:border-accent/20'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{language.flag}</span>
              <div className="flex flex-col items-start">
                <span className={`text-lg font-semibold ${
                  currentLanguage.code === language.code ? 'text-accent' : 'text-white'
                }`}>
                  {language.nativeName}
                </span>
                <span className="text-sm text-gray-400">{language.name}</span>
              </div>
            </div>
            {currentLanguage.code === language.code && (
              <div className="flex items-center space-x-2">
                <Check className="w-6 h-6 text-accent" />
                <span className="text-accent font-semibold">Current</span>
              </div>
            )}
          </button>
        ))}
      </div>
    )
  }

  // Desktop variant
  return (
    <div className={`relative ${className}`} data-language-selector>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 xl:space-x-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-2 xl:px-3 py-1 xl:py-2 rounded-full border-2 border-gray-600/50 hover:border-purple-500/50 transition-all transform hover:scale-105 whitespace-nowrap text-xs xl:text-sm"
        aria-label="Select language"
      >
        <Globe className="w-3 h-3 xl:w-4 xl:h-4 text-purple-400 flex-shrink-0" />
        <span className="hidden sm:inline font-medium">{currentLanguage.nativeName}</span>
        <span className="text-lg">{currentLanguage.flag}</span>
        <ChevronDown 
          className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

{isOpen && (
  <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 min-w-[140px] xl:min-w-[160px] max-h-64 overflow-y-auto">
    {languages.map((language) => (
      <button
        key={language.code}
        onClick={() => handleLanguageChange(language)}
        className="flex items-center justify-between w-full px-3 xl:px-4 py-2 xl:py-3 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all text-xs xl:text-sm"
      >
        <div className="flex items-center space-x-2">
          <span className="text-base xl:text-lg">{language.flag}</span>
          <div className="flex flex-col">
            <span className="font-medium">{language.nativeName}</span>
            <span className="text-xs text-gray-400">{language.name}</span>
          </div>
        </div>
        {currentLanguage.code === language.code && (
          <Check className="w-3 h-3 xl:w-4 xl:h-4 text-purple-400 flex-shrink-0" />
        )}
      </button>
    ))}
    {/* 添加自定义滚动条样式 */}
    <style jsx>{`
      div::-webkit-scrollbar {
        width: 5px;
      }
      div::-webkit-scrollbar-track {
        background: transparent;
      }
      div::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.3); /* gray-400 with opacity */
        border-radius: 9999px; /* rounded-full */
      }
    `}</style>
  </div>
)}
    </div>
  )
}