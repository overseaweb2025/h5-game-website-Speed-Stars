"use client"

import React from 'react'

// Simple game data with images
const gameData = [
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
  },
  {
    id: 5,
    name: "puzzle-adventure",
    display_name: "Puzzle Adventure",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Puzzle+Game"
    tag: "New"
  },
  {
    id: 6,
    name: "action-hero", 
    display_name: "Action Hero",
    image: "https://via.placeholder.com/300x300/DC2626/ffffff?text=Action+Hero"
    tag: "Updated"
  }
]

const SimpleGameCards = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🎮 Game Collection
      </h2>
      
      {/* Game Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {gameData.map((game) => (
          <div 
            key={game.id}
            className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
          >
            {/* Game Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <img
                src={game.image || '/placeholder-game.jpg'}
                alt={game.display_name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/300x300/6B7280/ffffff?text=${encodeURIComponent(game.display_name)}`;
                }}
              />
              
              {/* Tag Badge */}
              {game.tag && (
                <div className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg ${
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
                <button className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:scale-110 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Game Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                {game.display_name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HTML5 Game</span>
                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors">
                  Play Now →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl">
          Load More Games
        </button>
      </div>
    </div>
  )
}

export default SimpleGameCards