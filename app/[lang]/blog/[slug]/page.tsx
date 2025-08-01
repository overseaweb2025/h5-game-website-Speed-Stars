import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/data/blog/blog-data";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/lib/lang/i18n";
import ShareButton from "./ShareButton";
import ExpandableText from "./ExpandableText";
import AuthorTooltip from "./AuthorTooltip";
import DateTooltip from "./DateTooltip";

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


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const t = await getDictionary(lang as "en" | "zh");
  const post = getBlogPostBySlug(slug);
  
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
              href="/blog" 
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold group transition-all duration-200 text-sm md:text-base"
            >
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="truncate">{t?.blog?.backToBlog || "Back to Blog"}</span>
            </Link>
          </div>
        </div>

        <main className="container mx-auto px-4 pb-6 md:pb-12">
          <article className="max-w-4xl mx-auto">
            
            {/* Article Header */}
            <header className="mb-6 md:mb-12">
              
              {/* Title */}
              <div className="mb-4 md:mb-6">
                <ExpandableText 
                  className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight"
                  maxLines={2}
                >
                  {post.title}
                </ExpandableText>
              </div>
              
              {/* Excerpt */}
              <div className="mb-4 md:mb-8">
                <ExpandableText 
                  className="text-sm md:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light"
                  maxLines={2}
                >
                  {post.excerpt}
                </ExpandableText>
              </div>
              
              {/* Meta Information */}
              <div className="grid grid-cols-7 gap-2 md:gap-4 p-3 md:p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm items-center">
                
                {/* Author - 3 columns */}
                <div className="col-span-3 text-gray-300 min-w-0">
                  <AuthorTooltip 
                    author={post.author}
                    className="text-sm md:text-lg font-medium block"
                  />
                </div>
                
                {/* Date - 2 columns */}
                <div className="col-span-2 text-gray-300 min-w-0">
                  <DateTooltip 
                    date={post.date}
                    className="text-sm md:text-lg font-medium"
                  />
                </div>
                
                {/* Share Button - 2 columns */}
                <div className="col-span-2 flex justify-end">
                  <ShareButton />
                </div>
                
              </div>
              
            </header>
            
            {/* Article Content */}
            <div className="bg-gray-900/80 rounded-3xl p-4 md:p-8 lg:p-12 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <div 
                className="prose prose-xl max-w-none 
                prose-headings:text-white prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-8
                prose-h2:text-3xl prose-h2:text-purple-300 prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-3
                prose-h3:text-2xl prose-h3:text-blue-300
                prose-h4:text-xl prose-h4:text-green-300
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-purple-400 prose-strong:font-semibold
                prose-ul:text-gray-300 prose-ol:text-gray-300 
                prose-li:mb-2 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300
                prose-code:text-purple-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-600 prose-pre:rounded-lg
                prose-a:text-purple-400 prose-a:hover:text-purple-300 prose-a:no-underline prose-a:font-medium
                prose-img:rounded-lg prose-img:shadow-lg
                first:prose-p:text-xl first:prose-p:text-gray-200 first:prose-p:font-medium"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            
            
            {/* Back to Blog */}
            <div className="text-center mt-6 md:mt-12">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
              >
                <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="truncate">{t?.blog?.backToAllPosts || "Back to All Posts"}</span>
              </Link>
            </div>
            
          </article>
        </main>
      </div>
      
      <Footer t={t} />
    </>
  );
}