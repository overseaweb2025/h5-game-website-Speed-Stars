"use client"

interface ContentSectionsProps {
  homeData?: any
}

export default function ContentSections({ homeData }: ContentSectionsProps) {
  if (!homeData?.page_content) return null

  return (
    <div>
      {/* Features section */}
      {homeData.page_content.Features && (
        <div className="mt-6 mb-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
              dangerouslySetInnerHTML={{
                __html: homeData.page_content.Features
              }}
            />
          </div>
        </div>
      )}

      {/* About section */}
      {homeData.page_content.About && (
        <div className="mt-6 mb-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
              dangerouslySetInnerHTML={{
                __html: homeData.page_content.About
              }}
            />
          </div>
        </div>
      )}

      {/* Gameplay section */}
      {homeData.page_content.Gameplay && (
        <div className="mt-6 mb-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none text-text/80 leading-relaxed [&>h1]:text-text [&>h2]:text-text [&>h3]:text-text [&>h4]:text-text [&>h5]:text-text [&>h6]:text-text [&>p]:text-text/80 [&>ul]:text-text/80 [&>ol]:text-text/80 [&>li]:text-text/80 [&>a]:text-primary [&>a]:hover:text-primary/80 [&>strong]:text-text [&>b]:text-text"
              dangerouslySetInnerHTML={{
                __html: homeData.page_content.Gameplay
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}