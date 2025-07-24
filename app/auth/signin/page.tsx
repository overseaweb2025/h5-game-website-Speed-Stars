"use client"

import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon, LogInIcon } from "lucide-react"
import type { Metadata } from "next"

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
      setLoading(false)
    }
    fetchProviders()
  }, [])

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return '🔍'
      case 'github':
        return '🐙'
      default:
        return '🔑'
    }
  }

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
      case 'github':
        return 'from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black'
      default:
        return 'from-primary to-primary-hover hover:from-primary-hover hover:to-primary'
    }
  }

  if (loading) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="card cartoon-shadow border-4 border-primary p-8 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl font-black text-text">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <section className="py-12 md:py-16 bg-white relative overflow-hidden min-h-screen flex items-center">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-10 pop-in">🔐</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 pop-in" style={{ animationDelay: "0.3s" }}>
          🎮
        </div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-15 pop-in" style={{ animationDelay: "0.6s" }}>
          🚀
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

          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-text mb-4 pop-in">
                Sign In to <span className="gradient-text">GameHub Central</span>
              </h1>
              <p className="text-lg text-text/80">
                Connect with your favorite gaming platform
              </p>
            </div>

            <div className="card cartoon-shadow border-4 border-primary transform hover:scale-[1.02] transition-transform pop-in">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-2xl font-black text-primary">Choose Your Login Method</h2>
                <p className="text-text/80 mt-2">Quick and secure authentication</p>
              </div>

              <div className="space-y-4">
                {providers && Object.values(providers).map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    className={`w-full bg-gradient-to-r ${getProviderColor(provider.id)} text-white font-black py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-cartoon border-4 border-white flex items-center justify-center space-x-3 jello`}
                    style={{ animationDelay: `${Object.keys(providers).indexOf(provider.id) * 0.1}s` }}
                  >
                    <span className="text-2xl">{getProviderIcon(provider.id)}</span>
                    <span className="text-lg">Continue with {provider.name}</span>
                    <LogInIcon className="w-5 h-5" />
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                <p className="text-sm text-text/60">
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-black text-text text-center mb-4">Why Sign In?</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="card cartoon-shadow border-4 border-secondary text-center transform hover:rotate-[1deg] transition-transform pop-in" style={{ animationDelay: "0.4s" }}>
                  <div className="text-3xl mb-2">💾</div>
                  <h4 className="font-black text-secondary mb-1">Save Your Progress</h4>
                  <p className="text-sm text-text/80">Keep your high scores and achievements</p>
                </div>
                <div className="card cartoon-shadow border-4 border-accent text-center transform hover:rotate-[-1deg] transition-transform pop-in" style={{ animationDelay: "0.5s" }}>
                  <div className="text-3xl mb-2">🏆</div>
                  <h4 className="font-black text-accent mb-1">Compete with Friends</h4>
                  <p className="text-sm text-text/80">Share scores and challenge others</p>
                </div>
                <div className="card cartoon-shadow border-4 border-accent-3 text-center transform hover:rotate-[1deg] transition-transform pop-in" style={{ animationDelay: "0.6s" }}>
                  <div className="text-3xl mb-2">🌟</div>
                  <h4 className="font-black text-accent-3 mb-1">Personalized Experience</h4>
                  <p className="text-sm text-text/80">Get game recommendations just for you</p>
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