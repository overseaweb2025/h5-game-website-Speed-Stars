'use client'
import { useLangBlogDetails } from "@/hooks/LangBlogDetails_value"


export default function TestPage() {
  const {LangBlogDetails} = useLangBlogDetails()
  return (
    <>
     {LangBlogDetails && LangBlogDetails.zh.map(item=>{
      return (
        <div>
          <p>title: {item.title}</p> 
          <p>key  : {item.keywords}</p> 
        </div>
      )
     })}
    </>
  )
}