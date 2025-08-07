import { language } from "./language";

//blog 页面 list 数据展示
export interface blog {
    title:string;
    summary:string;
    name:string
}

//blog 内页详情
export interface blogDetails {
    name:string;
    title:string;
    description:string;
    keywords:string;
    summary:string;
    content:string;
    alternate:string[]
    editor:{
        name:string;
    }
    published_at:string;
}

//blog 页面 缓存扩展  多条 多语言下的数据
export type LangBlog = language<blog[]> 
//多语言数据详情
export type LangBlogDetails = language<blogDetails[]> 
