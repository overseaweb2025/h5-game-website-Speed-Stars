"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameHistory, type GameHistoryItem } from './useGameHistory'

interface GamePageTimerOptions {
  threshold?: number // 触发历史记录的时间阈值（秒），默认30秒
  gameInfo: Omit<GameHistoryItem, 'visitedAt' | 'visitDuration'>
  enabled?: boolean // 是否启用计时器，默认true
}

export const useGamePageTimer = ({ 
  threshold = 30, 
  gameInfo, 
  enabled = true 
}: GamePageTimerOptions) => {
  // 使用 ref 保存最新的 gameInfo，避免在 callback 中引用过期的值
  const gameInfoRef = useRef(gameInfo)
  gameInfoRef.current = gameInfo
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [isActive, setIsActive] = useState(true)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { addToHistory, isEnabled: historyEnabled } = useGameHistory()

  // 计算当前停留时间
  const calculateElapsedTime = useCallback(() => {
    return Math.floor((Date.now() - startTime) / 1000)
  }, [startTime])

  // 更新elapsed time的函数
  const updateElapsedTime = useCallback(() => {
    if (isActive) {
      const newElapsed = calculateElapsedTime()
      setElapsedTime(newElapsed)
    }
  }, [calculateElapsedTime, isActive])

  // 触发历史记录添加
  const triggerHistoryAdd = useCallback(() => {
    if (!hasTriggered && historyEnabled && enabled) {
      const duration = calculateElapsedTime()
      const currentGameInfo = gameInfoRef.current
      console.log(`Game page timer: Adding ${currentGameInfo.name} to history after ${duration} seconds`)
      
      addToHistory(currentGameInfo, duration)
      setHasTriggered(true)
    }
  }, [hasTriggered, historyEnabled, enabled, calculateElapsedTime, addToHistory])

  // 处理页面可见性变化
  const handleVisibilityChange = useCallback(() => {
    if (typeof document !== 'undefined') {
      if (document.hidden) {
        // 页面隐藏时停止计时
        setIsActive(false)
        console.log('Game page timer: Page hidden, pausing timer')
      } else {
        // 页面重新显示时继续计时
        setIsActive(true)
        console.log('Game page timer: Page visible, resuming timer')
      }
    }
  }, [])

  // 处理页面卸载前的清理
  const handleBeforeUnload = useCallback(() => {
    if (enabled && historyEnabled && !hasTriggered) {
      const duration = calculateElapsedTime()
      // 如果停留时间超过10秒但不足30秒，也添加到历史记录
      if (duration >= 10) {
        const currentGameInfo = gameInfoRef.current
        console.log(`Game page timer: Adding ${currentGameInfo.name} to history on page unload after ${duration} seconds`)
        addToHistory(currentGameInfo, duration)
      }
    }
  }, [enabled, historyEnabled, hasTriggered, calculateElapsedTime, addToHistory])

  useEffect(() => {
    if (!enabled || !historyEnabled) {
      console.log('Game page timer: Disabled (enabled:', enabled, ', historyEnabled:', historyEnabled, ')')
      return
    }

    console.log(`Game page timer: Started for ${gameInfo.name}, threshold: ${threshold}s`)

    // 设置主计时器：在指定时间后触发历史记录添加
    timerRef.current = setTimeout(() => {
      if (isActive) {
        triggerHistoryAdd()
      }
    }, threshold * 1000)

    // 设置更新计时器：每秒更新elapsed time
    intervalRef.current = setInterval(updateElapsedTime, 1000)

    // 监听页面可见性变化
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    // 监听页面卸载
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      // 清理计时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // 移除事件监听器
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }

      // 组件卸载时的最终检查
      handleBeforeUnload()
    }
  }, [enabled, historyEnabled, threshold])

  // 当页面重新激活时，重新设置计时器
  useEffect(() => {
    if (isActive && enabled && historyEnabled && !hasTriggered) {
      const currentElapsed = calculateElapsedTime()
      const remainingTime = threshold - currentElapsed
      
      if (remainingTime > 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        
        timerRef.current = setTimeout(() => {
          if (isActive) {
            triggerHistoryAdd()
          }
        }, remainingTime * 1000)
        
        console.log(`Game page timer: Resumed, ${remainingTime}s remaining`)
      } else {
        // 如果已经超过阈值，立即触发
        triggerHistoryAdd()
      }
    }
  }, [isActive, enabled, historyEnabled, hasTriggered, threshold])

  // 手动触发历史记录添加的函数
  const manualTrigger = useCallback(() => {
    if (enabled && historyEnabled && !hasTriggered) {
      triggerHistoryAdd()
    }
  }, [enabled, historyEnabled, hasTriggered, triggerHistoryAdd])

  // 重置计时器的函数
  const reset = useCallback(() => {
    setHasTriggered(false)
    setElapsedTime(0)
    setIsActive(true)
    
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    if (enabled && historyEnabled) {
      timerRef.current = setTimeout(() => {
        if (isActive) {
          triggerHistoryAdd()
        }
      }, threshold * 1000)
    }
  }, [enabled, historyEnabled, threshold, triggerHistoryAdd, isActive])

  return {
    // 状态
    elapsedTime,
    hasTriggered,
    isActive,
    enabled: enabled && historyEnabled,
    
    // 计算属性
    progress: Math.min((elapsedTime / threshold) * 100, 100), // 进度百分比
    remainingTime: Math.max(threshold - elapsedTime, 0), // 剩余时间
    
    // 方法
    manualTrigger,
    reset,
    
    // 信息
    threshold,
    gameInfo
  }
}

export default useGamePageTimer