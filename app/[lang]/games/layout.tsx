import { Metadata } from "next"
import { getGamesCanonicalUrl } from "@/lib/seo-utils"
import { getDictionary } from "@/lib/lang/i18n"
import GamesLayoutClient from "./GamesLayoutClient"
import { Locale } from "@/lib/lang/dictionaraies"
interface PropMetadata {
  params: {
    lang: Locale;
  };
}
export async function generateMetadata({params }:PropMetadata): Promise<Metadata> {
  const { lang } = params; // 从 params 中解构 lang
  const canonicalUrl = `${process.env.CANONICAL_DOMAIN}/${lang}/games`

  const t = await getDictionary(lang as Locale);


  return {
    title: t.games.title,
    description:t.games.description ,
    keywords: t.games.keywords,
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
  params: { lang: Locale }
}) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  
  return <GamesLayoutClient t={t} lang={lang as Locale}>{children}</GamesLayoutClient>
}