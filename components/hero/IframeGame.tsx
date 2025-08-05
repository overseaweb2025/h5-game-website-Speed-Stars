import { GameDetails } from "@/app/api/types/Get/game"
import { useGamePlayTracker } from "@/hooks/useGamePlayTracker"
import { useState } from "react"

interface PropIframe {
    gameDetails:GameDetails
}

const IframeGame = ({gameDetails}:PropIframe)=>{
    const [iframeHeight, setIframeHeight] = useState("600px")
  
    const {
      initializeGame,
      setGameContainerRef,
      setIframeRef,
    } = useGamePlayTracker()
    
    return(
        <>
              <div
                  id="game-frame"
                  ref={setGameContainerRef}
                  className="relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 mb-6 bg-black"
                  style={{ 
                    width: "100%", 
                    minHeight: "300px",
                    height: iframeHeight,
                    borderRadius: '12px',
                    aspectRatio: '16/10' // Force rectangular aspect ratio
                  }}
                >
                  
                    <iframe
                                          ref={setIframeRef}
                      src={gameDetails.package.url}
                      title={"Speed Stars Game"}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      style={{
                        backgroundColor: '#000',
                        imageRendering: 'auto'
                      }}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>
              </div>
        </>
    )
}

const NotLoading = ({t}:{t:any})=>{
    return (
        <>
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
               <div className="text-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                 <h2 className="text-2xl font-black text-text mb-3">{t?.hero?.loadingGame || "Loading Game..."}</h2>
                 <p className="text-text/80">{t?.hero?.pleaseWait || "Please wait while we load the game data"}</p>
               </div>
             </div>
        </>
    )
}
export default IframeGame 