"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useGameData } from "@/hooks/useGameData"
import { getCategoryIcon } from "./utils"
import { useResponsive } from "@/shared/hooks"
import { useLangGameList } from "@/hooks/LangGamelist_value"
import { Locale } from "@/lib/lang/dictionaraies"

// 固定的主要导航项目
const fixedNavItems = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'new', icon: '✨', label: 'New' },
  { id: 'trending', icon: '🔥', label: 'Trending now' },
  { id: 'updates', icon: '🔄', label: 'Updated' },
  { id: 'originals', icon: '👑', label: 'Originals' },
  { id: 'multiplayer', icon: '👥', label: 'Multiplayer' }
]

interface SaberProps {
  onSidebarToggle?: (toggleFunction: () => void) => void
  onStateChange?: (sidebarVisible: boolean, isCollapsed: boolean, isHovered: boolean) => void
  lang:Locale
}

const Saber = ({ onSidebarToggle, onStateChange ,lang}: SaberProps) => {
  const { allCategories } = useGameData()
  const {getLangGamelistBylang} = useLangGameList()
  const GameList = getLangGamelistBylang(lang)
  const router = useRouter()
  const pathname = usePathname()
  
  // 侧边栏状态管理
  const [sidebarVisible, setSidebarVisible] = useState(true) // 侧边栏是否可见
  const [isHovered, setIsHovered] = useState(false) // 鼠标悬停状态
  const [hoveredItem, setHoveredItem] = useState<string | null>(null) // 悬停的菜单项
  const [selectedItem, setSelectedItem] = useState('home')

  // 使用共享的响应式Hook
  const { isSmallScreen, isCollapsed, setIsCollapsed } = useResponsive({
    breakpoint: 1024,
    initialCollapsed: true, // 移动端默认收起状态
    onScreenSizeChange: (isSmall, wasSmall) => {
      if (isSmall && !wasSmall) {
        // 切换到移动端：显示但设置为图标模式
        setSidebarVisible(true)
        setIsCollapsed(true)
      } else if (!isSmall && wasSmall) {
        // 切换到桌面端：显示且展开
        setSidebarVisible(true)
        setIsCollapsed(false)
      }
    }
  })

  // 切换侧边栏的函数 - 移动端在显示/隐藏之间切换
  const toggleSidebar = useCallback(() => {
    if (isSmallScreen) {
      // 移动端：在显示和隐藏之间切换
      setSidebarVisible(!sidebarVisible)
      // 如果显示侧边栏，默认为图标模式
      if (!sidebarVisible) {
        setIsCollapsed(true)
      }
    } else {
      // 桌面端：在默认模式和图标模式之间切换
      setIsCollapsed(!isCollapsed)
    }
  }, [isSmallScreen, sidebarVisible, isCollapsed])


  // 处理鼠标悬停
  const handleMouseEnter = useCallback(() => {
    if (isCollapsed && !isSmallScreen) {
      setIsHovered(true)
    }
  }, [isCollapsed, isSmallScreen])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setHoveredItem(null)
  }, [])

  // 处理项目悬停
  const handleItemHover = useCallback((itemId: string | null) => {
    setHoveredItem(itemId)
  }, [])

  // 处理触摸事件 - 触摸任意行时将图标模式展开为完整模式
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 防止触摸事件冒泡，确保只有当前项目被处理
    e.stopPropagation()
    
    if (isCollapsed) {
      setIsCollapsed(false) // 从图标模式切换到完整默认模式
      setIsHovered(false)   // 确保悬停状态重置
      
      // 在小屏幕上，添加轻微的触觉反馈（如果支持）
      if (isSmallScreen && 'vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }
  }, [isCollapsed, isSmallScreen])

  // 处理菜单项点击
  const handleItemClick = useCallback((itemId: string) => {
    setSelectedItem(itemId)
    
    // 从当前路径提取语言代码
    const getLangFromPath = () => {
      const segments = pathname.split('/')
      // pathname 格式: /en/games 或 /zh/games
      return segments[1] || 'en' // 默认英语
    }
    
    // 处理Home按钮点击 - 跳转到当前语言的首页
    if (itemId === 'home') {
      const lang = getLangFromPath()
      router.push(`/${lang}/games`)
      return
    }
    
    // 如果点击的是分类项目，导航到分类页面
    if (itemId.startsWith('category-')) {
      const categoryId = itemId.replace('category-', '')
      const category = allCategories.find(cat => cat.category_id.toString() === categoryId)
      if (category) {
        const lang = getLangFromPath()
        router.push(`/${lang}/games/c/${encodeURIComponent(category.category_name)}`)
      }
    }
  }, [router, allCategories, pathname])

  // 将toggle函数传递给父组件
  useEffect(() => {
    onSidebarToggle?.(toggleSidebar)
  }, [onSidebarToggle, toggleSidebar])

  // 状态变化时通知父组件
  useEffect(() => {
    onStateChange?.(sidebarVisible, isCollapsed, isHovered)
  }, [onStateChange, sidebarVisible, isCollapsed, isHovered])

  // 键盘快捷键支持 (E键)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'e' || event.key === 'E') {
        // 确保不在输入框中
        if (event.target instanceof HTMLElement && 
            !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
          event.preventDefault()
          toggleSidebar()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // 创建侧边栏分类列表 - 使用所有分类（包括空的）
  const createSidebarCategories = () => {
    if(GameList)
    return GameList.map(category => ({
      id: `category-${category.category_id}`,
      icon: getCategoryIcon(category.category_name),
      label: category.category_name,
      categoryId: category.category_id,
      gameCount: category.games ? category.games.length : 0
    }))
  }

  const sidebarCategories = createSidebarCategories()

  return (
    <div 
      className={`h-full w-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 shadow-sm transition-all duration-300 sidebar-container ${
        !sidebarVisible ? 'hidden' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="py-4">
          <nav className="flex flex-col">
            {/* 固定主要导航 */}
            <div className="mb-2">
              {fixedNavItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative group flex items-center h-12 cursor-pointer select-none transition-all duration-200 hover:bg-gray-700/50 touch-manipulation active:bg-gray-600/50 ${
                    selectedItem === item.id ? 'border-l-[6px] border-purple-400' : ''
                  }`}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => handleItemHover(item.id)}
                  onMouseLeave={() => handleItemHover(null)}
                  onTouchStart={handleTouchStart}
                >
                  {selectedItem === item.id && (
                    <div 
                      className="absolute left-0 top-0 bottom-0"
                      style={{ width: '1.2px', backgroundColor: '#a48eff' }}
                    />
                  )}
                  
                  <div className="flex items-center w-full px-4">
                    <span className="text-xl font-bold text-gray-300 flex-shrink-0 mr-3" style={{fontFamily: 'inherit'}}>{item.icon}</span>
                    <div
                      className={`transition-all duration-300 overflow-hidden whitespace-nowrap font-semibold ${
                        selectedItem === item.id
                          ? 'text-purple-400 transform translate-x-2'
                          : hoveredItem === item.id
                            ? 'text-purple-300 transform translate-x-2'
                            : 'text-gray-300'
                      }`}
                      style={{
                        opacity: (isCollapsed && !isHovered) ? 0 : 1,
                        width: (isCollapsed && !isHovered) ? '0px' : 'auto',
                        fontFamily: 'inherit'
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 游戏分类导航 - 来自API数据 */}
            <div 
              className="border-t border-gray-600/50 mt-4 pt-2 transition-all duration-300"
              style={{
                opacity: (isCollapsed && !isHovered) ? 1 : 1,
                height: 'auto',
                overflow: 'visible'
              }}
            >
              {sidebarCategories && sidebarCategories.map((category) => (
                <div
                  key={category.id}
                  className={`relative group flex items-center h-12 cursor-pointer select-none transition-all duration-200 hover:bg-gray-700/50 touch-manipulation active:bg-gray-600/50 ${
                    selectedItem === category.id ? 'border-l-[6px] border-purple-400' : ''
                  } ${category.gameCount === 0 ? 'opacity-60' : ''}`}
                  onClick={() => handleItemClick(category.id)}
                  onMouseEnter={() => handleItemHover(category.id)}
                  onMouseLeave={() => handleItemHover(null)}
                  onTouchStart={handleTouchStart}
                >
                  {selectedItem === category.id && (
                    <div 
                      className="absolute left-0 top-0 bottom-0"
                      style={{ width: '1.2px', backgroundColor: '#a48eff' }}
                    />
                  )}
                  
                  <div className="flex items-center w-full px-4">
                    <span className="text-lg font-bold text-gray-300 flex-shrink-0 mr-3" style={{fontFamily: 'inherit'}}>{category.icon}</span>
                    <div
                      className={`text-sm transition-all duration-300 overflow-hidden whitespace-nowrap font-semibold ${
                        selectedItem === category.id
                          ? 'text-purple-400 transform translate-x-2'
                          : hoveredItem === category.id
                            ? 'text-purple-300 transform translate-x-2'
                            : 'text-gray-300'
                      }`}
                      style={{
                        opacity: (isCollapsed && !isHovered) ? 0 : 1,
                        width: (isCollapsed && !isHovered) ? '0px' : 'auto',
                        fontFamily: 'inherit'
                      }}
                    >
                      <span>{category.label}</span>
                      {category.gameCount > 0 && (
                        <span className="ml-1 text-xs opacity-60">({category.gameCount})</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Saber