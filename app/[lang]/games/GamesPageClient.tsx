"use client"

// 状态管理由GamesLayoutClient统一处理
import GamesShow from "@/components/games/GamesShow"
import { Locale } from "@/lib/lang/dictionaraies"

interface GamesPageClientProps {
  lang:Locale
}

export default function GamesPageClient({ lang }: GamesPageClientProps) {
  return (
    <GamesShow lang={lang} />
  )
}