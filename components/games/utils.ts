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

// 固定的分类图标映射 - 确保每个分类名称总是返回相同的图标
const categoryIconCache = new Map<string, string>()

// 根据分类名称获取图标的函数 - 优先匹配关键词，然后基于分类名称确定性分配
export const getCategoryIcon = (categoryName: string, categoryId?: number) => {
  const name = categoryName.toLowerCase()
  
  // 如果已经缓存了这个分类的图标，直接返回
  if (categoryIconCache.has(categoryName)) {
    return categoryIconCache.get(categoryName)!
  }
  
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
      categoryIconCache.set(categoryName, icon)
      return icon
    }
  }
  
  // 如果没有关键词匹配，使用分类名称确定性分配图标
  // 使用分类名称作为种子来保证相同分类总是得到相同图标
  const seed = categoryName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const selectedIcon = CATEGORY_ICONS[seed % CATEGORY_ICONS.length] || '🎮'
  
  // 缓存结果
  categoryIconCache.set(categoryName, selectedIcon)
  
  return selectedIcon
}

// 生成游戏占位符图片的函数 - 使用游戏机图标
export const generateGameImage = (game: Game, index: number) => {
  // 不再生成动态图片，直接返回undefined让GameCard显示游戏机占位符
  return undefined
}

// 添加确定性标签的函数 - 修复Hydration错误
export const addRandomTags = (games: Game[]): ExtendedGame[] => {
  // 安全检查：确保games是有效数组
  if (!games || !Array.isArray(games) || games.length === 0) {
    return []
  }
  
  const tags = ['Hot', 'New', 'Updated', undefined]
  
  return games.filter(game => game != null).map((game, index) => {
    // 使用游戏ID和索引生成确定性的"随机"数，避免Hydration错误
    const gameId = game.id || index
    const seed = typeof gameId === 'string' 
      ? gameId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
      : gameId
    
    // 基于种子的确定性随机
    const shouldHaveTag = (seed + index) % 10 > 6 // 约40%概率有标签
    const tagIndex = (seed + index * 3) % tags.length
    
    return {
      ...game,
      image: generateGameImage(game, index),
      tag: shouldHaveTag ? tags[tagIndex] : undefined
    }
  })
}