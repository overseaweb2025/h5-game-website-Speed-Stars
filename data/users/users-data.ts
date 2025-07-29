import { 
  UserProfileResponse, 
  GameHistory, 
  FavoriteGame, 
  CommentHistory,
  UserAchievement 
} from '@/app/api/types/Get/user-profile'

// 静态用户数据
export interface StaticUserData extends UserProfileResponse {
  slug: string
}

export const staticUsersData: StaticUserData[] = [
  {
    slug: "gaming-master",
    profile: {
      id: "user_1",
      name: "Gaming Master",
      email: "gaming.master@example.com",
      avatar: "/placeholder.svg?height=100&width=100&text=GM&bg=4a9eff&color=white",
      joinDate: "2023-06-15",
      level: 25,
      experience: 8750,
      achievements: 45
    },
    stats: {
      totalGamesPlayed: 89,
      totalPlayTime: 5420, // 分钟
      favoriteGamesCount: 12,
      commentsCount: 34,
      averageRating: 4.8,
      achievementsCount: 45,
      currentLevel: 25,
      nextLevelExperience: 10000,
      currentExperience: 8750
    },
    recentGames: [
      {
        id: 1,
        gameId: 1,
        gameName: "sniper-challenge-game",
        gameDisplayName: "Sniper Challenge Game",
        lastPlayed: "2024-01-20T18:30:00Z",
        playTime: 125,
        sessionsCount: 8,
        highScore: 2850,
        gameImage: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
      },
      {
        id: 2,
        gameId: 7,
        gameName: "super-slime",
        gameDisplayName: "Super Slime",
        lastPlayed: "2024-01-19T22:15:00Z",
        playTime: 98,
        sessionsCount: 5,
        highScore: 1890,
        gameImage: "/placeholder.svg?height=80&width=120&text=Slime&bg=8b4513&color=white"
      },
      {
        id: 3,
        gameId: 12,
        gameName: "dig-tycoon",
        gameDisplayName: "Dig Tycoon",
        lastPlayed: "2024-01-18T16:45:00Z",
        playTime: 156,
        sessionsCount: 12,
        highScore: 5600,
        gameImage: "/placeholder.svg?height=80&width=120&text=Dig&bg=2196f3&color=white"
      }
    ],
    favoriteGames: [
      {
        id: 1,
        gameId: 1,
        gameName: "sniper-challenge-game",
        gameDisplayName: "Sniper Challenge Game",
        addedDate: "2023-08-10",
        gameImage: "/placeholder.svg?height=80&width=120&text=Sniper&bg=4a9eff&color=white"
      },
      {
        id: 2,
        gameId: 11,
        gameName: "twisted-tangle",
        gameDisplayName: "Twisted Tangle",
        addedDate: "2023-09-22",
        gameImage: "/placeholder.svg?height=80&width=120&text=Tangle&bg=8b008b&color=white"
      },
      {
        id: 3,
        gameId: 7,
        gameName: "super-slime",
        gameDisplayName: "Super Slime",
        addedDate: "2023-10-05",
        gameImage: "/placeholder.svg?height=80&width=120&text=Slime&bg=8b4513&color=white"
      }
    ],
    recentComments: [
      {
        id: 1,
        gameId: 1,
        gameName: "sniper-challenge-game",
        gameDisplayName: "Sniper Challenge Game",
        comment: "Absolutely incredible game! The precision mechanics are spot-on and the graphics are stunning. Spent hours perfecting my aim.",
        rating: 5,
        createdAt: "2024-01-15T14:30:00Z",
        updatedAt: "2024-01-15T14:30:00Z",
        likes: 28
      },
      {
        id: 2,
        gameId: 7,
        gameName: "super-slime",
        gameDisplayName: "Super Slime",
        comment: "Super fun and addictive! Perfect physics and smooth gameplay. Great for both quick sessions and long gaming marathons.",
        rating: 5,
        createdAt: "2024-01-10T11:20:00Z",
        updatedAt: "2024-01-10T11:20:00Z",
        likes: 19
      }
    ],
    achievements: [
      {
        id: 1,
        title: "Sniper Elite",
        description: "Score 1000+ points in Sniper Challenge",
        icon: "🎯",
        unlockedAt: "2023-09-15T10:30:00Z",
        category: "gaming",
        rarity: "epic"
      },
      {
        id: 2,
        title: "Gaming Veteran",
        description: "Play 50+ different games",
        icon: "🏆",
        unlockedAt: "2023-12-20T16:45:00Z",
        category: "milestone",
        rarity: "legendary"
      }
    ]
  },
  {
    slug: "casual-player",
    profile: {
      id: "user_2",
      name: "Casual Player",
      email: "casual.player@example.com",
      avatar: "/placeholder.svg?height=100&width=100&text=CP&bg=8b4513&color=white",
      joinDate: "2023-11-08",
      level: 8,
      experience: 1250,
      achievements: 12
    },
    stats: {
      totalGamesPlayed: 23,
      totalPlayTime: 890,
      favoriteGamesCount: 5,
      commentsCount: 8,
      averageRating: 4.2,
      achievementsCount: 12,
      currentLevel: 8,
      nextLevelExperience: 1500,
      currentExperience: 1250
    },
    recentGames: [
      {
        id: 4,
        gameId: 2,
        gameName: "slice-master",
        gameDisplayName: "Slice Master",
        lastPlayed: "2024-01-19T14:20:00Z",
        playTime: 25,
        sessionsCount: 2,
        highScore: 450,
        gameImage: "/placeholder.svg?height=80&width=120&text=Slice&bg=ff8c00&color=white"
      },
      {
        id: 5,
        gameId: 6,
        gameName: "find-the-vampire",
        gameDisplayName: "Find the Vampire",
        lastPlayed: "2024-01-17T20:10:00Z",
        playTime: 35,
        sessionsCount: 3,
        gameImage: "/placeholder.svg?height=80&width=120&text=Vampire&bg=8b008b&color=white"
      }
    ],
    favoriteGames: [
      {
        id: 4,
        gameId: 2,
        gameName: "slice-master",
        gameDisplayName: "Slice Master",
        addedDate: "2023-12-15",
        gameImage: "/placeholder.svg?height=80&width=120&text=Slice&bg=ff8c00&color=white"
      },
      {
        id: 5,
        gameId: 13,
        gameName: "volley-beans",
        gameDisplayName: "Volley Beans",
        addedDate: "2024-01-02",
        gameImage: "/placeholder.svg?height=80&width=120&text=Volley&bg=4caf50&color=white"
      }
    ],
    recentComments: [
      {
        id: 3,
        gameId: 2,
        gameName: "slice-master",
        gameDisplayName: "Slice Master",
        comment: "Really enjoyable puzzle mechanics! Perfect for relaxing after work.",
        rating: 4,
        createdAt: "2024-01-12T19:45:00Z",
        updatedAt: "2024-01-12T19:45:00Z",
        likes: 5
      }
    ],
    achievements: [
      {
        id: 3,
        title: "First Steps",
        description: "Play your first game",
        icon: "👶",
        unlockedAt: "2023-11-08T12:00:00Z",
        category: "milestone",
        rarity: "common"
      },
      {
        id: 4,
        title: "Social Butterfly",
        description: "Leave 5 comments",
        icon: "💬",
        unlockedAt: "2024-01-05T15:30:00Z",
        category: "social",
        rarity: "rare"
      }
    ]
  },
  {
    slug: "speed-runner",
    profile: {
      id: "user_3",
      name: "Speed Runner",
      email: "speed.runner@example.com",
      avatar: "/placeholder.svg?height=100&width=100&text=SR&bg=ff4500&color=white",
      joinDate: "2023-03-22",
      level: 42,
      experience: 15680,
      achievements: 78
    },
    stats: {
      totalGamesPlayed: 156,
      totalPlayTime: 12450,
      favoriteGamesCount: 8,
      commentsCount: 67,
      averageRating: 4.9,
      achievementsCount: 78,
      currentLevel: 42,
      nextLevelExperience: 18000,
      currentExperience: 15680
    },
    recentGames: [
      {
        id: 6,
        gameId: 8,
        gameName: "mad-royale-tactics",
        gameDisplayName: "Mad Royale Tactics",
        lastPlayed: "2024-01-20T23:15:00Z",
        playTime: 245,
        sessionsCount: 15,
        highScore: 9850,
        gameImage: "/placeholder.svg?height=80&width=120&text=Royale&bg=87ceeb&color=white"
      },
      {
        id: 7,
        gameId: 9,
        gameName: "tile-jumper-3d",
        gameDisplayName: "Tile Jumper 3D",
        lastPlayed: "2024-01-20T21:30:00Z",
        playTime: 189,
        sessionsCount: 12,
        highScore: 7200,
        gameImage: "/placeholder.svg?height=80&width=120&text=Jumper&bg=2196f3&color=white"
      }
    ],
    favoriteGames: [
      {
        id: 6,
        gameId: 8,
        gameName: "mad-royale-tactics",
        gameDisplayName: "Mad Royale Tactics",
        addedDate: "2023-04-10",
        gameImage: "/placeholder.svg?height=80&width=120&text=Royale&bg=87ceeb&color=white"
      },
      {
        id: 7,
        gameId: 4,
        gameName: "stick-war",
        gameDisplayName: "Stick War",
        addedDate: "2023-05-18",
        gameImage: "/placeholder.svg?height=80&width=120&text=War&bg=ff4500&color=white"
      }
    ],
    recentComments: [
      {
        id: 4,
        gameId: 8,
        gameName: "mad-royale-tactics",
        gameDisplayName: "Mad Royale Tactics",
        comment: "Best strategy game I've ever played! The tactics system is incredibly deep and rewarding. Highly recommend for competitive players.",
        rating: 5,
        createdAt: "2024-01-18T12:20:00Z",
        updatedAt: "2024-01-18T12:20:00Z",
        likes: 42
      },
      {
        id: 5,
        gameId: 4,
        gameName: "stick-war",
        gameDisplayName: "Stick War",
        comment: "Classic gameplay with modern polish. Perfect for speed running challenges!",
        rating: 5,
        createdAt: "2024-01-16T08:15:00Z",
        updatedAt: "2024-01-16T08:15:00Z",
        likes: 31
      }
    ],
    achievements: [
      {
        id: 5,
        title: "Speed Demon",
        description: "Complete 10 games in under 5 minutes each",
        icon: "⚡",
        unlockedAt: "2023-07-12T14:22:00Z",
        category: "gaming",
        rarity: "legendary"
      },
      {
        id: 6,
        title: "Completionist",
        description: "Play 100+ different games",
        icon: "🎮",
        unlockedAt: "2023-11-30T09:45:00Z",
        category: "milestone",
        rarity: "legendary"
      }
    ]
  }
]

// 工具函数
export const getUserBySlug = (slug: string): StaticUserData | undefined => {
  return staticUsersData.find(user => user.slug === slug)
}

export const getAllUserSlugs = (): string[] => {
  return staticUsersData.map(user => user.slug)
}

// 检查用户是否公开可见
export const isUserPublic = (slug: string): boolean => {
  // 所有静态用户都是公开的
  return !!getUserBySlug(slug)
}