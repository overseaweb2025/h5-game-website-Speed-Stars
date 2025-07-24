import type { Metadata } from "next";
import { getGameBySlug, getAllGameSlugs } from "@/data/games/games-data";

interface GameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const gameSlugs = getAllGameSlugs();
  return gameSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GameLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  
  if (!game) {
    return {
      title: "Game Not Found - Speed Stars",
      description: "The requested game could not be found.",
    };
  }
  
  return {
    title: `${game.title} - Speed Stars`,
    description: game.description,
  };
}

export default function GameLayout({ children }: GameLayoutProps) {
  return <>{children}</>;
}