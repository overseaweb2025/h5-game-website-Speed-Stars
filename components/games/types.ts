import { Game } from "@/app/api/types/Get/game"

// 扩展Game接口以包含UI需要的字段
export interface ExtendedGame extends Game {
  image?: string
  tag?: string
}

export interface GameCardProps {
  game: ExtendedGame
  className?: string
  size?: 'small' | 'medium' | 'large' | 'horizontal-scroll'
  t?: any
}