"use client"

import React, { useState } from 'react'
import { useGameHistory, type GameHistoryItem } from '@/hooks/useGameHistory'
import { Clock, Trash2, Calendar, BarChart3, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface GameHistoryProps {
  className?: string
  showStats?: boolean
  maxItems?: number
  t?: any
}

export const GameHistory: React.FC<GameHistoryProps> = ({ 
  className = '', 
  showStats = true,
  maxItems,
  t 
}) => {
  const { 
    history, 
    stats, 
    isEnabled, 
    loading, 
    error, 
    clearHistory, 
    removeGame,
    getRecentGames,
    getHistoryByCategory 
  } = useGameHistory()

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'duration' | 'name'>('recent')

  // 如果未启用历史记录功能（用户未登录）
  if (!isEnabled) {
    return (
      <div className={`${className}`}>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t?.gameHistory?.gameHistory || "Game History"}</h3>
              <p className="text-gray-400 mb-4">
                {t?.gameHistory?.signInToTrackHistory || "Sign in to track your game browsing history and see which games you've spent time playing."}
              </p>
              <Button className="btn-primary">
                {t?.gameHistory?.signInToEnable || "Sign In to Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className={`${className}`}>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">{t?.gameHistory?.loadingGameHistory || "Loading game history..."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className={`${className}`}>
        <Card className="bg-gray-800/50 border-gray-700 border-red-500/50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t?.common?.retry || "Retry"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 空历史记录
  if (history.length === 0) {
    return (
      <div className={`${className}`}>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t?.gameHistory?.noGameHistory || "No Game History"}</h3>
              <p className="text-gray-400 mb-4">
                {t?.gameHistory?.startPlayingGames || "Start playing games to see your browsing history here. Games you spend 30+ seconds on will be automatically tracked."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 格式化时间
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  // 获取分类
  const categories = getHistoryByCategory()
  const categoryList = ['all', ...Object.keys(categories)]

  // 过滤和排序历史记录
  let filteredHistory = selectedCategory === 'all' 
    ? history 
    : categories[selectedCategory] || []

  // 应用数量限制
  if (maxItems && maxItems > 0) {
    filteredHistory = filteredHistory.slice(0, maxItems)
  }

  // 排序
  filteredHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.visitedAt - a.visitedAt
      case 'duration':
        return b.visitDuration - a.visitDuration
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 统计信息 */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div className="ml-2">
                  <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
                  <p className="text-xs text-gray-400">{t?.gameHistory?.totalGames || "Total Games"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-400" />
                <div className="ml-2">
                  <p className="text-2xl font-bold text-white">{formatTime(stats.totalPlayTime)}</p>
                  <p className="text-xs text-gray-400">{t?.gameHistory?.totalTime || "Total Time"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-400" />
                <div className="ml-2">
                  <p className="text-2xl font-bold text-white">{stats.recentGames}</p>
                  <p className="text-xs text-gray-400">{t?.gameHistory?.today || "Today"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-400" />
                <div className="ml-2">
                  <p className="text-2xl font-bold text-white">{formatTime(stats.averagePlayTime)}</p>
                  <p className="text-xs text-gray-400">{t?.gameHistory?.average || "Average"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 控制面板 */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">{t?.gameHistory?.gameHistoryCount?.replace('{count}', filteredHistory.length.toString()) || `Game History (${filteredHistory.length})`}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {/* 分类筛选 */}
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white text-sm rounded px-3 py-1"
              >
                {categoryList.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? (t?.gameHistory?.allCategories || 'All Categories') : cat}
                  </option>
                ))}
              </select>
              
              {/* 排序 */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-700 border-gray-600 text-white text-sm rounded px-3 py-1"
              >
                <option value="recent">{t?.gameHistory?.recentFirst || "Recent First"}</option>
                <option value="duration">{t?.gameHistory?.longestFirst || "Longest First"}</option>
                <option value="name">{t?.gameHistory?.nameAZ || "Name A-Z"}</option>
              </select>
              
              {/* 清除历史 */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t?.gameHistory?.clearAll || "Clear All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* 游戏历史列表 */}
          <div className="space-y-3">
            {filteredHistory.map((game) => (
              <div 
                key={`${game.slug}-${game.visitedAt}`}
                className="flex items-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors group"
              >
                {/* 游戏图片 */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-600 rounded-lg overflow-hidden">
                  <img 
                    src={game.image || '/placeholder-game.jpg'} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-game.jpg'
                    }}
                  />
                </div>
                
                {/* 游戏信息 */}
                <div className="flex-grow ml-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold truncate">{game.name}</h3>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="text-xs">
                        {formatTime(game.visitDuration)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {game.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-400 text-sm truncate">{game.description}</p>
                    <p className="text-gray-500 text-xs ml-4">{formatDate(game.visitedAt)}</p>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/game/${game.slug}`}>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeGame(game.slug)}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GameHistory