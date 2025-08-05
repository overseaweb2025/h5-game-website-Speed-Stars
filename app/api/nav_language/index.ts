import api from '..'
import { ApiResponse } from '../types'
import { languageNav } from '../types/Get/nav'
export const getNavLanguage = ()=>{
    return api.get<ApiResponse<languageNav>>('/api/v1/navigation')
}