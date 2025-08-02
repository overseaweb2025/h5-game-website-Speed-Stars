"use client"

import React from "react"
import { SearchResult } from "./SearchUtils"
import { GameRouter } from "@/lib/router"

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onResultClick?: (result: SearchResult) => void
  className?: string
  t?: any
}

export default function SearchResults({
  results,
  query,
  onResultClick,
  className = "",
  t
}: SearchResultsProps) {
  
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    } else {
      GameRouter.toGameDetail(result.slug)
    }
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {t?.search?.noResults || "未找到相关游戏"}
        </h3>
        <p className="text-gray-400">
          {t?.search?.noResultsDesc || "请尝试其他搜索词"}
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          {t?.search?.resultsFor || "搜索结果"}: "{query}"
        </h2>
        <p className="text-gray-400">
          {t?.search?.foundResults || "找到"} {results.length} {t?.search?.games || "个游戏"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((result, index) => (
          <div
            key={`${result.id}-${index}`}
            onClick={() => handleResultClick(result)}
            className="bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/30 hover:border-purple-500/50 group"
          >
            {/* 游戏封面 */}
            <div className="aspect-square bg-gray-700 relative overflow-hidden">
              {result.cover ? (
                <img
                  src={result.cover}
                  alt={result.display_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                    if (placeholder) placeholder.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center text-4xl ${result.cover ? 'hidden' : ''}`}>
                🎮
              </div>
            </div>
            
            {/* 游戏信息 */}
            <div className="p-3">
              <h3 className="font-medium text-white text-sm md:text-base truncate group-hover:text-purple-300 transition-colors">
                {result.display_name}
              </h3>
              {result.category && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {result.category}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}