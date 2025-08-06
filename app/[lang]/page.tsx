import Header from "@/components/header"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import NavigationArrow from "@/components/navigation-arrow"
import HomepageTestimonials from "@/components/homepage-testimonials"
import FAQ from "@/components/faq"
import { getDictionary } from "@/lib/lang/i18n"
import { fetchHomeGameData, extractSEOFromHomeData } from "@/lib/server-api"
import { Metadata } from "next"
import { Locale } from "@/lib/lang/dictionaraies"
export async function generateMetadata({params}: {params: Promise<{lang: string}>}): Promise<Metadata> {
  const { lang } = await params
  
  try {
    // Fetch home game data for SEO metadata
    const homeData = await fetchHomeGameData()
    const seoData = extractSEOFromHomeData(homeData)

    console.log('homedata',homeData)
    return {
      title: homeData?.data.title,
      description: homeData?.data.description,
      keywords: homeData?.data.keywords,
      openGraph: {
        title:  homeData?.data.title,
        description: homeData?.data.description,
        type: 'website',
        locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: homeData?.data.title,
        description: homeData?.data.description,
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

export default async function Home({params}: {params: Promise<{lang: string}>}) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);

  return (
    <main>
      <Header t={t} lang={lang as Locale}/>
      <Hero t={t} lang={lang as Locale} />
      <HomepageTestimonials />
      <FAQ t={t} />
      <NavigationArrow isHomePage={true} />
      <Footer t={t}  lang={lang as Locale}/>
    </main>
  )
}
