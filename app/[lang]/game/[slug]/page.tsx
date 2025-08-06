import { Metadata } from "next";
import { getDictionary } from "@/lib/lang/i18n";
import GamePageClient from "./GamePageClient";
import { Locale } from "@/lib/lang/dictionaraies";
import { getGameDetails } from "@/app/api/test/game/index";
import { title } from "process";
import { Description } from "@radix-ui/react-toast";
// 为 generateMetadata 和页面组件定义明确的参数类型
interface PageParams {
  lang: Locale;
  slug: string;
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug, lang } = params;
  
  try {
    const res = await getGameDetails(slug, lang);
    const gameDetails = res.data
    console.log('获取的多语言SEO 数据',gameDetails)
    if (!gameDetails) {
      return {
        title: 'Game Not Found',
        description: 'The requested game could not be found.',
      };
    }

    return {
      title: gameDetails.page_title || gameDetails.display_name || slug,
      description: gameDetails.page_description || `Play ${gameDetails.display_name || slug} online`,
      keywords: gameDetails.page_keywords || `${gameDetails.display_name || slug}, game, online, play`,
      openGraph: {
        title: gameDetails.page_title || gameDetails.display_name || slug,
        description: gameDetails.page_description || `Play ${gameDetails.display_name || slug} online`,
        images: gameDetails.cover ? [
          {
            url: gameDetails.cover,
            width: 800,
            height: 600,
            alt: gameDetails.display_name || slug,
          }
        ] : undefined,
        type: 'website',
        locale: lang === 'en' ? 'en_US' : lang,
        siteName: 'Speed Stars',
      },
      twitter: {
        card: 'summary_large_image',
        title: gameDetails.page_title || gameDetails.display_name || slug,
        description: gameDetails.page_description || `Play ${gameDetails.display_name || slug} online`,
        images: gameDetails.cover ? [gameDetails.cover] : undefined,
      },
      alternates: {
        canonical: `/${lang}/game/${slug}`,
        languages: {
          'en': `/en/game/${slug}`,
          'es': `/es/game/${slug}`,
          'fr': `/fr/game/${slug}`,
          'ja': `/ja/game/${slug}`,
          'ko': `/ko/game/${slug}`,
          'ru': `/ru/game/${slug}`,
          'hi': `/hi/game/${slug}`,
          'vi': `/vi/game/${slug}`,
          'tl': `/tl/game/${slug}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Speed Stars - Game',
      description: 'Play online games at Speed Stars',
    };
  }
}


export default async function GamePage({ params }: { params: { slug: string; lang: Locale } }) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  return <GamePageClient slug={params.slug} lang={lang} t={t}/>;
}
