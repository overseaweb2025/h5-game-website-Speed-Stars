"use client"

import React, { useEffect, useMemo } from "react"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import GameHero from '@/components/hero/index'
import NavigationArrow from "@/components/navigation-arrow"
import LoadingSpinner from "@/shared/components/LoadingSpinner"
import GameDetailsCacheDebug from "@/components/GameDetailsCacheDebug"
import { useGameDetails } from "@/hooks/useGameDetails"
import { useGameHistory } from "@/hooks/useGameHistory"
import { useGamePageTimer } from "@/hooks/useGamePageTimer"
import { gameDetailsParser } from "@/lib/game-utils"
import { useResponsive } from "@/shared/hooks/useResponsive"
import { GameRouter } from "@/lib/router"
import { Locale } from "@/lib/lang/dictionaraies"
import { useLangGameDetails } from "@/hooks/LangGameDetails_value"
import { useLangGameList } from "@/hooks/LangGamelist_value"
interface GamePageClientProps {
  slug: string
  lang:Locale
  t:any
}

export default function GamePageClient({ slug,lang,t }: GamePageClientProps) {
  // 响应式屏幕检测
  const { isSmallScreen } = useResponsive({ breakpoint: 1024 })

  // 游戏详情状态管理器
  const {
    data: gameData,
    isLoading: loading,
    error,
    isCached,
    getGameDetails
  } = useGameDetails(slug)
  //游戏详情管理器
  const {autoGetData,getGameDetailsFromCache} = useLangGameDetails()
  const gameDetails = getGameDetailsFromCache(lang,slug)
  const {getLangGamelistBylang,getLangGames} = useLangGameList()
  const GameList = getLangGames(lang)
  // 游戏历史记录功能
  const { isEnabled } = useGameHistory()
  
  // 使用 useMemo 优化 gameInfo 对象，避免无限重新创建
  const gameInfo = useMemo(() => {
    if (gameData) {
      return {
        id: gameData.gameSlug || slug,
        page_title: gameData.page_title,
        page_description: gameData.page_description,
        page_keywords: gameData.page_keywords,
        name: gameData.display_name,
        slug: slug,
        image: '/placeholder-game.jpg', // 使用占位图
        category: gameData.categoryInfo?.name || 'Games',
        description: gameData.info || '',
      }
    } else {
      return {
        id: slug,
        page_title: '',
        page_description: '',
        page_keywords: '',
        name: 'Loading...',
        slug: slug,
        image: '/placeholder-game.jpg', // 使用占位图
        category: 'Games',
        description: ''
      }
    }
  }, [gameData, slug])
  
  // 游戏页面计时器 - 只在有游戏数据且用户已登录时启用
  const gamePageTimer = useGamePageTimer({
    threshold: 30, // 30秒后添加到历史记录
    gameInfo: gameInfo,
    enabled: !!gameData && isEnabled // 只有在游戏数据加载完成且用户登录时才启用
  })

  // 移动端自动跳转到play页面的逻辑
  useEffect(() => {
    if (isSmallScreen && gameData && typeof window !== 'undefined') {
      const gameTitle = gameData.display_name || gameData.page_title || 'Game'
      const gameUrl = gameData.iframe_src || gameData.url
      
      // 使用统一的路由工具跳转到play页面
      if (gameUrl) {
        GameRouter.toGamePlay(slug, gameUrl, gameTitle)
      }
    }
  }, [isSmallScreen, gameData, slug])
  useEffect(()=>{
    //获取 游戏详情
    autoGetData(lang,slug)
  },[])

  if (loading) {
    return (
      <main>
        <Header lang={lang }/>
        <LoadingSpinner 
          text={isCached ? "Loading from cache..." : "Loading game..."} 
          fullScreen 
        />
        <Footer lang={lang}/>
      </main>
    )
  }

  // 只有在确实出现致命错误且不在加载中时才调用notFound
  if (error && !loading && !gameData) {
    // 检查是否是网络错误或服务器错误，给用户提供重试机会
    if (error.includes('Network') || error.includes('500') || error.includes('Failed to fetch')) {
      return (
        <main>
          <Header lang={lang }/>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🎮</div>
              <h1 className="text-2xl font-bold text-white mb-4">Game Temporarily Unavailable</h1>
              <p className="text-gray-400 mb-6">
                We're having trouble loading this game. This might be a temporary issue.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-accent hover:bg-accent-2 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg inline-block"
                >
                  Return to Home
                </a>
              </div>
            </div>
          </div>
          <Footer lang={lang } />
        </main>
      )
    }
    // 对于真正的404错误才调用notFound
    notFound()
  }

  // 如果没有数据但也没有错误，且不在加载中，显示加载状态
  if (!gameData && !loading && !error) {
    return (
      <main>
        <Header lang={lang }/>
        <LoadingSpinner text="Loading game..." fullScreen />
        <Footer lang={lang }/>
      </main>
    )
  }

  // Convert API data to Hero component format using the parser
  const heroGameData = gameData ? gameDetailsParser.toHeroGameData(gameData, slug) : null

  return (
    <main>
      <Header lang={lang }/>

        {/* <Hero game={heroGameData} reviews={gameDetails?.reviews} gameData={gameDetails} />     */}
        {gameDetails &&  <GameHero t={t} gameDetails={gameDetails} GameList={GameList} />}
      <NavigationArrow isHomePage={false} />
      
      {/* Game Information Section */}
     
      
      <Footer lang={lang }/>
      {/* <GameDetailsCacheDebug /> */}
    </main>
  )
}