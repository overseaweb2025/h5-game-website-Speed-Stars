// app/blog/[slug]/BlogHero.tsx
import { Locale } from "@/lib/lang/dictionaraies";
import BlogArticle from './BlogArticle';
import { getBlogDetails } from "@/app/api/blog/index";
import { unescapeStructuredData } from "@/lib/json/json_utill";
import { JsonLdScript } from "./JsonPramse";
interface PropHero {
  lang: Locale;
  slug: string;
  t: any;
}

const BlogHero = async ({ lang, slug, t }: PropHero) => {
  const res = await getBlogDetails(slug, lang);
  const blog_Details = res?.data?.data;

  // 在检查文章是否存在前，先声明一个变量
  let unescapedData: { [key: string]: string } | null = null;
  
  // 检查文章是否存在且支持当前语言
  if (blog_Details && blog_Details.alternate && Array.isArray(blog_Details.alternate) && blog_Details.alternate.includes(lang)) {
    // 修正：在这里调用 unescapeStructuredData 函数来解析转义字符串
    if (blog_Details.structured_data) {
        unescapedData = unescapeStructuredData(blog_Details.structured_data);
    }
    console.log('data:',unescapedData)
    
    return (
      <>
        {/* 只有当 unescapedData 存在时才渲染 */}
        {unescapedData && (
            <>
                <JsonLdScript data={unescapedData } />
            </>
        )}
        <BlogArticle lang={lang} t={t} slug={slug} blog_Details={blog_Details} />
      </>
    );
  } else {
    // 文章不存在或不支持当前语言，显示未找到页面
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {t?.blog?.blogPostNotFound || "Blog Post Not Found"}
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              {t?.blog?.requestedBlogPostNotFound || "The requested blog post could not be found or is not available in your language."}
            </p>
            <a 
              href={`/${lang}/blog`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {t?.blog?.backToBlog || "Back to Blog"}
            </a>
          </div>
        </div>
      </div>
    );
  }
};

export default BlogHero;