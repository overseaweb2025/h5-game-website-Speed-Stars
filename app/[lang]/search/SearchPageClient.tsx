"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles, TrendingUp, Filter } from "lucide-react"
import { SearchBox, SearchResults } from "@/components/search"
import { useLangGameList } from "@/hooks/LangGamelist_value"
import { SearchEngine, SearchResult } from "@/components/search/SearchUtils"
import { Locale } from "@/lib/lang/dictionaraies"

interface SearchPageClientProps {
  initialQuery?: string
  t?: any
  lang: Locale
}

export default function SearchPageClient({ initialQuery = "", t, lang }: SearchPageClientProps) {
  const [query, setQuery] = useState(initialQuery)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  
  const router = useRouter()
  const { getLangGames } = useLangGameList()
  const allGames = getLangGames(lang)

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

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setQuery(value)
    getSearchSuggestions(value)
  }

  // 处理搜索建议点击
  const handleSuggestionClick = (suggestion: string) => {
    performSearch(suggestion)
  }

  // 处理搜索按钮点击
  const handleSearchClick = () => {
    if (query.trim()) {
      performSearch(query.trim())
    }
  }

  // 执行搜索并跳转
  const performSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    
    // 保存搜索历史
    try {
      const searchHistory = JSON.parse(localStorage.getItem('search-history') || '[]')
      const newHistory = [searchTerm, ...searchHistory.filter((item: string) => item !== searchTerm)].slice(0, 10)
      localStorage.setItem('search-history', JSON.stringify(newHistory))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
    
    // 跳转到搜索结果页面
    router.push(`/search/results/${encodeURIComponent(searchTerm)}`)
  }

  // 获取热门搜索
  const popularSearches = SearchEngine.getPopularSearches(allGames, 8)

  return (
    <div className="container mx-auto px-4">
      
      {/* 移动端导航栏 + 搜索框 */}
      <div className="md:hidden flex items-center gap-2 py-2 -mt-20 border-b border-gray-700/50">
        {/* 返回按钮 */}
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center text-white hover:text-purple-400 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* 搜索框 - 占据剩余空间 */}
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t?.search?.placeholder || "搜索游戏..."}
            className="w-full bg-gray-800/90 border-0 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm"
          />
        </div>
        
        {/* 搜索按钮 */}
        <button 
          onClick={handleSearchClick}
          className="flex items-center justify-center flex-shrink-0"
        >
          <span className="text-sm font-medium text-pink-400">{t?.search?.searchButton || "搜索"}</span>
        </button>
      </div>

      {/* PC端搜索页面标题 */}
      <div className="hidden md:block text-center mb-6 md:mb-12">
        <div className="flex items-center justify-center mb-3 md:mb-4 pt-6 md:pt-0">
          <div className="p-2 md:p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg">
            <Search className="w-5 h-5 md:w-8 md:h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4">
          {t?.search?.title || "Discover Amazing Games"}
        </h1>
        <p className="text-sm md:text-xl text-gray-300 max-w-2xl mx-auto">
          {t?.search?.subtitle || "Search through our collection of exciting games and find your next favorite adventure"}
        </p>
      </div>
      
      {/* PC端搜索框 */}
      <div className="hidden md:flex justify-center">
        <div className="max-w-2xl w-full mb-12">
          <SearchBox
            games={allGames}
            placeholder={t?.search?.placeholder || "Search for games, categories, or keywords..."}
            onSearch={(searchQuery, searchResults) => {
              setQuery(searchQuery)
              setResults(searchResults)
            }}
            variant="default"
            t={t}
            className="w-full text-sm md:text-base"
          />
        </div>
      </div>

      {/* PC端搜索结果 */}
      <div className="hidden md:block">
        {query ? (
          <div className="max-w-6xl mx-auto mt-8">
            <SearchResults
              results={results}
              query={query}
              t={t}
              className="mb-12"
            />
          </div>
        ) : (
          <>
            {/* 热门搜索 */}
            <div className="max-w-4xl mx-auto mb-6 md:mb-12 mt-8">
              <div className="text-center mb-4 md:mb-8">
                <div className="flex items-center justify-center mb-2 md:mb-4">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-purple-400 mr-2 md:mr-3" />
                  <h2 className="text-lg md:text-2xl font-bold text-white">
                    {t?.search?.popularSearches || "Popular Searches"}
                  </h2>
                </div>
                <p className="text-sm md:text-base text-gray-400">
                  {t?.search?.popularSearchesDesc || "Try one of these popular search terms"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const searchResults = SearchEngine.search(term, allGames, {
                        maxResults: 20
                      })
                      setQuery(term)
                      setResults(searchResults)
                    }}
                    className="group p-3 md:p-4 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700/50 hover:border-purple-500/50 rounded-xl transition-all duration-200 text-left"
                  >
                    <div className="text-sm md:text-base text-white font-medium group-hover:text-purple-300 transition-colors truncate">
                      {term}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 搜索建议 */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4 md:mb-8">
                <div className="flex items-center justify-center mb-2 md:mb-4">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-400 mr-2 md:mr-3" />
                  <h2 className="text-lg md:text-2xl font-bold text-white">
                    {t?.search?.searchTips || "Search Tips"}
                  </h2>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                <div className="p-3 md:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="text-sm md:text-base text-white font-semibold mb-2 md:mb-3 flex items-center">
                    <Search className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-purple-400" />
                    {t?.search?.searchByName || "Search by Game Name"}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {t?.search?.searchByNameDesc || "Type the exact name or part of the game name for precise results."}
                  </p>
                  <div className="mt-2 md:mt-3">
                    <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                      {t?.search?.example || "Example"}: ""
                    </span>
                  </div>
                </div>
                
                <div className="p-3 md:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="text-sm md:text-base text-white font-semibold mb-2 md:mb-3 flex items-center">
                    <Filter className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-blue-400" />
                    {t?.search?.searchByCategory || "Search by Category"}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {t?.search?.searchByCategoryDesc || "Find games by their category like racing, puzzle, action, etc."}
                  </p>
                  <div className="mt-2 md:mt-3">
                    <span className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                      {t?.search?.example || "Example"}: "racing", "puzzle"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 移动端内容区域 */}
      <div className="md:hidden mt-1">
        {/* 搜索建议列表 */}
        {query && searchSuggestions.length > 0 && (
          <div className="mb-6">
            <div className="divide-y divide-gray-600">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="py-3 px-1 hover:bg-gray-700/30 cursor-pointer transition-all duration-200"
                >
                  <div className="text-white font-medium text-xs">
                    {suggestion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!query && (
          <>
            {/* 热门搜索 */}
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400 mr-2" />
                  <h2 className="text-lg font-bold text-white">
                    {t?.search?.popularSearches || "热门搜索"}
                  </h2>
                </div>
                <p className="text-sm text-gray-400">
                  {t?.search?.popularSearchesDesc || "试试这些热门搜索词"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => performSearch(term)}
                    className="group p-3 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700/50 hover:border-purple-500/50 rounded-xl transition-all duration-200 text-left"
                  >
                    <div className="text-sm text-white font-medium group-hover:text-purple-300 transition-colors truncate">
                      {term}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 搜索建议 */}
            <div>
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                  <h2 className="text-lg font-bold text-white">
                    {t?.search?.searchTips || "搜索提示"}
                  </h2>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="text-sm text-white font-semibold mb-2 flex items-center">
                    <Search className="w-4 h-4 mr-1 text-purple-400" />
                    {t?.search?.searchByName || "按游戏名搜索"}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {t?.search?.searchByNameDesc || "输入游戏的完整名称或部分名称获得精确结果"}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                      {t?.search?.example || "例如"}: ""
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <h3 className="text-sm text-white font-semibold mb-2 flex items-center">
                    <Filter className="w-4 h-4 mr-1 text-blue-400" />
                    {t?.search?.searchByCategory || "按分类搜索"}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {t?.search?.searchByCategoryDesc || "根据游戏分类查找，如赛车、益智、动作等"}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                      {t?.search?.example || "例如"}: "racing", "puzzle"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}