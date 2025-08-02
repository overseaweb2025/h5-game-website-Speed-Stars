import { getDictionary } from "@/lib/lang/i18n"
import GamesPageClient from "./GamesPageClient"

export default async function GamesPageServer({params}: {params: {lang: string}}) {
  const lang = params.lang as "en" | "zh";
  const t = await getDictionary(lang);
  
  return <GamesPageClient t={t} />;
}