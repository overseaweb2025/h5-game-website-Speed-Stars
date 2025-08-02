import { Game } from "@/app/api/types/Get/game"
import { ExtendedGame } from "./types"

// 可用的游戏分类图标池
const CATEGORY_ICONS = [
  '🎮', '⚔️', '🗺️', '🧩', '🏆', '🏎️', '🎯', '🏀', '⚽', '💄', 
  '🚲', '👥', '🏃', '🎴', '🎱', '🌐', '👻', '🚪', '🚗', '⛏️', 
  '🀄', '🏰', '⚡', '👆', '😎', '👗', '🎪', '🎨', '🎲', '🎭',
  '🎸', '🎺', '🎻', '🎹', '🎤', '🎧', '🎬', '🎥', '📱', '💻',
  '🎊', '🎉', '🎈', '🎁', '🏅', '🥇', '🥈', '🥉', '🏵️', '🎖️'
]

// 已使用的图标跟踪器
const usedIconsMap = new Map<string, Set<string>>()

// 根据分类名称获取图标的函数 - 优先匹配关键词，然后随机分配
export const getCategoryIcon = (categoryName: string, categoryId?: number) => {
  const name = categoryName.toLowerCase()
  
  // 首先尝试关键词匹配
  const keywordMatches: { [key: string]: string } = {
    'action': '⚔️',
    'adventure': '🗺️', 
    'puzzle': '🧩',
    'sports': '🏆',
    'racing': '🏎️',
    'car': '🏎️',
    'shooting': '🎯',
    'fps': '🎯',
    'basketball': '🏀',
    'soccer': '⚽',
    'football': '⚽',
    'beauty': '💄',
    'bike': '🚲',
    'player': '👥',
    'stickman': '🏃',
    'card': '🎴',
    'pool': '🎱',
    'io': '🌐',
    'horror': '👻',
    'escape': '🚪',
    'driving': '🚗',
    'minecraft': '⛏️',
    'mahjong': '🀄',
    'tower': '🏰',
    'defense': '🏰',
    'flash': '⚡',
    'controller': '🎮',
    'clicker': '👆',
    'casual': '😎',
    'dress': '👗'
  }
  
  // 检查关键词匹配
  for (const [keyword, icon] of Object.entries(keywordMatches)) {
    if (name.includes(keyword)) {
      return icon
    }
  }
  
  // 如果没有关键词匹配，使用随机分配策略
  const sessionKey = 'current_session'
  if (!usedIconsMap.has(sessionKey)) {
    usedIconsMap.set(sessionKey, new Set())
  }
  
  const usedIcons = usedIconsMap.get(sessionKey)!
  
  // 如果所有图标都用过了，重置使用记录
  if (usedIcons.size >= CATEGORY_ICONS.length - 5) {
    usedIcons.clear()
  }
  
  // 找到未使用的图标
  const availableIcons = CATEGORY_ICONS.filter(icon => !usedIcons.has(icon))
  
  // 使用分类名称作为种子来保证相同分类总是得到相同图标
  const seed = categoryName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const selectedIcon = availableIcons[seed % availableIcons.length] || '🎮'
  
  // 记录已使用的图标
  usedIcons.add(selectedIcon)
  
  return selectedIcon
}

// 生成游戏占位符图片的函数
export const generateGameImage = (game: Game, index: number) => {
  const colors = ['4a9eff', '8b4513', '2196f3', '8b008b', 'ff8c00', '4caf50', 'ff4500', '87ceeb']
  const bgColor = colors[index % colors.length]
  const encodedName = encodeURIComponent(game.display_name.substring(0, 12))
  return `/placeholder.svg?height=150&width=200&text=${encodedName}&bg=${bgColor}&color=white`
}

// 添加随机标签的函数
export const addRandomTags = (games: Game[]): ExtendedGame[] => {
  const tags = ['Hot', 'New', 'Updated', undefined]
  return games.map((game, index) => ({
    ...game,
    image: generateGameImage(game, index),
    tag: Math.random() > 0.6 ? tags[Math.floor(Math.random() * tags.length)] : undefined
  }))
}