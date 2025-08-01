"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Search } from "lucide-react"
import { heroData } from "@/data/home/hero-data"
import { useGamePlayTracker } from "@/hooks/useGamePlayTracker"
import { useGameData } from "@/hooks/useGameData"
import { useHomeGameData } from "@/hooks/useHomeGameData"
import { Game as APIGame, reviews_comment, ExtendedGameDetails } from "@/app/api/types/Get/game"
import GameCard from "./games/GameCard"
import { getGameDetails } from "@/app/api/gameList"
import Testimonials from "@/components/testimonials"
import { GameRouter } from "@/lib/router"
interface Game {
  id: string
  title: string
  description: string
  image: string
  category: string
  iframeSrc?: string
  features?: string[]
  howToPlay?: string[]
}

interface Review {
  user_name: string;
  rating: number;
  content: string;
  email: string;
  created_at: string;
}

interface HeroProps {
  game?: Game;
  title?: string;
  description?: string;
  reviews?: Review[];
  gameData?: ExtendedGameDetails;
  t?: any;
}

// 辅助函数：将 APIGame 转换为 ExtendedGame
const convertToExtendedGame = (apiGame: APIGame): any => ({
  id: apiGame.id,
  name: apiGame.name,
  display_name: apiGame.display_name,
  image: undefined // 将会生成占位图
})

export default function Hero({ game, title, description, reviews, gameData, t }: HeroProps) {
  const [iframeHeight, setIframeHeight] = useState("600px")
  const [randomGames, setRandomGames] = useState<APIGame[]>([])
  const [speedStarsReviews, setSpeedStarsReviews] = useState<reviews_comment[]>([])
  
  // 获取games页面的数据
  const { allGames } = useGameData()
  
  // 获取首页游戏数据
  const { homeData, gameUrl, pageTitle, loading: homeDataLoading } = useHomeGameData()
  
  // 生成游戏占位符图片的函数

  
  // 游戏追踪系统
  const {
    initializeGame,
    setGameContainerRef,
    setIframeRef,
  } = useGamePlayTracker()

  // 获取随机游戏数据 - 只在allGames首次加载时执行一次
  useEffect(() => {
    if (allGames.length > 0) {
      setRandomGames(prevRandomGames => {
        if (prevRandomGames.length === 0) {
          // 从games页面的数据中随机获取足够多的游戏用于填充各个区域
          const availableGames = allGames.filter(apiGame => apiGame.name !== game?.id)
          const shuffled = [...availableGames].sort(() => 0.5 - Math.random())
          return shuffled
        }
        return prevRandomGames
      })
    }
  }, [allGames, game?.id])

  // 在首页时获取speed-stars的评论数据
  useEffect(() => {
    if (!game) { // 只在首页时执行
      const fetchSpeedStarsReviews = async () => {
        try {
          const response = await getGameDetails('speed-stars')
          if (response?.data?.data?.reviews) {
            setSpeedStarsReviews(response.data.data.reviews)
          }
        } catch (error) {
          // 即使获取评论失败，也不影响页面其他功能
          // 设置空数组，避免反复尝试
          setSpeedStarsReviews([])
        }
      }
      
      // 延迟执行，等待游戏数据加载完成
      const timer = setTimeout(fetchSpeedStarsReviews, 1000)
      return () => clearTimeout(timer)
    }
  }, [game])

  useEffect(() => {
    const updateHeight = () => {
      // Calculate height based on viewport width to maintain rectangular aspect ratio
      const width = window.innerWidth
      let containerWidth
      
      if (width >= 1024) {
        // Desktop: use game frame width within the 1080px container
        containerWidth = 1080 - 48 // subtract padding
      } else if (width >= 640) {
        // Tablet: use available width minus padding
        containerWidth = Math.min(width - 64, 1080 - 48)
      } else {
        // Mobile: use available width minus minimal padding
        containerWidth = Math.min(width - 16, 1080 - 48)
      }
      
      // 16:10 aspect ratio for better rectangular game display (more suitable for most games)
      const height = Math.floor(containerWidth * 0.625)
      
      // Dynamic minimum height based on screen size to ensure playability
      let minHeight = 300
      if (width >= 1024) minHeight = 400
      if (width >= 1440) minHeight = 500
      if (width < 640) minHeight = 250
      if (width < 480) minHeight = 200
      
      setIframeHeight(`${Math.max(height, minHeight)}px`)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  // 初始化游戏追踪
  useEffect(() => {
    if (game) {
      initializeGame({
        id: game.id,
        name: game.id, // 使用id作为name
        displayName: game.title
      })
    }
  }, [game, initializeGame])

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
          <div className="w-full">
            {/* Breadcrumbs Navigation - Above title */}
            {gameData && gameData.breadcrumbs && gameData.breadcrumbs.length > 0 && (
              <div className="flex justify-center mb-4">
                <div style={{ width: "1494px", maxWidth: "calc(100vw - 32px)" }}>
                  <nav aria-label="Breadcrumb">
                    <div className="flex items-center space-x-1 text-sm">
                      {/* Games link */}
                      <Link href="/games" className="text-gray-300 hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10">
                        {t?.navigation?.allGames || "Games"}
                      </Link>
                      {gameData.breadcrumbs.map((crumb, index) => {
                        // Skip the first breadcrumb if it's "Games" to avoid duplication
                        if (index === 0 && crumb.name.toLowerCase() === 'games') {
                          return null;
                        }
                        
                        const isLast = index === gameData.breadcrumbs.length - 1;
                        const categorySlug = crumb.name.toLowerCase().replace(/\s+/g, '-');
                        
                        return (
                          <div key={index} className="flex items-center">
                            <svg 
                              className="mx-2 h-4 w-4 text-gray-400" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className={isLast ? "text-primary font-semibold px-2 py-1 rounded" : ""}>
                              {isLast ? (
                                crumb.name
                              ) : (
                                <Link 
                                  href={`/games/c/${categorySlug}`}
                                  className="text-gray-300 hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10"
                                >
                                  {crumb.name}
                                </Link>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </nav>
                </div>
              </div>
            )}

            {/* 桌面端显示标题 */}
            <h1 className="hidden lg:block text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
              {game ? (
                <span className="gradient-text">{game.title}</span>
              ) : title ? (
                <span className="gradient-text">{title}</span>
              ) : (
                <>
                  <span className="gradient-text">{heroData.title.main}</span>
                  <span className="text-accent-2 text-stroke">{heroData.title.subtitle}</span>
                </>
              )}
            </h1>

            {/* Game container with side panels - Desktop layout */}
            <div className="hidden lg:flex justify-center items-start gap-6 mb-6 mx-auto" style={{ width: "1680px", maxWidth: "calc(100vw - 32px)" }}>
              
              {/* Left side panel - Independent */}
              <div 
                className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow flex-shrink-0"
                style={{ 
                  width: "200px",
                  borderRadius: '12px'
                }}
              >
                <div className="p-3">
                  <div className="grid grid-cols-1 gap-4">
                    {randomGames.length > 0 ? (
                      randomGames.slice(0, 8).map((randomGame, index) => (
                        <GameCard
                          key={`left-${randomGame.id}-${index}`}
                          game={convertToExtendedGame(randomGame)}
                          className="w-full"
                          size="small"
                          isHomepage={true}
                        />
                      ))
                    ) : (
                      // Default placeholder cards when no game data
                      Array.from({ length: 8 }, (_, index) => (
                        <div key={`left-placeholder-${index}`} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-2 aspect-square flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl mb-1">🎮</div>
                            <div className="text-white text-xs font-medium">{t?.common?.loading || "Loading..."}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Main center container - Contains game frame, bottom panel, and all other content */}
              <div 
                className="flex-shrink-0 p-6"
                style={{ width: "1466px" }}
              >
                {/* Game frame - Optimized for rectangular game display */}
                <div
                  id="game-frame"
                  ref={setGameContainerRef}
                  className="relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 mb-6 bg-black"
                  style={{ 
                    width: "100%", 
                    height: iframeHeight,
                    minHeight: "300px",
                    borderRadius: '12px',
                    aspectRatio: '16/10' // Force rectangular aspect ratio
                  }}
                >
                  
                  {(game?.iframeSrc || gameUrl || heroData.gameIframeSrc) ? (
                    <iframe
                      ref={setIframeRef}
                      src={game?.iframeSrc || gameUrl || heroData.gameIframeSrc}
                      title={pageTitle || game?.title || t?.hero?.speedStarUnblocked || "Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      style={{
                        backgroundColor: '#000',
                        imageRendering: 'auto'
                      }}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>
                  ) : homeDataLoading ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                        <h2 className="text-2xl font-black text-text mb-3">{t?.hero?.loadingGame || "Loading Game..."}</h2>
                        <p className="text-text/80">{t?.hero?.pleaseWait || "Please wait while we load the game data"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎮</div>
                        <h2 className="text-3xl font-black text-text mb-3">{t?.hero?.comingSoon || "Coming Soon!"}</h2>
                        <p className="text-text/80 text-lg">{t?.hero?.awesomeGameAvailableSoon || "This awesome game will be available soon."}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom games panel - Random games display */}
                <div className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow mb-6 rounded-xl p-4">
                  <h2 className="text-lg font-bold text-white mb-4">{t?.hero?.discoverMoreGames || "Discover More Games"}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {randomGames.length > 0 ? (
                      randomGames.slice(0, 4).map((randomGame, index) => (
                        <GameCard
                          key={`discover-${randomGame.id}-${index}`}
                          game={convertToExtendedGame(randomGame)}
                          className="w-full"
                          size="medium"
                          isHomepage={true}
                        />
                      ))
                    ) : (
                      // Default placeholder cards when no game data
                      Array.from({ length: 4 }, (_, index) => (
                        <div key={`bottom-placeholder-${index}`} className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-4 min-h-[160px] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎮</div>
                            <div className="text-white text-sm font-medium">{t?.common?.loading || "Loading..."}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Features section - 在底部游戏面板下方 */}
                {!game && homeData?.data && (
                  <div className="mt-6 mb-6">
                    <div className="max-w-4xl mx-auto">
                      <div 
                        className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                        dangerouslySetInnerHTML={{
                          __html: homeData?.data.page_content.Features || ""
                        }}
                      />
                    </div>
                  </div>
                )}


                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 px-2">
                  <button onClick={() => scrollToSection("game-frame")} className="btn-primary text-lg sm:text-xl md:text-2xl jello w-full sm:w-auto">
                    {heroData.buttons.primary}
                  </button>
                  <Link
                    href="/games"
                    className="btn-secondary text-lg sm:text-xl md:text-2xl jello w-full sm:w-auto"
                    style={{ animationDelay: "0.5s" }}
                  >
                    {heroData.buttons.secondary}
                  </Link>
                </div>

                {/* Homepage: Show page_content.about directly below buttons */}
               {
                !game && homeData?.data &&(
                  <div>
                  <div className="mt-6 mb-6">
                    <div className="max-w-4xl mx-auto">
                      <div 
                        className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                        dangerouslySetInnerHTML={{
                          __html: homeData?.data.page_content.About || ""
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 mb-6">
                    <div className="max-w-4xl mx-auto">
                      <div 
                        className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                        dangerouslySetInnerHTML={{
                          __html: homeData?.data.page_content.Features || ""
                        }}
                      />
                    </div>
                  </div>

                    <div className="mt-6 mb-6">
                    <div className="max-w-4xl mx-auto">
                      <div 
                        className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                        dangerouslySetInnerHTML={{
                          __html: homeData?.data.page_content.Gameplay || ""
                        }}
                      />
                    </div>
                  </div>

                  </div>
                )
               }

                {/* Game page: Show game description */}
                {game && (
                   <div className="container mx-auto px-4 mt-12 space-y-8">
                     {/* Game Info HTML Content */}
                     {game.description && (
                       <section className="py-8">
                         <div className="max-w-4xl mx-auto">
                           <div 
                             className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                             dangerouslySetInnerHTML={{
                               __html: game.description
                             }}
                           />
                         </div>
                       </section>
                     )}
                   </div>
                 )}

              </div>

              {/* Right side panel - Independent */}
              <div 
                className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow flex-shrink-0"
                style={{ 
                  width: "200px",
                  borderRadius: '12px'
                }}
              >
                <div className="p-3">
                  <h3 className="text-lg font-bold text-white mb-3 text-center">Features</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {randomGames.length > 0 ? (
                      randomGames.slice(0, 8).map((randomGame, index) => {
                        const tags = ['New', 'Hot', 'Top rated'];
                        const taggedGame = {
                          ...convertToExtendedGame(randomGame),
                          tag: tags[index % 3]
                        };
                        return (
                          <GameCard
                            key={`right-${randomGame.id}-${index}`}
                            game={taggedGame}
                            className="w-full"
                            size="small"
                            isHomepage={true}
                          />
                        );
                      })
                    ) : (
                      // Default placeholder cards when no game data
                      Array.from({ length: 8 }, (_, index) => {
                        const tags = ['New', 'Hot', 'Top rated'];
                        const tag = tags[index % 3];
                        return (
                          <div key={`right-placeholder-${index}`} className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-gray-600/50 p-2 aspect-square flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl mb-1">🎮</div>
                              <div className="text-white text-xs font-medium">{t?.common?.loading || "Loading..."}</div>
                            </div>
                            {/* Tag badge */}
                            <div className={`absolute -top-1 -left-1 px-2 py-0.5 text-xs font-bold text-white rounded-[6px] shadow-lg z-10 ${
                              tag === 'Hot' ? 'bg-red-500' : 
                              tag === 'New' ? 'bg-purple-500' : 
                              'bg-blue-500'
                            }`}>
                              {tag}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Mobile/Tablet layout - 统一网格布局 */}
            <div className="lg:hidden mb-6" style={{ margin: '0 30px' }}>
              {/* 第一行：固定定位的功能卡片 + 游戏标题卡片 */}
              <div className="relative mb-5" style={{ width: 'calc(100% - 10px)' }}>
                <div className="grid grid-cols-3 gap-6">
                  {/* 固定定位的功能卡片 */}
                  <div className="col-span-1 relative">
                    <div className="fixed z-30 bg-white rounded-[9px] shadow-lg transition-shadow duration-300 h-[73px] p-1" style={{ width: 'calc((100vw - 80px) / 3 - 12px)' }}>
                      {/* 2行网格布局 */}
                      <div className="grid grid-rows-2 h-full gap-0">
                        {/* 第一行：占据2个格子 */}
                        <div className="row-span-1 grid grid-cols-2 gap-0 border-b border-gray-200">
                          <div className="col-span-2 bg-white flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-800">{t?.hero?.gameCenter || "游戏中心"}</span>
                          </div>
                        </div>
                        
                        {/* 第二行：2个div，无间隔，中间有分隔线 */}
                        <div className="row-span-1 grid grid-cols-2 gap-0">
                          <div className="bg-white flex items-center justify-center border-r border-gray-200">
                            <Home className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="bg-white flex items-center justify-center">
                            <Search className="w-4 h-4 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="bg-white rounded-[9px] px-4 py-3 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-start h-[73px]">
                      <div className="text-left">
                        <h2 className="text-base font-black text-gray-800 leading-tight">
                          {game ? game.title : (pageTitle || heroData.title.main)}
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">
                          {t?.hero?.category || "分类名"}: {game?.category || homeData?.data?.category || "Games"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 统一3列网格布局，间距4，圆角8px */}
              <div className="grid grid-cols-3 gap-4">
                
                {/* 第二行：完整尺寸内嵌游戏 - 占据3格 */}
                <div className="col-span-3">
                  <div
                    id="game-frame-mobile-full"
                    className="relative w-full rounded-[9px] overflow-hidden shadow-lg hover:shadow-xl bg-black cursor-pointer group"
                    style={{ 
                      aspectRatio: '5/4', // 缩小高度1/5，从1:1变为5:4
                      width: '100%'
                    }}
                    onClick={() => {
            
                      if (gameData) {
                        // 内页跳转
                        GameRouter.toGamePlay(
                          gameData.gameSlug || "",
                          gameData.package?.url || "",
                          gameData.display_name || ""
                        )

                      }else {
                        //首页跳转
                        GameRouter.toGamePlay(homeData?.data.title || 'not_name',homeData?.data.game.package.url||'',homeData?.data.title)
                      }
                    }}
                  >
                  
                  {/* 游戏封面图片 */}
                  {!homeDataLoading ? (
                    <img
                      src={gameData?.cover || homeData?.data.game.cover}
                      alt={pageTitle || game?.title || t?.hero?.speedStarUnblocked || "Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      style={{
                        backgroundColor: '#000',
                        imageRendering: 'auto',
                      }}
                      onError={(e) => {
                        // 如果图片加载失败，显示占位符
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {homeDataLoading ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                        <h3 className="text-2xl font-black text-text mb-2">{t?.hero?.loadingGame || "Loading Game..."}</h3>
                        <p className="text-text/80">{t?.hero?.pleaseWait || "Please wait..."}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-3xl font-black text-text mb-2">{t?.hero?.comingSoon || "Coming Soon!"}</h3>
                        <p className="text-text/80 text-lg">{t?.hero?.awesomeGameAvailableSoon || "This awesome game will be available soon."}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 蒙板和播放按钮 */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-30">
                    {/* 白色圆圈包围的三角播放按钮 */}
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 transform transition-all duration-300 group-hover:scale-110">
                      <div className="w-0 h-0 border-l-[12px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent bg-white" style={{ marginLeft: '2px' }}></div>
                    </div>
                    {/* 开始游戏文字 */}
                    <p className="text-white text-lg font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                      {t?.hero?.startGame || "开始游戏"}
                    </p>
                  </div>
                </div>
                </div>

                {/* 第三行开始：30个游戏卡片 - 每行3个 */}
                {(() => {
                  // 获取游戏数据，避免显示"2 Player"分类，优先选择其他分类
                  const { categoriesWithGames } = useGameData();
                  const filteredCategories = categoriesWithGames.filter(category => 
                    category.category_name.toLowerCase() !== '2 player'
                  );
                  const selectedCategory = filteredCategories.length > 0 ? filteredCategories[0] : categoriesWithGames[0];
                  
                  // 收集所有游戏用于显示30个
                  const allAvailableGames = categoriesWithGames.flatMap(category => category.games || []);
                  const gamesToShow = allAvailableGames.slice(0, 30);
                  
                  return (
                    <>
                      {gamesToShow.length > 0 ? (
                        gamesToShow.map((game, index) => (
                          <div key={`mobile-featured-${game.id}-${index}`} className="col-span-1">
                            <GameCard
                              game={convertToExtendedGame(game)}
                              className="w-full aspect-square"
                              size="tiny"
                              isHomepage={true}
                            />
                          </div>
                        ))
                      ) : (
                        // Fallback cards when no data is available
                        Array.from({ length: 30 }, (_, index) => (
                          <div key={`fallback-${index}`} className="col-span-1">
                            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-[9px] border border-gray-600/50 p-2 aspect-square flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg mb-1">🎮</div>
                                <div className="text-white text-xs font-medium">{t?.hero?.gameNumber?.replace('{index}', (index + 1).toString()) || `Game ${index + 1}`}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  );
                })()}
                
                {/* 首页移动端：在游戏卡片下方显示page_content内容 */}
                {!game && homeData?.data && (
                  <>
                    {/* About Content */}
                    <div className="col-span-3 mt-6">
                      <div className="max-w-4xl mx-auto">
                        <div 
                          className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                          dangerouslySetInnerHTML={{
                            __html: homeData?.data.page_content.About || ""
                          }}
                        />
                      </div>
                    </div>

                  </>
                )}
                
              </div>
            </div>


          </div>
        </div>
      </div>
      
      {/* Only show these sections for game pages (when game prop is provided) */}
 

      {/* 首页不显示 */}
      {
        game && (
          <Testimonials gameSlug={game?.id} reviews={reviews} />
        )
      }

    </section>
  )
}
