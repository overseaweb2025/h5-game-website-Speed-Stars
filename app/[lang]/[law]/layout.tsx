import { getNavLanguage } from "@/app/api/nav_language";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Locale, localesArrary } from "@/lib/lang/dictionaraies";
import { getDictionary } from "@/lib/lang/i18n";
interface propLaw {
  lang:Locale
  law:string
}



export default async function LawLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params:propLaw
}) {
  const lang = params.lang as Locale;
  const t = await getDictionary(lang);
  
  return (
    <>
    <Header t={t} lang={lang}/>
     {children}
     <Footer t={t} lang={lang}/>
    </>
  )
}