"use client"
import { Locale } from "@/lib/lang/dictionaraies"
import HomeHero from "./home"
interface HeroProps {
  title?: string;
  description?: string;
  lang: Locale;
  t?: any;
}

export default function Hero({ title, description, lang, t }: HeroProps) {
  return (
    <HomeHero 
      title={title} 
      description={description} 
      lang={lang} 
      t={t} 
    />
  )
}
