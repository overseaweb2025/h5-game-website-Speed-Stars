"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { getGameList } from '@/app/api/gameList'
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
  {
    category_id: 1,
    category_name: "Action",
    games: [
      { id: 1, name: "speed-stars", display_name: "Speed Stars" },
      { id: 2, name: "speed-stars-2", display_name: "Speed Stars 2" },
      { id: 3, name: "crazy-cattle-3d", display_name: "Crazy Cattle 3D" },
      { id: 4, name: "speed-stars-3", display_name: "Speed Stars 3" },
      { id: 5, name: "action-hero", display_name: "Action Hero" }
    ]
  },
  {
    category_id: 2,
    category_name: "Racing",
    games: [
      { id: 6, name: "highway-race", display_name: "Highway Race" },
      { id: 7, name: "drift-master", display_name: "Drift Master" },
      { id: 8, name: "street-racer", display_name: "Street Racer" },
      { id: 9, name: "turbo-speed", display_name: "Turbo Speed" }
    ]
  },
  {
    category_id: 3,
    category_name: "Puzzle",
    games: [
      { id: 10, name: "block-puzzle", display_name: "Block Puzzle" },
      { id: 11, name: "word-challenge", display_name: "Word Challenge" },
      { id: 12, name: "mind-maze", display_name: "Mind Maze" },
      { id: 13, name: "logic-master", display_name: "Logic Master" }
    ]
  },
  {
    category_id: 4,
    category_name: "Adventure",
    games: [
      { id: 14, name: "treasure-hunt", display_name: "Treasure Hunt" },
      { id: 15, name: "jungle-quest", display_name: "Jungle Quest" },
      { id: 16, name: "mystery-island", display_name: "Mystery Island" }
    ]
  },
  {
    category_id: 5,
    category_name: "Sports",
    games: [
      { id: 17, name: "soccer-pro", display_name: "Soccer Pro" },
      { id: 18, name: "basketball-star", display_name: "Basketball Star" },
      { id: 19, name: "tennis-ace", display_name: "Tennis Ace" }
    ]
  }
]

// 获取游戏数据的函数
const fetchGameData = async (): Promise<void> => {
  // 如果正在加载，避免重复请求
  if (globalGameData.loading) {
    console.log('Game data fetch already in progress, skipping...')
    return
  }

  try {
    updateGlobalState({ loading: true, error: null })
    
    console.log('Starting to fetch game data...')
    const response = await getGameList()

    console.log('Fetched game data:', response)
    const gameCategories = response.data.data
    
    updateGlobalState({
      data: gameCategories,
      loading: false,
      error: null,
      lastFetchTime: Date.now()
    })
    
    console.log('Game data fetched successfully:', gameCategories)
  } catch (err: any) {
    console.error('Error fetching game data:', err)
    
    // 更详细的错误处理
    let errorMessage = 'Failed to load games'
    let useFallback = false
    
    if (err?.response?.status === 500) {
      errorMessage = 'Server error'
      console.log('Server error detected, checking for cached or fallback data')
      
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
      console.log('Using fallback game data')
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

// 初始化数据 - 在模块加载时立即执行
const initializeGameData = async () => {
  if (!isInitialized && !globalGameData.loading) {
    isInitialized = true
    console.log('Initializing game data on module load...')
    await fetchGameData()
  }
}

// 延迟初始化数据，避免路由切换时立即执行
if (typeof window !== 'undefined') {
  // 使用setTimeout延迟执行，避免在路由切换时立即触发
  setTimeout(() => {
    if (!isInitialized) {
      initializeGameData()
    }
  }, 100)
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
    
    // 确保数据已经开始获取（如果还没有的话）
    if (!isInitialized && shouldFetchData()) {
      console.log('Fallback: Starting data fetch from useEffect...')
      initializeGameData()
    }

    // 设置定期检查数据是否过期（延长检查间隔）
    intervalRef.current = setInterval(() => {
      if (isDataExpired() && globalGameData.data.length > 0 && !globalGameData.loading) {
        console.log('Game data expired, refetching...')
        fetchGameData()
      }
    }, 60000) // 每60秒检查一次，减少频率

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