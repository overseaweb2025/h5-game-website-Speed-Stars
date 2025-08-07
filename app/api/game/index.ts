import api from '../index'
import { ApiResponse } from '../types';
import { GameList,GameDetails, HomeGameData, gamelist, Game } from '../types/Get/game';

export const getGameList = (lang?:string) => {

  return api.get<ApiResponse<gamelist>>('/api/v1/game/list',{
    params:{
      lang
    }
  });
}
//获取分类页的所有消息
export const getGameCategory = (category:string)=>{

  return api.get<ApiResponse<GameList>>('/api/v1/game/list',{params:{category}});
}
export const getGameDetails = (name: string,lang:string = 'en') => {
  // Use local proxy route which handles fallback to local data
  return api.get<ApiResponse<GameDetails>>(`/api/v1/game`,{params:{name,lang}});
}

//按类获取数据
export const getClassNameGames = (category:string,lang:string = 'en')=>{
  return api.get<ApiResponse<Game[]>>('/api/v1/game/list',{
    params:{
    category,lang   
    }
  })
}

//获取首页得信息
export const getGameHome = (lang:string = 'en')=>{
  return api.get<HomeGameData>('/api/v1/index/show',{
    params:{
      lang
    }
  })
}