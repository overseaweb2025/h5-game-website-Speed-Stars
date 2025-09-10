//这里是获取隐私政策的api 接口 用于渲染ISR 持续1个月的

import api from ".."
import { ApiResponse } from "../types"
import { public_writing } from "../types/Get/public_writing"

export const getLawPageValue = async (law:string, lang: string)=>{
    try {
        console.log('Requesting law page with parameter:', law);
        const response = await api.get<ApiResponse<public_writing>>('/api/v1/page',{
            params:{
                name:law,
                lang
            }
        });
        console.log('Law page API response:', response.data);
        return response;
    } catch (error) {
        console.error('Law page API error:', error);
        throw error;
    }
}