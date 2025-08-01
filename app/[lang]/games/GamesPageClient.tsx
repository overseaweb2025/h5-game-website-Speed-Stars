"use client"

// 状态管理由GamesLayoutClient统一处理
import GamesShow from "@/components/games/GamesShow"

interface GamesPageClientProps {
  t: any
}

export default function GamesPageClient({ t }: GamesPageClientProps) {
  return (
    <GamesShow />
  )
}