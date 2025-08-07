"use client"

import { useEffect, useState } from 'react'
import { CategorySEO, games } from '@/app/api/types/Get/game'
import GameCard from '@/components/games/GameCard'

interface CategoryPageClientProps {
  category: string
  t?: any
  games:games
}

export default function CategoryPageClient({ category, t ,games}: CategoryPageClientProps) {
  const decodedCategory = decodeURIComponent(category)
  const [seoData, setSeoData] = useState<CategorySEO | null>(null)
  
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              🎮 {decodedCategory} {t?.games?.games || "Games"}
            </h1>
            {seoData?.page_description && (
              <p className="text-gray-400 text-sm md:text-base mb-6">
                {seoData.page_description}
              </p>
            )}
            
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              🌟 {t?.games?.featuredGames || "Featured"} {decodedCategory} {t?.games?.games || "Games"}
            </h2>
            
            {/* 游戏展示区域 */}
            <div className="w-full">
              {games && games.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {games.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="aspect-square">
                      <GameCard 
                        game={item}
                        className="w-full h-full shadow-lg hover:shadow-xl"
                        size="horizontal-scroll"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 flex-col gap-4">
                  <div className="text-6xl">🎮</div>
                  <div className="text-white text-2xl font-bold">No Games Available</div>
                  <div className="text-white/60 text-center max-w-md">
                    Sorry, there are no games available in this category at the moment. Check back soon for new additions!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}