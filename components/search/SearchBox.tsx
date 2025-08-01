"use client"

import React, { useState, useRef, useEffect } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
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
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // 获取热门搜索
  const popularSearches = SearchEngine.getPopularSearches(games, 6)

  // 加载历史搜索
  useEffect(() => {
    const saved = localStorage.getItem('game-search-history')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse search history:', error)
      }
    }
  }, [])

  // 保存搜索历史
  const saveSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const newHistory = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(newHistory)
    localStorage.setItem('game-search-history', JSON.stringify(newHistory))
  }

  // 执行搜索
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // 防抖处理
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const searchResults = SearchEngine.search(searchQuery, games, {
        maxResults: 8,
        minScore: 0.2,
        includeDescription: true,
        includeCategory: true
      })
      
      setResults(searchResults)
      setIsLoading(false)
      onSearch?.(searchQuery, searchResults)
    }, 300)
  }

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    performSearch(value)
  }

  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveSearchHistory(query.trim())
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    setQuery(result.display_name)
    setIsOpen(false)
    saveSearchHistory(result.display_name)
    
    // 跳转到游戏页面
    GameRouter.toGameDetail(result.slug)
    
    onResultClick?.(result)
  }

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    performSearch(suggestion)
    inputRef.current?.focus()
  }

  // 清空搜索
  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
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

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (query) {
        clearSearch()
      } else {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
  }

  const isCompact = variant === 'compact'

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative ${isCompact ? 'w-64' : 'w-full max-w-md'}`}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full bg-gray-800/90 border border-gray-600 rounded-full 
              text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
              focus:ring-2 focus:ring-purple-500/20 transition-all duration-200
              ${isCompact ? 'px-4 py-2 pl-10 text-sm' : 'px-6 py-3 pl-12'}
            `}
          />
          
          {/* 搜索图标 */}
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          
          {/* 清空按钮 */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`}
            >
              <X className="w-full h-full" />
            </button>
          )}
        </div>
      </form>

      {/* 搜索结果下拉框 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          
          {/* 搜索结果 */}
          {query && results.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-400 px-3 py-2 font-medium">
                {t?.search?.results || "Search Results"} ({results.length})
              </div>
              <div className="max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={`${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                      {result.cover ? (
                        <img
                          src={result.cover}
                          alt={result.display_name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                            if (placeholder) placeholder.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-2xl ${result.cover ? 'hidden' : ''}`}>
                        🎮
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {result.display_name}
                      </div>
                      {result.category && (
                        <div className="text-xs text-gray-400 truncate">
                          {result.category}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {result.matchType === 'exact' && '⭐'}
                      {result.matchType === 'start' && '🎯'}
                      {result.matchType === 'contain' && '🔍'}
                      {result.matchType === 'fuzzy' && '✨'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 无搜索结果 */}
          {query && !isLoading && results.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm">{t?.search?.noResults || "No games found"}</div>
              <div className="text-xs mt-1">{t?.search?.tryDifferent || "Try a different search term"}</div>
            </div>
          )}

          {/* 加载状态 */}
          {isLoading && (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
              <div className="text-sm">{t?.search?.searching || "Searching..."}</div>
            </div>
          )}

          {/* 历史搜索和热门搜索 */}
          {!query && !isLoading && (
            <div className="p-2">
              {/* 历史搜索 */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-xs text-gray-400 px-3 py-2 font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    {t?.search?.recent || "Recent Searches"}
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
                      >
                        <Search className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-white">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 热门搜索 */}
              {popularSearches.length > 0 && (
                <div>
                  <div className="flex items-center text-xs text-gray-400 px-3 py-2 font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {t?.search?.popular || "Popular Searches"}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {popularSearches.map((search, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-2 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors text-sm text-white truncate"
                      >
                        {search}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}