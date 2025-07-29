"use client"

import { useState, useEffect } from "react"
import GamesShow from "@/components/games/GamesShow"

export default function GamesPage() {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // 初始化时检查屏幕尺寸
  useEffect(() => {
    const initializeScreenSize = () => {
      const isSmall = window.innerWidth < 1024
      setIsSmallScreen(isSmall)
      if (isSmall) {
        setIsCollapsed(true)
      }
    }
    
    initializeScreenSize()
  }, [])

  // 响应式检测
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1024
      const wasSmallScreen = isSmallScreen
      setIsSmallScreen(isSmall)
      
      if (isSmall && !wasSmallScreen) {
        setIsCollapsed(true)
        setSidebarVisible(true)
      } else if (!isSmall && wasSmallScreen) {
        setSidebarVisible(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [isSmallScreen])

  return (
    <GamesShow 
      sidebarVisible={sidebarVisible}
      isSmallScreen={isSmallScreen}
      isCollapsed={isCollapsed}
      isHovered={isHovered}
    />
  )
}

