import GameListCard from "./gamelist_card/index"
type CategoryPageProps = {
  params: {
    category: string
  }
}

const CategoryPage = ({ params: { category } }: CategoryPageProps) => {
  const decodedCategory = decodeURIComponent(category)
  
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
              {decodedCategory}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Our free online {decodedCategory.toLowerCase()} games include classic 2D platform games, cartoony adventures, and a range of strategy and 3D titles.
            </p>
          </div>
          <GameListCard category={category} />
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
