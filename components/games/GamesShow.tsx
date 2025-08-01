"use client"

import { useState, useRef } from "react"
import { useGameData } from "@/hooks/useGameData"
import { getCategoryIcon, addRandomTags } from "./utils"
import { ExtendedGame } from "./types"
import GameCard from "./GameCard"

// Featured Games组件
const FeaturedGameSection = ({ games }: { games: ExtendedGame[] }) => {
  const [showControls, setShowControls] = useState(false)
  const [touched, setTouched] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
    setTouched(false)
  }

  const handleTouchStart = () => {
    setShowControls(true)
    setTouched(true)
  }

  const shouldShowControls = showControls || touched

  return (
    <div className="mb-4">
      <h2 className="text-2xl md:text-3xl font-black text-white mb-4 pop-in">
        🌟 Featured Games
      </h2>
      
      {/* 整个行区域 - 严格限制在屏幕宽度内 */}
      <div 
        className="relative w-full max-w-full bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden backdrop-blur-sm"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        {/* 左箭头 */}
        <button
          onClick={() => handleScroll('left')}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
            shouldShowControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        
        {/* 右箭头 */}
        <button
          onClick={() => handleScroll('right')}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
            shouldShowControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
        
        {/* 内容区域 - 严格限制在容器内滚动 */}
        <div 
          ref={scrollRef} 
          className="overflow-x-auto scrollbar-hide"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <div className="flex gap-2 p-2 sm:gap-4 sm:p-4 md:gap-6 md:p-6" style={{ width: 'max-content', minWidth: '100%' }}>
            <div className="flex-shrink-0">
              {/* Featured Games 布局：移动端gap-2，桌面端gap-6 */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                {/* 第一个格子：大卡片 */}
                <div className="col-span-1">
                  <GameCard game={games[0]} className="shadow-xl hover:shadow-2xl" size="large" />
                </div>
                {/* 第二个格子：包含四个小卡片的大div */}
                <div className="col-span-1">
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3">
                    {games.slice(1, 5).map((game, index) => (
                      <GameCard key={game.id} game={game} className="shadow-lg hover:shadow-xl" size="small" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// GameRowSection组件
const GameRowSection = ({ title, games, sectionIndex }: { title: string, games: ExtendedGame[], sectionIndex: number }) => {
  const [showControls, setShowControls] = useState(false)
  const [touched, setTouched] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
    setTouched(false)
  }

  const handleTouchStart = () => {
    setShowControls(true)
    setTouched(true)
  }

  const shouldShowControls = showControls || touched

  return (
    <div className="mb-4">
      <h2 className="text-2xl md:text-3xl font-black text-white mb-4 pop-in">
        {title}
      </h2>
      
      {/* 整个行区域 - 严格限制在屏幕宽度内 */}
      <div 
        className="relative w-full max-w-full min-h-[200px] bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-xl overflow-hidden backdrop-blur-sm"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        {/* 左箭头 */}
        <button
          onClick={() => handleScroll('left')}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
            shouldShowControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        
        {/* 右箭头 */}
        <button
          onClick={() => handleScroll('right')}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
            shouldShowControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
        
        {/* 内容区域 - 严格限制在容器内滚动 */}
        <div 
          ref={scrollRef} 
          className="overflow-x-auto scrollbar-hide"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <div className="flex gap-4 p-4 sm:gap-6 sm:p-6" style={{ width: 'max-content', minWidth: '100%' }}>
            {games.map((game, index) => (
              <div key={`${sectionIndex}-${game.id}-${index}`} className="flex-shrink-0">
                <GameCard 
                  game={game}
                  className="flex-shrink-0 shadow-lg hover:shadow-xl"
                  size="horizontal-scroll"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// GamesShow不再直接接收侧边栏状态，由Layout统一管理
const GamesShow = () => {
  const { 
    data: gameCategories, 
    loading, 
    error, 
    categoriesWithGames, 
    allGames,
    refresh 
  } = useGameData()

  // 根据真实分类数据创建游戏行，只显示有游戏的分类
  const createGameRows = () => {
    if (categoriesWithGames.length === 0) return []
    
    return categoriesWithGames.map(category => ({
      title: `${getCategoryIcon(category.category_name)} ${category.category_name}`,
      games: addRandomTags(category.games),
      categoryId: category.category_id
    }))
  }

  const gameRows = createGameRows()
  
  // Featured Games使用所有可用游戏
  const featuredGames = allGames.length > 0 ? addRandomTags(allGames).slice(0, 5) : []
  
  return (
    <div className="w-full max-w-full overflow-hidden bg-gray-800 backdrop-blur-sm">
      {/* Page Header */}
      <div className="text-center py-6 px-4 sm:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 pop-in">
          🎮 <span className="gradient-text">Game Collection</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto px-4">
          Discover amazing free HTML5 games for endless entertainment
        </p>
      </div>

      {/* Main game showcase area - 严格限制宽度不超过容器 */}
      <div className="w-full max-w-full overflow-hidden px-2 sm:px-4">
        {/* 调试信息栏 - 只在开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-800 text-white text-sm p-3 mb-4 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <span>Categories: {categoriesWithGames.length}</span>
              <span>Games: {allGames.length}</span>
              <span>Status: {loading ? 'Loading...' : error ? 'Error' : 'Ready'}</span>
              <button 
                onClick={refresh}
                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading games...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 flex-col gap-4">
            <div className="text-red-400 text-xl">{error}</div>
            <button 
              onClick={refresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Featured Games Section */}
            {featuredGames.length > 0 && (
              <FeaturedGameSection 
                games={featuredGames}
              />
            )}
            
            {/* Game Rows */}
            {gameRows.map((row, index) => (
              row.games.length > 0 && (
                <GameRowSection
                  key={index}
                  title={row.title}
                  games={row.games}
                  sectionIndex={index}
                />
              )
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default GamesShow