import { language } from "./language";

// 这是首页的数据设计
export interface GameDetails {
    package: {
        url: string;
    };
    cover: string;
    category: string;
}

export interface PageContent {
    About: string;
    Gameplay: string;
    Features: string;
}

export interface HomeGameInfo {
    title: string;
    keywords: string;
    description: string;
    game: GameDetails;
    page_content: PageContent;
}

export type LangHomeInfo = language<HomeGameInfo>