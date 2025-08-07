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
  const [totalPages, setTotalPages] = useState(5) // 默认总页数
  const [loading, setLoading] = useState(false)
  const {LangBlog,updataLanguageByLang} = useLangBlog()
  const fetchBlogData = async (page: number) => {
    setLoading(true)

    try {
      const blogParams: postBlog = {
        directory: "/blog",
        per_page: '5',
        page: page.toString()
      }
      
      const response = await getPagration(blogParams,lang)
      console.log('打印数据',response.data.data )
      updataLanguageByLang(response.data.data,lang)
      // 如果response.data是数组，直接使用；如果是对象包含数组，需要相应调整
      const posts = Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : []
      setBlogPosts(posts)
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
      
      {blogPosts.length > 0 ? (
        <>
          <div className="space-y-6 md:space-y-8">
            {blogPosts.map((post, index) => (
              <div
                key={post.name || index}
                className="card p-6 md:p-8 border-4 border-primary rainbow-border shadow-cartoon-xl pop-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 hover:text-primary transition-colors">
                  <Link href={`/${lang}/blog/${post.name}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-200 mb-6 text-base md:text-lg leading-relaxed">{post.summary}</p>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-300 mb-6">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1.5 text-secondary" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/${lang}/blog/${post.name}`}
                  className="inline-flex items-center font-semibold text-primary hover:text-primary-hover transition-colors text-lg touch-target"
                >
                  {t?.blog?.readMore || "Read Full Article"} <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            ))}
          </div>
          
          <CustomPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">{t?.search?.noResults || "No blog data available"}</p>
        </div>
      )}
    </div>
  )
}