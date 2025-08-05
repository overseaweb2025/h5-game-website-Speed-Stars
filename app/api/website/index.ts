import api  from "..";
import { ApiResponse } from "../types";
import { website } from "../types/Get/website";
export const getWebsite = ()=>{

    return api.get<ApiResponse<website>>('/api/v1/site')
}