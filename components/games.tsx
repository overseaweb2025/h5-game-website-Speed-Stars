import Image from "next/image"
import Link from "next/link"
import { gamesData } from "@/data/games/games-data"

export default function Games() {

  return (
    <section id="explore-games" className="py-16 bg-white relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-20 left-10 text-6xl text-accent pop-in">⭐</div>
      <div className="absolute top-40 right-20 text-4xl text-primary pop-in" style={{ animationDelay: "0.3s" }}>
        ✨
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-text mb-4 pop-in">
            Explore More <span className="gradient-text">Games</span>
          </h2>
          <p className="text-text/80 max-w-2xl mx-auto text-lg">
            Discover our collection of fun and engaging HTML5 games for all ages
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {gamesData.map((game, index) => (
            <Link
              href={game.url}
              key={index}
              className={`card hover:scale-105 hover:rotate-1 transition-all cursor-pointer relative ${game.featured ? "border-8 border-primary rainbow-border" : ""} pop-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-36 w-full mb-3 rounded-xl overflow-hidden">
                <Image
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Category badge display removed */}
                {game.featured && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-accent-3 rounded-full px-4 py-2 shadow-cartoon transform -rotate-3 jello">
                    <span className="text-sm font-black text-white">Featured</span>
                  </div>
                )}
                {!game.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg px-4 py-2 bg-primary/80 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold mb-1.5">{game.title}</h3>
              <p className="text-sm text-text/80">{game.description}</p>
              
              {/* 🌟 star only for the first card */}
              {index === 0 && (
                <div className="absolute bottom-2 right-2 text-5xl text-secondary pop-in" style={{ animationDelay: "0.6s" }}>
                  🌟
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
