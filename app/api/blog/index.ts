import api  from "..";
import { ApiResponse } from "../types";
import {blog, blogDetails} from '@/app/api/types/Get/blog'
import { postBlog } from "../types/Post/blog";
import { Locale } from "@/lib/lang/dictionaraies";
export const getPagration = (form: postBlog,lang:Locale = 'en') => { // 如果以后项目更新了 /作为根目录 则加入 ''
    return api.get<ApiResponse<blog>>('/api/v1/post-list', { params: { 
        directory:lang === 'en' ? '/blog' : `/${lang}/blog`,
        per_page:form.per_page,
        page:form.page
    } });
}
export const getBlogDetails =  (name: string, lang: Locale) => {
    const path = lang === 'en' ? `/blog/${name}` : `/${lang}/blog/${name}`
   return api.get<ApiResponse<blogDetails>>('/api/v1/post',{params:{
    name:path
   }})
}
