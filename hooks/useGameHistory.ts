"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'

export interface GameHistoryItem {
  id: string
  name: string
  slug: string
  image: string
  category?: string
  description?: string
  visitedAt: number
  visitDuration: number // 访问时长（秒）
}

interface GameHistoryState {
  history: GameHistoryItem[]
  loading: boolean
  error: string | null
}

const STORAGE_KEY = 'game_browsing_history'
const MAX_HISTORY_ITEMS = 50 // 最多保存50个历史记录

// 全局状态
let globalHistoryState: GameHistoryState = {
  history: [],
  loading: false,
  error: null
}

// 监听器存储
const historyListeners = new Set<() => void>()

// 通知所有监听器状态更新
const notifyHistoryListeners = () => {
  historyListeners.forEach(listener => listener())
}

// 更新全局历史状态
const updateHistoryState = (newState: Partial<GameHistoryState>) => {
  globalHistoryState = { ...globalHistoryState, ...newState }
  notifyHistoryListeners()
}

// 从localStorage加载历史记录
const loadHistoryFromStorage = (): GameHistoryItem[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 验证数据格式
      if (Array.isArray(parsed)) {
        return parsed.filter(item => 
          item.id && item.name && item.slug && typeof item.visitedAt === 'number'
        )
      }
    }
  } catch (error) {
  }
  
  return []
}

// 保存历史记录到localStorage
const saveHistoryToStorage = (history: GameHistoryItem[]) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
  }
}

// 初始化历史记录
const initializeHistory = () => {
  if (globalHistoryState.history.length === 0) {
    const storedHistory = loadHistoryFromStorage()
    updateHistoryState({ history: storedHistory })
  }
}

// 添加游戏到历史记录
const addGameToHistory = (gameInfo: Omit<GameHistoryItem, 'visitedAt' | 'visitDuration'>, visitDuration: number = 0) => {
  const newHistoryItem: GameHistoryItem = {
    ...gameInfo,
    visitedAt: Date.now(),
    visitDuration
  }
  
  // 移除重复的游戏（基于slug）
  const filteredHistory = globalHistoryState.history.filter(item => item.slug !== gameInfo.slug)
  
  // 添加到开头
  const newHistory = [newHistoryItem, ...filteredHistory]
  
  // 限制历史记录数量
  const limitedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS)
  
  updateHistoryState({ history: limitedHistory })
  saveHistoryToStorage(limitedHistory)
  
}

// 清除历史记录
const clearHistory = () => {
  updateHistoryState({ history: [] })
  saveHistoryToStorage([])
}

// 删除指定游戏历史记录
const removeGameFromHistory = (slug: string) => {
  const newHistory = globalHistoryState.history.filter(item => item.slug !== slug)
  updateHistoryState({ history: newHistory })
  saveHistoryToStorage(newHistory)
}

// 获取游戏历史记录统计
const getHistoryStats = () => {
  const history = globalHistoryState.history
  const totalGames = history.length
  const totalPlayTime = history.reduce((total, item) => total + item.visitDuration, 0)
  const recentGames = history.filter(item => Date.now() - item.visitedAt < 24 * 60 * 60 * 1000) // 24小时内
  
  return {
    totalGames,
    totalPlayTime,
    recentGames: recentGames.length,
    averagePlayTime: totalGames > 0 ? Math.round(totalPlayTime / totalGames) : 0
  }
}

// 游戏历史记录Hook
export const useGameHistory = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const { isAuthenticated } = useAuth()
  
  // 强制重新渲染的函数
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    // 只有在用户登录时才初始化历史记录
    if (isAuthenticated) {
      initializeHistory()
    }
    
    // 添加监听器
    historyListeners.add(triggerUpdate)
    
    return () => {
      historyListeners.delete(triggerUpdate)
    }
  }, [isAuthenticated, triggerUpdate])

  // 添加游戏到历史记录的函数
  const addToHistory = useCallback((gameInfo: Omit<GameHistoryItem, 'visitedAt' | 'visitDuration'>, visitDuration: number = 0) => {
    // 只有登录用户才记录历史
    if (isAuthenticated) {
      addGameToHistory(gameInfo, visitDuration)
    }
  }, [isAuthenticated])

  // 清除历史记录的函数
  const clearGameHistory = useCallback(() => {
    if (isAuthenticated) {
      clearHistory()
    }
  }, [isAuthenticated])

  // 删除指定游戏的函数
  const removeGame = useCallback((slug: string) => {
    if (isAuthenticated) {
      removeGameFromHistory(slug)
    }
  }, [isAuthenticated])

  // 获取最近访问的游戏
  const getRecentGames = useCallback((limit: number = 10) => {
    return globalHistoryState.history.slice(0, limit)
  }, [])

  // 按分类获取历史记录
  const getHistoryByCategory = useCallback(() => {
    const categorized: { [key: string]: GameHistoryItem[] } = {}
    
    globalHistoryState.history.forEach(item => {
      const category = item.category || 'Uncategorized'
      if (!categorized[category]) {
        categorized[category] = []
      }
      categorized[category].push(item)
    })
    
    return categorized
  }, [])

  return {
    // 状态
    history: isAuthenticated ? globalHistoryState.history : [],
    loading: globalHistoryState.loading,
    error: globalHistoryState.error,
    isEnabled: isAuthenticated, // 是否启用历史记录功能
    
    // 统计信息
    stats: isAuthenticated ? getHistoryStats() : { totalGames: 0, totalPlayTime: 0, recentGames: 0, averagePlayTime: 0 },
    
    // 操作函数
    addToHistory,
    clearHistory: clearGameHistory,
    removeGame,
    
    // 查询函数
    getRecentGames,
    getHistoryByCategory,
    
    // 检查函数
    hasVisited: useCallback((slug: string) => {
      return isAuthenticated && globalHistoryState.history.some(item => item.slug === slug)
    }, [isAuthenticated]),
    
    getVisitInfo: useCallback((slug: string) => {
      if (!isAuthenticated) return null
      return globalHistoryState.history.find(item => item.slug === slug) || null
    }, [isAuthenticated])
  }
}

export default useGameHistory