import { Metadata } from "next";
import { getDictionary } from "@/lib/lang/i18n";
import GamePageClient from "./GamePageClient";
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getGameDetails, getGameList } from "@/app/api/game/index";
// 为 generateMetadata 和页面组件定义明确的参数类型
interface PageParams {
  lang: Locale;
  slug: string;
}
//ISR 优化
export const revalidate = 240;

export async function generateStaticParams() {
  const languages: Locale[] = localesArrary
  const res = await getGameList("en"); // 假设获取任意语言的列表即可
  const gameListResponse  = res.data.data
  const Slugs:string[] = []
  gameListResponse.map(gamelist=>{
    if(gamelist.games.length>0)
    gamelist.games.map(game=>{
      Slugs.push(game.name)
    })
  })
  const params = [];

  for (const lang of languages) {
    for (const slug of Slugs)
    params.push({ slug, lang });
  }
  
  return params;
}
export async function generateMetadata({params}: {params: Promise<{lang: Locale,slug:string}>}): Promise<Metadata> {
  const { lang,slug } = await params
    const canonicalUrl = `${process.env.CANONICAL_DOMAIN}/${lang}/game/${slug}`

  try {
    // Fetch home game data for SEO metadata
    const res = await getGameDetails(slug, lang)
    const homeData = res.data.data

    return {
      title: homeData.page_title || "Speed Stars - Racing Game",
      description: homeData.page_description || "Play Speed Stars racing game online",
      keywords: homeData.page_keywords || "speed stars, racing game, online game",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title:  homeData.page_title,
        description: homeData.page_description,
        type: 'website',
        locale: lang,
      },
      twitter: {
        card: 'summary_large_image',
        title: homeData.page_title,
        description: homeData?.page_description,
      }
    }
  } catch (error) {
    // Fallback metadata if API fails
    return {
      title: "Speed Stars - Racing Game",
      description: "Play Speed Stars racing game online",
      keywords: "speed stars, racing game, online game",
      alternates: {
        canonical: canonicalUrl,
      },
    }
  }
}



export default async function GamePage({ params }: { params: { slug: string; lang: Locale } }) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  return <GamePageClient slug={params.slug} lang={lang} t={t}/>;
}
