import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import type { Metadata } from "next"
import { CalendarDays, MessageSquare, ArrowRight, User, Clock, TrendingUp } from "lucide-react"
import { blogPosts } from "@/data/blog/blog-data"
import { getDictionary } from "@/lib/lang/i18n"

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

export default async function BlogPage({params}: {params: {lang: string}}) {
  const lang = params.lang as "en" | "zh";
  const t = await getDictionary(lang);
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const trendingPosts = blogPosts.filter((post) => post.trending)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <main className="bg-background">
      <Header t={t} />

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

          {/* Trending Posts Section - Mobile optimized */}
          {trendingPosts.length > 0 && (
            <div className="mb-8 md:mb-12">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-primary mr-2" />
                <h2 className="text-2xl md:text-3xl font-black text-white">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {trendingPosts.slice(0, 3).map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="card hover:scale-105 transition-all pop-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-3">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-200 mb-4 text-sm md:text-base line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-300">
                      <div className="flex items-center">
                        <User className="h-3 w-3 md:h-4 md:w-4 mr-1 text-secondary" />
                        <span className="truncate">{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 text-accent-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured Posts Section - Mobile optimized */}
          {featuredPosts.length > 0 && (
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Featured Articles</h2>
              <div className="space-y-6 md:space-y-8">
                {featuredPosts.map((post, index) => (
                  <div
                    key={post.slug}
                    className="card p-6 md:p-8 border-4 border-primary rainbow-border shadow-cartoon-xl pop-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="mb-4">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-gray-200 mb-6 text-base md:text-lg leading-relaxed">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-300 mb-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1.5 text-secondary" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1.5 text-secondary" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1.5 text-accent" />
                        {post.comments} Comments
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-accent-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center font-semibold text-primary hover:text-primary-hover transition-colors text-lg touch-target"
                    >
                      Read Full Article <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts Grid - Mobile optimized */}
          {regularPosts.length > 0 && (
            <div className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6">Latest Articles</h2>
              <div className="mobile-grid">
                {regularPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="card hover:scale-105 transition-all pop-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-3">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-200 mb-4 text-sm md:text-base line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-300 mb-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-3 w-3 md:h-4 md:w-4 mr-1 text-secondary" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 text-accent-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm md:text-base">Read More</span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Signup - Mobile optimized */}
          <div className="card p-6 md:p-8 bg-gradient-to-r from-primary/10 to-accent-3/10 border-4 border-accent text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
              Stay Updated with Official Speed Stars News!
            </h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Get the latest game updates, strategy guides, and exclusive content delivered straight to your inbox. Join
              thousands of Speed Stars fans!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full border-2 border-primary/30 focus:border-primary focus:outline-none text-sm md:text-base"
              />
              <button className="btn-primary px-6 md:px-8 py-3 whitespace-nowrap touch-target">Subscribe Now!</button>
            </div>
          </div>
        </div>
      </section>

      <Footer t={t} />
    </main>
  )
}
