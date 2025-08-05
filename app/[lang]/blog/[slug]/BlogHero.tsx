'use client'
import { useLangBlogDetails } from "@/hooks/LangBlogDetails_value"
import { Locale } from "@/lib/lang/dictionaraies"
import BlogArticle from './BlogArticle' 
interface PropHero {
    lang:Locale
    slug:string
    t:any
}
const BlogHero = ({lang,slug,t}:PropHero)=>{
  const {getBlogDetailsFromCache} = useLangBlogDetails()
  const blog_Details = getBlogDetailsFromCache(lang,slug)

  return (
    <BlogArticle lang={lang} t={t} slug={slug} blog_Details={blog_Details} />
  )
}
export default BlogHero