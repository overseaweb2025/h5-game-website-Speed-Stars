export interface Game {
  title: string;
  description: string;
  image: string;
  url: string;
  featured: boolean;
  available: boolean;
  iframeSrc?: string;
  howToPlay?: string[];
  features?: string[];
}

export const gamesData: Game[] = []

export const getGameBySlug = (slug: string): Game | undefined => {
  return gamesData.find(game => game.url === `/games/${slug}`);
};

export const getAllGameSlugs = (): string[] => {
  return gamesData.map(game => game.url.replace('/games/', ''));
};

export const getRandomGames = (count: number = 3, excludeSlug?: string): Game[] => {
  let availableGames = gamesData.filter(game => game.available);
  
  if (excludeSlug) {
    availableGames = availableGames.filter(game => game.url !== `/games/${excludeSlug}`);
  }
  
  const shuffled = [...availableGames].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};