import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { blog_slug: string } }
) {

      const { blog_slug } = params;

  console.log('你好！我接受到了你的请求');
  console.log('WebSocket upgrade request received');

  const upgrade = request.headers.get('upgrade');
  
  if (upgrade?.toLowerCase() !== 'websocket') {
    return NextResponse.json(
      { message: '你好！我接受到了你的请求 - HTTP request received' },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { 
      message: 'WebSocket upgrade not supported in Next.js API routes. Use a separate WebSocket server.',
      info: '你好！我接受到了你的请求'
    },
    { status: 426 }
  );
}