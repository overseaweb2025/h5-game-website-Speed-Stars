import { heroData } from "@/data/home/hero-data"
import { GameDetails, game } from "@/app/api/types/Get/game"

interface TitleProps {
  game?: game
  gameDetails?: GameDetails
  title?: string
  pageTitle?: string
}

const Title = ({ game, gameDetails, title, pageTitle }: TitleProps) => {
  return (
    <h1 className="hidden lg:block text-5xl md:text-6xl lg:text-7xl text-text font-black mb-4 leading-tight text-center pop-in">
      {game ? (
        <span className="gradient-text">{game.display_name || game.name}</span>
      ) : gameDetails ? (
        <span className="gradient-text">{gameDetails.display_name || gameDetails.title}</span>
      ) : title ? (
        <span className="gradient-text">{title}</span>
      ) : pageTitle ? (
        <span className="gradient-text">{pageTitle}</span>
      ) : (
        <>
          <span className="gradient-text">{heroData.title.main}</span>
          <span className="text-accent-2 text-stroke">{heroData.title.subtitle}</span>
        </>
      )}
    </h1>
  )
}
export default Title