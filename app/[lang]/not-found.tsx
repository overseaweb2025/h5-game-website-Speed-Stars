import Link from "next/link"
import type { Metadata } from "next"
import { getDictionary } from "@/lib/lang/i18n-client"
import { Locale } from "@/lib/lang/dictionaraies";

// 更新404页面的元数据

export const metadata: Metadata = {
  title: "Page Not Found | Speed Stars",
  description: "Oops! The page you are looking for does not exist.",
}

export default async function NotFound({params}: {params: Promise<{lang: Locale}> | {lang: Locale} | undefined}) {
  let lang: "en" | "zh" = "en"; // 默认语言
  
  try {
    if (params) {
      // 处理 Promise 或直接对象
      const resolvedParams = params instanceof Promise ? await params : params;
      lang = (resolvedParams?.lang as "en" | "zh") || "en";
    }
  } catch (error) {
    // 如果参数解析失败，使用默认语言
    lang = "en";
  }
  
  const t = await getDictionary(lang);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-gray-600/50">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🎮</div>
              <div className="text-lg font-medium">
                {t?.common?.loading || 'Loading...'}
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">{t?.notFound?.["404"] || "404"}</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">{t?.notFound?.pageNotFoundTitle || "Page Not Found"}</h2>
        <p className="text-text/80 mb-8 max-w-md mx-auto">
          {t?.notFound?.gameWanderedOff || "Oops! The game you're looking for seems to have wandered off to another level."}
        </p>
        <Link
          href="/"
          className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          {t?.notFound?.returnToHome || "Return to Home"}
        </Link>
      </div>
    </div>
  )
}
