import { Zap, Globe, Clock, Award, Shield, Smartphone } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Physics-Based Mechanics",
      description: "Feel every step and lean with realistic physics that impact your success",
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Play Anywhere",
      description: "Free online and unblocked - play directly in your browser on any device",
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Replay System",
      description: "Analyze your performance and improve your strategy with slow-motion replays",
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: "Global Leaderboards",
      description: "Compete with players worldwide and represent your country",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Two-Player Mode",
      description: "Challenge a friend in intense head-to-head races",
    },
    {
      icon: <Smartphone className="h-10 w-10" />,
      title: "Mobile Optimized",
      description: "Perfectly designed for touch controls and mobile screens",
    },
  ]

  return (
    <section id="features" className="py-8 md:py-12 bg-white relative overflow-hidden">
      {/* Decorative game controllers */}
      <div className="absolute top-10 right-10 text-6xl opacity-20 rotate-12">🎮</div>
      <div className="absolute bottom-10 left-10 text-8xl opacity-20 -rotate-12">🕹️</div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-text mb-4 font-black pop-in">
            Amazing <span className="gradient-text">Features</span>
          </h2>
          <p className="text-text/80 max-w-2xl mx-auto">
            Speed Stars combines minimalistic yet beautiful visual design with satisfying physics-based movement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:border-8 hover:border-primary transition-all hover:rotate-1 pop-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="game-icon mb-4 inline-flex transform hover:rotate-12 transition-transform swing">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-text/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
