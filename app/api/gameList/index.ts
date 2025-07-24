import api from '../index'

export const getGameList = async () => {

  try {
    const response = await api.get('/gameList');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch game list');
  }
}