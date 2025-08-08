import {NotBlogData} from '@/data/blog/notBlog'
interface PropGameHTML{
    description:string
}
const GameHTML = ({description}:PropGameHTML)=>{
    return(
        <>
        <div className="container mx-auto px-4 mt-12 space-y-8">
               {/* Game Info HTML Content */}
                 <section className="py-8">
                   <div className="max-w-4xl mx-auto">
                     <div 
                       className="prose prose-invert  text-left mx-auto w-full max-w-4xl"
                       dangerouslySetInnerHTML={{
                         __html: description || NotBlogData
                       }}
                     />
                   </div>
                 </section>
         </div>
        </>
    )
}

export default GameHTML