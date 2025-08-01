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
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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
    setIsOpen(value.length > 0)
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
          onFocus={() => setIsOpen(query.length > 0)}
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
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={`${result.id}-${index}`}
              onClick={() => handleResultClick(result)}
              className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50 last:border-b-0"
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
    </div>
  )
}