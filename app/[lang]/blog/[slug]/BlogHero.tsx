import { Locale } from "@/lib/lang/dictionaraies"
import BlogArticle from './BlogArticle'
import { getBlogDetails } from "@/app/api/test/blog"

interface PropHero {
    lang: Locale
    slug: string
    t: any
}

const BlogHero = async ({ lang, slug, t }: PropHero) => {
  const res = await getBlogDetails(slug,lang)
  const blog_Details = res.data.data
  return (
    <BlogArticle lang={lang} t={t} slug={slug} blog_Details={blog_Details} />
  )
}

export default BlogHero