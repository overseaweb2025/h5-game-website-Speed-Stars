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
                       className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
                       dangerouslySetInnerHTML={{
                         __html: description
                       }}
                     />
                   </div>
                 </section>
         </div>
        </>
    )
}

export default GameHTML