// app/[lang]/category/[category]/page.tsx
import { Metadata } from "next";
import { getDictionary } from "@/lib/lang/i18n";
import CategoryPageClient from './CategoryPageClient';
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getClassNameGames, getGameList } from "@/app/api/game/index";
// 为页面组件和 generateMetadata 定义明确的参数类型
interface CategoryPageProps {
  params: {
    lang: Locale;
    category: string;
  };
}

// ISR 优化：设置重新验证时间
export const revalidate = 120;

export async function generateStaticParams() {
  const languages: Locale[] = localesArrary;
  const params: { category: string; lang: Locale }[] = [];

  // 使用 Promise.all() 并行发起所有语言的 API 请求
  const allGameListPromises = languages.map(lang => getGameList(lang));
  
  // 等待所有请求完成，并捕获结果
  const results = await Promise.all(allGameListPromises);

  const allCategorySlugs = new Set<string>();

  // 遍历所有请求结果，提取唯一的分类名称
  results.forEach(res => {
    // 确保请求成功且数据存在
    if (res?.data?.data) {
      for (const category of res.data.data) {
        if (category.category_name) {
          allCategorySlugs.add(category.category_name);
        }
      }
    }
  });

  // 结合所有分类和语言生成 params 数组
  for (const categorySlug of allCategorySlugs) {
    for (const lang of languages) {
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