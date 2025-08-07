"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { getGameList } from '@/app/api/game'
import { GameList, CategoryGameList } from '@/app/api/types/Get/game'

interface GameDataState {
  data: CategoryGameList[]
  loading: boolean
  error: string | null
  lastFetchTime: number | null
}

const CACHE_DURATION = 3 * 60 * 1000 // 3分钟缓存时间

// 全局状态存储
let globalGameData: GameDataState = {
  data: [],
  loading: false,
  error: null,
  lastFetchTime: null
}

// 监听器存储
const listeners = new Set<() => void>()

// 初始化标志
let isInitialized = false
let initPromise: Promise<void> | null = null

// 通知所有监听器状态更新
const notifyListeners = () => {
  listeners.forEach(listener => listener())
}

// 更新全局状态
const updateGlobalState = (newState: Partial<GameDataState>) => {
  globalGameData = { ...globalGameData, ...newState }
  notifyListeners()
}

// 检查数据是否过期
const isDataExpired = (): boolean => {
  if (!globalGameData.lastFetchTime) return true
  return Date.now() - globalGameData.lastFetchTime > CACHE_DURATION
}

// 检查是否需要获取数据
const shouldFetchData = (): boolean => {
  // 如果数据为空，需要获取
  if (globalGameData.data.length === 0) return true
  // 如果数据过期，需要获取
  if (isDataExpired()) return true
  // 如果正在加载，不需要重复获取
  if (globalGameData.loading) return false
  return false
}

// Fallback本地游戏数据
const fallbackGameData: CategoryGameList[] = [

]

// 获取游戏数据的函数
const fetchGameData = async (): Promise<void> => {
  // 如果正在加载，避免重复请求
  if (globalGameData.loading) {
    return
  }

  // 如果已经有数据且未过期，跳过请求
  if (globalGameData.data.length > 0 && !isDataExpired()) {
    return
  }

  try {
    updateGlobalState({ loading: true, error: null })
    
    const response = await getGameList()
    const gameCategories = response.data.data
    
    updateGlobalState({
      data: gameCategories,
      loading: false,
      error: null,
      lastFetchTime: Date.now()
    })
    
  } catch (err: any) {
    
    // 更详细的错误处理
    let errorMessage = 'Failed to load games'
    let useFallback = false
    
    if (err?.response?.status === 500) {
      errorMessage = 'Server error'
      
      // 如果服务器错误但有缓存数据，保持现有数据不变
      if (globalGameData.data.length > 0) {
        updateGlobalState({
          loading: false,
          error: null // 不显示错误，保持使用缓存数据
        })
        return
      } else {
        // 没有缓存数据，使用fallback数据
        useFallback = true
        errorMessage = 'Using offline game data'
      }
    } else if (err?.response?.status === 404) {
      errorMessage = 'Game data not found'
      useFallback = true
    } else if (err?.code === 'NETWORK_ERROR' || !err?.response) {
      errorMessage = 'Network connection failed'
      // 检查是否有缓存数据
      if (globalGameData.data.length > 0) {
        updateGlobalState({
          loading: false,
          error: null
        })
        return
      } else {
        useFallback = true
        errorMessage = 'Using offline game data'
      }
    }
    
    if (useFallback) {
      updateGlobalState({
        data: fallbackGameData,
        loading: false,
        error: null, // 不显示错误，显示fallback数据
        lastFetchTime: Date.now()
      })
    } else {
      updateGlobalState({
        loading: false,
        error: errorMessage
      })
    }
  }
}

// 强制刷新数据
const refreshGameData = async (): Promise<void> => {
  updateGlobalState({ lastFetchTime: null }) // 重置时间戳
  await fetchGameData()
}

// 初始化数据 - 确保只初始化一次
const initializeGameData = async (): Promise<void> => {
  // 如果已经初始化或正在初始化，返回现有的Promise
  if (isInitialized) {
    return
  }
  
  if (initPromise) {
    return initPromise
  }

  // 标记已初始化，防止重复调用
  isInitialized = true
  
  initPromise = (async () => {
    try {
      await fetchGameData()
    } catch (error) {
      // 重置标志，允许重试
      isInitialized = false
      throw error
    } finally {
      initPromise = null
    }
  })()
  
  return initPromise
}

// 延迟初始化数据，确保只在客户端执行一次
if (typeof window !== 'undefined') {
  // 使用requestIdleCallback或setTimeout来延迟初始化，避免阻塞页面渲染
  const scheduleInit = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        if (!isInitialized) {
          initializeGameData().catch(() => {})
        }
      })
    } else {
      setTimeout(() => {
        if (!isInitialized) {
          initializeGameData().catch(() => {})
        }
      }, 100)
    }
  }
  
  // 如果页面已经加载完成，立即执行
  if (document.readyState === 'complete') {
    scheduleInit()
  } else {
    // 否则等待页面加载完成
  }
}

// 自定义Hook
export const useGameData = () => {
  const [, forceUpdate] = useState({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // 强制重新渲染的函数
  const triggerUpdate = useCallback(() => {
    forceUpdate({})
  }, [])

  useEffect(() => {
    // 添加监听器
    listeners.add(triggerUpdate)
    
    // 确保数据已经开始获取（作为fallback机制）
    if (!isInitialized && shouldFetchData()) {
      initializeGameData().catch(() => {})
    }

    // 设置定期检查数据是否过期（仅在需要时）
    intervalRef.current = setInterval(() => {
      // 只有在有数据且过期时才重新获取
      if (isDataExpired() && globalGameData.data.length > 0 && !globalGameData.loading) {
        fetchGameData().catch(() => {})
      }
    }, 5 * 60 * 1000) // 每5分钟检查一次，减少频率

    // 清理函数
    return () => {
      listeners.delete(triggerUpdate)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [triggerUpdate])

  // 手动刷新函数
  const refresh = useCallback(() => {
    refreshGameData()
  }, [])

  // 获取有游戏的分类
  const getCategoriesWithGames = useCallback(() => {
    return globalGameData.data.filter(category => 
      category.games && category.games.length > 0
    )
  }, [globalGameData.data])

  // 获取所有分类（包括空的）
  const getAllCategories = useCallback(() => {
    return globalGameData.data
  }, [globalGameData.data])

  // 获取所有游戏
  const getAllGames = useCallback(() => {
    return globalGameData.data.flatMap(category => category.games || [])
  }, [globalGameData.data])

  return {
    // 状态
    data: globalGameData.data,
    loading: globalGameData.loading,
    error: globalGameData.error,
    lastFetchTime: globalGameData.lastFetchTime,
    
    // 派生数据
    categoriesWithGames: getCategoriesWithGames(),
    allCategories: getAllCategories(),
    allGames: getAllGames(),
    
    // 状态检查
    isDataExpired: isDataExpired(),
    isEmpty: globalGameData.data.length === 0,
    
    // 操作函数
    refresh,
    fetchData: fetchGameData
  }
}

export default useGameData