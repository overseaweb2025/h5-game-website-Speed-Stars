import Image from "next/image"

interface SpeedStarsSectionProps {
  t?: any;
}

export default function SpeedStarsSection({ t }: SpeedStarsSectionProps = {}) {
  return (
    <section id="about" className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-text mb-2 text-5xl font-black leading-none">
            About <span className="text-primary"></span>
          </h2>
          <p className="text-text/80 max-w-3xl mx-auto text-lg">
             is a dynamic track and field game that puts players in the fast lane of short-distance sprints. The game offers a satisfying mix of precision, timing, and high-speed thrills with various running competitions of different distances, rewarding skill and practice.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl mb-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg"
                alt=" racing game showing colorful runners on a track in a stadium"
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
              />
            </div>
            <h3 className="text-xl font-bold text-center text-text mb-3">
              : Race, Rank, and Reach the Champion!
            </h3>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-3 text-text">
               Unblocked - Play Free Online
            </h3>
            <p className="mb-3 text-text/80">
               isn't your typical racing game. It's a physics-based sprinting experience packed with humor, intensity, and quirky challenges. As you take control of a wobbly-legged athlete, your mission is to run as fast as possible without tripping over yourself — easier said than done!
            </p>
            <p className="mb-4 text-text/80">
              The awkward movement mechanics and ragdoll animations create endless laugh-out-loud moments, making each race a blend of skill and pure chaos. Available completely free online,  Unblocked can be played on any device without restrictions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
