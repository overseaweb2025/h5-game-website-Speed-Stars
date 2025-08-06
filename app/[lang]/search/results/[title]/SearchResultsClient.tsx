"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLangGameList } from "@/hooks/LangGamelist_value"
import { SearchEngine } from "@/components/search/SearchUtils"
import { GameRouter } from "@/lib/router"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Locale } from "@/lib/lang/dictionaraies"

interface SearchResult {
  id: string
  name: string
  display_name: string
  category?: string
  cover?: string
  slug: string
}

interface SearchResultsClientProps {
  searchQuery?: string
  t?: any
  lang: Locale
}

export default function SearchResultsClient({ searchQuery = "", t, lang }: SearchResultsClientProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState(searchQuery || "")
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  
  const router = useRouter()
  const { getLangGames } = useLangGameList()
  const allGames = getLangGames(lang)
  const searchRef = useRef<HTMLDivElement>(null)

  // 加载搜索历史
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('search-history') || '[]')
      setSearchHistory(history.slice(0, 5)) // 只显示前5个
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }, [])

  // 简单的模糊匹配搜索函数
  const performSearch = (query: string) => {
    if (!query.trim() || !allGames.length) {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const matchedGames = allGames
      .filter(game => 
        game.display_name.toLowerCase().includes(searchTerm) ||
        (game.category && game.category.toLowerCase().includes(searchTerm))
      )
      .map(game => ({
        id: game.name,
        name: game.name,
        display_name: game.display_name,
        category: game.category,
        cover: game.cover,
        slug: game.name
      }))
      .slice(0, 50) // 限制结果数量

    setResults(matchedGames)
  }

  // 获取搜索建议
  const getSearchSuggestions = (searchQuery: string) => {
    if (!searchQuery.trim() || allGames.length === 0) {
      setSearchSuggestions([])
      return
    }

    const query = searchQuery.toLowerCase()
    const matchedGames = new Set<string>()

    allGames.forEach(game => {
      if (game.display_name.toLowerCase().includes(query)) {
        matchedGames.add(game.display_name)
      }
      if (game.category && game.category.toLowerCase().includes(query)) {
        matchedGames.add(game.display_name)
      }
    })

    const suggestions = Array.from(matchedGames).slice(0, 8)
    setSearchSuggestions(suggestions)
  }

  // 当searchQuery或allGames变化时执行搜索
  useEffect(() => {
    if (searchQuery && allGames.length > 0) {
      setIsLoading(true)
      performSearch(searchQuery)
      setIsLoading(false)
    }
  }, [searchQuery, allGames.length]) // 只依赖length避免引用问题

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

  // 处理搜索历史点击
  const handleHistoryClick = (historyItem: string) => {
    performSearchAndNavigate(historyItem)
  }

  // 处理搜索按钮点击
  const handleSearchClick = () => {
    if (query.trim()) {
      performSearchAndNavigate(query.trim())
    }
  }

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      performSearchAndNavigate(query.trim())
    }
  }

  // 执行搜索并更新URL
  const performSearchAndNavigate = (searchTerm: string) => {
    setQuery(searchTerm)
    setShowSuggestions(false)
    
    // 保存搜索历史
    try {
      const currentHistory = JSON.parse(localStorage.getItem('search-history') || '[]')
      const newHistory = [searchTerm, ...currentHistory.filter((item: string) => item !== searchTerm)].slice(0, 10)
      localStorage.setItem('search-history', JSON.stringify(newHistory))
      setSearchHistory(newHistory.slice(0, 5))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
    
    // 跳转到新的搜索结果页面
    router.push(`/search/results/${encodeURIComponent(searchTerm)}`)
  }

  // 清除搜索历史
  const clearSearchHistory = () => {
    try {
      localStorage.removeItem('search-history')
      setSearchHistory([])
    } catch (error) {
      console.warn('Failed to clear search history:', error)
    }
  }

  // 处理游戏点击
  const handleGameClick = (game: SearchResult) => {
    GameRouter.toGameDetail(game.slug)
  }

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 获取热门搜索
  const popularSearches = SearchEngine.getPopularSearches(allGames, 6)

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
        <div ref={searchRef} className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder="搜索游戏..."
            className="w-full bg-gray-800/90 border-0 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm"
          />
          
          {/* 移动端搜索建议下拉框 */}
          {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0 || popularSearches.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
              
              {/* 搜索建议 */}
              {searchSuggestions.length > 0 && (
                <div className="border-b border-gray-700/50">
                  <div className="px-3 py-2 text-xs text-gray-400 font-medium">搜索建议</div>
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors text-white text-sm"
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        {suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 搜索历史 */}
              {!query && searchHistory.length > 0 && (
                <div className="border-b border-gray-700/50">
                  <div className="px-3 py-2 text-xs text-gray-400 font-medium flex items-center justify-between">
                    <span>搜索历史</span>
                    <button 
                      onClick={clearSearchHistory}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      清除
                    </button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors text-white text-sm"
                    >
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 热门搜索 */}
              {!query && popularSearches.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs text-gray-400 font-medium">热门搜索</div>
                  {popularSearches.map((term, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors text-white text-sm"
                    >
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                        {term}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* PC端搜索栏 */}
      <div className="hidden md:block pt-8 pb-6">
        <div className="max-w-2xl mx-auto">
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                placeholder="搜索游戏、分类或关键词..."
                className="w-full pl-12 pr-12 py-4 bg-gray-800/90 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-base"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("")
                    setResults([])
                    setShowSuggestions(false)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* PC端搜索建议下拉框 */}
            {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0 || popularSearches.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                
                {/* 搜索建议 */}
                {searchSuggestions.length > 0 && (
                  <div className="border-b border-gray-700/50">
                    <div className="px-4 py-3 text-sm text-gray-400 font-medium">搜索建议</div>
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors text-white border-b border-gray-700/30 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <Search className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="font-medium">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 搜索历史 */}
                {!query && searchHistory.length > 0 && (
                  <div className="border-b border-gray-700/50">
                    <div className="px-4 py-3 text-sm text-gray-400 font-medium flex items-center justify-between">
                      <span>最近搜索</span>
                      <button 
                        onClick={clearSearchHistory}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        清除历史
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleHistoryClick(item)}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors text-white border-b border-gray-700/30 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-3 text-gray-400" />
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 热门搜索 */}
                {!query && popularSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-3 text-sm text-gray-400 font-medium">热门搜索</div>
                    {popularSearches.map((term, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors text-white border-b border-gray-700/30 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-3 text-gray-400" />
                          <span>{term}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 搜索结果标题 */}
      <div className="hidden md:block text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          搜索结果: "{searchQuery}"
        </h1>
        <p className="text-gray-400">
          找到 {results.length} 个相关游戏
        </p>
      </div>

      {/* 移动端结果统计 */}
      <div className="md:hidden mb-4 text-center pt-4">
        <span className="text-sm text-gray-400">
          找到 {results.length} 个结果
        </span>
      </div>

      {/* 搜索结果 */}
      <div className="mt-4 md:mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-white">搜索中...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
            {results.map((game, index) => (
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