import { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getDictionary } from "@/lib/lang/i18n";
import SearchPageClient from "./SearchPageClient";

interface SearchPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: `Search Games - Speed Stars`,
    description: "Search and discover amazing games. Find your favorite games instantly with our powerful search engine.",
    keywords: "game search, find games, online games, browser games, search games",
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { lang } = await params;
  const { q } = await searchParams;
  const t = await getDictionary(lang as "en" | "zh");
  
  return (
    <>
      <Header t={t} />
      <main className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen pt-20">
        <SearchPageClient initialQuery={q} t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}