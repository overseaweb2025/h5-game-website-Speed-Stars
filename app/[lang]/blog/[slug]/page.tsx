import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/data/blog/blog-data";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/lang/i18n";
import BlogHeader from '@/app/[lang]/blog/[slug]/Header'
import { blogDetails } from "@/app/api/types/Get/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams() {
  const blogSlugs = getAllBlogSlugs();
  return blogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = getBlogPostBySlug(slug);
  
  // Skip API call in server-side metadata generation to avoid URL issues
  // API calls should be done in client components instead
  if (!post) {
    return {
      title: "Blog Post Not Found - Speed Stars",
      description: "The requested blog post could not be found.",
    };
  }
  
  return {
    title: `${post.title} - Speed Stars Blog`,
    description: post.description || post.excerpt,
  };
}

const Conloge_Api_data = async (slug: string, lang: string): Promise<blogDetails > => {

  const blog_Details:blogDetails = {
    title: "",
    description: "",
    keywords: "",
    summary: "",
    content: "",
    editor: {
      name: ""
    },
    published_at: ""
  }

  try {
    // 直接使用 fetch 调用完整 URL，避免 axios 在服务端的问题
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/post?name=${slug}&lang=${lang}`
    console.log('API URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.data) {
        return {
          title: data.data.title || blog_Details.title,
          description: data.data.description || blog_Details.description,
          keywords: data.data.keywords || blog_Details.keywords,
          summary: data.data.summary || blog_Details.summary,
          content: data.data.content || blog_Details.content,
          editor: {
            name: data.data.editor?.name || blog_Details.editor.name
          },
          published_at: data.data.published_at || blog_Details.published_at
        }
      }
    } else {
      console.log('API response error:', response.status, response.statusText)
    }
  } catch (er) {
    console.error('Blog details API error:', er)
  }

  return blog_Details
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const t = await getDictionary(lang as "en" | "zh");
  const post = getBlogPostBySlug(slug);
  const blog_Details: blogDetails = await Conloge_Api_data(slug, lang)

  
  if (!post) {
    notFound();
  }
  
  return (
    <>
      <Header t={t} />
      
      {/* Hero Section with Background */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
        
        {/* Navigation */}
        <div className="pt-2 pb-4 md:pt-20 md:pb-8">
          <div className="container mx-auto px-4">
            <Link 
              href={`/${lang}/blog`} 
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold group transition-all duration-200 text-sm md:text-base"
            >
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="truncate">{t?.blog?.backToBlog}</span>
            </Link>
          </div>
        </div>

        <main className="container mx-auto px-4 pb-6 md:pb-12">
          <article className="max-w-4xl mx-auto">
            
            {/* Article Header */}
           <BlogHeader post={post} blogDetails={blog_Details}/>
            
           
            
            
            {/* Back to Blog */}
            <div className="text-center mt-6 md:mt-12">
              <Link 
                href={`/${lang}/blog`} 
                className="inline-flex items-center px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
              >
                <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="truncate">{t?.blog?.backToAllPosts}</span>
              </Link>
            </div>
            
          </article>
        </main>
      </div>
      
      <Footer t={t} />
    </>
  );
}