"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Search } from "lucide-react"
import { heroData } from "@/data/home/hero-data"
import { useGamePlayTracker } from "@/hooks/useGamePlayTracker"
import { useGameData } from "@/hooks/useGameData"
import { useHomeLanguage } from "@/hooks/LangHome_value"
import { Game as APIGame, reviews_comment } from "@/app/api/types/Get/game"
import { Locale } from "@/lib/lang/dictionaraies"
import GameCard from "./games/GameCard"
import { getGameDetails } from "@/app/api/gameList"
import { GameRouter } from "@/lib/router"
interface HeroProps {
  title?: string;
  description?: string;
  lang: Locale;
  t?: any;
}

// 辅助函数：将 APIGame 转换为 ExtendedGame
const convertToExtendedGame = (apiGame: APIGame): any => ({
  id: apiGame.id,
  name: apiGame.name,
  display_name: apiGame.display_name,
  image: undefined // 将会生成占位图
})

export default function Hero({ title, description, lang, t }: HeroProps) {
  const router = useRouter()
  const [iframeHeight, setIframeHeight] = useState("600px")
  const [randomGames, setRandomGames] = useState<APIGame[]>([])
  const [speedStarsReviews, setSpeedStarsReviews] = useState<reviews_comment[]>([])
  
  // 获取games页面的数据
  const { allGames } = useGameData()
  
  // 使用首页语言管理器（只获取数据，不负责获取）
  const { getHomeInfoByLang } = useHomeLanguage()
  const homeData = getHomeInfoByLang(lang)
  
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

  // 初始化首页游戏追踪
  useEffect(() => {
    if (homeData?.game) {
      initializeGame({
        id: homeData.game.package.url || homeData.title || 'speed-stars',
        name: homeData.game.cover || homeData.title || 'speed-stars',
        displayName: homeData.title || 'Speed Stars'
      })
    }
  }, [homeData, initializeGame])

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
            {/* 桌面端显示标题 */}
            <h1 className="hidden lg:block text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
              {title ? (
                <span className="gradient-text">{title}</span>
              ) : homeData?.title ? (
                <span className="gradient-text">{homeData.title}</span>
              ) : (
                <>
                  <span className="gradient-text">{heroData.title.main}</span>
                  <span className="text-accent-2 text-stroke">{heroData.title.subtitle}</span>
                </>
              )}
            </h1>

            {/* Game container with side panels - Desktop layout */}
            <div className="hidden lg:flex justify-center items-start gap-6 mb-6 mx-auto max-w-[1980px] w-full px-4">
              
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
                className="flex-1 min-w-0 p-6 max-w-[1650px] mx-auto"
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
                  
                  {(homeData?.game?.package?.url || heroData.gameIframeSrc) ? (
                    <iframe
                      ref={setIframeRef}
                      src={homeData?.game?.package?.url || heroData.gameIframeSrc}
                      title={homeData?.title || t?.hero?.speedStarUnblocked || "Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      style={{
                        backgroundColor: '#000',
                        imageRendering: 'auto'
                      }}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>
                  ) : !homeData ? (
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
                {homeData?.page_content?.Features && (
                  <div className="mt-6 mb-6">
                    <div className="max-w-4xl mx-auto">
                      <div 
                        className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                        dangerouslySetInnerHTML={{
                          __html: homeData.page_content.Features
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

                {/* Homepage content sections */}
                {homeData?.page_content && (
                  <div>
                    {/* About section */}
                    {homeData.page_content.About && (
                      <div className="mt-6 mb-6">
                        <div className="max-w-4xl mx-auto">
                          <div 
                            className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                            dangerouslySetInnerHTML={{
                              __html: homeData.page_content.About
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Gameplay section */}
                    {homeData.page_content.Gameplay && (
                      <div className="mt-6 mb-6">
                        <div className="max-w-4xl mx-auto">
                          <div 
                            className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                            dangerouslySetInnerHTML={{
                              __html: homeData.page_content.Gameplay
                            }}
                          />
                        </div>
                      </div>
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
                  <h3 className="text-lg font-bold text-white mb-3 text-center"></h3>
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
            <div className="lg:hidden mb-6 px-4 mx-auto max-w-screen-xl">
              {/* 第一行：固定定位的功能卡片 + 游戏标题卡片 */}
              <div className="relative mb-5 w-full">
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
                          <div 
                            className="bg-white flex items-center justify-center border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => router.push('/')}
                          >
                            <Home className="w-4 h-4 text-blue-500" />
                          </div>
                          <div 
                            className="bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => router.push('/search')}
                          >
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
                          {homeData?.title || heroData.title.main}
                        </h2>
                        <p className="text-xs text-gray-600 mt-1">
                          {t?.hero?.category || "分类名"}: {homeData?.game.category || "Games"}
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
                      // 首页跳转到游戏播放页
                      if (homeData?.game?.package?.url) {
                        GameRouter.toGamePlay(
                          homeData.title || 'speed-stars',
                          homeData.game.package.url,
                          homeData.title || 'Speed Stars'
                        )
                      }
                    }}
                  >
                  
                  {/* 游戏封面图片 */}
                  {homeData ? (
                    <img
                      src={homeData.game?.cover}
                      alt={homeData.title || t?.hero?.speedStarUnblocked || "Speed Stars Game"}
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
                  
                  {!homeData ? (
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
                {homeData?.page_content?.About && (
                  <div className="col-span-3 mt-6">
                    <div className="max-w-4xl mx-auto">
                      <div 
                        className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                        dangerouslySetInnerHTML={{
                          __html: homeData.page_content.About
                        }}
                      />
                    </div>
                  </div>
                )}
                
              </div>
            </div>


          </div>
        </div>
      </div>

    </section>
  )
}
