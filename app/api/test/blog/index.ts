import instance from ".."
import { ApiResponse } from "../../types"
import { blogDetails } from "../../types/Get/blog"

export const getBlogDetails  = (name:string,lang:string)=>{
    return instance.get<ApiResponse<blogDetails>>('/api/v1/post',{
        params:{
            name,lang
        }
    })
}
