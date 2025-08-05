import { Locale } from "@/lib/lang/dictionaraies";
import GamesPageServer from "./GamesPageServer"

export default function GamesPage({params}: {params: {lang: Locale}}) {
  return <GamesPageServer params={params} />;
}