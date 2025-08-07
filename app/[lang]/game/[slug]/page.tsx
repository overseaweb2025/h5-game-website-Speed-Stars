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
export const revalidate = 120;

export async function generateStaticParams() {
    const languages: Locale[] = localesArrary;
    const params: { slug: string; lang: Locale }[] = [];

    // 为每种语言调用一次 API
    for (const lang of languages) {
        const res = await getGameList(lang);
        const gamelist = res.data.data;
        gamelist.map(catogry=>{
          catogry.games.map(item=>{
            params.push({slug:item.name,lang})
          })
        })
    }

    return params;
}

export async function generateMetadata({params}: {params: Promise<{lang: Locale,slug:string}>}): Promise<Metadata> {
  const { lang,slug } = await params
  try {
    // Fetch home game data for SEO metadata
    const res = await getGameDetails(slug, lang)
    const homeData = res.data.data

    console.log('GameDetialsData',homeData)
    return {
      title: homeData.page_title,
      description: homeData.page_description,
      keywords: homeData.page_keywords,
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
      keywords: "speed stars, racing game, online game"
    }
  }
}



export default async function GamePage({ params }: { params: { slug: string; lang: Locale } }) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  return <GamePageClient slug={params.slug} lang={lang} t={t}/>;
}
