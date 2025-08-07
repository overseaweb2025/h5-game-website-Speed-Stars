import Header from "@/components/header"
import Footer from "@/components/footer"
import { Locale } from "@/lib/lang/dictionaraies"
import { getDictionary } from "@/lib/lang/i18n"
import UserProfileClient from "./UserProfileClient"

export default async function UserProfilePage({params}: {params: {lang: Locale, slug: string}}) {
  const lang = params.lang as Locale
  const t = await getDictionary(lang)

  return (
    <main className="bg-background min-h-screen">
      <Header t={t} lang={lang as Locale}/>
      <UserProfileClient lang={lang} t={t} />
      <Footer t={t} lang={lang as Locale}/>
    </main>
  )
}