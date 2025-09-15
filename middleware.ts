import { NextRequest, NextResponse } from "next/server";
import {localesArrary} from '@/lib/lang/dictionaraies'
let locales = localesArrary;
let defaultLocale = "en";

// ============================
// --- 1. 配置区域 ---
// ============================



export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查路径是否已经包含支持的语言 (e.g., /en/products)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // --- 路径已包含语言 ---
  if (pathnameHasLocale) {
    // 【重要修正】
    // 即使用户直接访问带语言的 URL，我们也需要设置 Cookie，以记住他的偏好
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    
    // 只有当 Cookie 不存在或与当前语言不匹配时才设置
    if (request.cookies.get("preferred-language")?.value !== locale) {
      response.cookies.set("preferred-language", locale, {
        maxAge: 30 * 24 * 60 * 60, // 30天
        path: "/",
        sameSite: "lax",
      });
    }
    
    return response;
  }

  // --- 路径不包含语言，需要进行处理 ---

  // 获取最合适的语言
  const locale = getLocale(request);

  // 处理根目录 '/'
  if (pathname === "/") {
    // 使用 REWRITE，保持 URL 简洁
    const response = NextResponse.rewrite(new URL(`/${locale}`, request.url));
    response.cookies.set("preferred-language", locale, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
    response.headers.set('Vary', 'Accept-Language, Cookie');
    return response;
  }

  // 处理其他所有路径 (e.g., /products)
  // 必须使用 REDIRECT，让语言成为 URL 的一部分
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("preferred-language", locale, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

// ============================
// --- 3. 辅助函数 ---
// ============================

/**
 * 根据请求确定最佳语言环境。
 * 优先级: Cookie > Accept-Language Header > 默认值
 */
function getLocale(request: NextRequest): string {
  const cookieLang = request.cookies.get("preferred-language")?.value;
  if (cookieLang && locales.includes(cookieLang)) {
    return cookieLang;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocale = parseAcceptLanguage(acceptLanguage);
    if (preferredLocale && locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

/**
 * 解析 Accept-Language 头部字符串，返回最匹配的语言。
 */
function parseAcceptLanguage(acceptLanguage: string): string | null {
  const languages = acceptLanguage
    .split(",")
    .map((langPart) => {
      const [code, qStr] = langPart.trim().split(";q=");
      const quality = qStr ? parseFloat(qStr) : 1.0;
      return { code: code.toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (locales.includes(code)) return code;
    const prefix = code.split("-")[0];
    if (locales.includes(prefix)) return prefix;
  }

  return null;
}

// ============================
// --- 4. 中间件配置 ---
// ============================

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};