import api from '../index'
import { ApiResponse } from '../types';
import { GameList,GameDetails, HomeGameData, gamelist } from '../types/Get/game';

export const getGameList = (lang?:string) => {

  return api.get<ApiResponse<gamelist>>('/api/v1/game/list');
}
//获取分类页的所有消息
export const getGameCategory = (category:string)=>{

  return api.get<ApiResponse<GameList>>('/api/v1/game/list',{params:{category}});
}
export const getGameDetails = (name: string) => {
  // Use local proxy route which handles fallback to local data
  return api.get<ApiResponse<GameDetails>>(`/api/v1/game`,{params:{name}});
}

//获取首页得信息
export const getGameHome = ()=>{
  return api.get<HomeGameData>('/api/v1/index/show')
}