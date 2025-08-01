"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GamepadIcon as GameController, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

interface FooterProps {
  t?: any;
}

export default function Footer({ t }: FooterProps = {}) {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  
  // Get current language from pathname
  const getCurrentLang = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0]
      if (['zh', 'de', 'es', 'fr'].includes(firstSegment)) {
        return firstSegment
      }
    }
    return 'en'
  }
  
  // Create localized link
  const createLocalizedLink = (path: string) => {
    const currentLang = getCurrentLang()
    if (currentLang === 'en') {
      return path
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

  // Get active link classes for footer links
  const getFooterLinkClasses = (href: string) => {
    const baseClasses = "transition-colors hover:scale-105 transform"
    const isActive = isActiveLink(href)
    
    if (isActive) {
      return `${baseClasses} text-accent font-bold`
    }
    return `${baseClasses} text-gray-200 hover:text-primary`
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 relative overflow-hidden border-t-8 border-gray-600">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full pop-in"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full pop-in"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full pop-in"
          style={{ animationDelay: "0.6s" }}
        ></div>

        {/* Additional decorative elements */}
        <div
          className="absolute top-20 right-1/4 w-16 h-16 bg-accent-2 rounded-full pop-in"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent-4 rounded-full pop-in"
          style={{ animationDelay: "1.2s" }}
        ></div>

        {/* Cartoon stars */}
        <div className="absolute top-1/3 right-1/3 text-4xl pop-in" style={{ animationDelay: "0.4s" }}>
          ⭐
        </div>
        <div className="absolute bottom-1/3 left-1/5 text-3xl pop-in" style={{ animationDelay: "0.7s" }}>
          ✨
        </div>
        <div className="absolute top-2/3 right-1/5 text-5xl pop-in" style={{ animationDelay: "1s" }}>
          🌟
        </div>
      </div>
      <div className="container mx-auto px-4">
        {/* Top Footer with Logo */}
        <div className="flex flex-col md:flex-row justify-center items-center border-b border-gray-600/30 pb-8 mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <GameController className="h-12 w-12 text-accent drop-shadow-lg wiggle" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white text-stroke whitespace-nowrap">{t?.footer?.gameHubCentralDescription?.split(' ')[0] === 'GameHub' ? 'GameHub Central' : 'GameHub Central'}</span>
          </Link>
        </div>

        {/* Main Footer Links - 移动端优化 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {/* About Us - 移动端简化 */}
          <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
            <p className="text-lg sm:text-xl font-black mb-3 sm:mb-4 border-b-2 sm:border-b-4 border-gray-600/50 pb-2 text-white">{t?.footer?.aboutUs || "About Us"}</p>
            {/* 移动端隐藏描述文字，桌面端显示 */}
            <p className="hidden lg:block text-gray-200 mb-4 text-sm">
              {t?.footer?.gameHubCentralDescription || "GameHub Central offers the best collection of free HTML5 games for your entertainment, optimized for all devices and completely unblocked."}
            </p>
            {/* 移动端显示简化版本 */}
            <p className="lg:hidden text-gray-200 mb-3 text-sm">
              {t?.footer?.gameHubMobile || "Free HTML5 games for everyone"}
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <Link
                href="https://www.facebook.com/sharer/sharer.php?u=https://speed-stars.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-accent transition-all hover:scale-125 transform"
                aria-label={t?.footer?.shareOnFacebook || "Share on Facebook"}
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/intent/tweet?url=https://speed-stars.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-accent transition-all hover:scale-125 transform"
                aria-label={t?.footer?.shareOnTwitter || "Share on Twitter"}
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://speed-stars.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-accent transition-all hover:scale-125 transform"
                aria-label={t?.footer?.shareOnLinkedIn || "Share on LinkedIn"}
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.reddit.com/submit?url=https://speed-stars.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-accent transition-all hover:scale-125 transform"
                aria-label={t?.footer?.shareOnReddit || "Share on Reddit"}
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Quick Links - 移动端优化 */}
          <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
            <p className="text-lg sm:text-xl font-black mb-3 sm:mb-4 border-b-2 sm:border-b-4 border-gray-600/50 pb-2 text-white">{t?.footer?.quickLinks || "Quick Links"}</p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link href={createLocalizedLink("/about")} className={getFooterLinkClasses("/about")}>
                  {t?.footer?.aboutUs || "About Us"}
                </Link>
              </li>
              <li>
                <Link href={createLocalizedLink("/contact")} className={getFooterLinkClasses("/contact")}>
                  {t?.footer?.contact || "Contact"}
                </Link>
              </li>
              <li>
                <Link href={createLocalizedLink("/blog")} className={getFooterLinkClasses("/blog")}>
                  {t?.navigation?.blog || "Blog"}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support - 移动端单独一行 */}
          <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
            <p className="text-lg sm:text-xl font-black mb-3 sm:mb-4 border-b-2 sm:border-b-4 border-gray-600/50 pb-2 text-white">{t?.footer?.support || "Support"}</p>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm sm:text-base">
              <li>
                <Link href={createLocalizedLink("/help")} className={getFooterLinkClasses("/help")}>
                  {t?.footer?.helpCenter || "Help Center"}
                </Link>
              </li>
              <li>
                <Link href={createLocalizedLink("/terms")} className={getFooterLinkClasses("/terms")}>
                  {t?.footer?.termsOfService || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href={createLocalizedLink("/privacy")} className={getFooterLinkClasses("/privacy")}>
                  {t?.footer?.privacyPolicy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href={createLocalizedLink("/cookies")} className={getFooterLinkClasses("/cookies")}>
                  {t?.footer?.cookiePolicy || "Cookie Policy"}
                </Link>
              </li>
              <li>
                <Link href={createLocalizedLink("/dmca")} className={getFooterLinkClasses("/dmca")}>
                  {t?.footer?.dmca || "DMCA"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-gray-600/30 text-center text-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} GameHub Central. {t?.footer?.allRightsReserved || "All rights reserved."}</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center text-gray-200 hover:text-accent transition-all font-black hover:scale-110"
                aria-label={t?.footer?.backToTop || "Back to top"}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {t?.footer?.backToTop || "Back to Top"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm">
            <p className="mb-2">{t?.footer?.notAffiliatedDisclaimer || "GameHub Central is not affiliated with any game developers unless specifically stated."}</p>
            <address className="mt-2 not-italic flex flex-col md:flex-row justify-center items-center gap-2">
              <span className="flex items-center">
                <span className="mr-2">📍</span>
                {t?.footer?.address || "36 Central Avenue, California, USA"}
              </span>
              <span className="hidden md:inline mx-2">|</span>
              <span className="flex items-center">
                <span className="mr-2">📧</span>
                {t?.footer?.email || "support@speed-stars.net"}
              </span>
              <span className="hidden md:inline mx-2">|</span>
              <span className="flex items-center">
                <span className="mr-2">📱</span>
                {t?.footer?.phone || "+16070231235"}
              </span>
            </address>

            <div className="mt-4 pt-4 border-t border-gray-600/30 flex flex-col md:flex-row justify-between items-center">
              <p>{t?.footer?.madeWithLove || "🎮 Made with love for gamers everywhere"}</p>
              <p>{t?.footer?.privacyPriority || "🔒 Your privacy and security are our priority"}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
