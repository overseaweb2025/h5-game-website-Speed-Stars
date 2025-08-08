import { getNavLanguage } from "@/app/api/nav_language";
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getLawPageValue } from "@/app/api/law";
import {NotFoundhtmlCode} from './htmlcode'
import { notFound } from "next/navigation";

interface propLaw {
  lang: Locale;
  law: string;
}

export const revalidate = 2592000;

export async function generateStaticParams() {
  try {
    const languages: Locale[] = localesArrary;
    const params: propLaw[] = [];

    const res = await getNavLanguage();
    const laws = res.data.data;
    const footerNav = laws.footer_nav;

    // 遍历所有语言，确保生成所有可能的路由
    for (const lang of languages) {
      // 检查 footerNav[lang] 是否存在
      const lawSlugs = footerNav[lang];
      if (!lawSlugs) {
        console.warn(`No law slugs found for language: ${lang}`);
        continue;
      }

      for (const lawItem of lawSlugs) {
        for (const slugContent of lawItem.content) {
          const cleanSlug = slugContent.text.replace(/^\//, '');

          // 跳过无效 slug
          if (!cleanSlug || cleanSlug.trim() === '') continue;

          // 编码 slug 以处理空格和特殊字符
          const encodedSlug = encodeURIComponent(cleanSlug);
          params.push({ lang: lang, law: encodedSlug });
        }
      }
    }

    return params;
  } catch (error) {
    console.error('Error generating static params for law pages:', error);
    // 返回空数组以防止构建失败，但应在构建时发出警告
    return [];
  }
}

// LawPage 组件保持不变，因为它已经能够正确处理 params
const LawPage = async ({ params }: { params: { lang: Locale; law: string } }) => {
  try {
    const { lang, law } = params;
    // 解码 law 参数以处理编码字符
    const decodedLaw = decodeURIComponent(law);
    // 通过获取 api 接口数据进行强制渲染 getLawPageValue(law)
    const res = await getLawPageValue(decodedLaw);
    let htmlCode = res.data.data.content;

    if (!htmlCode) {
      // 如果没有内容，则抛出 notFound 错误，Next.js 会渲染 404 页面
      notFound();
    }

    return (
      <div className="flex justify-center min-h-screen p-4">
        <div 
          className="prose prose-invert text-left mx-auto w-full max-w-4xl"
          dangerouslySetInnerHTML={{ __html: htmlCode }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering law page:', error);
    // 如果 API 调用失败，也渲染 404
    notFound();
  }
};

export default LawPage;
