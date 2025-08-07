"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GamepadIcon as GameController } from "lucide-react"
import SocialIcons from "./footer/SocialIcons"
import { useWebsiteData } from "@/hooks/useWebsiteData"
import { websiteUtill } from "@/lib/website/websiteUtill"
import { useNavgationLanguage } from "@/hooks/Navigation_value/use-navigation-language"
import { contentMessage, footer_nav, top_navigation } from "@/app/api/types/Get/nav"
import { langSequence, langSequence_footernavigation } from "@/lib/lang/utils"
import {Locale, localesArrary } from '@/lib/lang/dictionaraies'

interface FooterProps {
  t?: any; // 更好的类型是 t: Dictionary
  lang: Locale;
}

export const revalidate = 20000;
export async function generateStaticParams() {
    const languages: Locale[] = localesArrary;
    const params: { lang: Locale }[] = [];

    // 为每种语言调用一次 API
    for (const lang of languages) {
          params.push({ lang });
    }

    return params;
}

export default function Footer({ t, lang }: FooterProps) {

  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const { websiteData} = useWebsiteData();
  // 获取 nav 的数据
  const { navState, updateLanguage } = useNavgationLanguage();

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


  const getSociallcons = ()=>{
    if(websiteData)return    <SocialIcons websiteData={websiteData} />

    return null
  }

  //navigation 首页top 顶部 导航栏信息
  const FooterComponents = ({ navItems }:{navItems:footer_nav[]}) => {
  return (
    <>  
       {navItems.map((item,index)=>{
        return(
          <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50" key={index}>
            <p className="text-lg sm:text-xl font-black mb-3 sm:mb-4 border-b-2 sm:border-b-4 border-gray-600/50 pb-2 text-white">{item.block}</p>
            <ul className="space-y-2 text-sm sm:text-base">
              {['About Us','关于我们',"À propos de nous",
                "Liens rapides","हमारे बारे में","私たちについて", 
                "회사 소개","О нас","Tungkol sa Amin",
                 "Về chúng tôi"].includes(item.block)  ? <AboutItems items={item.content} /> : <FooterItems items={item.content} />}
              
            </ul>
            
          </div>
        )
       })}
    </>
  );
};
// 通用版式
  const FooterItems = ({items}:{items:contentMessage[]})=>{
    if (!Array.isArray(items)) {
      return null;
    }
    
    return(
      <>
      {
        items.map((item,index)=>{
          return (
          <li key={index}>
            <Link href={createLocalizedLink(item.href)} className={getFooterLinkClasses(item.text)}>
              {item.text}
            </Link>
          </li>
          )
        })
      }
      </>
    )
  }
 // 特殊类型
  const AboutItems = ({items}:{items:contentMessage[]})=>{
    if (!Array.isArray(items)) {
      return (
        <>
          {getSociallcons()}
        </>
      );
    }
    
    return (
      <>
          {
            items.map((item,index)=>{
              return (
                <div key={index}>
                  {/* 移动端隐藏描述文字，桌面端显示 */}
                  <p className="hidden lg:block text-gray-200 mb-4 text-sm">
                     {item.text}
                  </p>
                  {/* 移动端显示简化版本 */}
                  <p className="lg:hidden text-gray-200 mb-3 text-sm">
                     {item.text}
                  </p>
                </div>
              )
            })
          }
            {getSociallcons()}
      </>
    )
  }
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 relative overflow-hidden border-t-8 border-gray-600">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full pop-in"/>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full pop-in"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full pop-in"
          style={{ animationDelay: "0.6s" }}
        />

        {/* Additional decorative elements */}
        <div
          className="absolute top-20 right-1/4 w-16 h-16 bg-accent-2 rounded-full pop-in"
          style={{ animationDelay: "0.9s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent-4 rounded-full pop-in"
          style={{ animationDelay: "1.2s" }}
        />
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
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white text-stroke whitespace-nowrap">
              {websiteData &&  websiteUtill(websiteData,'site-name')}
            </span>
          </Link>
        </div>

        {/* Main Footer Links - 移动端优化 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
          <FooterComponents navItems={langSequence_footernavigation(navState?.footer_nav, lang) || []} />
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-gray-600/30 text-center text-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} {websiteData && websiteUtill(websiteData,'site-name')}. {t?.footer?.allRightsReserved}</p>
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
                {t?.footer?.backToTop}
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm">
 

            <div className="mt-4 pt-4 border-t border-gray-600/30 flex flex-col md:flex-row justify-between items-center">
              <p>{t?.footer?.madeWithLove }</p>
              <p>{t?.footer?.privacyPriority || "🔒 Your privacy and security are our priority"}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
