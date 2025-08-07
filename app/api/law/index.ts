//这里是获取隐私政策的api 接口 用于渲染ISR 持续1个月的

import api from ".."
import { ApiResponse } from "../types"
import { public_writing } from "../types/Get/public_writing"

export const getLawPageValue = (law:string)=>{
    return api.get<ApiResponse<public_writing>>('/api/v1/page',{
        params:{
            name:law
        }
    })
}