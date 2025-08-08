import { getNavLanguage } from "@/app/api/nav_language";
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getLawPageValue } from "@/app/api/law";
import {NotFoundhtmlCode} from './htmlcode'
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

    for (const lang of languages) {
      for (const law of laws.footer_nav.en) {
        for (const slug of law.content) {
          const cleanSlug = slug.text.replace(/^\//, '');
          // Skip invalid slugs
          if (!cleanSlug || cleanSlug.trim() === '') continue;
          // Encode the slug to handle spaces and special characters
          const encodedSlug = encodeURIComponent(cleanSlug);
          params.push({ lang: lang, law: encodedSlug });
          
        }
      }
    }
    return params;
  } catch (error) {
    console.error('Error generating static params for law pages:', error);
    // Return empty array to prevent build failure
    return [];
  }
}

// LawPage 组件现在将是你的主页面内容
// 它需要接收 params 来获取 'law' 的值，并获取相应的 HTML
const LawPage = async ({ params }: { params: { lang: Locale; law: string } }) => {
  try {
    const { lang, law } = params;
    // Decode the law parameter to handle encoded characters
    const decodedLaw = decodeURIComponent(law);
    // 通过获取 api 接口数据进行强制渲染 getLawPageValue(law)
    const res = await getLawPageValue(decodedLaw);
    let htmlCode = res.data.data.content;
    if(htmlCode === '' || htmlCode === null || htmlCode === undefined){
      htmlCode = NotFoundhtmlCode;
    }
    return (
      // 使用 flexbox 和 min-h-screen 来居中对齐内容
      <div className="flex justify-center min-h-screen p-4">
        <div 
          className="prose prose-invert text-left mx-auto w-full max-w-4xl"
          dangerouslySetInnerHTML={{ __html: htmlCode }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering law page:', error);
    return (
      <div className="flex justify-center min-h-screen p-4">
        <div className="prose prose-invert text-left mx-auto w-full max-w-4xl">
          <h1>Page Not Found</h1>
          <p>The requested page could not be loaded.</p>
        </div>
      </div>
    );
  }
};


export default LawPage;