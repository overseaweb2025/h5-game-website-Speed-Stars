'use client'
import { useLangBlogDetails } from "@/hooks/LangBlogDetails_value"
import { Locale } from "@/lib/lang/dictionaraies"
import BlogArticle from './BlogArticle' 
import { useEffect } from "react"
interface PropHero {
    lang:Locale
    slug:string
    t:any
}
const BlogHero = ({lang,slug,t}:PropHero)=>{
  const {getBlogDetailsFromCache,autoGetData} = useLangBlogDetails()
  const blog_Details = getBlogDetailsFromCache(lang,slug)
  useEffect(()=>{
    if(!blog_Details){
      autoGetData(lang,slug)
    }
  },[blog_Details])
  return (
    <BlogArticle lang={lang} t={t} slug={slug} blog_Details={blog_Details} />
  )
}
export default BlogHero