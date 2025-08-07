"use client"

import React, { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { SearchEngine, SearchResult } from "./SearchUtils"
import { Game as APIGame } from "@/app/api/types/Get/game"
import { GameRouter } from "@/lib/router"

interface SearchBoxProps {
  games: APIGame[]
  placeholder?: string
  onSearch?: (query: string, results: SearchResult[]) => void
  onResultClick?: (result: SearchResult) => void
  className?: string
  variant?: 'default' | 'compact'
  t?: any
}

export default function SearchBox({
  games,
  placeholder = "Search games...",
  onSearch,
  onResultClick,
  className = "",
  variant = 'default',
  t
}: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recommendedGames, setRecommendedGames] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 检测是否为移动设备
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // 生成推荐游戏列表
  useEffect(() => {
    if (games.length > 0) {
      const shuffled = [...games].sort(() => 0.5 - Math.random())
      const recommended = shuffled.slice(0, 6).map(game => ({
        id: game.id,
        name: game.name,
        display_name: game.display_name,
        slug: game.name,
        category: game.category || 'Games'
      }))
      setRecommendedGames(recommended)
    }
  }, [games])

  // 处理搜索
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const searchResults = SearchEngine.search(searchQuery, games, {
      maxResults: 8
    })
    
    setResults(searchResults)
    if (onSearch) {
      onSearch(searchQuery, searchResults)
    }
  }

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setQuery(value)
    performSearch(value)
    setIsOpen(true) // 总是打开下拉框
  }

  // 处理输入框聚焦
  const handleFocus = () => {
    // PC端点击搜索框就显示弹出框，移动端不显示
    if (!isMobile) {
      setIsOpen(true)
    }
  }

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    setQuery(result.display_name)
    setIsOpen(false)
    
    if (onResultClick) {
      onResultClick(result)
    } else {
      GameRouter.toGameDetail(result.slug)
    }
  }

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-gray-800/90 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
          {/* 有搜索结果时显示搜索结果 */}
          {results.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-750 border-b border-gray-600">
                <div className="text-gray-300 text-xs font-medium">Search Results</div>
              </div>
              {results.map((result, index) => (
                <div
                  key={`search-${result.id}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50"
                >
                  <div className="text-white font-medium text-sm">
                    {result.display_name}
                  </div>
                  {result.category && (
                    <div className="text-gray-400 text-xs mt-1">
                      {result.category}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* PC端无搜索查询或无结果时显示推荐游戏 */}
          {!isMobile && (!query || results.length === 0) && recommendedGames.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-750 border-b border-gray-600">
                <div className="text-gray-300 text-xs font-medium">Recommended Games</div>
              </div>
              {recommendedGames.map((game, index) => (
                <div
                  key={`recommended-${game.id}-${index}`}
                  onClick={() => handleResultClick(game)}
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50 last:border-b-0"
                >
                  <div className="text-white font-medium text-sm">
                    {game.display_name}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {game.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 无内容时的占位 */}
          {(!recommendedGames.length && !results.length) && (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              No games available
            </div>
          )}
        </div>
      )}
    </div>
  )
}