"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getGameList } from "@/app/api/gameList/index"
import { useState, useEffect, useRef } from "react"
import type { GameList, Game } from "@/app/api/types/Get/game"

interface GameCardProps {
  game: Game
  size?: 'small' | 'medium' | 'featured'
  tag?: 'New' | 'Hot' | 'Updated'
}

const GameCard = ({ game, size = 'medium', tag }: GameCardProps) => {
  // Card dimensions based on reference image
  const getCardDimensions = () => {
    switch (size) {
      case 'featured':
        return {
          container: 'w-[200px] md:w-[240px]',
          imageAspect: 'aspect-[16/9]',
          titleSize: 'text-sm md:text-base',
          rounded: 'rounded-[13px]'
        }
      case 'small':
        return {
          container: 'w-[160px] md:w-[180px]',
          imageAspect: 'aspect-[16/9]',
          titleSize: 'text-xs md:text-sm',
          rounded: 'rounded-[13px]'
        }
      default:
        return {
          container: 'w-[180px] md:w-[200px]',
          imageAspect: 'aspect-[16/9]',
          titleSize: 'text-sm',
          rounded: 'rounded-[13px]'
        }
    }
  }

  const dimensions = getCardDimensions()
  
  // Generate responsive srcset for placeholder
  const generateSrcSet = (width: number) => {
    const baseUrl = `/placeholder.svg?height=${Math.round(width * 9/16)}&width=${width}&text=${encodeURIComponent(game.display_name)}`
    return [
      `${baseUrl}&dpr=1 1x`,
      `${baseUrl}&dpr=2 2x`,
      `${baseUrl}&dpr=3 3x`
    ].join(', ')
  }

  const baseWidth = size === 'featured' ? 240 : size === 'small' ? 180 : 200
  
  return (
    <Link
      href={`/games/${game.name}`}
      className={`group block ${dimensions.container} flex-shrink-0 transition-all duration-300 hover:scale-105 snap-start`}
    >
      <div className={`relative ${dimensions.imageAspect} w-full overflow-hidden ${dimensions.rounded} bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow`}>
        <img
          src={`/placeholder.svg?height=${Math.round(baseWidth * 9/16)}&width=${baseWidth}&text=${encodeURIComponent(game.display_name)}`}
          srcSet={generateSrcSet(baseWidth)}
          alt={game.display_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Tag badge */}
        {tag && (
          <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-[6px] ${
            tag === 'Hot' ? 'bg-red-500' : 
            tag === 'New' ? 'bg-purple-500' : 
            'bg-blue-500'
          }`}>
            {tag}
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      {/* Title */}
      <div className="pt-2 px-1">
        <h3 className={`${dimensions.titleSize} font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors`}>
          {game.display_name}
        </h3>
      </div>
    </Link>
  )
}

interface ScrollableGameRowProps {
  games: Game[]
  categoryName: string
  showViewAll?: boolean
}

const ScrollableGameRow = ({ games, categoryName, showViewAll }: ScrollableGameRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      
      // Rule 4: Don't show buttons when content doesn't exceed container width
      // Add small tolerance to account for fractional pixels
      const canScroll = scrollWidth > clientWidth + 2
      
      if (!canScroll) {
        setCanScrollLeft(false)
        setCanScrollRight(false)
        return
      }
      
      // Rule 1: Show > by default when at start position (no displacement)
      // Rule 2: Show < when scrolled right (has displacement)
      setCanScrollLeft(scrollLeft > 1) // Small tolerance for precision
      
      // Rule 3: Don't show > when at the end
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2) // Small tolerance for precision
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons()
    }, 100) // Small delay to ensure DOM is ready
    
    const current = scrollRef.current
    if (current) {
      current.addEventListener('scroll', checkScrollButtons)
      const resizeObserver = new ResizeObserver(checkScrollButtons)
      resizeObserver.observe(current)
      
      return () => {
        current.removeEventListener('scroll', checkScrollButtons)
        resizeObserver.disconnect()
        clearTimeout(timer)
      }
    }
    
    return () => clearTimeout(timer)
  }, [games])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-text">{categoryName}</h2>
        {showViewAll && (
          <Link
            href={`/games/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-primary hover:text-primary-hover font-bold text-sm md:text-base transition-colors"
          >
            {categoryName} →
          </Link>
        )}
      </div>
      
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-3 py-2 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl hover:shadow-2xl hover:scale-110 border border-white/20"
          >
            <span className="text-xl font-bold select-none">&lt;</span>
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-3 py-2 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl hover:shadow-2xl hover:scale-110 border border-white/20"
          >
            <span className="text-xl font-bold select-none">&gt;</span>
          </button>
        )}
        
        <div
          ref={scrollRef}
          className="flex gap-[7px] overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {games.map((game, index) => {
            // Add some variety with tags
            const tags: Array<'New' | 'Hot' | 'Updated' | undefined> = ['New', 'Hot', 'Updated', undefined]
            const randomTag = Math.random() > 0.6 ? tags[Math.floor(Math.random() * tags.length)] : undefined
            
            return (
              <GameCard 
                key={game.id} 
                game={game} 
                size={index < 3 ? "featured" : "medium"}
                tag={randomTag}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface GridGameSectionProps {
  games: Game[]
  categoryName: string
  showViewAll?: boolean
}

const GridGameSection = ({ games, categoryName, showViewAll }: GridGameSectionProps) => {
  const displayedGames = games.slice(0, 8)
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-text">{categoryName}</h2>
        {showViewAll && (
          <Link
            href={`/games/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-primary hover:text-primary-hover font-bold text-sm md:text-base transition-colors"
          >
            {categoryName} →
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[7px]">
        {displayedGames.map((game, index) => {
          // Add some variety with tags for grid layout
          const tags: Array<'New' | 'Hot' | 'Updated' | undefined> = ['New', 'Hot', 'Updated', undefined]
          const randomTag = Math.random() > 0.7 ? tags[Math.floor(Math.random() * tags.length)] : undefined
          
          return (
            <GameCard 
              key={game.id} 
              game={game} 
              size="small"
              tag={randomTag}
            />
          )
        })}
      </div>
    </div>
  )
}

interface GameGroupProps {
  games: Game[]
  index: number
}

const GameGroup = ({ games, index }: GameGroupProps) => {
  // Take up to 5 games for this group (1 main + up to 4 small)
  const groupGames = games.slice(0, 5)
  const mainGame = groupGames[0]
  const smallGames = groupGames.slice(1) // Take all remaining games, even if less than 4
  
  if (!mainGame) return null
  
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px] lg:w-[480px] snap-start">
      <div className="flex gap-[7px] h-[180px] md:h-[220px] lg:h-[260px]">
        {/* Left side - Main game (large) */}
        <div className="flex-1">
          <Link
            href={`/games/${mainGame.name}`}
            className="group block w-full h-full"
          >
            <div className="relative w-full h-full overflow-hidden rounded-[13px] bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300">
              <img
                src={`/placeholder.svg?height=260&width=240&text=${encodeURIComponent(mainGame.display_name)}`}
                srcSet={`/placeholder.svg?height=260&width=240&text=${encodeURIComponent(mainGame.display_name)}&dpr=1 1x, /placeholder.svg?height=260&width=240&text=${encodeURIComponent(mainGame.display_name)}&dpr=2 2x`}
                alt={mainGame.display_name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Game title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4">
                <h3 className="text-white font-bold text-sm md:text-lg line-clamp-2">
                  {mainGame.display_name}
                </h3>
              </div>
              
              {/* Tag badge for main game */}
              {Math.random() > 0.5 && (
                <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-[6px] bg-red-500">
                  Top rated
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </Link>
        </div>
        
        {/* Right side - 4 small games in 2x2 grid */}
        <div className="w-[120px] md:w-[150px] lg:w-[180px]">
          <div className="grid grid-cols-1 grid-rows-4 gap-[7px] h-full">
            {smallGames.map((game, gameIndex) => {
              const tags: Array<'New' | 'Hot' | 'Updated' | undefined> = ['New', 'Hot', 'Updated', undefined]
              const randomTag = Math.random() > 0.8 ? tags[Math.floor(Math.random() * tags.length)] : undefined
              
              return (
                <Link
                  key={game.id}
                  href={`/games/${game.name}`}
                  className="group block"
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[13px] bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <img
                      src={`/placeholder.svg?height=60&width=120&text=${encodeURIComponent(game.display_name.slice(0, 8))}`}
                      alt={game.display_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Tag badge for small games */}
                    {randomTag && (
                      <div className={`absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-[4px] ${
                        randomTag === 'Hot' ? 'bg-red-500' : 
                        randomTag === 'New' ? 'bg-purple-500' : 
                        'bg-blue-500'
                      }`}>
                        {randomTag}
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeaturedGameRowProps {
  games: Game[]
  categoryName: string
  showViewAll?: boolean
}

const FeaturedGameRow = ({ games, categoryName, showViewAll }: FeaturedGameRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Create groups from available games
  const createGameGroups = () => {
    const groups = []
    const gamesPerGroup = 5
    
    if (games.length === 0) return groups
    
    // If we have less than 5 games, create one group with all games
    if (games.length < 5) {
      groups.push(games)
      return groups
    }
    
    // Create groups of 5, repeat games if necessary to fill multiple groups
    const allGames = [...games]
    const targetGroups = Math.min(6, Math.ceil(games.length / gamesPerGroup)) // Maximum 6 groups
    
    // Repeat games if we don't have enough for multiple groups
    while (allGames.length < targetGroups * gamesPerGroup) {
      allGames.push(...games)
    }
    
    for (let i = 0; i < targetGroups; i++) {
      const startIndex = i * gamesPerGroup
      const groupGames = allGames.slice(startIndex, startIndex + gamesPerGroup)
      if (groupGames.length > 0) {
        groups.push(groupGames)
      }
    }
    
    return groups
  }

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      
      // Calculate total content width based on groups
      const gameGroups = createGameGroups()
      const groupWidth = 320 + 7 // base width + gap (320px for mobile, gap-[7px])
      const mdGroupWidth = 400 + 7 // md width + gap 
      const lgGroupWidth = 480 + 7 // lg width + gap
      
      // Use responsive group width (simplified for now, using base width)
      const totalContentWidth = gameGroups.length * groupWidth
      
      // Rule 4: Don't show buttons when content doesn't exceed container width
      const canScroll = totalContentWidth > clientWidth
      
      if (!canScroll) {
        setCanScrollLeft(false)
        setCanScrollRight(false)
        return
      }
      
      // Rule 1: Show > by default when at start position (no displacement)
      // Rule 2: Show < when scrolled right (has displacement)
      setCanScrollLeft(scrollLeft > 1) // Small tolerance for precision
      
      // Rule 3: Don't show > when at the end
      const maxScroll = totalContentWidth - clientWidth
      setCanScrollRight(scrollLeft < maxScroll - 2) // Small tolerance for precision
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollButtons()
    }, 100) // Small delay to ensure DOM is ready
    
    const current = scrollRef.current
    if (current) {
      current.addEventListener('scroll', checkScrollButtons)
      const resizeObserver = new ResizeObserver(checkScrollButtons)
      resizeObserver.observe(current)
      
      return () => {
        current.removeEventListener('scroll', checkScrollButtons)
        resizeObserver.disconnect()
        clearTimeout(timer)
      }
    }
    
    return () => clearTimeout(timer)
  }, [games])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340 // Approximately one group width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const gameGroups = createGameGroups()

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-text">{categoryName}</h2>
        {showViewAll && (
          <Link
            href={`/games/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-primary hover:text-primary-hover font-bold text-sm md:text-base transition-colors"
          >
            {categoryName} →
          </Link>
        )}
      </div>
      
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-[110px] md:top-[130px] lg:top-[150px] -translate-y-1/2 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-4 py-3 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl hover:shadow-2xl hover:scale-110 border border-white/20"
          >
            <span className="text-2xl font-bold select-none">&lt;</span>
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-[110px] md:top-[130px] lg:top-[150px] -translate-y-1/2 z-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-4 py-3 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-xl hover:shadow-2xl hover:scale-110 border border-white/20"
          >
            <span className="text-2xl font-bold select-none">&gt;</span>
          </button>
        )}
        
        <div
          ref={scrollRef}
          className="flex gap-[7px] overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {gameGroups.map((groupGames, index) => (
            <GameGroup
              key={`group-${index}`}
              games={groupGames}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const ShowGameList = () => {
  const [gameData, setGameData] = useState<GameList | null>(null)
  const [loading, setLoading] = useState(true)

  // Categories that should be displayed as horizontal scrolling rows
  const scrollCategories = ['Action', 'Adventure', '.io', 'Basketball']
  
  // Categories that should be displayed as grids
  const gridCategories = ['2 Player', 'Puzzle', 'Racing', 'Sports']

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        console.log('开始请求游戏数据...')
        const res = await getGameList()
        console.log('API响应:', res)
        console.log('请求到的游戏数据', res.data)
        console.log('Categories found:', res.data?.data?.length || res.data?.length)
        
        // Handle different response structures
        const gameCategories = res.data.data || res.data
        setGameData(gameCategories)
      } catch (error: any) {
        console.error('Failed to fetch game data:', error)
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        })
        
        // Use mock data for development if API fails
        const mockData = [
          {
            category_id: 1,
            category_name: "2 Player",
            games: [
              {
                id: 1,
                display_name: "Sniper Challenge Game",
                name: "sniper-challenge-game"
              }
            ]
          },
          {
            category_id: 2,
            category_name: "Action",
            games: [
              {
                id: 7,
                display_name: "Super Slime",
                name: "super-slime"
              },
              {
                id: 12,
                display_name: "Dig Tycoon",
                name: "dig-tycoon"
              }
            ]
          },
          {
            category_id: 3,
            category_name: "Adventure",
            games: [
              {
                id: 3,
                display_name: "Street Life",
                name: "street-life"
              }
            ]
          }
        ]
        
        console.log('Using mock data due to API error')
        setGameData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [])

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text/60">Loading games...</p>
          </div>
        </div>
      </section>
    )
  }

  const categories = gameData?.filter(cat => cat.games.length > 0) || []
  console.log('Filtered categories:', categories.length)

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🎮</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
        🕹️
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-text mb-4 pop-in">
            All Our <span className="gradient-text">Awesome Games</span>
          </h1>
          <p className="text-xl md:text-2xl text-text/80 max-w-3xl mx-auto">
            Dive into our collection of free, unblocked HTML5 games. Ready for some fun?
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => {
              const shouldShowViewAll = category.games.length > 20
              const isScrollCategory = scrollCategories.includes(category.category_name)
              const isGridCategory = gridCategories.includes(category.category_name)
              
              // Use Featured layout for the first category - use the actual category name, not "Featured"
              if (categoryIndex === 0 && category.games.length > 0) {
                return (
                  <FeaturedGameRow
                    key={category.category_id}
                    games={category.games}
                    categoryName={category.category_name}
                    showViewAll={shouldShowViewAll}
                  />
                )
              }
              
              // Default behavior: scroll for categories with many games, grid for few games
              const shouldUseScroll = isScrollCategory || (!isGridCategory && category.games.length > 8)
              
              if (shouldUseScroll) {
                return (
                  <ScrollableGameRow
                    key={category.category_id}
                    games={category.games.slice(0, 20)}
                    categoryName={category.category_name}
                    showViewAll={shouldShowViewAll}
                  />
                )
              } else {
                return (
                  <GridGameSection
                    key={category.category_id}
                    games={category.games}
                    categoryName={category.category_name}
                    showViewAll={shouldShowViewAll}
                  />
                )
              }
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="No games available"
              width={300}
              height={200}
              className="mx-auto mb-6 opacity-70"
            />
            <h2 className="text-3xl font-bold text-text mb-4">Game Zone Under Construction!</h2>
            <p className="text-text/80 max-w-md mx-auto mb-6">
              We're busy adding more awesome games. Check back soon for new adventures!
            </p>
          </div>
        )}

        <div className="text-center mt-12 md:mt-16">
          <Link href="/#game-frame" className="btn-primary text-xl md:text-2xl jello">
            Play Speed Stars Now!
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ShowGameList