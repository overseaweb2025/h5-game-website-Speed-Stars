import GamesPageServer from "./GamesPageServer"

export default function GamesPage({params}: {params: {lang: string}}) {
  return <GamesPageServer params={params} />;
}