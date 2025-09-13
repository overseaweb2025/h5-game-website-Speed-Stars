import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import NavigationArrow from "@/components/navigation-arrow"
import HomepageTestimonials from "@/components/homepage-testimonials"
import FAQ from "@/components/faq"
import { getDictionary } from "@/lib/lang/i18n"
import { Metadata } from "next"
import { Locale, localesArrary } from "@/lib/lang/dictionaraies"
import { getGameHome } from "../api/game/index"
import { getCanonicalDomain } from "@/lib/seo-utils"

export const revalidate = 320;

const API_BASE_URL = process.env.NEXT_API_URL || 'http://www.xingnengyun.com';

async function fetchHomeSEO(lang: string) {
  const FALLBACK = { title: 'Free Game', description: 'Free Game', keywords: 'Free Game' };
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/index/show?lang=${lang}`, { next: { revalidate } });
    console.log(res)
    const json = await res.json();
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

export async function generateStaticParams() {
  const languages: Locale[] = localesArrary;
  const params: { lang: Locale }[] = [];

  // 为每种语言调用一次 API
  for (const lang of languages) {
    params.push({ lang });
  }

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const domain = getCanonicalDomain()
  

  const canonicalUrl = `${domain}/${lang}`

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
        "x-default": domain
      }
    },
    openGraph: {
      title: homeData?.title || 'Free Game',
      description: homeData?.description,
      type: 'website',
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: homeData?.title || 'Free Game',
      description: homeData?.description,
    }
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
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
  )
}
