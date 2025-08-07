// app/[lang]/category/[category]/page.tsx
import { Metadata } from "next";
import { getDictionary } from "@/lib/lang/i18n";
import CategoryPageClient from './CategoryPageClient';
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getClassNameGames, getGameList } from "@/app/api/game/index";

// 验证分类 slug 是否有效
function isValidCategorySlug(slug: string): boolean {
  // 排除无效的分类名称
  if (!slug || slug.trim() === '') return false;
  
  // 排除以点开头的分类（如 .io）
  if (slug.startsWith('.')) return false;
  
  // 排除包含特殊字符的分类
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(slug)) return false;
  
  // 排除过短的分类名
  if (slug.length < 2) return false;
  
  // 排除包含空格但可能导致URL问题的分类
  if (slug.includes(' ') && slug.length > 20) return false;
  
  return true;
}

// 为页面组件和 generateMetadata 定义明确的参数类型
interface CategoryPageProps {
  params: {
    lang: Locale;
    category: string;
  };
}

// ISR 优化：设置重新验证时间
export const revalidate = 120;

// 暂时禁用静态生成以避免构建时的速率限制问题
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // 在构建时返回空数组，使用动态生成
  return [];
}

// 页面组件，负责在服务器端获取数据并传递给客户端组件
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, lang } = params;

  // 验证分类是否有效
  if (!isValidCategorySlug(category)) {
    // 返回404或重定向到游戏列表页面
    throw new Error(`Invalid category: ${category}`);
  }

  // 获取多语言字典
  const t = await getDictionary(lang);
  
  try {
    // 优化点：在页面组件内部获取数据
    const res = await getClassNameGames(category, lang);
    const gamelist = res.data.data;
    return (
      <CategoryPageClient 
        category={category} 
        t={t} 
        games={gamelist} 
      />
    );
  } catch (error: any) {
    // 处理API错误，特别是429错误
    if (error.response?.status === 429) {
      console.warn(`Rate limited for category ${category}, returning empty games list`);
      return (
        <CategoryPageClient 
          category={category} 
          t={t} 
          games={[]} 
        />
      );
    }
    
    // 其他错误重新抛出
    throw error;
  }
}