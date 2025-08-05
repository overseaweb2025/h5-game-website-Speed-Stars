import { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getDictionary } from "@/lib/lang/i18n";
import SearchResultsClient from "./SearchResultsClient";
import { Locale } from "@/lib/lang/dictionaraies";

interface SearchResultsPageProps {
  params: Promise<{ lang: string; title: string }>;
}

export async function generateMetadata({ params }: SearchResultsPageProps): Promise<Metadata> {
  const { lang, title } = await params;
  const decodedTitle = decodeURIComponent(title);
  
  return {
    title: `Search Results for "${decodedTitle}" - Speed Stars`,
    description: `Search results for ${decodedTitle}. Find your favorite games instantly with our powerful search engine.`,
    keywords: "game search, search results, find games, online games, browser games",
  };
}

export default async function SearchResultsPage({ params }: SearchResultsPageProps) {
  const { lang, title } = await params;
  const decodedTitle = decodeURIComponent(title);
  const t = await getDictionary(lang as Locale);
  
  return (
    <>
      <Header t={t} lang={lang as Locale}/>
      <main className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen pt-20">
        <SearchResultsClient searchQuery={decodedTitle} t={t} />
      </main>
      <Footer t={t} lang={lang as Locale}/>
    </>
  );
}