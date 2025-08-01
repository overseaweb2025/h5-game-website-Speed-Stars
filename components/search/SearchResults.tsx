"use client"

import React from "react"
import Link from "next/link"
import { SearchResult } from "./SearchUtils"
import { GameRouter } from "@/lib/router"
import { Clock, Star, Zap, Search as SearchIcon } from "lucide-react"

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onResultClick?: (result: SearchResult) => void
  showGrouped?: boolean
  className?: string
  t?: any
}

export default function SearchResults({
  results,
  query,
  onResultClick,
  showGrouped = false,
  className = "",
  t
}: SearchResultsProps) {
  
  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result)
    GameRouter.toGameDetail(result.slug)
  }

  const getMatchIcon = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact':
        return <Star className="w-4 h-4 text-yellow-500" title="Exact match" />
      case 'start':
        return <Zap className="w-4 h-4 text-blue-500" title="Starts with" />
      case 'contain':
        return <SearchIcon className="w-4 h-4 text-green-500" title="Contains" />
      case 'fuzzy':
        return <Clock className="w-4 h-4 text-purple-500" title="Similar" />
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-400"
    if (score >= 0.7) return "text-yellow-400"
    if (score >= 0.5) return "text-orange-400"
    return "text-red-400"
  }

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery) return text
    
    const regex = new RegExp(`(${searchQuery})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-300 text-gray-900 px-1 rounded">
          {part}
        </mark> : 
        part
    )
  }

  if (results.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {t?.search?.noResults || "No games found"}
        </h3>
        <p className="text-gray-400 mb-4">
          {t?.search?.noResultsMessage || `No games found for "${query}". Try searching with different keywords.`}
        </p>
        <div className="text-sm text-gray-500">
          {t?.search?.suggestions || "Try searching for:"} 
          <span className="ml-2 text-purple-400">racing, puzzle, action, adventure</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* 搜索统计 */}
      <div className="flex items-center justify-between mb-6 px-4 py-3 bg-gray-800/50 rounded-lg">
        <div className="text-white">
          <span className="font-semibold">{results.length}</span> 
          <span className="text-gray-400 ml-1">
            {t?.search?.resultsFor || "results for"} "<span className="text-purple-400">{query}</span>"
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {t?.search?.sortedByRelevance || "Sorted by relevance"}
        </div>
      </div>

      {/* 搜索结果网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <div
            key={`${result.id}-${index}`}
            onClick={() => handleResultClick(result)}
            className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-gray-700 hover:border-purple-500 group"
          >
            {/* 游戏图片 */}
            <div className="w-full h-32 bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
              {result.cover ? (
                <img
                  src={result.cover}
                  alt={result.display_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                    if (placeholder) placeholder.classList.remove('hidden')
                  }}
                />
              ) : null}
              
              {/* 占位符 */}
              <div className={`absolute inset-0 flex items-center justify-center text-4xl ${result.cover ? 'hidden' : ''}`}>
                🎮
              </div>

              {/* 匹配类型标签 */}
              <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
                {getMatchIcon(result.matchType)}
              </div>
            </div>

            {/* 游戏信息 */}
            <div className="space-y-2">
              {/* 游戏名称 */}
              <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                {highlightText(result.display_name, query)}
              </h3>

              {/* 分类和分数 */}
              <div className="flex items-center justify-between text-sm">
                {result.category && (
                  <span className="text-gray-400 bg-gray-700 px-2 py-1 rounded-full text-xs">
                    {result.category}
                  </span>
                )}
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Score:</span>
                  <span className={`text-xs font-semibold ${getScoreColor(result.score)}`}>
                    {(result.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* 描述 */}
              {result.description && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  {highlightText(result.description.substring(0, 100), query)}
                  {result.description.length > 100 && '...'}
                </p>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-500">
                  {result.matchType === 'exact' && (t?.search?.exactMatch || 'Exact match')}
                  {result.matchType === 'start' && (t?.search?.startsWith || 'Starts with')}
                  {result.matchType === 'contain' && (t?.search?.contains || 'Contains')}
                  {result.matchType === 'fuzzy' && (t?.search?.similar || 'Similar')}
                </span>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                  {t?.search?.playNow || "Play Now"} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 搜索提示 */}
      <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <h4 className="text-white font-medium mb-2">
          {t?.search?.searchTips || "Search Tips"}
        </h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• {t?.search?.tip1 || "Use specific game names for better results"}</li>
          <li>• {t?.search?.tip2 || "Try searching by category (e.g., 'racing', 'puzzle')"}</li>
          <li>• {t?.search?.tip3 || "Partial matches are supported"}</li>
          <li>• {t?.search?.tip4 || "Search is case-insensitive"}</li>
        </ul>
      </div>
    </div>
  )
}