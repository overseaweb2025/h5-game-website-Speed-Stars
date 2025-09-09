"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarDays, ArrowRight } from "lucide-react"
import CustomPagination from "@/components/ui/custom-pagination"
import { getPagration } from "@/app/api/blog/index"
import { postBlog } from "@/app/api/types/Post/blog"
import { blog } from "@/app/api/types/Get/blog"
import { useLangBlog } from "@/hooks/LangBlog_value"
import { Locale } from "@/lib/lang/dictionaraies"

interface BlogListProps {
  t: any
  lang: Locale
}

export default function BlogList({ t, lang }: BlogListProps) {
  const [blogPosts, setBlogPosts] = useState<blog[]>([])
  const [currentPage, setCurrentPage] = useState(1) // 默认页码8
  const [totalPages, setTotalPages] = useState(1) // 默认总页数
  const [loading, setLoading] = useState(false)
  const {LangBlog,updataLanguageByLang} = useLangBlog()
  const fetchBlogData = async (page: number) => {
    setLoading(true)

    try {
      const blogParams: postBlog = {
        directory: "/blog",
        per_page: '12',
        page: page.toString()
      }
      
      const response = await getPagration(blogParams,lang)
      updataLanguageByLang(response.data.data,lang)
      // 如果response.data是数组，直接使用；如果是对象包含数组，需要相应调整
      const posts = Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : []
      setBlogPosts(posts)

      if (response.data?.meta?.total) {
        setTotalPages(Math.ceil(response.data?.meta?.total / 12))
      }
    } catch (error) {
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  // 初始加载页面8的数据
  useEffect(() => {

    fetchBlogData(1)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchBlogData(page)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">{t?.common?.loading || "Loading..."}</div>
      </div>
    )
  }

  return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-black text-white mb-6">{t?.blog?.latestArticles }</h2>
          <div className="space-y-4 md:space-y-8">
            {blogPosts.map((post, index) => (
              <div
                key={post.name || index}
                className="card p-4 sm:p-6 md:p-8 border-4 border-primary rainbow-border shadow-cartoon-xl pop-in max-h-[260px] sm:max-h-none overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-2 sm:mb-4 hover:text-primary transition-colors line-clamp-2 leading-tight">
                  <Link href={`/${lang}/blog/${post.name}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3">{post.summary}</p>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs sm:text-sm text-gray-300 mb-3 sm:mb-6">
                  {/* <div className="flex items-center">
                    <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-secondary" />
                    <span className="text-xs sm:text-sm">{new Date().toLocaleDateString()}</span>
                  </div> */}
                </div>
                <Link
                  href={`/${lang}/blog/${post.name}`}
                  className="inline-flex items-center font-semibold text-primary hover:text-primary-hover transition-colors text-sm sm:text-base md:text-lg touch-target"
                >
                  {t?.blog?.readMore || "Read Full Article"} <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                </Link>
              </div>
            ))}
          </div>
          {blogPosts.length <=0 && 
            <div className="text-center py-12">
               <p className="text-gray-400 text-lg">{t?.search?.noResults || "No blog data available"}</p>
            </div>
            }
          <CustomPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange}
          />      
    </div>
  )
}