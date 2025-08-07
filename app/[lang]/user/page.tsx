import { Locale } from "@/lib/lang/dictionaraies";
import { getDictionary } from "@/lib/lang/i18n";
import UserPageClient from "./UserPageClient";

interface UserPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { lang } = await params;
  const t = await getDictionary(lang as Locale);
  
  return <UserPageClient lang={lang} t={t} />;
}