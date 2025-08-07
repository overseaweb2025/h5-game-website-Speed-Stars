// app/[lang]/category/[category]/page.tsx
import { Metadata } from "next";
import { getDictionary } from "@/lib/lang/i18n";
import CategoryPageClient from './CategoryPageClient';
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getClassNameGames, getGameList } from "@/app/api/game/index";
import { games } from "@/app/api/types/Get/game";

// 为页面组件和 generateMetadata 定义明确的参数类型
interface CategoryPageProps {
  params: {
    lang: Locale;
    category: string;
  };
}

// ISR 优化：设置重新验证时间
export const revalidate = 1;

// generateStaticParams 用于在构建时生成所有可能的路由参数
export async function generateStaticParams() {
  const languages: Locale[] = localesArrary;
  const params: { category: string; lang: Locale }[] = [];
  
  // 1. 获取所有语言下所有唯一的分类名称
  const allCategorySlugs = new Set<string>();
  for (const lang of languages) {
    const res = await getGameList(lang);
    const gamelist = res.data.data;
    if (gamelist) {
      for (const category of gamelist) {
        if (category.category_name) {
          allCategorySlugs.add(category.category_name);
        }
      }
    }
  }

  // 2. 结合所有分类和语言生成 params 数组
  for (const categorySlug of allCategorySlugs) {
    for (const lang of languages) {
      // 注意：这里只返回了 category 和 lang，因为这是 URL 中存在的参数
      params.push({ category: categorySlug, lang });
    }
  }

  return params;
}

// 页面组件，负责在服务器端获取数据并传递给客户端组件
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, lang } = params;

  // 获取多语言字典
  const t = await getDictionary(lang);
  
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
}