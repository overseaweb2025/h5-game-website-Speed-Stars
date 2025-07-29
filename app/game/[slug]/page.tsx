"use client"

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { getGameDetails } from "@/app/api/gameList";
import { GameDetailsResponse, ExtendedGameDetails } from "@/app/api/types/Get/game";
import { gameDetailsParser, getRatingDisplay, getStarRating } from "@/lib/game-utils";
import Hero from "@/components/hero";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NavigationArrow from "@/components/navigation-arrow";
import { LoadingSpinner } from "@/shared/components";
import Testimonials from "@/components/testimonials";

export default function GamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [gameData, setGameData] = useState<ExtendedGameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const response = await getGameDetails(slug);
        if (response.data && response.data.data) {
          // 使用工具函数转换为扩展的游戏详情
          console.log("Raw game data:", response.data.data);
          const extendedDetails = gameDetailsParser.toExtendedDetails(response.data.data);
          setGameData(extendedDetails);
        } else {
          setError("Game not found");
        }
      } catch (err) {
        console.error("Failed to fetch game data:", err);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGameData();
    }
  }, [slug]);

  if (loading) {
    return (
      <main>
        <Header />
        <LoadingSpinner text="Loading game..." fullScreen />
        <Footer />
      </main>
    );
  }

  if (error || !gameData) {
    notFound();
  }

  // Convert API data to Hero component format using the parser
  const heroGameData = gameDetailsParser.toHeroGameData(gameData, slug);

  return (
    <main>
      <Header />
      <Hero game={heroGameData} reviews={gameData.reviews} />
      
      {/* Breadcrumbs Navigation - Top Left */}
      {gameData.breadcrumbs && gameData.breadcrumbs.length > 0 && (
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-3 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <nav aria-label="Breadcrumb">
              <div className="flex items-center space-x-1 text-sm">
                {/* Always show Games first */}
                <div className="flex items-center">
                  <span className="text-gray-300 hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10">
                    Games
                  </span>
                  <svg 
                    className="mx-2 h-4 w-4 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {gameData.breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && (
                      <svg 
                        className="mx-2 h-4 w-4 text-gray-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`${
                      index === gameData.breadcrumbs.length - 1 
                        ? 'text-primary font-semibold' 
                        : 'text-gray-300 hover:text-primary'
                    } transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10`}>
                      {crumb.name}
                    </span>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </section>
      )}
      
      <NavigationArrow />
      
      {/* Game Information Section */}
     
      
      <Footer />
    </main>
  );
}