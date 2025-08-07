import { NextRequest, NextResponse } from "next/server";
import {localesArrary} from '@/lib/lang/dictionaraies'
let locales = localesArrary;
let defaultLocale = "en";

// ISR 缓存控制头部
const ISR_CACHE_HEADERS = {
  // 缓存5分钟，stale-while-revalidate 60秒
  'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
  // ISR 标识
  'X-ISR-Cache': 'enabled'
}

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  // 1. 首先检查 URL 查询参数 (优先级最高)
  const { searchParams } = request.nextUrl;
  const paramLang = searchParams.get('lang');
  if (paramLang && locales.includes(paramLang as any)) {
    return paramLang;
  }

  // 2. 检查 Cookie 中的语言设置
  const cookieLang = request.cookies.get('preferred-language')?.value;
  if (cookieLang && locales.includes(cookieLang as any)) {
    return cookieLang;
  }

  // 3. 解析 Accept-Language 头部 (最后的回退选项)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // 解析 Accept-Language 头部，获取最匹配的语言
    const preferredLocale = parseAcceptLanguage(acceptLanguage);
    if (preferredLocale && locales.includes(preferredLocale as any)) {
      return preferredLocale;
    }
  }
  
  return defaultLocale;
}

// 解析 Accept-Language 头部的辅助函数
function parseAcceptLanguage(acceptLanguage: string): string | null {
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qStr] = lang.trim().split(';q=');
      const quality = qStr ? parseFloat(qStr) : 1;
      return { code: code.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality); // 按质量值排序

  for (const { code } of languages) {
    // 检查完整语言代码
    if (locales.includes(code as any)) {
      return code;
    }
    
    // 检查语言代码前缀 (如 zh-CN -> zh)
    const prefix = code.split('-')[0];
    if (locales.includes(prefix as any)) {
      return prefix;
    }
  }
  
  return null;
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  
  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径已包含语言代码，添加 ISR 缓存头
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    
    // 检查是否是需要 ISR 优化的页面
    if (isISROptimizedRoute(pathname)) {
      // 添加 ISR 缓存控制头
      Object.entries(ISR_CACHE_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      // 添加语言信息到头部
      const currentLocale = extractLocaleFromPath(pathname);
      if (currentLocale) {
        response.headers.set('X-Current-Language', currentLocale);
      }
      
      console.log(`[ISR Middleware] Applied caching headers to ${pathname}`);
    }
    
    return response;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en/products
  
  const response = NextResponse.redirect(request.nextUrl);
  
  // 设置语言偏好 Cookie (有效期30天)
  response.cookies.set('preferred-language', locale, {
    maxAge: 30 * 24 * 60 * 60, // 30 天
    path: '/',
    sameSite: 'lax'
  });
  
  return response;
}

// 检查是否是需要 ISR 优化的路由
function isISROptimizedRoute(pathname: string): boolean {
  const isrRoutes = [
    /^\/[a-z]{2}\/$/,                    // 首页: /en/, /zh/ 等
    /^\/[a-z]{2}\/games$/,               // 游戏列表页
    /^\/[a-z]{2}\/games\/c\/[^\/]+$/,    // 游戏分类页
    /^\/[a-z]{2}\/game\/[^\/]+$/,        // 游戏详情页
    /^\/[a-z]{2}\/blog$/,                // 博客列表页
    /^\/[a-z]{2}\/blog\/[^\/]+$/,        // 博客详情页
  ];
  
  return isrRoutes.some(pattern => pattern.test(pathname));
}

// 从路径中提取语言代码
function extractLocaleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})\//);
  return match ? match[1] : null;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, and static files
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};