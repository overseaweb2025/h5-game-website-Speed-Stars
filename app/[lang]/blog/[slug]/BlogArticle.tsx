import BlogNavigation from './Navigation'
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import BlogHeader from '@/app/[lang]/blog/[slug]/Header'
import { Locale } from "@/lib/lang/dictionaraies";
import { BlogPost } from "@/data/blog/blog-data";
import { blogDetails } from "@/app/api/types/Get/blog";
import ClientNotFound from './ClientNotFound';
interface PropBlog{
    lang:Locale
    t:any
    slug:string
    blog_Details:blogDetails | null | undefined
}

const BlogArticle=({lang,t,slug,blog_Details}:PropBlog)=>{
    if(blog_Details === null || blog_Details === undefined) return <ClientNotFound params={lang as Locale} t={t} />

    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        
        {/* Navigation */}
      <BlogNavigation lang={lang} t={t} slug={slug} />

        <main className="container mx-auto px-4 pb-6 md:pb-12">
          <article className="max-w-4xl mx-auto">
            
            {/* Article Header */}
           <BlogHeader blogDetails={blog_Details}/>
            
           
            
            
            {/* Back to Blog */}
            <div className="text-center mt-6 md:mt-12">
              <Link 
                href={`/${lang}/blog`} 
                className="inline-flex items-center px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
              >
                <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="truncate">{t?.blog?.backToAllPosts}</span>
              </Link>
            </div>
            
          </article>
        </main>
      </div>
    )
}



export default BlogArticle