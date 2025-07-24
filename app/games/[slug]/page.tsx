"use client"

import { notFound } from "next/navigation";
import { getGameBySlug } from "@/data/games/games-data";
import { useParams } from "next/navigation";
import PageLayout from "@/components/page-layout";

export default function GamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const game = getGameBySlug(slug);
  
  if (!game) {
    notFound();
  }

  // Convert the game data to match our interface
  const gameData = {
    id: slug,
    title: game.title,
    description: game.description,
    image: game.image,
    category: "Featured", // Default category
    iframeSrc: game.iframeSrc,
    features: game.features,
    howToPlay: game.howToPlay
  };
  
  return (
    <PageLayout 
      game={gameData}
      showAllSections={true}
    />
  );
}