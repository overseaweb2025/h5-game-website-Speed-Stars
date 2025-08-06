// @/app/api/test/game/index.ts

import { Locale } from "@/lib/lang/dictionaraies";

export const getGameDetails = async (slug: string, lang: Locale) => {
  const API_BASE_URL = process.env.NEXT_API_URL;
  
  if (!API_BASE_URL) {
    throw new Error('Server configuration error: NEXT_API_URL is missing.');
  }
  
  const url = `${API_BASE_URL}/api/v1/game?name=${slug}&lang=${lang}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 这一行是关键！它会禁用 Next.js 的请求缓存
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error in getGameDetails:', error);
    throw error;
  }
};