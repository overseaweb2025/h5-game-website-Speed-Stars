import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const envCheck = {
    googleId: !!process.env.GOOGLE_ID,
    googleSecret: !!process.env.GOOGLE_SECRET,
    nextauthUrl: !!process.env.NEXTAUTH_URL,
    nextauthSecret: !!process.env.NEXTAUTH_SECRET,
    nodeEnv: process.env.NODE_ENV,
    // Don't expose actual values, just whether they exist
    googleIdLength: process.env.GOOGLE_ID?.length || 0,
    googleSecretLength: process.env.GOOGLE_SECRET?.length || 0,
  }

  return NextResponse.json(envCheck)
}