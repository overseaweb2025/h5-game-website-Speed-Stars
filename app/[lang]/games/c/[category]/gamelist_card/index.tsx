'use client'
import { ExtendedGame } from "@/components/games/types"
import { useGameData } from "@/hooks/useGameData"
import GameCard from "@/components/games/GameCard"
import { LoadingSpinner, ErrorDisplay, NotFound } from "@/shared/components"
import { useEffect, useState } from "react"

type GameListCardProps = {
  category: string
}

const GameListCard = ({ category }: GameListCardProps) => {
  const { categoriesWithGames, loading, error } = useGameData()
  const [categoryList, setCategoryList] = useState<ExtendedGame[]>([])

  const handelCategory = ()=>{
   const decodedCategory = decodeURIComponent(category)

    const foundCategory = categoriesWithGames.find(
      (cat) => cat.category_name.toLowerCase() === decodedCategory.toLowerCase()
    )
    // Category list processing
    if (foundCategory && foundCategory.games) {
      setCategoryList(foundCategory.games)
    } else {
      setCategoryList([])
    }
}

  useEffect(() => {
    // Process categories and games data
    categoriesWithGames.forEach((Item,index)=>{
      if(Item.category_name === category && Item.games.length >0){
        handelCategory()
      }
    })

  }, [categoriesWithGames, category])

  if (loading) {
    return <LoadingSpinner text="Loading games..." fullScreen={false} />
  }

  if (error) {
    return <ErrorDisplay title="Error loading games" message={error} fullScreen={false} />
  }

  if (categoryList.length === 0) {
    return <NotFound message={`No games found under category "${category}"`} />
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categoryList.map((item, index) => (
          <div key={`${item.id}-${index}`} className="aspect-[4/3]">
            <GameCard 
              game={item}
              className="w-full h-full shadow-lg hover:shadow-xl"
              size="horizontal-scroll"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameListCard
