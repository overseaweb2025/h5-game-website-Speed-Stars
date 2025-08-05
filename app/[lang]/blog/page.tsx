import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import BlogList from "@/components/blog/BlogList"
import { getDictionary } from "@/lib/lang/i18n"
import { Locale } from "@/lib/lang/dictionaraies"
export const metadata: Metadata = {
  title: "Speed Stars Blog | Game News, Tips & Updates",
  description:
    "Stay updated with the latest news, game tips, strategies, and announcements from Speed Stars. Your go-to source for all things HTML5 gaming!",
  keywords: "Speed Stars blog, game news, HTML5 gaming tips, game updates, unblocked games blog, game strategies",
  openGraph: {
    title: "Speed Stars Blog | Game News, Tips & Updates",
    description:
      "Stay updated with the latest news, game tips, strategies, and announcements from Speed Stars. Your go-to source for all things HTML5 gaming!",
    url: "https://speed-stars.net/blog",
    siteName: "Speed Stars",
    images: [
      {
        url: "https://speed-stars.net/images/blog-og.png",
        width: 1200,
        height: 630,
        alt: "Speed Stars Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  canonical: "https://speed-stars.net/blog",
}


export default async function BlogPage({params}: {params: Promise<{lang: string}>}) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);

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
              Speed Stars <span className="gradient-text">Official Blog</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto">
              Your official source for Speed Stars news, game strategies, and the latest in unblocked gaming!
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
