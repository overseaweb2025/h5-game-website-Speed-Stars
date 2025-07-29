"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { heroData } from "@/data/home/hero-data"
import { useGamePlayTracker } from "@/hooks/useGamePlayTracker"
import { useGameData } from "@/hooks/useGameData"
import { Game as APIGame, reviews_comment } from "@/app/api/types/Get/game"
import { getGameDetails } from "@/app/api/gameList"
import Games from "@/components/games"
import SpeedStarsSection from "@/components/speed-stars-section"
import GameplaySection from "@/components/gameplay-section"
import Features from "@/components/features"
import HowToPlay from "@/components/how-to-play"
import Testimonials from "@/components/testimonials"

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
}

export default function Hero({ game, title, description, reviews }: HeroProps) {
  const { data: session } = useSession()
  const [iframeHeight, setIframeHeight] = useState("600px")
  const [randomGames, setRandomGames] = useState<APIGame[]>([])
  const [speedStarsReviews, setSpeedStarsReviews] = useState<reviews_comment[]>([])
  
  // 获取games页面的数据
  const { allGames } = useGameData()
  
  // 生成游戏占位符图片的函数
  const generateGameImage = (apiGame: APIGame, index: number) => {
    const colors = ['4a9eff', '8b4513', '2196f3', '8b008b', 'ff8c00', '4caf50', 'ff4500', '87ceeb']
    const bgColor = colors[index % colors.length]
    const encodedName = encodeURIComponent(apiGame.display_name.substring(0, 12))
    return `/placeholder.svg?height=150&width=200&text=${encodedName}&bg=${bgColor}&color=white`
  }
  
  // 游戏追踪系统
  const {
    isTracking,
    elapsedTime,
    threshold,
    initializeGame,
    handleGameAreaClick,
    setGameContainerRef,
    setIframeRef,
    trackingState,
    debugInfo,
    getPlayHistory
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
          if (response.data.data?.reviews) {
            setSpeedStarsReviews(response.data.data.reviews)
          }
        } catch (error) {
          console.error('Failed to fetch speed-stars reviews:', error)
        }
      }
      fetchSpeedStarsReviews()
    }
  }, [game])

  useEffect(() => {
    const updateHeight = () => {
      // Calculate height based on viewport width to maintain aspect ratio
      const width = window.innerWidth
      let containerWidth
      
      if (width >= 1024) {
        // Desktop: use game frame width (900px)
        containerWidth = 900
      } else if (width >= 640) {
        // Tablet: use available width minus padding (sm: 16px margins)
        containerWidth = Math.min(width - 32, 900)
      } else {
        // Mobile: use available width minus minimal padding (2px margins = 4px total)
        containerWidth = Math.min(width - 8, 900)
      }
      
      // 16:9 aspect ratio for the game
      const height = Math.floor(containerWidth * 0.5625)
      
      // Dynamic minimum height based on screen size
      let minHeight = 200
      if (width < 400) minHeight = 180
      if (width < 320) minHeight = 160
      
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
      {/* Decorative elements - dark theme */}
      <div className="absolute top-10 left-10 w-32 h-20 bg-purple-500/20 rounded-full opacity-80 pop-in"></div>
      <div
        className="absolute top-20 right-20 w-40 h-24 bg-blue-500/20 rounded-full opacity-70 pop-in"
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/4 w-36 h-22 bg-purple-400/20 rounded-full opacity-75 pop-in"
        style={{ animationDelay: "0.6s" }}
      ></div>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
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
            <div className="hidden lg:flex justify-center items-start gap-6 mb-6 mx-auto" style={{ width: "1494px", maxWidth: "calc(100vw - 32px)" }}>
              
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
                    {randomGames.slice(0, 10).map((randomGame, index) => {
                      const tags = ['Hot', 'New', 'Top rated'];
                      const tagColors = ['bg-red-500', 'bg-purple-500', 'bg-orange-500'];
                      const randomTag = tags[index % tags.length];
                      const tagColor = tagColors[index % tagColors.length];
                      
                      return (
                        <Link key={`left-${randomGame.id}-${index}`} href={`/games/${randomGame.name}`} className="block aspect-video">
                          <div className="relative w-full h-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group" style={{ borderRadius: '12px' }}>
                            <Image
                              src={generateGameImage(randomGame, index)}
                              alt={randomGame.display_name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="180px"
                            />
                            
                            {/* Tag badge in top-left corner */}
                            <div className={`absolute top-2 left-2 px-2 py-1 ${tagColor} text-white text-xs font-bold z-10`} style={{ borderRadius: '4px' }}>
                              {randomTag}
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" style={{ borderRadius: '12px' }} />
                            
                            {/* Game title at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h4 className="text-sm font-bold text-white drop-shadow-lg line-clamp-2 leading-tight">
                                {randomGame.display_name}
                              </h4>
                            </div>
                            
                            <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300" style={{ borderRadius: '12px' }} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main center container - Contains game frame, bottom panel, and all other content */}
              <div 
                className="flex-shrink-0 p-6"
                style={{ width: "1080px" }}
              >
                {/* Game frame */}
                <div
                  id="game-frame"
                  ref={setGameContainerRef}
                  className="relative overflow-hidden cartoon-shadow border-8 border-white transform hover:scale-[1.02] transition-transform mb-6"
                  style={{ 
                    width: "100%", 
                    height: iframeHeight,
                    minHeight: "400px",
                    borderRadius: '12px'
                  }}
                >
                  
                  {(game?.iframeSrc || heroData.gameIframeSrc) ? (
                    <iframe
                      ref={setIframeRef}
                      src={game?.iframeSrc || heroData.gameIframeSrc}
                      title={game?.title || "Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-3xl font-black text-text mb-3">Coming Soon!</h3>
                        <p className="text-text/80 text-lg">This awesome game will be available soon.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom games panel - Random games display */}
                <div 
                  className="bg-gradient-to-r from-accent-3/20 via-primary/20 to-secondary/20 border-3 border-accent-4/30 cartoon-shadow mb-6"
                  style={{ 
                    width: "100%",
                    minHeight: "200px",
                    borderRadius: '12px'
                  }}
                >
                  <div className="p-6 h-full">
                    <h3 className="text-lg font-bold text-center mb-4 text-primary">Discover More Games</h3>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 h-full">
                      {randomGames.slice(20, 80).map((randomGame, index) => (
                        <Link key={`bottom-${randomGame.id}-${index}`} href={`/games/${randomGame.name}`} className="block">
                          <div className="relative w-full aspect-square overflow-hidden hover:scale-105 transition-transform duration-300" style={{ borderRadius: '12px' }}>
                            <Image
                              src={generateGameImage(randomGame, index + 20)}
                              alt={randomGame.display_name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 60px, (max-width: 768px) 70px, (max-width: 1024px) 80px, 70px"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1" style={{ borderRadius: '0 0 12px 12px' }}>
                              <h4 className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-white text-center line-clamp-1">
                                {randomGame.display_name}
                              </h4>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>


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

                {/* Only show content sections on homepage (when no game prop) */}
                {!game && (
                  <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-4 gap-6">
                      {randomGames.slice(50, 58).map((randomGame, index) => (
                        <Link key={`explore-${randomGame.id}-${index}`} href={`/games/${randomGame.name}`} className="block">
                          <div className="relative w-full aspect-square overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md" style={{ borderRadius: '12px' }}>
                            <Image
                              src={generateGameImage(randomGame, index + 50)}
                              alt={randomGame.display_name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 200px, 250px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <h4 className="text-sm font-bold text-white text-center line-clamp-2 leading-tight">
                                {randomGame.display_name}
                              </h4>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <SpeedStarsSection />
                    
                    <GameplaySection />
                    
                    <Features />
                    
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
                  <div className="grid grid-cols-1 gap-4">
                    {randomGames.slice(10, 20).map((randomGame, index) => {
                      const tags = ['New', 'Hot', 'Top rated'];
                      const tagColors = ['bg-purple-500', 'bg-red-500', 'bg-blue-500'];
                      const randomTag = tags[index % tags.length];
                      const tagColor = tagColors[index % tagColors.length];
                      
                      return (
                        <Link key={`right-${randomGame.id}-${index}`} href={`/games/${randomGame.name}`} className="block aspect-video">
                          <div className="relative w-full h-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group" style={{ borderRadius: '12px' }}>
                            <Image
                              src={generateGameImage(randomGame, index + 10)}
                              alt={randomGame.display_name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="180px"
                            />
                            
                            {/* Tag badge in top-left corner */}
                            <div className={`absolute top-2 left-2 px-2 py-1 ${tagColor} text-white text-xs font-bold z-10`} style={{ borderRadius: '4px' }}>
                              {randomTag}
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" style={{ borderRadius: '12px' }} />
                            
                            {/* Game title at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h4 className="text-sm font-bold text-white drop-shadow-lg line-clamp-2 leading-tight">
                                {randomGame.display_name}
                              </h4>
                            </div>
                            
                            <div className="absolute inset-0 ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300" style={{ borderRadius: '12px' }} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Mobile/Tablet layout - stacked vertically */}
            <div className="lg:hidden mb-6">
              {/* Game frame (mobile) - responsive sizing */}
              <div className="mx-1 sm:mx-2 mb-4">
                <div
                  id="game-frame-mobile"
                  ref={setGameContainerRef}
                  className="relative w-full rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden cartoon-shadow border-2 sm:border-4 md:border-6 border-white transform hover:scale-[1.01] transition-transform"
                  style={{ 
                    height: iframeHeight
                  }}
                >
                  
                  {(game?.iframeSrc || heroData.gameIframeSrc) ? (
                    <iframe
                      ref={setIframeRef}
                      src={game?.iframeSrc || heroData.gameIframeSrc}
                      title={game?.title || "Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🎮</div>
                        <h3 className="text-2xl font-black text-text mb-2">Coming Soon!</h3>
                        <p className="text-text/80">This game will be available soon.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side panels for mobile - responsive layout */}
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 justify-center items-stretch mx-1 sm:mx-2">
                {/* For very small screens, stack vertically. For 480px+, use horizontal */}
                <div className="flex flex-col min-[480px]:flex-row gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-3 border-accent/30 cartoon-shadow">
                    <div className="p-2 sm:p-3 md:p-4 text-center">
                      <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🎮</div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-text mb-1 leading-tight">Game Tips</h3>
                      <p className="text-xs sm:text-sm text-text/80 leading-tight break-words">Master timing!</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 bg-gradient-to-b from-accent/20 to-accent-2/20 rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-3 border-primary/30 cartoon-shadow">
                    <div className="p-2 sm:p-3 md:p-4 text-center">
                      <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">🏆</div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-text mb-1 leading-tight">High Score</h3>
                      <p className="text-xs sm:text-sm text-text/80 leading-tight break-words">Beat best!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      
      {/* Only show these sections for game pages (when game prop is provided) */}
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
          {/* What Players Say 区域 */}
          {/* 已移除，评论只由 Testimonials 组件渲染 */}
          
          <Testimonials gameSlug={game?.id} reviews={reviews} />
        </div>
      )}
    </section>
  )
}
