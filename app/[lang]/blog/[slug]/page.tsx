import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/data/blog/blog-data";
import { getDictionary } from "@/lib/lang/i18n";
import { Locale } from "@/lib/lang/dictionaraies";
import BlogHero from "./BlogHero";
interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: Locale }>;
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