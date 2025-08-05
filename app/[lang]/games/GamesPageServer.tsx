import GamesPageClient from "./GamesPageClient"
import { Locale } from "@/lib/lang/dictionaraies";

export default async function GamesPageServer({params}: {params: {lang: Locale}}) {
  const lang = params.lang as Locale;
  
  return <GamesPageClient lang={lang}/>;
}