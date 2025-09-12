import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import BlogList from "@/components/blog/BlogList"
import { getDictionary } from "@/lib/lang/i18n"
import { Locale, localesArrary } from "@/lib/lang/dictionaraies"
import { getWebsite } from '@/app/api/website';
import { websiteUtill } from "@/lib/website/websiteUtill"
import { getGameHome } from "@/app/api/game"


interface BlogPageProps {
  params: {
    lang: Locale
  }
}
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const domain = process.env.CANONICAL_DOMAIN; // 您的网站域名
  const { lang } = params;

  // 使用 reduce 动态生成 languages 对象
  const alternateLanguages = localesArrary.reduce((acc, locale) => {
    // 确保 locale 和 domain 变量存在
    acc[locale] = `${domain}/${locale}/blog`;
    return acc;
  }, {} as Record<string, string>); // 加上类型断言以符合 TypeScript 要求
  const res = await getGameHome(lang)
  const homeData = res.data.data


  return {
    title: homeData.title,
    description: homeData?.description,
    keywords: homeData?.keywords,
    alternates: {
      // Canonical URL 应该包含语言路径
      canonical: `${domain}/${lang}/blog`,
      // 可选：设置多语言链接
      languages: {
        ...alternateLanguages,
        'x-default': `${domain}/en/blog`, // 'x-default' 通常作为备选，可以单独设置
      },
    },
  };
}


export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);
  const response = await getWebsite();
  const data = response.data.data;
  const siteName = websiteUtill(data, 'site-name')
  return (
    <main className="bg-background">
      <Header t={t} lang={lang as Locale} />
      <section className="section-padding bg-gray-900 relative overflow-hidden">
        {/* Decorative elements - Mobile optimized */}
        <div className="absolute top-4 left-4 md:top-10 md:left-10 text-4xl md:text-6xl opacity-10 pop-in">📰</div>
        <div
          className="absolute bottom-8 right-4 md:bottom-20 md:right-10 text-4xl md:text-6xl opacity-10 pop-in"
          style={{ animationDelay: "0.3s" }}
        >
          💡
        </div>
        <div
          className="absolute top-1/3 right-1/4 text-3xl md:text-5xl opacity-10 pop-in"
          style={{ animationDelay: "0.6s" }}
        >
          ✍️
        </div>

        <div className="container mx-auto container-padding">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black mb-4 pop-in text-white">
              <span className="gradient-text">{`${siteName} Official Blog`}</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto">
              {`Your official source for ${siteName} news, game strategies, and the latest in unblocked gaming!`}
            </p>
          </div>

          {/* API Blog Posts with Pagination */}
          <BlogList t={t} lang={lang as Locale} />


        </div>
      </section>

      <Footer t={t} lang={lang as Locale} />
    </main>
  )
}
