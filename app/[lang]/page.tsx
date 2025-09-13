import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import NavigationArrow from "@/components/navigation-arrow";
import HomepageTestimonials from "@/components/homepage-testimonials";
import FAQ from "@/components/faq";
import { getDictionary } from "@/lib/lang/i18n";
import { Metadata } from "next";
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getGameHome } from "../api/game/index";
import { getCanonicalDomain } from "@/lib/seo-utils";
import { cache } from "react";

export const revalidate = 320;

const API_BASE_URL =
  process.env.NEXT_API_URL || "http://www.xingnengyun.com";

// 这个函数保持不变。在构建时，它内部的 fetch 会命中由 generateStaticParams 预热的缓存
const getCachedHomeData = cache(async (lang: string) => {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/index/show?lang=${lang}`,
    { next: { revalidate } }
  );
  console.log(
    `Fetching data for [${lang}]... Status: ${res.status}`
  );
  if (!res.ok) {
    // 当 API 错误时返回 null，避免构建中断
    return null;
  }
  return res.json();
});

// 这个函数保持不变
async function fetchHomeSEO(lang: string) {
  const FALLBACK = {
    title: "Free Game",
    description: "Free Game",
    keywords: "Free Game",
  };
  try {
    const json = await getCachedHomeData(lang);
    const d = json?.data ?? {};
    return {
      title: d.title,
      description: d.description,
      keywords: d.keywords,
    };
  } catch {
    return FALLBACK;
  }
}

// ==================================================================
// 核心改动在此函数中
// ==================================================================
export async function generateStaticParams() {
  const languages: Locale[] = localesArrary;

  // 在并行构建开始前，串行地预热所有语言的数据缓存
  // 这样可以避免因并发请求过多而导致 API 返回 429 错误
  console.log("Warming up data cache for all languages...");
  for (const lang of languages) {
    try {
      // 这里的 fetch 调用必须和 getCachedHomeData 内部的 fetch 调用
      // 在 URL 和 options 上完全一致，以便命中 Next.js 的数据缓存
      await fetch(`${API_BASE_URL}/api/v1/index/show?lang=${lang}`, {
        next: { revalidate },
      });
      console.log(`Cache warmed up successfully for language: ${lang}`);
    } catch (error) {
      // 如果某个语言预热失败，打印错误但不要中断整个构建过程
      console.error(`Failed to warm up cache for language ${lang}:`, error);
    }
  }
  console.log("All language caches have been warmed up.");

  // 最后，返回 Next.js 需要构建的页面语言参数
  return languages.map((lang) => ({ lang }));
}

// generateMetadata 函数保持不变
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const domain = getCanonicalDomain();

  const canonicalUrl = `${domain}/${lang}`;

  const homeData = await fetchHomeSEO(lang);
  return {
    title: homeData?.title,
    description: homeData?.description,
    keywords: homeData?.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: domain,
        zh: `${domain}/zh`,
        ru: `${domain}/ru`,
        es: `${domain}/es`,
        hi: `${domain}/hi`,
        fr: `${domain}/fr`,
        ja: `${domain}/ja`,
        ko: `${domain}/ko`,
        "x-default": domain,
      },
    },
    openGraph: {
      title: homeData?.title || "Free Game",
      description: homeData?.description,
      type: "website",
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: homeData?.title || "Free Game",
      description: homeData?.description,
    },
  };
}

// Home 页面组件保持不变
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);

  return (
    <main>
      <Header t={t} lang={lang as Locale} />
      <Hero t={t} lang={lang as Locale} />
      <HomepageTestimonials />
      {/* <FAQ t={t} /> */}
      <NavigationArrow isHomePage={true} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}