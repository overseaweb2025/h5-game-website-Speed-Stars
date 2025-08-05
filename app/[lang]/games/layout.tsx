import { Metadata } from "next"
import { getGamesCanonicalUrl } from "@/lib/seo-utils"
import { getDictionary } from "@/lib/lang/i18n"
import {Locale} from '@/lib/lang/dictionaraies'
import GamesLayoutClient from "./GamesLayoutClient"

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = getGamesCanonicalUrl()
  
  return {
    title: "Free Online Games - Speed Stars",
    description: "Play hundreds of free online games including action, puzzle, sports, and racing games. No downloads required, play instantly in your browser!",
    keywords: "free online games, browser games, HTML5 games, action games, puzzle games, sports games, racing games, speed stars",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Free Online Games - Speed Stars",
      description: "Play hundreds of free online games including action, puzzle, sports, and racing games. No downloads required, play instantly in your browser!",
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: "Free Online Games - Speed Stars",
      description: "Play hundreds of free online games including action, puzzle, sports, and racing games. No downloads required, play instantly in your browser!",
    }
  }
}

export default async function GamesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  
  return <GamesLayoutClient t={t} lang={lang}>{children}</GamesLayoutClient>
}