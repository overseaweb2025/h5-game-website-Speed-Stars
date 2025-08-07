import api  from "..";
import { ApiResponse } from "../types";
import {blog, blogDetails} from '@/app/api/types/Get/blog'
import { postBlog } from "../types/Post/blog";
import { Locale } from "@/lib/lang/dictionaraies";
export const getPagration = (form: postBlog,lang:Locale = 'en') => {
    return api.get<ApiResponse<blog>>('/api/v1/post-list', { params: { ...form ,lang} });
}
export const getBlogDetails = async (name: string, lang: string) => {
    try {
        const response = await api.get<ApiResponse<blogDetails>>('/api/v1/post', {
            params: {
                name, lang
            }
        })
        return response
    } catch (error: any) {
        // 返回一个标准化的错误响应格式
        return {
            data: {
                data: null,
                message: error.response?.status === 404 ? 'Blog post not found' : 'Failed to fetch blog post',
                status: error.response?.status || 500
            }
        }
    }
}
