'use client'
import { Locale } from "@/lib/lang/dictionaraies"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { getBlogDetails } from "@/app/api/blog"
import { useLangBlogDetails } from "@/hooks/LangBlogDetails_value"
 const blogNavigation = ({lang,t,slug}:{lang:Locale,t:any,slug:string})=>{
    const {updateLangBlogDetails,LangBlogDetails} = useLangBlogDetails()
    useEffect(()=>{
        getBlogDetails(slug,lang).then(res=>{
            updateLangBlogDetails(res.data.data,lang)
        })
    },[])
    return (
        <>
         <div className="pt-2 pb-4 md:pt-20 md:pb-8">
          <div className="container mx-auto px-4">
            <Link 
              href={`/${lang}/blog`} 
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold group transition-all duration-200 text-sm md:text-base"
            >
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="truncate">{t?.blog?.backToBlog}</span>
            </Link>
          </div>
        </div>
        </>
    )
}

export default blogNavigation