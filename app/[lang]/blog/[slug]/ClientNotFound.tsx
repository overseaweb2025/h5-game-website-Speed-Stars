'use client'
import Link from "next/link"
import { Locale } from "@/lib/lang/dictionaraies"

interface ClientNotFoundProps {
  params: Locale | undefined
  t?: any
}

export default function ClientNotFound({ params, t }: ClientNotFoundProps) {
  const lang = params || "en"
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-gray-600/50">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🎮</div>
              <div className="text-lg font-medium">
                {t?.common?.loading || 'Loading...'}
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">{t?.notFound?.["404"] || "404"}</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">{t?.notFound?.pageNotFoundTitle || "Page Not Found"}</h2>
        <p className="text-text/80 mb-8 max-w-md mx-auto">
          {t?.notFound?.gameWanderedOff || "Oops! The game you're looking for seems to have wandered off to another level."}
        </p>
        <Link
          href="/"
          className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          {t?.notFound?.returnToHome || "Return to Home"}
        </Link>
      </div>
    </div>
  )
}