import { Play, Download, Trophy, Palette } from "lucide-react"
import Image from "next/image"

interface HowToPlayProps {
  t?: any;
}

export default function HowToPlay({ t }: HowToPlayProps = {}) {
  const steps = [
    {
      icon: <Play className="h-8 w-8" />,
      title: t?.howToPlay?.masterYourRhythm || "Master Your Rhythm",
      description: t?.howToPlay?.rhythmDescription || "Tap alternately to control your runner's legs and maintain perfect balance",
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: t?.howToPlay?.noDownloadsRequired || "No Downloads Required",
      description: t?.howToPlay?.noDownloadsDescription || "Play instantly in your browser - completely free and unblocked",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: t?.howToPlay?.customizeYourRunner || "Customize Your Runner",
      description: t?.howToPlay?.customizeDescription || "Choose from various outfits and colors to create your unique athlete",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: t?.howToPlay?.competeGlobally || "Compete Globally",
      description: t?.howToPlay?.competeDescription || "Race against players worldwide and climb the leaderboards",
    },
  ]

  return (
    <section id="how-to-play" className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-text mb-2">
            {t?.howToPlay?.howToPlay || "How to Play"}
          </h2>
          <p className="text-text/80 max-w-2xl mx-auto">
            {t?.howToPlay?.gettingStartedDescription || "Getting started with  is quick and easy - master these simple steps to become a champion"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-unblock-p6VNjFOpqJrZ4kQ34bOBw8sOIzYxF7.webp"
                alt={t?.howToPlay?.customizeYourRunner || " character customization screen showing outfit options and a colorful runner"}
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
            <p className="text-center text-sm text-text/70 mt-2">
              {t?.howToPlay?.customizeRunnerDetails || "Customize your runner with various outfits and colors to stand out on the track"}
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
