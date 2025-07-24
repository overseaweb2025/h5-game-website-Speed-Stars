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

export const gamesData: Game[] = [
  {
    title: "Speed Stars",
    description: "Master the rhythm in this physics-based sprinting game",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg",
    url: "/games/speed-stars",
    featured: true,
    available: true,
    iframeSrc: "https://speedstars2.io/game/speed-stars/",
    howToPlay: [
      "Click or tap to start running.",
      "Time your clicks/taps to hit speed boosts.",
      "Avoid obstacles on the track.",
      "Reach the finish line as fast as possible!"
    ],
    features: [
      "Fast-paced rhythm-based gameplay.",
      "Physics-based character movement.",
      "Multiple challenging tracks.",
      "Vibrant cartoon graphics and effects.",
      "Easy to learn, hard to master."
    ]
  },
  {
    title: "Speed Stars 2",
    description: "Play unlocked Speed Stars 2 games!",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-2-150x150-DSEGhbCjX3YS7vlK1FBI3K4WWYd47z.png",
    url: "/games/speed-stars-2",
    featured: false,
    available: true,
    iframeSrc: "https://speedstarsgame.com/gg/speed-stars-2/"
  },
  {
    title: "CRAZY CATTLE 3D",
    description: "Crazy Cattle 3D offers quick, adrenaline-fueled sessions perfect for a stress-relieving break.",
    image: "/images/crazy-cattle-3d-art.jpeg",
    url: "/games/crazy-cattle-3d",
    featured: false,
    available: true
  }
];

export const getGameBySlug = (slug: string): Game | undefined => {
  return gamesData.find(game => game.url === `/games/${slug}`);
};

export const getAllGameSlugs = (): string[] => {
  return gamesData.map(game => game.url.replace('/games/', ''));
};