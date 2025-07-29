import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, GamepadIcon as GameController, StarIcon, UsersIcon, TrophyIcon, HeartIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | GameHub Central - Free HTML5 Games Platform",
  description:
    "Learn about GameHub Central, your premier destination for free HTML5 games. Discover our mission, team, and commitment to providing the best gaming experience.",
  keywords: "about GameHub Central, free games platform, HTML5 games, online games, gaming community",
  openGraph: {
    title: "About Us | GameHub Central - Free HTML5 Games Platform",
    description:
      "Learn about GameHub Central, your premier destination for free HTML5 games. Discover our mission, team, and commitment to providing the best gaming experience.",
    url: "https://speed-stars.net/about",
    siteName: "GameHub Central",
    images: [
      {
        url: "https://speed-stars.net/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About GameHub Central",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/about",
}

export default function AboutPage() {
  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-gray-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🎮</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          🕹️
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          ⭐
        </div>

        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8 flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-primary hover:text-primary-hover font-black text-lg group bg-white rounded-full px-6 py-3 shadow-cartoon border-4 border-primary cartoon-shadow transform hover:scale-110 hover:rotate-2 transition-all jello"
            >
              <ChevronLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 pop-in">
              About <span className="gradient-text">GameHub Central</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Your premier destination for free, unblocked HTML5 games
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            <div className="card cartoon-shadow border-4 border-primary transform hover:rotate-[1deg] transition-transform duration-300 pop-in">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-3xl md:text-4xl font-black text-primary text-stroke">Our Mission</h2>
              </div>
              <div className="text-gray-200 space-y-4">
                <p className="text-lg leading-relaxed">
                  At GameHub Central, we believe that everyone deserves access to high-quality entertainment. 
                  Our mission is to provide a vast collection of free HTML5 games that are accessible to 
                  players worldwide, regardless of their device or location.
                </p>
                <p className="text-lg leading-relaxed">
                  We're committed to creating a safe, fun, and inclusive gaming environment where players 
                  of all ages can discover new adventures, challenge themselves, and connect with others 
                  through the universal language of games.
                </p>
              </div>
            </div>

            <div className="card cartoon-shadow border-4 border-secondary transform hover:rotate-[-1deg] transition-transform duration-300 pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl md:text-4xl font-black text-secondary text-stroke">Our Vision</h2>
              </div>
              <div className="text-gray-200 space-y-4">
                <p className="text-lg leading-relaxed">
                  We envision GameHub Central as the go-to platform for instant gaming entertainment. 
                  Our goal is to eliminate barriers between players and great games by providing 
                  instant access without downloads, installations, or complicated setup processes.
                </p>
                <p className="text-lg leading-relaxed">
                  Through cutting-edge HTML5 technology and careful curation, we aim to deliver 
                  console-quality gaming experiences directly through your web browser, making 
                  gaming more accessible than ever before.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            <div className="card cartoon-shadow border-4 border-accent-3 text-center transform hover:scale-105 transition-transform pop-in">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-2xl font-black text-accent-3 mb-2">50+ Games</h3>
              <p className="text-gray-200">Carefully curated collection of premium HTML5 games</p>
            </div>
            <div className="card cartoon-shadow border-4 border-accent text-center transform hover:scale-105 transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-black text-accent mb-2">100K+ Players</h3>
              <p className="text-gray-200">Active gaming community from around the world</p>
            </div>
            <div className="card cartoon-shadow border-4 border-primary text-center transform hover:scale-105 transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-black text-primary mb-2">0 Downloads</h3>
              <p className="text-gray-200">Instant play - no installations or plugins required</p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 pop-in">
                Our <span className="gradient-text">Core Values</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                The principles that guide everything we do at GameHub Central
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card cartoon-shadow border-4 border-accent-2 text-center transform hover:rotate-[2deg] transition-transform pop-in">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-black text-accent-2 mb-2">Safety First</h3>
                <p className="text-gray-200 text-sm">All games are thoroughly tested and safe for players of all ages</p>
              </div>
              <div className="card cartoon-shadow border-4 border-accent-4 text-center transform hover:rotate-[-2deg] transition-transform pop-in" style={{ animationDelay: "0.1s" }}>
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-black text-accent-4 mb-2">Speed & Performance</h3>
                <p className="text-gray-200 text-sm">Lightning-fast loading times and smooth gameplay experience</p>
              </div>
              <div className="card cartoon-shadow border-4 border-secondary text-center transform hover:rotate-[2deg] transition-transform pop-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-xl font-black text-secondary mb-2">Global Access</h3>
                <p className="text-gray-200 text-sm">Available worldwide with no geographic restrictions</p>
              </div>
              <div className="card cartoon-shadow border-4 border-primary text-center transform hover:rotate-[-2deg] transition-transform pop-in" style={{ animationDelay: "0.3s" }}>
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-black text-primary mb-2">Quality Curation</h3>
                <p className="text-gray-200 text-sm">Hand-picked games that meet our high standards for fun and quality</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 pop-in">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <div className="card cartoon-shadow border-4 border-accent-3 max-w-4xl mx-auto transform hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="text-6xl mb-4">👨‍💻👩‍💻</div>
                <h3 className="text-2xl font-black text-white mb-4">Gaming Enthusiasts & Tech Experts</h3>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Our team consists of passionate gamers, experienced developers, and dedicated community managers 
                  who work tirelessly to bring you the best gaming experience possible. We're gamers ourselves, 
                  and we understand what makes a great game great.
                </p>
                <div className="flex justify-center space-x-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎮</div>
                    <p className="text-sm font-bold text-gray-200">Game Curators</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💻</div>
                    <p className="text-sm font-bold text-gray-200">Developers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-sm font-bold text-gray-200">Community Managers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="card cartoon-shadow border-4 border-primary max-w-3xl mx-auto transform hover:rotate-[1deg] transition-transform pop-in">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Play?</h2>
                <p className="text-lg text-gray-200 mb-6">
                  Join thousands of players who have already discovered the joy of gaming at GameHub Central. 
                  Start your adventure today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/games"
                    className="btn-primary text-xl jello"
                  >
                    Browse All Games
                  </Link>
                  <Link
                    href="/"
                    className="btn-secondary text-xl jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Start Playing Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}