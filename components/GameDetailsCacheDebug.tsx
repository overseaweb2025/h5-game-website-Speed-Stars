"use client"

import React, { useState } from 'react'
import { useGameDetails } from '@/hooks/useGameDetails'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Database, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

interface GameDetailsCacheDebugProps {
  className?: string
  showInProduction?: boolean
}

export const GameDetailsCacheDebug: React.FC<GameDetailsCacheDebugProps> = ({ 
  className = '',
  showInProduction = false 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const {
    cacheStats,
    globalCache,
    globalLoading,
    globalErrors,
    clearAllCache
  } = useGameDetails()

  // 在生产环境中隐藏（除非明确允许）
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  const getTimeUntilExpiry = (expiresAt: number) => {
    const now = Date.now()
    const remaining = expiresAt - now
    if (remaining <= 0) return 'Expired'
    return formatDuration(remaining)
  }

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Database className="h-4 w-4 mr-1" />
          Cache Debug
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md ${className}`}>
      <Card className="bg-gray-800 border-gray-600 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Game Details Cache</CardTitle>
            <div className="flex gap-1">
              <Button
                onClick={clearAllCache}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs border-gray-600"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* 统计信息 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-700 rounded p-2">
              <div className="text-green-400 font-semibold">{cacheStats.validCount}</div>
              <div className="text-gray-400">Valid</div>
            </div>
            <div className="bg-gray-700 rounded p-2">
              <div className="text-yellow-400 font-semibold">{cacheStats.expiredCount}</div>
              <div className="text-gray-400">Expired</div>
            </div>
            <div className="bg-gray-700 rounded p-2">
              <div className="text-blue-400 font-semibold">{cacheStats.loadingCount}</div>
              <div className="text-gray-400">Loading</div>
            </div>
            <div className="bg-gray-700 rounded p-2">
              <div className="text-red-400 font-semibold">{cacheStats.errorCount}</div>
              <div className="text-gray-400">Errors</div>
            </div>
          </div>

          {/* 缓存项列表 */}
          {globalCache.size > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-300 flex items-center">
                <Database className="h-3 w-3 mr-1" />
                Cached Items ({globalCache.size})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {Array.from(globalCache.entries()).map(([slug, item]) => (
                  <div key={slug} className="bg-gray-700 rounded p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white truncate">{slug}</span>
                      <Badge
                        variant={item.expiresAt > Date.now() ? "default" : "destructive"}
                        className="text-xs px-1 py-0"
                      >
                        {item.expiresAt > Date.now() ? "Valid" : "Expired"}
                      </Badge>
                    </div>
                    <div className="text-gray-400 space-y-0.5">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Cached: {formatTime(item.cachedAt)}
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Expires: {getTimeUntilExpiry(item.expiresAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 正在加载的项 */}
          {globalLoading.size > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-blue-400">Loading ({globalLoading.size})</h4>
              {Array.from(globalLoading).map(slug => (
                <div key={slug} className="bg-blue-900/30 rounded p-1 text-xs text-blue-300">
                  {slug}
                </div>
              ))}
            </div>
          )}

          {/* 错误项 */}
          {globalErrors.size > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Errors ({globalErrors.size})
              </h4>
              {Array.from(globalErrors.entries()).map(([slug, error]) => (
                <div key={slug} className="bg-red-900/30 rounded p-2 text-xs">
                  <div className="text-red-300 font-medium">{slug}</div>
                  <div className="text-red-400 truncate">{error}</div>
                </div>
              ))}
            </div>
          )}

          {/* 空状态 */}
          {globalCache.size === 0 && globalLoading.size === 0 && globalErrors.size === 0 && (
            <div className="text-center text-gray-400 text-xs py-4">
              No cached items
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GameDetailsCacheDebug