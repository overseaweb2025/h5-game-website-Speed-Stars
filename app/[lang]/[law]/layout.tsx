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
  params: propLaw
}) {
  try {
    // Validate params exist
    if (!params || !params.lang) {
      console.error('Invalid params in LawLayout:', params);
      // Fallback to English if params are invalid
      const t = await getDictionary('en');
      return (
        <>
          <Header t={t} lang={'en'}/>
          {children}
          <Footer t={t} lang={'en'}/>
        </>
      );
    }

    const lang = params.lang as Locale;
    const t = await getDictionary(lang);
    
    return (
      <>
        <Header t={t} lang={lang}/>
        {children}
        <Footer t={t} lang={lang}/>
      </>
    );
  } catch (error) {
    console.error('Error in LawLayout:', error);
    // Fallback to English on any error
    const t = await getDictionary('en');
    return (
      <>
        <Header t={t} lang={'en'}/>
        {children}
        <Footer t={t} lang={'en'}/>
      </>
    );
  }
}