import { NextResponse } from 'next/server';
// 假设你有一个函数来清除服务器端的缓存
import { clearServerCache } from '@/lib/server-cache/index'; 

export async function DELETE() {
  console.log('API 路由已收到删除请求。');
  
  try {
    // 假设这是清除服务器缓存的逻辑
    await clearServerCache();
    console.log('服务器端缓存已清除。');
    
    return NextResponse.json({
      message: '服务器端的删除操作已完成。',
      status: 'success'
    });
  } catch (error) {
    console.error('服务器端删除操作失败:', error);
    return NextResponse.json({
      message: '服务器端删除操作失败。',
      status: 'error'
    }, { status: 500 });
  }
}