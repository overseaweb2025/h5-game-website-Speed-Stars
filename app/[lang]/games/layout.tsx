import { Metadata } from "next"
import { getGamesCanonicalUrl } from "@/lib/seo-utils"
import { getDictionary } from "@/lib/lang/i18n"
import GamesLayoutClient from "./GamesLayoutClient"
import { Locale } from "@/lib/lang/dictionaraies"
import { getGameHome } from "@/app/api/game"

interface PropMetadata {
  params: {
    lang: Locale;
  };
}
export async function generateMetadata({ params }: PropMetadata): Promise<Metadata> {
  const { lang } = params; // 从 params 中解构 lang
  const canonicalUrl = `${process.env.CANONICAL_DOMAIN}/${lang}/games`

  const res = await getGameHome(lang)
  const homeData = res.data.data
  return {
    title: homeData.title,
    description: homeData?.description,
    keywords: homeData?.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: homeData?.title,
      description: homeData?.description,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: homeData?.title,
      description: homeData?.description,
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