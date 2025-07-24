import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "All Games | Speed Stars - Play Free Online HTML5 Games",
  description:
    "Browse and play all available free HTML5 games on Speed Stars. Discover exciting adventures like Speed Stars, Speed Stars 2, CRAZY CATTLE 3D, and more!",
  keywords: "all games, Speed Stars, Speed Stars 2, free games, HTML5 games, online games, CRAZY CATTLE 3D",
  openGraph: {
    title: "All Games | Speed Stars - Play Free Online HTML5 Games",
    description:
      "Browse and play all available free HTML5 games on Speed Stars. Discover exciting adventures like Speed Stars, Speed Stars 2, CRAZY CATTLE 3D, and more!",
    url: "https://speed-stars.net/games",
    siteName: "Speed Stars",
    images: [
      {
        url: "https://speed-stars.net/images/og-image.jpg", // Using the main site OG image
        width: 1200,
        height: 630,
        alt: "All Games on Speed Stars",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/games",
}

const allGamesData = [
  {
    slug: "speed-stars",
    title: "Speed Stars",
    description: "Master the rhythm in this physics-based sprinting game. Race against the clock and opponents!",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg",
    url: "/games/speed-stars",
    featured: true,
  },
  {
    slug: "speed-stars-2",
    title: "Speed Stars 2",
    description:
      "The ultimate evolution of physics-based racing! Enhanced graphics, new tracks, and exciting multiplayer modes await.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-2-150x150-DSEGhbCjX3YS7vlK1FBI3K4WWYd47z.png",
    url: "/games/speed-stars-2",
    featured: true,
  },
  {
    slug: "crazy-cattle-3d",
    title: "CRAZY CATTLE 3D",
    description: "Guide your herd through wacky 3D puzzles. A hilarious and challenging adventure!",
    image: "/images/crazy-cattle-3d-art.jpeg",
    url: "/games/crazy-cattle-3d",
    featured: false,
  },
  // Add more games here as they become available
]

export default function GamesPage() {
  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🎮</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          🕹️
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-text mb-4 pop-in">
              All Our <span className="gradient-text">Awesome Games</span>
            </h1>
            <p className="text-xl md:text-2xl text-text/80 max-w-3xl mx-auto">
              Dive into our collection of free, unblocked HTML5 games. Ready for some fun?
            </p>
          </div>

          {allGamesData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {allGamesData.map((game, index) => (
                <Link
                  href={game.url}
                  key={game.slug}
                  className={`card flex flex-col overflow-hidden hover:shadow-cartoon-xl transition-all transform hover:-rotate-1 pop-in ${game.featured ? "border-4 border-primary rainbow-border" : "border-4 border-transparent"}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-20 md:h-24 w-full">
                    <Image
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      fill
                      className="object-cover rounded-t-2xl" // Ensure top corners are rounded if card has rounded-3xl
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                    />
                  </div>
                  {game.featured && (
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-primary to-accent-3 rounded-full px-2 py-0.5 shadow-cartoon transform -rotate-2 jello z-10">
                      <span className="text-[8px] font-black text-white">Featured</span>
                    </div>
                  )}
                  <div className="p-1 flex flex-col flex-grow">
                    <h2 className="text-sm md:text-base font-bold text-text mb-1 hover:text-primary transition-colors line-clamp-2">
                      {game.title}
                    </h2>
                    <p className="text-xs md:text-sm text-text/70 mb-2 flex-grow leading-relaxed line-clamp-3">{game.description}</p>
                    <div className="mt-auto pt-1 border-t border-gray-200/50">
                      <span className="inline-flex items-center font-semibold text-primary hover:text-primary-hover transition-colors text-xs md:text-sm">
                        Play Now <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="No games available"
                width={300}
                height={200}
                className="mx-auto mb-6 opacity-70"
              />
              <h2 className="text-3xl font-bold text-text mb-4">Game Zone Under Construction!</h2>
              <p className="text-text/80 max-w-md mx-auto mb-6">
                We're busy adding more awesome games. Check back soon for new adventures!
              </p>
            </div>
          )}

          <div className="text-center mt-12 md:mt-16">
            <Link href="/#game-frame" className="btn-primary text-xl md:text-2xl jello">
              Play Speed Stars Now!
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
