import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import { getDictionary } from "@/lib/lang/i18n"
import HelpClient from "./HelpClient"

export const metadata: Metadata = {
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


export default async function HelpPage({params}: {params: {lang: string}}) {
  const lang = params.lang as "en" | "zh";
  const t = await getDictionary(lang);

  return (
    <main className="bg-background">
      <Header t={t} />

      <section className="py-12 md:py-16 bg-gray-900 relative overflow-hidden">
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
              className="inline-flex items-center text-primary hover:text-primary-hover font-black text-lg group bg-gray-900 rounded-full px-6 py-3 shadow-cartoon border-4 border-primary cartoon-shadow transform hover:scale-110 hover:rotate-2 transition-all jello"
            >
              <ChevronLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 pop-in">
              Help <span className="gradient-text">Center</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              Find answers to common questions and get the help you need
            </p>
          </div>

          <HelpClient t={t} />
        </div>
      </section>

      <Footer t={t} />
    </main>
  )
}