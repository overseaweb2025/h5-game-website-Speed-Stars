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
  },
  {
    title: "Sniper Challenge Game",
    description: "Test your precision and accuracy in this challenging sniper game. Take on various targets and missions.",
    image: "/placeholder.jpg",
    url: "/games/sniper-challenge-game",
    featured: false,
    available: true,
    howToPlay: [
      "Aim with your mouse or finger",
      "Hold to steady your shot",
      "Breathe and time your shots carefully",
      "Complete mission objectives"
    ],
    features: [
      "Realistic sniper mechanics",
      "Multiple challenging missions",
      "Precision aiming system",
      "Progressive difficulty"
    ]
  },
  {
    title: "Super Slime",
    description: "Control a bouncy slime character through challenging obstacle courses and puzzles.",
    image: "/placeholder.jpg",
    url: "/games/super-slime",
    featured: false,
    available: true,
    howToPlay: [
      "Use arrow keys or WASD to move",
      "Jump to avoid obstacles",
      "Collect power-ups along the way",
      "Reach the end goal"
    ],
    features: [
      "Cute slime character",
      "Physics-based movement",
      "Colorful environments",
      "Fun for all ages"
    ]
  },
  {
    title: "Dig Tycoon",
    description: "Build and manage your own mining empire. Dig deep, find treasures, and expand your operations.",
    image: "/placeholder.jpg",
    url: "/games/dig-tycoon",
    featured: false,
    available: true,
    howToPlay: [
      "Click to dig and mine resources",
      "Upgrade your equipment",
      "Hire workers to automate mining",
      "Expand to new mining sites"
    ],
    features: [
      "Incremental gameplay",
      "Resource management",
      "Upgrade systems",
      "Idle mechanics"
    ]
  },
  {
    title: "Twisted Tangle",
    description: "Solve complex rope puzzles by untangling twisted knots and obstacles.",
    image: "/placeholder.jpg",
    url: "/games/twisted-tangle",
    featured: false,
    available: true,
    howToPlay: [
      "Drag to move rope segments",
      "Untangle knots carefully",
      "Avoid obstacles",
      "Complete each level"
    ],
    features: [
      "Brain-teasing puzzles",
      "Progressive difficulty",
      "Satisfying mechanics",
      "Colorful graphics"
    ]
  }
];

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