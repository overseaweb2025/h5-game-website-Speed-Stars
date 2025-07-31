import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/data/blog/blog-data";
import { ChevronLeftIcon, CalendarDays, User, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/lang/i18n";

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
      <main className="container mx-auto px-4 py-8 pt-24 md:pt-28 lg:pt-32 bg-gray-900 text-white min-h-screen">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary-hover font-bold group">
            <ChevronLeftIcon className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          <Card className="mb-8 card cartoon-shadow border-4 border-accent-3 transform hover:rotate-[-1deg] transition-transform duration-300">
            <CardHeader className="pb-6">
              <div className="mb-4">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                  {post.category}
                </span>
              </div>
              <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-3 to-secondary mb-4 text-stroke-sm leading-tight">
                {post.title}
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-secondary" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5 text-secondary" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-accent-3" />
                  {post.readTime}
                </div>
                {post.comments && (
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1.5 text-accent" />
                    {post.comments} Comments
                  </div>
                )}
              </div>
              
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            </CardHeader>
            
            <CardContent>
              <div 
                className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-accent-3 prose-p:text-gray-200 prose-p:leading-relaxed prose-strong:text-primary prose-ul:text-gray-200 prose-ol:text-gray-200 prose-li:mb-2 prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
          
          {/* Related posts or additional content could go here */}
          <div className="text-center">
            <Link 
              href="/blog" 
              className="btn-primary inline-flex items-center"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Back to All Posts
            </Link>
          </div>
        </article>
      </main>
      <Footer t={t} />
    </>
  );
}