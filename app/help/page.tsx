"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, SearchIcon, HelpCircleIcon, BookOpenIcon, SettingsIcon, GamepadIcon, MonitorIcon, SmartphoneIcon } from "lucide-react"
import type { Metadata } from "next"

const metadata: Metadata = {
  title: "Help Center | GameHub Central - Gaming Support & FAQ",
  description:
    "Find answers to common questions about GameHub Central. Get help with games, technical issues, account management, and more.",
  keywords: "help center, gaming support, FAQ, troubleshooting, GameHub Central help",
  openGraph: {
    title: "Help Center | GameHub Central - Gaming Support & FAQ",
    description:
      "Find answers to common questions about GameHub Central. Get help with games, technical issues, account management, and more.",
    url: "https://speed-stars.net/help",
    siteName: "GameHub Central",
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/help",
}

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    description: "New to GameHub Central? Start here!",
    questions: [
      {
        question: "How do I start playing games?",
        answer: "Simply click on any game from our homepage or games page. No downloads or installations required - games load instantly in your browser!"
      },
      {
        question: "Do I need to create an account?",
        answer: "No account is required! All our games are free to play without registration. Just visit our site and start playing immediately."
      },
      {
        question: "Are all games really free?",
        answer: "Yes! Every game on GameHub Central is completely free. No hidden fees, subscriptions, or in-app purchases."
      }
    ]
  },
  {
    id: "technical-issues",
    title: "Technical Issues",
    icon: "🔧",
    description: "Troubleshooting and technical support",
    questions: [
      {
        question: "A game won't load or appears blank",
        answer: "Try refreshing the page first. If that doesn't work, clear your browser cache and cookies, then try again. Make sure you have a stable internet connection."
      },
      {
        question: "Games are running slowly or lagging",
        answer: "Close other browser tabs and applications to free up memory. Try using a different browser or updating your current browser to the latest version."
      },
      {
        question: "I'm getting an error message",
        answer: "Take a screenshot of the error message and contact our support team at support@speed-stars.net. Include details about your browser and operating system."
      },
      {
        question: "Audio is not working in games",
        answer: "Check your device's volume settings and make sure it's not muted. Some browsers require user interaction before playing audio - try clicking on the game first."
      }
    ]
  },
  {
    id: "device-compatibility",
    title: "Device Compatibility",
    icon: "📱",
    description: "Playing on different devices",
    questions: [
      {
        question: "Can I play on my mobile phone?",
        answer: "Yes! Our HTML5 games work on smartphones, tablets, and desktop computers. Games automatically adapt to your screen size."
      },
      {
        question: "Which browsers are supported?",
        answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated."
      },
      {
        question: "Do games work offline?",
        answer: "No, our games require an internet connection to load and play. However, once loaded, some games may continue to work if your connection is temporarily interrupted."
      }
    ]
  },
  {
    id: "gameplay",
    title: "Gameplay Help",
    icon: "🎮",
    description: "Game controls and strategies",
    questions: [
      {
        question: "How do I control the games?",
        answer: "Most games use arrow keys or WASD for movement, spacebar for jumping, and mouse clicks for actions. Specific controls are usually shown at the start of each game."
      },
      {
        question: "Can I save my game progress?",
        answer: "Progress saving depends on the individual game. Some games save automatically in your browser's local storage, while others reset when you reload the page."
      },
      {
        question: "How do I go fullscreen?",
        answer: "Look for a fullscreen button (usually in the corner of the game) or press F11 on your keyboard. You can exit fullscreen by pressing Escape."
      }
    ]
  }
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0 || searchTerm === "")

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const questionId = `${categoryId}-${questionIndex}`
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  return (
    <main className="bg-background">
      <Header />

      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🆘</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          💡
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          ❓
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
            <h1 className="text-4xl md:text-6xl font-black text-text mb-4 pop-in">
              Help <span className="gradient-text">Center</span>
            </h1>
            <p className="text-xl md:text-2xl text-text/80 max-w-3xl mx-auto">
              Find answers to common questions and get the help you need
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="card cartoon-shadow border-4 border-accent transform hover:scale-[1.02] transition-transform pop-in">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/60 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-text font-medium text-lg placeholder-text/60"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Link 
              href="/contact" 
              className="card cartoon-shadow border-4 border-primary text-center transform hover:rotate-[2deg] hover:scale-105 transition-all pop-in"
            >
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-lg font-black text-primary mb-2">Contact Support</h3>
              <p className="text-text/80 text-sm">Get personalized help from our team</p>
            </Link>

            <div className="card cartoon-shadow border-4 border-secondary text-center transform hover:rotate-[-2deg] hover:scale-105 transition-all pop-in" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-lg font-black text-secondary mb-2">Game Tutorials</h3>
              <p className="text-text/80 text-sm">Learn how to play our games</p>
            </div>

            <div className="card cartoon-shadow border-4 border-accent text-center transform hover:rotate-[2deg] hover:scale-105 transition-all pop-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="text-lg font-black text-accent mb-2">Troubleshooting</h3>
              <p className="text-text/80 text-sm">Fix common technical issues</p>
            </div>

            <div className="card cartoon-shadow border-4 border-accent-3 text-center transform hover:rotate-[-2deg] hover:scale-105 transition-all pop-in" style={{ animationDelay: "0.3s" }}>
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-black text-accent-3 mb-2">Community</h3>
              <p className="text-text/80 text-sm">Connect with other players</p>
            </div>
          </div>

          {/* Help Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={category.id} className="card cartoon-shadow border-4 border-accent-2 transform hover:scale-[1.01] transition-transform pop-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{category.icon}</div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-accent-2">{category.title}</h2>
                      <p className="text-text/80">{category.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.questions.map((qa, questionIndex) => {
                    const questionId = `${category.id}-${questionIndex}`
                    const isExpanded = expandedQuestion === questionId
                    
                    return (
                      <div key={questionIndex} className="border-2 border-accent-2/20 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(category.id, questionIndex)}
                          className="w-full px-6 py-4 text-left bg-gradient-to-r from-accent-2/10 to-primary/10 hover:from-accent-2/20 hover:to-primary/20 transition-colors flex items-center justify-between"
                        >
                          <span className="font-black text-text">{qa.question}</span>
                          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            ⌄
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-6 py-4 bg-white border-t-2 border-accent-2/20">
                            <p className="text-text/80 leading-relaxed">{qa.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {searchTerm && filteredCategories.every(cat => cat.questions.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-black text-text mb-4">No results found</h3>
              <p className="text-text/80 mb-6">
                We couldn't find any help topics matching "{searchTerm}". Try different keywords or contact our support team.
              </p>
              <Link href="/contact" className="btn-primary text-lg jello">
                Contact Support
              </Link>
            </div>
          )}

          {/* Still Need Help */}
          <div className="mt-16 text-center">
            <div className="card cartoon-shadow border-4 border-primary max-w-3xl mx-auto transform hover:rotate-[1deg] transition-transform pop-in">
              <div className="text-center">
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-3xl md:text-4xl font-black text-text mb-4">Still Need Help?</h2>
                <p className="text-lg text-text/80 mb-6">
                  Can't find what you're looking for? Our support team is here to help! 
                  We typically respond within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="btn-primary text-xl jello"
                  >
                    Contact Support
                  </Link>
                  <a
                    href="mailto:support@speed-stars.net"
                    className="btn-secondary text-xl jello"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Email Us Directly
                  </a>
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