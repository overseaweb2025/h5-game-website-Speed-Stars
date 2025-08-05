import { language } from "./language";

// 基础游戏信息
export interface Game {
    category_name: string | undefined;
    description: string | undefined;
    image: string | undefined;
    url: string | undefined;
    iframe_src: string | undefined;
    id: number;
    name: string;
    display_name: string;
    package?: {
        url: string;
    };
    category?: CategorySEO;
    cover:string;
}

// 类别SEO信息
export interface CategorySEO {
    page_title: string;
    page_description: string;
    page_keywords: string;
}

// 分类游戏列表
export interface CategoryGameList {
    category_id: number;
    category_name: string;
    games: Game[];
}

export type GameList = CategoryGameList[];

// 面包屑导航项
export interface Breadcrumb {
    name: string;
    path: string;
    level: number;
}

// 游戏包信息
export interface GamePack {
    url: string;
}

// 游戏评分信息（解析rating字符串）
export interface GameRating {
    score: number;        // 评分数值，如 4.5
    votes: number;        // 投票数，如 2
    displayText: string;  // 原始显示文本，如 "4.5(2votes)"
}
export interface reviews_comment {
    user_name: string;
    rating: number;
    email: string;
    content: string;
    created_at: string;  // 评论创建时间，ISO格式
}
// 游戏详情的完整数据结构
export interface GameDetailsData {
    breadcrumbs: Breadcrumb[];
    page_title: string;
    page_description: string;
    page_keywords: string;
    display_name: string;
    package: GamePack;
    rating: string;           // 原始评分字符串，如 "4.5(2votes)"
    info: string;            // HTML格式的游戏介绍
    technology: string;      // 技术栈，如 "HTML5"
    platforms: string;       // 支持平台，如 "Browser (desktop, mobile)"
    released_at: string;     // 发布日期，ISO格式
    reviews: reviews_comment[];
    last_updated: string;    // 最后更新日期，ISO格式
    cover:string;
}

// API响应结构
export type GameDetailsResponse =GameDetailsData

// 扩展的游戏详情（包含解析后的数据，用于组件）
export interface ExtendedGameDetails extends GameDetailsData {
    iframe_src: any;
    url: any;
    // 解析后的评分信息
    parsedRating?: GameRating;
    
    // 格式化的日期
    formattedReleaseDate?: string;
    formattedUpdateDate?: string;
    
    // 面包屑相关的便捷方法
    categoryInfo?: {
        name: string;
        path: string;
    };
    
    // 游戏slug（从面包屑中提取）
    gameSlug?: string;
}

// 用于Hero组件的游戏数据格式
export interface HeroGameData {
    id: string;
    title: string;
    description: string;  // 这里是HTML格式的info
    image: string;
    category: string;
    iframeSrc: string;

    features?: string[];
    howToPlay?: string[];
}

export interface HomeGameData {
    data: {
        title:string,
        keywords: string,
        description: string,
        game: {
            package: {
                url: string;
            };
            cover:string;
            page_title: string;
            page_description: string;
            page_keywords: string;
            category: string;
        };
        page_content: {
            About: string;  // HTML格式的内容
            Features: string;
            Gameplay: string;
        };
    };
}

// 工具函数的类型定义
export type GameDetailsParser = {
    parseRating: (ratingString: string) => GameRating | null;
    formatDate: (dateString: string) => string;
    extractCategoryInfo: (breadcrumbs: Breadcrumb[]) => { name: string; path: string } | null;
    extractGameSlug: (breadcrumbs: Breadcrumb[]) => string | null;
    toHeroGameData: (details: GameDetailsData, slug: string) => HeroGameData;
    toExtendedDetails: (details: GameDetailsData) => ExtendedGameDetails;
    displayNameToTechnicalName: (displayName: string) => string;
};

// 向后兼容的类型别名
export interface Game_Category extends Breadcrumb {}











//----------------------------------------
//单个游戏的数据
export interface game {
    id:number,
    display_name:string,
    name:string,//相当与 slug 动态路由传递的值
    cover:string
}
//游戏list 中 的集合
export type games = game[]
//游戏list 中 分类游戏总和
export interface category {
    category_id:number,
    category_name:string,
    games:games
}

export type gamelist = category[]
//多语言版本的games 页面的列表数据
export type LangGameList = language<gamelist>
//----------------------------------------
//进入游戏页面后 所需要的游戏详情数据
export interface GameDetails {
  name:string;
  page_title: string;
  page_description: string;
  page_keywords: string;
  breadcrumbs: Breadcrumb[];
  display_name: string;
  cover: string;
  package: Package;
  rating: string;
  info: string;
  technology: string;
  platforms: string;
  reviews: Review[];
  released_at: string;
  last_updated: string;
}
export interface Breadcrumb {
  name: string;
  path: string;
  level: number;
}

export interface Package {
  url: string;
}

export interface Review {
  email: string;
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}
//多语言版本的游戏数据(详细数据 多个游戏数据)
export type LangGameData = language<GameDetails[]>

//---------------------------