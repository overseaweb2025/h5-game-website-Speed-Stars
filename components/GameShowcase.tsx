"use client"

import { useState, useEffect } from "react"
import Saber from "./games/Saber"
import GamesShow from "./games/GamesShow"

interface GameShowcaseProps {
  onSidebarToggle?: (toggleFunction: () => void) => void
}

const GameShowcase = ({ onSidebarToggle }: GameShowcaseProps) => {
  // 侧边栏状态管理
  const [sidebarVisible, setSidebarVisible] = useState(true) // 侧边栏是否可见
  const [isCollapsed, setIsCollapsed] = useState(false) // 是否收缩为图标模式
  const [isHovered, setIsHovered] = useState(false) // 鼠标悬停状态
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // 初始化时检查屏幕尺寸
  useEffect(() => {
    const initializeScreenSize = () => {
      const isSmall = window.innerWidth < 1024
      setIsSmallScreen(isSmall)
      if (isSmall) {
        setIsCollapsed(true) // 小屏幕默认图标模式
      }
    }
    
    initializeScreenSize()
  }, [])

  // 响应式检测
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 1024
      
      setIsSmallScreen(prevIsSmallScreen => {
        // 从大屏切换到小屏时
        if (isSmall && !prevIsSmallScreen) {
          setIsCollapsed(true) // 小屏时默认为图标模式
          setSidebarVisible(true) // 确保侧边栏可见
        }
        // 从小屏切换到大屏时
        else if (!isSmall && prevIsSmallScreen) {
          setSidebarVisible(true) // 确保侧边栏可见
          // 保持当前的collapsed状态，用户可以自己选择
        }
        
        return isSmall
      })
    }

    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <section className="py-16 bg-gray-900 relative overflow-hidden">
      {/* 装饰性星星，深色背景风格 */}
      <div className="absolute top-20 left-10 text-6xl text-accent/30 pop-in">⭐</div>
      <div className="absolute top-40 right-20 text-4xl text-primary/30 pop-in" style={{ animationDelay: "0.3s" }}>✨</div>
      <div className="absolute bottom-20 left-20 text-5xl text-secondary/30 pop-in" style={{ animationDelay: "0.6s" }}>🎮</div>
      
      <div className="relative flex min-h-screen">
        {/* 侧边栏组件 */}
        <Saber onSidebarToggle={onSidebarToggle} />

        {/* 游戏展示组件 */}
        <GamesShow 
          sidebarVisible={sidebarVisible}
          isSmallScreen={isSmallScreen}
          isCollapsed={isCollapsed}
          isHovered={isHovered}
        />
      </div>
    </section>
  )
}

export default GameShowcase