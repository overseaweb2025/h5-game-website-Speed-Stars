"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getRandomGames, Game } from "@/data/games/games-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Lightbulb } from "lucide-react"

interface GameSidebarProps {
  excludeSlug?: string
  position?: "left" | "right"
}

export default function GameSidebar({ 
  excludeSlug,
  position = "right" 
}: GameSidebarProps) {
  const [randomGames, setRandomGames] = useState<Game[]>([])
  const isLeft = position === "left"

  useEffect(() => {
    const games = getRandomGames(2, excludeSlug)
    setRandomGames(games)
  }, [excludeSlug])

  return (
    <div className={`fixed top-1/2 transform -translate-y-1/2 z-10 ${
      isLeft ? "left-4" : "right-4"
    } hidden lg:block`}>
      <Card className="w-[216px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-purple-700 dark:text-purple-300 text-sm font-bold flex items-center justify-center gap-2">
            {isLeft ? (
              <>
                <Lightbulb className="w-4 h-4" />
                Game Tips
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                High Score
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLeft ? (
            <div className="space-y-2">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium text-center mb-3">
                Master the timing to achieve the best scores!
              </p>
              {randomGames.map((game, index) => (
                <Link key={`${game.url}-${index}`} href={game.url} className="block">
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={game.image || '/placeholder-game.jpg'}
                        alt={game.title}
                        fill
                        className="object-cover rounded"
                        sizes="32px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                        {game.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium text-center mb-3">
                Challenge yourself and beat your best time!
              </p>
              {randomGames.map((game, index) => (
                <Link key={`${game.url}-${index}`} href={game.url} className="block">
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={game.image || '/placeholder-game.jpg'}
                        alt={game.title}
                        fill
                        className="object-cover rounded"
                        sizes="32px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                        {game.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}