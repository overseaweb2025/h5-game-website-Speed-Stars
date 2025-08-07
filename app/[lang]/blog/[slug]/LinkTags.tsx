// pages/product/[id].js
import Head from 'next/head';
import { Locale } from '@/lib/lang/dictionaraies';
interface PropsLink {
    lang:Locale
    slug:string
    alternate:string[]

}
 const LinkTags = ({ lang, slug, alternate }: PropsLink) => {
  return (
    <Head>
      {alternate.map((item, index) => (
        <link 
          key={index} 
          rel="alternate" 
          hrefLang={item} 
          href={`https://${process.env.CANONICAL_DOMAIN}/${item}/blog/${slug}`} 
        />
      ))}
      <link rel="alternate" hrefLang='x-default' href={`https://${process.env.CANONICAL_DOMAIN}/en/blog/${slug}`}  />
    </Head>
  );
};


export default LinkTags;