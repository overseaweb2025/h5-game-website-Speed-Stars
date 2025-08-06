import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getAllBlogSlugs } from "@/data/blog/blog-data";
import { getDictionary } from "@/lib/lang/i18n";
import { Locale } from "@/lib/lang/dictionaraies";
import { getBlogDetails } from "@/app/api/blog";
import BlogHero from "./BlogHero";

interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: Locale }>;
}

export const revalidate = 120;

export async function generateStaticParams() {
  const blogSlugs = getAllBlogSlugs();
  const languages: Locale[] = ['en', 'zh', 'ru', 'es', 'vi', 'hi', 'fr', 'tl', 'ja', 'ko'];
  
  const params = [];
  for (const slug of blogSlugs) {
    for (const lang of languages) {
      params.push({ slug, lang });
    }
  }
  return params;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  
  try {
    const response = await getBlogDetails(slug, lang);
    const post = response?.data?.data;
    
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
  } catch (error) {
    console.error('Error fetching blog details for metadata:', error);
    return {
      title: "Blog Post - Speed Stars",
      description: "Speed Stars blog post",
    };
  }
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const t = await getDictionary(lang as Locale);
  
  return (
    <>
      <Header t={t} lang = {lang as Locale}/>
      
      <BlogHero lang={lang as Locale} slug={slug} t={t}/>
      
      
      <Footer t={t} lang= {lang as Locale}/>
    </>
  );
}