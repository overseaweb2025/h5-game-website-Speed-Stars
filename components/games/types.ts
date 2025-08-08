import { Game } from "@/app/api/types/Get/game"

// 扩展Game接口以包含UI需要的字段
export interface ExtendedGame extends Game {
  image?: string
  tag?: string
}

export interface GameCardProps {
  game: ExtendedGame
  className?: string
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'horizontal-scroll'
  t?: any
  isHomepage?: boolean  // 新增：用于区分是否在首页使用
  lang?: string  // 新增：传入语言参数避免hydration mismatch
}