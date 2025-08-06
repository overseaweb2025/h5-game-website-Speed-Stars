import { Locale } from "@/lib/lang/dictionaraies"
import GamePage from "./page"
import { getDictionary } from "@/lib/lang/i18n-client"

interface PropPage {
    slug:string
    lang:Locale
}
const gamePage = async ({slug,lang}:PropPage)=>{

    const t = await getDictionary(lang);

    return (<GamePage params={{slug: slug,lang: lang}}/>)
}

export default gamePage