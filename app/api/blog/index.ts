import api  from "..";
import { ApiResponse } from "../types";
import {blog, blogDetails} from '@/app/api/types/Get/blog'
import { postBlog } from "../types/Post/blog";
export const getPagration = (form: postBlog) => {
    return api.get<ApiResponse<blog>>('/api/v1/post-list', { params: { ...form } });
}
export const getBlogDetails  = (name:string,lang:string)=>{
    return api.get<ApiResponse<blogDetails>>('/api/v1/post',{
        params:{
            name,lang
        }
    })
}
