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

// 获取游戏数据的函数
const fetchGameData = async (): Promise<void> => {
  // 如果正在加载，避免重复请求
  if (globalGameData.loading) return

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
  } catch (err) {
    console.error('Error fetching game data:', err)
    updateGlobalState({
      loading: false,
      error: 'Failed to load games'
    })
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

// 立即开始初始化数据
if (typeof window !== 'undefined') {
  // 确保在客户端环境中执行
  initializeGameData()
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

    // 设置定期检查数据是否过期
    intervalRef.current = setInterval(() => {
      if (isDataExpired() && globalGameData.data.length > 0) {
        console.log('Game data expired, refetching...')
        fetchGameData()
      }
    }, 30000) // 每30秒检查一次

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