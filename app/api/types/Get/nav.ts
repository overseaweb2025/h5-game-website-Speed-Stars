import { language } from "./language";

//顶部导航栏 类别 （多语言里面的属性 不是data.top_navigation）
export interface top_navigation{
    url:string;
    text:string;
    icon:string;
}
//底部导航栏
export interface footer_nav {
    block:string;
    content:contentMessage[];
}
//底部导航栏content 信息
export interface contentMessage {
    text:string;
    href:string;
}
//集合封装到一起
export interface languageNav {
    top_navigation:language<top_navigation[]> 
    footer_nav:language<footer_nav[]>
}

