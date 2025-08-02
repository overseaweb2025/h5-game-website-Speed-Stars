import api from '../index'
import { ApiResponse } from '../types';
import { GameList } from '../types/Get/game';

// 从gamelist API中提取所有游戏数据，仅返回games部分
export const getPages = async () => {
  try {
    // 获取完整的游戏分类列表
    const response = await api.get<ApiResponse<GameList>>('/api/v1/game/list');
    
    // 从所有分类中提取游戏数据
    const allGames = response.data.data
      .filter(category => category.games && category.games.length > 0) // 过滤掉空分类
      .flatMap(category => category.games) // 合并所有游戏
    
    // 返回只包含游戏数据的响应
    return {
      ...response,
      data: {
        ...response.data,
        data: allGames // 只返回游戏数组，不包含分类信息
      }
    };
  } catch (error) {
    // Error fetching pages from gamelist - silently handled
    throw error;
  }
}

// 根据游戏名称获取单个游戏
export const getPageByName = async (gameName: string) => {
  try {
    const response = await getPages();
    const game = response.data.data.find(game => game.name === gameName);
    
    if (!game) {
      throw new Error(`Game with name "${gameName}" not found`);
    }
    
    return {
      ...response,
      data: {
        ...response.data,
        data: game
      }
    };
  } catch (error) {
    // Error fetching game - silently handled
    throw error;
  }
}

// 获取所有游戏的slug（name字段）用于静态页面生成
export const getAllGameSlugsFromAPI = async (): Promise<string[]> => {
  try {
    const response = await getPages();
    return response.data.data.map(game => game.name);
  } catch (error) {
    // Error fetching game slugs - silently handled
    return [];
  }
}

// 获取游戏数据，转换为适合静态页面的格式
export const getGameDataForStaticPage = async (gameName: string) => {
  try {
    const response = await getPageByName(gameName);
    const game = response.data.data;
    
    // 转换为静态页面需要的格式
    return {
      id: game.id,
      name: game.name,
      title: game.display_name,
      description: `Play ${game.display_name} online for free!`,
      image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(game.display_name)}&bg=4a9eff&color=white`,
      url: `/games/${game.name}`,
      featured: false,
      available: true,
      iframeSrc: `https://example.com/games/${game.name}/`, // 需要根据实际情况调整
      howToPlay: [
        "Click to start the game.",
        "Follow the on-screen instructions.",
        "Have fun playing!"
      ],
      features: [
        "Free to play online",
        "No download required",
        "Mobile friendly",
        "High quality graphics"
      ]
    };
  } catch (error) {
    // Error getting game data - silently handled
    return null;
  }
}