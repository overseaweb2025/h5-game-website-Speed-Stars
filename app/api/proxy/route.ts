import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 })
  }

  // 验证目标 URL 是否有效
  try {
    new URL(targetUrl)
  } catch (urlError) {
    console.error('Invalid target URL:', targetUrl, urlError)
    return NextResponse.json({ 
      error: 'Invalid target URL format', 
      details: urlError instanceof Error ? urlError.message : 'Unknown URL error',
      receivedUrl: targetUrl
    }, { status: 400 })
  }

  try {
    // Request logging removed for production
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-Proxy/1.0)',
      },
    })

    // Response status logging removed for production
    
    if (!response.ok) {
      const errorText = await response.text()
      // Error response logging removed for production
      return NextResponse.json(
        { error: `Target server error: ${response.status}`, details: errorText }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    // Response data logging removed for production

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 })
  }

  // 验证目标 URL 是否有效
  try {
    new URL(targetUrl)
  } catch (urlError) {
    console.error('Invalid target URL:', targetUrl, urlError)
    return NextResponse.json({ 
      error: 'Invalid target URL format', 
      details: urlError instanceof Error ? urlError.message : 'Unknown URL error',
      receivedUrl: targetUrl
    }, { status: 400 })
  }

  try {
    // POST request logging removed for production
    
    const body = await request.json()
    const authHeader = request.headers.get('authorization')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; NextJS-Proxy/1.0)',
    }
    
    // 传递认证头
    if (authHeader) {
      headers.Authorization = authHeader
    }
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    // POST response status logging removed for production
    
    if (!response.ok) {
      const errorText = await response.text()
      // POST error response logging removed for production
      return NextResponse.json(
        { error: `Target server error: ${response.status}`, details: errorText }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    // POST response data logging removed for production

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    // POST error logging removed for production
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}