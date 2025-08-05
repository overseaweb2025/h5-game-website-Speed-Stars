import { GameDetails } from "@/app/api/types/Get/game";
import Link from "next/link";
interface PropBreadcrumebs{
    t:any
    gameDetails:GameDetails
}
const Breadcrumebs = ({t,gameDetails}:PropBreadcrumebs)=>{
    return (
        <>
          <div className="flex justify-center mb-4">
                <div className="max-w-[1494px] w-full px-4">
                  <nav aria-label="Breadcrumb">
                    <div className="flex items-center space-x-1 text-sm">
                      {/* Games link */}
                      <Link href="/games" className="text-gray-300 hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10">
                        {t?.navigation?.allGames || "Games"}
                      </Link>
                      {gameDetails.breadcrumbs.map((crumb, index) => {
                        // Skip the first breadcrumb if it's "Games" to avoid duplication
                        if (index === 0 && crumb.name.toLowerCase() === 'games') {
                          return null;
                        }
                        
                        const isLast = index === gameDetails.breadcrumbs.length - 1;
                        const categorySlug = crumb.name.toLowerCase().replace(/\s+/g, '-');
                        
                        return (
                          <div key={index} className="flex items-center">
                            <svg 
                              className="mx-2 h-4 w-4 text-gray-400" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className={isLast ? "text-primary font-semibold px-2 py-1 rounded" : ""}>
                              {isLast ? (
                                crumb.name
                              ) : (
                                <Link 
                                  href={`/games/c/${categorySlug}`}
                                  className="text-gray-300 hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10"
                                >
                                  {crumb.name}
                                </Link>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </nav>
                </div>
              </div>
        </>
    )
}

export  default Breadcrumebs