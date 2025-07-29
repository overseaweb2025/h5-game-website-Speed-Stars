"use client"

import { useState, useEffect, useCallback } from 'react'

interface UseResponsiveOptions {
  breakpoint?: number
  initialCollapsed?: boolean
  onScreenSizeChange?: (isSmall: boolean, wasSmall: boolean) => void
}

export const useResponsive = ({ 
  breakpoint = 1024, 
  initialCollapsed = false,
  onScreenSizeChange 
}: UseResponsiveOptions = {}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  // 初始化屏幕尺寸检测
  useEffect(() => {
    const initializeScreenSize = () => {
      const isSmall = window.innerWidth < breakpoint
      setIsSmallScreen(isSmall)
      if (isSmall && initialCollapsed) {
        setIsCollapsed(true)
      }
    }
    
    initializeScreenSize()
  }, [breakpoint, initialCollapsed])

  // 响应式检测
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < breakpoint
      
      setIsSmallScreen(prev => {
        if (isSmall !== prev) {
          // 调用回调函数，让调用者处理屏幕尺寸变化
          onScreenSizeChange?.(isSmall, prev)
        }
        return isSmall
      })
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [breakpoint, onScreenSizeChange])

  // 切换收缩状态
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  return {
    isSmallScreen,
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed
  }
}

export default useResponsive