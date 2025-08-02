"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'

// 游戏历史记录类型
export interface GamePlayRecord {
  id: string
  gameId: string
  gameName: string
  gameDisplayName: string
  playStartTime: string
  playDuration: number // 秒
  createdAt: string
  userId?: string
}

// 游戏追踪状态
interface GameTrackingState {
  isTracking: boolean
  startTime: number | null
  elapsedTime: number
  gameInfo: {
    id: string
    name: string
    displayName: string
  } | null
}

const PLAY_THRESHOLD = 10 // 10秒阈值
const STORAGE_KEY = 'game_play_history'

export const useGamePlayTracker = () => {
  const { data: session } = useSession()
  const [trackingState, setTrackingState] = useState<GameTrackingState>({
    isTracking: false,
    startTime: null,
    elapsedTime: 0,
    gameInfo: null
  })
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const gameContainerRef = useRef<HTMLDivElement | null>(null)

  // 获取用户ID
  const getUserId = useCallback(() => {
    return session?.user?.id || session?.user?.email || 'anonymous'
  }, [session])

  // 从localStorage获取历史记录
  const getPlayHistory = useCallback((): GamePlayRecord[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  }, [])

  // 保存游戏记录到localStorage
  const saveGameRecord = useCallback((record: GamePlayRecord) => {
    try {
      const history = getPlayHistory()
      const newHistory = [record, ...history].slice(0, 100) // 只保留最近100条记录
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (error) {
    }
  }, [getPlayHistory])

  // 开始追踪游戏
  const startTracking = useCallback((gameInfo: { id: string, name: string, displayName: string }) => {
    // 清除之前的计时器
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const startTime = Date.now()
    setTrackingState({
      isTracking: true,
      startTime,
      elapsedTime: 0,
      gameInfo
    })

    // 开始计时器
    timerRef.current = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      
      setTrackingState(prev => ({
        ...prev,
        elapsedTime: elapsed
      }))

      // 达到阈值时保存记录
      if (elapsed >= PLAY_THRESHOLD) {
        const record: GamePlayRecord = {
          id: `${gameInfo.id}_${startTime}`,
          gameId: gameInfo.id,
          gameName: gameInfo.name,
          gameDisplayName: gameInfo.displayName,
          playStartTime: new Date(startTime).toISOString(),
          playDuration: elapsed,
          createdAt: new Date().toISOString(),
          userId: getUserId()
        }

        saveGameRecord(record)
        stopTracking()
      }
    }, 1000)
  }, [getUserId, saveGameRecord])

  // 停止追踪 - 保持游戏信息，只停止计时
  const stopTracking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setTrackingState(prev => ({
      ...prev,
      isTracking: false,
      startTime: null,
      elapsedTime: 0
      // 保持 gameInfo，这样可以重新开始计时
    }))
  }, [])

  // 重置计时器（完全清除游戏信息）
  const resetTracking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setTrackingState({
      isTracking: false,
      startTime: null,
      elapsedTime: 0,
      gameInfo: null
    })
  }, [])

  // 设置iframe引用
  const setIframeRef = useCallback((iframe: HTMLIFrameElement | null) => {
    iframeRef.current = iframe
  }, [])

  // 设置游戏容器引用
  const setGameContainerRef = useCallback((container: HTMLDivElement | null) => {
    gameContainerRef.current = container
  }, [])

  // 检查点击是否在游戏区域内
  const isClickInGameArea = useCallback((event: MouseEvent | TouchEvent) => {
    if (!gameContainerRef.current) return false

    const rect = gameContainerRef.current.getBoundingClientRect()
    const clientX = 'touches' in event ? event.touches[0]?.clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0]?.clientY : event.clientY

    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    )
  }, [])

  // 处理页面点击事件 - 检测游戏区域外的点击来停止计时
  const handlePageClick = useCallback((event: MouseEvent) => {
    if (!gameContainerRef.current) return
    
    const rect = gameContainerRef.current.getBoundingClientRect()
    const isInGameArea = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    )
    
    if (!isInGameArea) {
      setTrackingState(prev => {
        if (prev.isTracking) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          return {
            ...prev,
            isTracking: false,
            startTime: null,
            elapsedTime: 0
          }
        }
        return prev
      })
    }
  }, [])

  // 处理页面触摸事件 - 检测游戏区域外的触摸来停止计时
  const handlePageTouch = useCallback((event: TouchEvent) => {
    if (!gameContainerRef.current || !event.touches[0]) return
    
    const rect = gameContainerRef.current.getBoundingClientRect()
    const touch = event.touches[0]
    const isInGameArea = (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    )
    
    if (!isInGameArea) {
      setTrackingState(prev => {
        if (prev.isTracking) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          return {
            ...prev,
            isTracking: false,
            startTime: null,
            elapsedTime: 0
          }
        }
        return prev
      })
    }
  }, [])

  // 处理滚轮事件 - 游戏区域外滚动停止计时
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!gameContainerRef.current) return
    
    const rect = gameContainerRef.current.getBoundingClientRect()
    const isInGameArea = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    )
    
    if (!isInGameArea) {
      setTrackingState(prev => {
        if (prev.isTracking) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          return {
            ...prev,
            isTracking: false,
            startTime: null,
            elapsedTime: 0
          }
        }
        return prev
      })
    }
  }, [])

  // 处理游戏容器点击 - 直接开始计时，仅在登录时有效
  const handleGameAreaClick = useCallback((event?: React.MouseEvent | React.TouchEvent) => {
    // 只有在登录状态下才能开始追踪
    if (session?.user && trackingState.gameInfo && !trackingState.isTracking) {
      startTracking(trackingState.gameInfo)
    }
  }, [session, trackingState.gameInfo, trackingState.isTracking, startTracking])

  // 初始化游戏信息但不开始追踪
  const initializeGame = useCallback((gameInfo: { id: string, name: string, displayName: string }) => {
    // 只有在登录状态下才初始化游戏追踪
    if (session?.user) {
      setTrackingState(prev => ({
        ...prev,
        gameInfo
      }))
    }
  }, [session])

  // 移除复杂的iframe点击检测逻辑，采用简化方案

  // 设置事件监听器
  useEffect(() => {
    document.addEventListener('click', handlePageClick)
    document.addEventListener('touchstart', handlePageTouch)
    document.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      document.removeEventListener('click', handlePageClick)
      document.removeEventListener('touchstart', handlePageTouch)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // 页面卸载时停止追踪
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTracking()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      stopTracking()
    }
  }, [stopTracking])

  return {
    // 状态
    isTracking: trackingState.isTracking,
    elapsedTime: trackingState.elapsedTime,
    gameInfo: trackingState.gameInfo,
    threshold: PLAY_THRESHOLD,
    
    // 操作函数
    initializeGame,
    startTracking,
    stopTracking,
    resetTracking,
    handleGameAreaClick,
    
    // Ref设置函数
    setIframeRef,
    setGameContainerRef,
    
    // 历史记录
    getPlayHistory,
    
    // 调试信息
    trackingState: process.env.NODE_ENV === 'development' ? trackingState : undefined,
    debugInfo: process.env.NODE_ENV === 'development' ? {
      hasContainer: !!gameContainerRef.current,
      containerRect: gameContainerRef.current?.getBoundingClientRect(),
      hasIframe: !!iframeRef.current
    } : undefined
  }
}