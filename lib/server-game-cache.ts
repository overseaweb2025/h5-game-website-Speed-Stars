import { Locale } from "@/lib/lang/dictionaraies";
import { GameDetails } from "@/app/api/types/Get/game";

// Server-side safe function to get game details for metadata generation
export async function getGameDetailsForMetadata(lang: Locale, slug: string): Promise<GameDetails | null> {
  try {
    // Try to import the game data statically - this might need adjustment based on your data structure
    // If your game data is stored in files, you can import them directly
    // If it's in a database, you'd make a direct database call here
    
    // For now, we'll try to access any statically available game data
    // You might need to adjust this path based on where your game data is stored
    const gameDataPath = `@/data/games/${lang}/${slug}.json`;
    
    try {
      const gameData = await import(gameDataPath);
      return gameData.default as GameDetails;
    } catch (importError) {
      // If no static file exists, return null
      return null;
    }
  } catch (error) {
    console.warn(`Failed to get game details for ${slug} in ${lang}:`, error);
    return null;
  }
}

// Helper function to create fallback metadata from slug
export function createFallbackMetadata(slug: string) {
  const gameName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${gameName} - Free Online Game`,
    description: `Play ${gameName} online for free. Enjoy this exciting browser game with no downloads required.`,
    keywords: `${gameName}, online game, free game, browser game, no download`,
  };
}

// Helper function to strip HTML tags
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Generate SEO metadata from game details
export function generateSEOMetadata(gameDetails: GameDetails, slug: string, canonicalUrl: string) {
  const title = gameDetails.page_title || `${gameDetails.display_name} - Free Online Game`;
  const description = gameDetails.page_description || 
    (gameDetails.info ? stripHtmlTags(gameDetails.info).substring(0, 160) : 
     `Play ${gameDetails.display_name} online for free. Enjoy this exciting browser game with no downloads required.`);
  const keywords = gameDetails.page_keywords || 
    `${gameDetails.display_name}, online game, free game, browser game, ${gameDetails.technology}, ${gameDetails.platforms}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website' as const,
      url: canonicalUrl,
      images: gameDetails.cover ? [{ url: gameDetails.cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: gameDetails.cover ? [gameDetails.cover] : undefined,
    }
  };
}