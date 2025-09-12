import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import NavigationArrow from "@/components/navigation-arrow";
import HomepageTestimonials from "@/components/homepage-testimonials";
// import FAQ from "@/components/faq"
import { getDictionary } from "@/lib/lang/i18n";
import type { Metadata } from "next";
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getGameHome } from "../api/game/index";
import { getCanonicalDomain } from "@/lib/seo-utils";

export const revalidate = 320; // ISR：避免每次都打外部接口

// 只在极少路径进行 SSG（按你的语言表）
export async function generateStaticParams() {
  const languages: Locale[] = localesArrary;
  return languages.map((lang) => ({ lang }));
}

// 判断是否在构建期（尽量保守，不同平台都安全）
function isBuildTime() {
  // Next.js 官方在构建阶段会注入 NEXT_PHASE=phase-production-build
  return process.env.NEXT_PHASE === "phase-production-build";
}

// 安全获取首页 SEO 数据：构建期或失败时返回兜底，运行时正常请求
async function safeGetHomeSEO(lang: string) {
  const FALLBACK = {
    title: "Free Game",
    description: "Free Game",
    keywords: "Free Game",
  };

  // 构建阶段：不要打外部请求，直接兜底，避免 429 失败卡死构建
  if (isBuildTime()) return FALLBACK;

  try {
    const res = await getGameHome(lang);
    const homeData = res?.data?.data;
    return {
      title: homeData?.title || FALLBACK.title,
      description: homeData?.description || FALLBACK.description,
      keywords: homeData?.keywords || FALLBACK.keywords,
    };
  } catch {
    // 外部接口 429/失败：兜底，但不让构建失败
    return FALLBACK;
  }
}

export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  const { lang } = params;
  const domain = getCanonicalDomain(); // e.g., https://game-players.com
  const canonicalUrl = `${domain}/${lang}`;

  const seo = await safeGetHomeSEO(lang);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${domain}/en`,
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
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: lang,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function Home(
  { params }: { params: { lang: string } }
) {
  const { lang } = params;
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
