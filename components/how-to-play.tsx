import { Play, Download, Trophy, Palette } from "lucide-react"
import Image from "next/image"

export default function HowToPlay() {
  const steps = [
    {
      icon: <Play className="h-8 w-8" />,
      title: "Master Your Rhythm",
      description: "Tap alternately to control your runner's legs and maintain perfect balance",
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "No Downloads Required",
      description: "Play instantly in your browser - completely free and unblocked",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Customize Your Runner",
      description: "Choose from various outfits and colors to create your unique athlete",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Compete Globally",
      description: "Race against players worldwide and climb the leaderboards",
    },
  ]

  return (
    <section id="how-to-play" className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-text mb-2">
            How to <span className="text-primary">Play</span>
          </h2>
          <p className="text-text/80 max-w-2xl mx-auto">
            Getting started with Speed Stars is quick and easy - master these simple steps to become a champion
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-unblock-p6VNjFOpqJrZ4kQ34bOBw8sOIzYxF7.webp"
                alt="Speed Stars character customization screen showing outfit options and a colorful runner"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
            <p className="text-center text-sm text-text/70 mt-2">
              Customize your runner with various outfits and colors to stand out on the track
            </p>
          </div>

          <div className="md:w-1/2">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start" id={`step-${index + 1}`}>
                  <div className="game-icon mr-4 flex-shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                    <p className="text-text/80">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
