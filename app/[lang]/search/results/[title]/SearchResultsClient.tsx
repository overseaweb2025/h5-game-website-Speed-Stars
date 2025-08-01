"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useGameData } from "@/hooks/useGameData"
import { SearchEngine, SearchResult } from "@/components/search/SearchUtils"
import { GameRouter } from "@/lib/router"

interface SearchResultsClientProps {
  searchQuery?: string
  t?: any
}

export default function SearchResultsClient({ searchQuery = "", t }: SearchResultsClientProps) {
  const [allResults, setAllResults] = useState<SearchResult[]>([])
  const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [query, setQuery] = useState(searchQuery || "")
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const router = useRouter()
  const { allGames } = useGameData()
  const ITEMS_PER_PAGE = 10

  // 执行搜索
  const performSearch = useCallback((searchTerm: string = searchQuery) => {
    if (!searchTerm || !allGames.length) return

    setIsLoading(true)
    
    const searchResults = SearchEngine.search(searchTerm, allGames, {
      maxResults: 1000,
      minScore: 0.1,
      includeDescription: false,
      includeCategory: true
    })
    
    setAllResults(searchResults)
    setDisplayedResults(searchResults.slice(0, ITEMS_PER_PAGE))
    setCurrentPage(1)
    setHasMore(searchResults.length > ITEMS_PER_PAGE)
    setIsLoading(false)
  }, [searchQuery, allGames])

  // 获取搜索建议
  const getSearchSuggestions = useCallback((searchTerm: string) => {
    if (!searchTerm.trim() || allGames.length === 0) {
      setSearchSuggestions([])
      return
    }

    const query = searchTerm.toLowerCase()
    const matchedGames = new Set<string>()

    allGames.forEach(game => {
      // 1. 通过游戏标题进行模糊匹配
      if (game.display_name.toLowerCase().includes(query)) {
        matchedGames.add(game.display_name)
      }
      
      // 2. 通过游戏分类进行匹配
      if (game.category && game.category.toLowerCase().includes(query)) {
        matchedGames.add(game.display_name)
      }
    })

    const suggestions = Array.from(matchedGames).slice(0, 8)
    setSearchSuggestions(suggestions)
  }, [allGames])

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setQuery(value)
    getSearchSuggestions(value)
    setShowSuggestions(true)
  }

  // 处理搜索建议点击
  const handleSuggestionClick = (suggestion: string) => {
    performSearchAndNavigate(suggestion)
  }

  // 处理搜索按钮点击
  const handleSearchClick = () => {
    if (query.trim()) {
      performSearchAndNavigate(query.trim())
    }
  }

  // 执行搜索并更新URL
  const performSearchAndNavigate = (searchTerm: string) => {
    setQuery(searchTerm)
    setShowSuggestions(false)
    
    // 保存搜索历史
    const searchHistory = JSON.parse(localStorage.getItem('search-history') || '[]')
    const newHistory = [searchTerm, ...searchHistory.filter((item: string) => item !== searchTerm)].slice(0, 10)
    localStorage.setItem('search-history', JSON.stringify(newHistory))
    
    // 跳转到新的搜索结果页面 - 使用动态路由
    router.push(`/search/results/${encodeURIComponent(searchTerm)}`)
  }

  // 加载更多结果
  const loadMoreResults = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    
    setIsLoadingMore(true)
    
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const newResults = allResults.slice(startIndex, endIndex)
      
      if (newResults.length > 0) {
        setDisplayedResults(prev => [...prev, ...newResults])
        setCurrentPage(nextPage)
        setHasMore(endIndex < allResults.length)
      } else {
        setHasMore(false)
      }
      
      setIsLoadingMore(false)
    }, 500)
  }, [hasMore, isLoadingMore, currentPage, allResults])

  // 无限滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100
      
      if (isAtBottom && hasMore && !isLoadingMore && displayedResults.length > 0) {
        loadMoreResults()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoadingMore, displayedResults.length, loadMoreResults])

  // 初始搜索
  useEffect(() => {
    if (!searchQuery || !allGames.length) return

    setIsLoading(true)
    
    const searchResults = SearchEngine.search(searchQuery, allGames, {
      maxResults: 1000,
      minScore: 0.1,
      includeDescription: false,
      includeCategory: true
    })
    
    setAllResults(searchResults)
    setDisplayedResults(searchResults.slice(0, ITEMS_PER_PAGE))
    setCurrentPage(1)
    setHasMore(searchResults.length > ITEMS_PER_PAGE)
    setIsLoading(false)
  }, [searchQuery, allGames, ITEMS_PER_PAGE])

  // 当 searchQuery 变化时更新 query 状态
  useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery])

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.search-suggestions-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 处理游戏点击
  const handleGameClick = (game: SearchResult) => {
    GameRouter.toGameDetail(game.slug)
  }

  return (
    <div className="container mx-auto px-4">
      
      {/* 移动端搜索栏 */}
      <div className="md:hidden flex items-center gap-2 py-2 -mt-20 border-b border-gray-700/50">
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center text-white hover:text-purple-400 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 搜索框 - 占据剩余空间 */}
        <div className="flex-1 relative search-suggestions-container">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="搜索游戏..."
            className="w-full bg-gray-800/90 border-0 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm"
          />
          
          {/* 搜索建议下拉框 */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors text-white text-sm border-b border-gray-700/50 last:border-b-0"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 搜索按钮 */}
        <button 
          onClick={handleSearchClick}
          className="flex items-center justify-center flex-shrink-0"
        >
          <span className="text-sm font-medium text-pink-400">搜索</span>
        </button>
      </div>

      {/* PC端标题 */}
      <div className="hidden md:block text-center mb-8 pt-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          搜索结果: "{searchQuery}"
        </h1>
        <p className="text-gray-400">
          找到 {allResults.length} 个相关游戏
        </p>
      </div>

      {/* 搜索结果 */}
      <div className="mt-4 md:mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-white">搜索中...</span>
          </div>
        ) : displayedResults.length > 0 ? (
          <>
            {/* 移动端结果统计 */}
            <div className="md:hidden mb-4 text-center">
              <span className="text-sm text-gray-400">
                找到 {allResults.length} 个结果，显示前 {displayedResults.length} 个
              </span>
            </div>

            {/* 游戏卡片网格 */}
            <div className="grid grid-cols-3 gap-4">
              {displayedResults.map((game, index) => (
                <div
                  key={`${game.id}-${index}`}
                  onClick={() => handleGameClick(game)}
                  className="bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/30 hover:border-purple-500/50 group"
                >
                  {/* 游戏封面 */}
                  <div className="aspect-square bg-gray-700 relative overflow-hidden">
                    {game.cover ? (
                      <img
                        src={game.cover}
                        alt={game.display_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center text-4xl ${game.cover ? 'hidden' : ''}`}>
                      🎮
                    </div>
                  </div>
                  
                  {/* 游戏信息 */}
                  <div className="p-3">
                    <h3 className="font-medium text-white text-sm md:text-base truncate group-hover:text-purple-300 transition-colors">
                      {game.display_name}
                    </h3>
                    {game.category && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {game.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 加载更多 */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-white text-sm">加载更多...</span>
              </div>
            )}

            {/* 加载完成提示 */}
            {!hasMore && displayedResults.length > 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-sm">
                  已显示全部 {allResults.length} 个结果
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              未找到相关游戏
            </h3>
            <p className="text-gray-400 mb-6">
              搜索 "{searchQuery}" 没有找到匹配的游戏
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              返回搜索
            </button>
          </div>
        )}
      </div>
    </div>
  )
}