import { Metadata } from "next";
import { gameDetailsParser} from "@/lib/game-utils";
import { getGameDetails } from "@/app/api/gameList";
import { getGameCanonicalUrl } from "@/lib/seo-utils";
import { getDictionary } from "@/lib/lang/i18n";
import GamePageClient from "./GamePageClient";

// 生成动态元数据 - 简化版，避免服务器端API调用错误
export async function generateMetadata(
  { params }: { params: { slug: string; lang: string } }
): Promise<Metadata> {
  const slug = params.slug || 'game';
  
  // 使用slug生成基础元数据，避免API调用错误
  const gameName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const canonicalUrl = getGameCanonicalUrl(slug);
  
  return {
    title: `${gameName} - Free Online Game`,
    description: `Play ${gameName} online for free. Enjoy this exciting browser game with no downloads required.`,
    keywords: `${gameName}, online game, free game, browser game, no download`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${gameName} - Free Online Game`,
      description: `Play ${gameName} online for free. Enjoy this exciting browser game with no downloads required.`,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${gameName} - Free Online Game`,
      description: `Play ${gameName} online for free. Enjoy this exciting browser game with no downloads required.`,
    }
  };
}

export default async function GamePage({ params }: { params: { slug: string; lang: string } }) {
  const lang = params.lang as "en" | "zh";
  const t = await getDictionary(lang);
  return <GamePageClient slug={params.slug} t={t} />;
}
