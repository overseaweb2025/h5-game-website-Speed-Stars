import { Game } from "@/app/api/types/Get/game"
import { ExtendedGame } from "./types"

// 根据分类名称获取图标的函数
export const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('action')) return '⚔️'
  if (name.includes('adventure')) return '🗺️'
  if (name.includes('puzzle')) return '🧩'
  if (name.includes('sports')) return '🏆'
  if (name.includes('racing') || name.includes('car')) return '🏎️'
  if (name.includes('shooting') || name.includes('fps')) return '🎯'
  if (name.includes('basketball')) return '🏀'
  if (name.includes('soccer')) return '⚽'
  if (name.includes('beauty')) return '💄'
  if (name.includes('bike')) return '🚲'
  if (name.includes('2 player')) return '👥'
  if (name.includes('stickman')) return '🏃'
  if (name.includes('card')) return '🎴'
  if (name.includes('pool')) return '🎱'
  if (name.includes('io')) return '🌐'
  if (name.includes('horror')) return '👻'
  if (name.includes('escape')) return '🚪'
  if (name.includes('driving')) return '🚗'
  if (name.includes('minecraft')) return '⛏️'
  if (name.includes('mahjong')) return '🀄'
  if (name.includes('tower defense')) return '🏰'
  if (name.includes('flash')) return '⚡'
  if (name.includes('controller')) return '🎮'
  if (name.includes('clicker')) return '👆'
  if (name.includes('casual')) return '😎'
  if (name.includes('dress up')) return '👗'
  return '🎮' // 默认游戏图标
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