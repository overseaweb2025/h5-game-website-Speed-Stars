import GamesPageClient from "./GamesPageClient"
import { Locale } from "@/lib/lang/dictionaraies";
import { getDictionary } from "@/lib/lang/i18n";

export default async function GamesPageServer({params}: {params: {lang: Locale}}) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  
  return <GamesPageClient lang={lang} t={t}/>;
}