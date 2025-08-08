"use client"

import React from 'react'
import Link from 'next/link'
import { Game as APIGame } from "@/app/api/types/Get/game"

interface BottomGamesPanelProps {
  randomGames: APIGame[]
  t?: any
}

// Simple game data with images
const defaultGames = [
  {
    id: 1,
    name: "speed-stars",
    display_name: "Speed Stars",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg",
    tag: "Hot"
  },
  {
    id: 2,
    name: "speed-stars-2", 
    display_name: "Speed Stars 2",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-2-150x150-DSEGhbCjX3YS7vlK1FBI3K4WWYd47z.png",
    tag: "New"
  },
  {
    id: 3,
    name: "crazy-cattle-3d",
    display_name: "CRAZY CATTLE 3D", 
    image: "/images/crazy-cattle-3d-art.jpeg",
    tag: "Updated"
  },
  {
    id: 4,
    name: "racing-game",
    display_name: "Racing Game",
    image: "https://via.placeholder.com/300x300/4F46E5/ffffff?text=Racing+Game",
    tag: "Hot"
  }
]

export default function BottomGamesPanel({ randomGames, t }: BottomGamesPanelProps) {
  // 使用 API 数据或默认数据
  const games = randomGames.length > 0 ? randomGames.slice(0, 4) : defaultGames

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg mb-6 p-4">
      <h2 className="text-lg font-bold text-white mb-4">{t?.hero?.discoverMoreGames || "Discover More Games"}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {games.map((game, index) => (
          <Link
            key={`discover-${game.id || game.name}-${index}`}
            href={`/game/${game.name}`}
            className="group relative bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-all duration-300"
          >
            {/* Game Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <img
                src={game.image || `https://via.placeholder.com/300x300/6B7280/ffffff?text=${encodeURIComponent(game.display_name || game.name)}`}
                alt={game.display_name || game.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/300x300/6B7280/ffffff?text=${encodeURIComponent(game.display_name || game.name)}`;
                }}
              />
              
              {/* Tag Badge */}
              {game.tag && (
                <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg ${
                  game.tag === 'Hot' ? 'bg-red-500' : 
                  game.tag === 'New' ? 'bg-green-500' : 
                  game.tag === 'Updated' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  {game.tag}
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Game Info */}
            <div className="p-3">
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                {game.display_name || game.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">HTML5 Game</span>
                <span className="text-blue-400 hover:text-blue-300 font-semibold text-xs transition-colors">
                  Play Now →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}