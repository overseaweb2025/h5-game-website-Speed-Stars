import React from 'react'

const BasicGameGrid = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Featured Games</h3>
      
      {/* Game Cards Container - This is the main div box you requested */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Game Card 1 - Speed Stars */}
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer aspect-square">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg"
            alt="Speed Stars"
            className="w-full h-full object-cover"
          />
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">Speed Stars</h4>
          </div>
        </div>
        
        {/* Game Card 2 - Speed Stars 2 */}
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer aspect-square">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-2-150x150-DSEGhbCjX3YS7vlK1FBI3K4WWYd47z.png"
            alt="Speed Stars 2"
            className="w-full h-full object-cover"
          />
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">Speed Stars 2</h4>
          </div>
        </div>
        
        {/* Game Card 3 - Crazy Cattle 3D */}
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer aspect-square">
          <img 
            src="/images/crazy-cattle-3d-art.jpeg"
            alt="Crazy Cattle 3D"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/300x300/6B7280/ffffff?text=Crazy+Cattle+3D";
            }}
          />
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">Crazy Cattle 3D</h4>
          </div>
        </div>
        
        {/* Game Card 4 - Racing Game */}
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer aspect-square">
          <img 
            src="https://via.placeholder.com/300x300/4F46E5/ffffff?text=Racing+Game"
            alt="Racing Game"
            className="w-full h-full object-cover"
          />
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">Racing Game</h4>
          </div>
        </div>
        
        {/* Game Card 5 - Puzzle Adventure */}
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer aspect-square">
          <img 
            src="https://via.placeholder.com/300x300/059669/ffffff?text=Puzzle+Game"
            alt="Puzzle Adventure"
            className="w-full h-full object-cover"
          />
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">Puzzle Adventure</h4>
          </div>
        </div>
        
        {/* Game Card 6 - Action Hero */}
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer aspect-square">
          <img 
            src="https://via.placeholder.com/300x300/DC2626/ffffff?text=Action+Hero"
            alt="Action Hero"
            className="w-full h-full object-cover"
          />
          <div className="p-3">
            <h4 className="text-white font-bold text-sm">Action Hero</h4>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default BasicGameGrid