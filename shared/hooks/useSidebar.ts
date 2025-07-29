"use client"

import { useState, useCallback } from 'react'
import { useResponsive } from './useResponsive'

interface UseSidebarOptions {
  initialVisible?: boolean
  breakpoint?: number
}

export const useSidebar = ({ 
  initialVisible = true, 
  breakpoint = 1024 
}: UseSidebarOptions = {}) => {
  const [sidebarVisible, setSidebarVisible] = useState(initialVisible)
  const [isHovered, setIsHovered] = useState(false)
  const [sidebarToggleFunction, setSidebarToggleFunction] = useState<(() => void) | null>(null)

  const { isSmallScreen, isCollapsed, setIsCollapsed, toggleCollapsed } = useResponsive({
    breakpoint,
    initialCollapsed: false,
    onScreenSizeChange: (isSmall, wasSmall) => {
      if (isSmall && !wasSmall) {
        // 从大屏切换到小屏时
        setIsCollapsed(true)
        setSidebarVisible(true)
      } else if (!isSmall && wasSmall) {
        // 从小屏切换到大屏时
        setSidebarVisible(true)
      }
    }
  })

  // 注册切换侧边栏的函数
  const handleSidebarToggle = useCallback((toggleFunction: () => void) => {
    setSidebarToggleFunction(() => toggleFunction)
  }, [])

  // 执行侧边栏切换
  const handleToggleButtonClick = useCallback(() => {
    if (sidebarToggleFunction) {
      sidebarToggleFunction()
    }
  }, [sidebarToggleFunction])

  // 切换侧边栏可见性
  const toggleSidebar = useCallback(() => {
    if (isSmallScreen) {
      setSidebarVisible(prev => !prev)
    } else {
      toggleCollapsed()
    }
  }, [isSmallScreen, toggleCollapsed])

  // 鼠标悬停处理
  const handleMouseEnter = useCallback(() => {
    if (isCollapsed && !isSmallScreen) {
      setIsHovered(true)
    }
  }, [isCollapsed, isSmallScreen])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  // 状态变化回调
  const notifyStateChange = useCallback((callback?: (visible: boolean, collapsed: boolean, hovered: boolean, small: boolean) => void) => {
    callback?.(sidebarVisible, isCollapsed, isHovered, isSmallScreen)
  }, [sidebarVisible, isCollapsed, isHovered, isSmallScreen])

  return {
    // 状态
    sidebarVisible,
    isCollapsed,
    isHovered,
    isSmallScreen,
    
    // 状态设置器
    setSidebarVisible,
    setIsCollapsed,
    setIsHovered,
    
    // 操作函数
    toggleSidebar,
    toggleCollapsed,
    handleSidebarToggle,
    handleToggleButtonClick,
    handleMouseEnter,
    handleMouseLeave,
    notifyStateChange
  }
}

export default useSidebar