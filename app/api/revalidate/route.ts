// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { localesArrary } from '@/lib/lang/dictionaraies';

// 验证请求的密钥，防止恶意清除缓存
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function GET(request: NextRequest) {
  // 从请求头中获取密钥
  const secret = request.headers.get('x-revalidate-secret');
  const path = request.nextUrl.searchParams.get('path');

  // 1. 检查密钥是否匹配
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // 2. 检查路径是否提供
  if (!path) {
    return NextResponse.json({ message: 'Missing path parameter' }, { status: 400 });
  }

  try {
    // 3. 清除指定路径的缓存
    for(const lang of localesArrary){
        revalidatePath(lang +'/'+ path);
    }
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}