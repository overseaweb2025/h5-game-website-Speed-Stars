import { Locale } from "@/lib/lang/dictionaraies";
import GamesPageServer from "./GamesPageServer"
import { getGameList } from "@/app/api/game";


export default async function GamesPage({params}: {params: {lang: Locale}}) {
  const res = await getGameList()
  console.log('Server games data:', res.data)
  return <GamesPageServer params={params} />;
}