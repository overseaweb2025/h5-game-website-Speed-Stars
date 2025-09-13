import { GameDetails, game } from "@/app/api/types/Get/game"
import { downgradeHeadings } from "@/utils/utils"

interface ContentSectionsProps {
  game?: game
  gameDetails?: GameDetails
  homeData?: any
  isMobile?: boolean
}

const ContentSections = ({ game, gameDetails, homeData, isMobile = false }: ContentSectionsProps) => {
  const containerClass = isMobile ? "col-span-3 mt-6" : "mt-6 mb-6"
  
  return (
    <>
      {/* Homepage content sections */}
      {!game && !gameDetails && homeData?.data && (
        <div className={containerClass}>
          {/* Features section */}
          {homeData.data.page_content.game_intro && (
            <div className="mb-6">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                  dangerouslySetInnerHTML={{
                    __html: homeData.data.page_content.game_intro
                  }}
                />
              </div>
            </div>
          )}

          {/* About section */}
          {homeData.data.page_content.About && (
            <div className="mb-6">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                  dangerouslySetInnerHTML={{
                    __html: downgradeHeadings(homeData.data.page_content.About)
                  }}
                />
              </div>
            </div>
          )}

          {/* Gameplay section */}
          {homeData.data.page_content.Gameplay && (
            <div className="mb-6">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                  dangerouslySetInnerHTML={{
                    __html: homeData.data.page_content.Gameplay
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game page content - Game info and description */}
      {(game || gameDetails) && (
        <div className="container mx-auto px-4 mt-12 space-y-8">
          <section className="py-8">
            <div className="max-w-4xl mx-auto">
              {game?.description && (
                <div 
                  className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                  dangerouslySetInnerHTML={{
                    __html: game.description
                  }}
                />
              )}
              {gameDetails?.description && !game?.description && (
                <div 
                  className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                  dangerouslySetInnerHTML={{
                    __html: gameDetails.description
                  }}
                />
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default ContentSections