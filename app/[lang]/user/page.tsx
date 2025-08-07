import { Locale } from "@/lib/lang/dictionaraies";
import { getDictionary } from "@/lib/lang/i18n";
import UserPageClient from "./UserPageClient";
import { Metadata } from "next/types";

interface UserPageProps {
  params: Promise<{ lang: Locale }>;
}
interface PropMetadata {
  params: {
    lang: Locale;
  };
}
export async function generateMetadata({params }:PropMetadata): Promise<Metadata> {
  const { lang } = params; // 从 params 中解构 lang
  const canonicalUrl = `${process.env.CANONICAL_DOMAIN}/${lang}/user`

  const t = await getDictionary(lang as Locale);


  return {
    title: t.user.title,
    description:t.user.description ,
    keywords: t.user.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Free Online User - Speed Stars",
      description: "Play hundreds of free online User including action, puzzle, sports, and racing games. No downloads required, play instantly in your browser!",
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: "Free Online User - Speed Stars",
      description: "Play hundreds of free online gaUsermes including action, puzzle, sports, and racing games. No downloads required, play instantly in your browser!",
    }
  }
}
export default async function UserPage({ params }: UserPageProps) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);
  
  return <UserPageClient lang={lang} t={t} />;
}