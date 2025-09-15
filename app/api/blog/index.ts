import api from "..";
import { ApiResponse } from "../types";
import { blog, blogDetails } from '@/app/api/types/Get/blog'
import { postBlog } from "../types/Post/blog";
import { Locale } from "@/lib/lang/dictionaraies";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_API_URL || 'http://www.xingnengyun.com'

export const getPagration = (form: postBlog, lang: Locale = 'en') => { // 如果以后项目更新了 /作为根目录 则加入 ''
    return api.get<ApiResponse<blog>>('/api/v1/post-list', {
        params: {
            directory: lang === 'en' ? '/blog' : `/${lang}/blog`,
            per_page: form.per_page,
            page: form.page
        }
    });
}
export const getBlogDetails = (slug: string, lang: Locale) => {
    const adress = `${API_BASE_URL}/api/v1/post`
    console.log('api axios 请求的参数路径', `${API_BASE_URL}/api/v1/post`)
    return axios.get<ApiResponse<blogDetails>>(adress, {
        params: {
            name: slug,
            lang: lang
        }
    })
}

