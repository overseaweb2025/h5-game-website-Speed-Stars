import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getAllBlogSlugs } from "@/data/blog/blog-data";
import { getDictionary } from "@/lib/lang/i18n";
import { Locale } from "@/lib/lang/dictionaraies";
import { getBlogDetails } from "@/app/api/blog";
import BlogHero from "./BlogHero";
import {localesArrary} from '@/lib/lang/dictionaraies'
interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: Locale }>;
}

export const revalidate = 120;

export async function generateStaticParams() {
  const blogSlugs = getAllBlogSlugs();
  const languages: Locale[] = localesArrary
  
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

  const response = await getBlogDetails(slug, lang);
  const post = response?.data?.data;

  if (!post) {
    // ... 如果 post 不存在，返回默认的 metadata
  }

  // 关键修正：确保 alternatesLinks 永远是数组，即使 post.alternate 不存在
  const alternatesLinks = (post?.alternate || []).map(locale => ({
    hreflang: locale,
    url: `${process.env.CANONICAL_DOMAIN}/${locale}/blog/${slug}`,
  }));

  return {
    title: `${post?.title}`,
    description: post?.description,
    alternates: {
      canonical: `${process.env.CANONICAL_DOMAIN}/${lang}/blog/${slug}`,
      languages: {
        ...alternatesLinks.reduce((acc, curr) => ({
          ...acc,
          [curr.hreflang]: curr.url,
        }), {}),
        'x-default': `${process.env.CANONICAL_DOMAIN}/en/blog/${slug}`,
      },
    },
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