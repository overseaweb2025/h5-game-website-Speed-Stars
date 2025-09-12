"use client"

import { useState, useEffect } from "react"
import { Locale } from "@/lib/lang/dictionaraies"
import { useLangGameList } from "@/hooks/LangGamelist_value"
import { useHomeLanguage } from "@/hooks/LangHome_value"
import { Game as APIGame, reviews_comment, game } from "@/app/api/types/Get/game"
import { getGameDetails } from "@/app/api/game"
import DesktopHero from "./DesktopHero"
import MobileHero from "./MobileHero"

interface HomeHeroProps {
  title?: string;
  description?: string;
  lang: Locale;
  t?: any;
}

export default function HomeHero({ title, description, lang, t }: HomeHeroProps) {
  const [iframeHeight, setIframeHeight] = useState("600px")
  const [randomGames, setRandomGames] = useState<game[]>([])
  const [speedStarsReviews, setSpeedStarsReviews] = useState<reviews_comment[]>([])
  
  // 使用useLangGameList获取多语言游戏数据
  const { getLangGames, getLangGamelistBylang, autoGetData: autoGetGameListData } = useLangGameList()
  const allGames = getLangGames(lang)
  
  // 使用首页语言管理器
  const { getHomeInfoByLang, autoGetHomeData } = useHomeLanguage()
  const homeData = getHomeInfoByLang(lang)

  // 初始化游戏数据获取
  useEffect(() => {
    // 同时获取首页核心数据和游戏列表数据
    autoGetHomeData(lang)
    autoGetGameListData(lang)
  }, [lang, autoGetHomeData, autoGetGameListData])

  // 获取随机游戏数据 - 只在allGames首次加载时执行一次
  useEffect(() => {
    if (allGames.length > 0) {
      setRandomGames(prevRandomGames => {
        if (prevRandomGames.length === 0) {
          // 从多语言游戏数据中随机获取足够多的游戏用于填充各个区域
          const shuffled = [...allGames].sort(() => 0.5 - Math.random())
          return shuffled
        }
        return prevRandomGames
      })
    }
  }, [allGames])

  // 获取speed-stars的评论数据（首页专用）
  useEffect(() => {
    const fetchSpeedStarsReviews = async () => {
      setSpeedStarsReviews([])
    }
    
    // 延迟执行，等待游戏数据加载完成
    const timer = setTimeout(fetchSpeedStarsReviews, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const updateHeight = () => {
      // Calculate height based on viewport width to maintain rectangular aspect ratio
      const width = window.innerWidth
      let containerWidth
      
      if (width >= 1024) {
        // Desktop: use game frame width within the expanded container (1080 * 1.125 = 1215px)
        containerWidth = 1215 - 48 + 300 // subtract padding and add 300px
      } else if (width >= 640) {
        // Tablet: use available width minus padding
        containerWidth = Math.min(width - 64, 1215 - 48 + 300)
      } else {
        // Mobile: use available width minus minimal padding
        containerWidth = Math.min(width - 16, 1215 - 48 + 300)
      }
      
      // 16:10 aspect ratio for better rectangular game display (more suitable for most games) - 减小1/2高度
      const height = Math.floor(containerWidth * 0.625 * 0.5)
      
      // Dynamic minimum height based on screen size to ensure playability - 减小1/2高度
      let minHeight = 150
      if (width >= 1024) minHeight = 200
      if (width >= 1440) minHeight = 250
      if (width < 640) minHeight = 125
      if (width < 480) minHeight = 100
      
      setIframeHeight(`${Math.max(height, minHeight)}px`)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-4 md:py-6 bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-4">
          {/* Desktop Layout */}
          <DesktopHero
            title={title}
            homeData={homeData}
            randomGames={randomGames}
            iframeHeight={iframeHeight}
            scrollToSection={scrollToSection}
            t={t}
          />

          {/* Mobile/Tablet Layout */}
          <MobileHero
            homeData={homeData}
            t={t}
            lang={lang}
          />
        </div>
      </div>
    </section>
  )
}