// app/components/BlogHeader.tsx
import { blogDetails } from "@/app/api/types/Get/blog";
import AuthorTooltip from "./AuthorTooltip";
import DateTooltip from "./DateTooltip";
import ExpandableText from "./ExpandableText";
import ShareButton from "./ShareButton";

// ✅ 不加 'use client'，这就是 Server Component
const BlogHeader = ({ blogDetails }: { blogDetails: blogDetails }) => {
  return (
    <>
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-6 md:mb-12">
          {/* Title */}
          <div className="mb-4 md:mb-6">
            <ExpandableText 
              className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight"
              maxLines={2}
            >
              {blogDetails.title}
            </ExpandableText>
          </div>

          {/* Excerpt */}
          <div className="mb-4 md:mb-8">
            <ExpandableText 
              className="text-sm md:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light"
              maxLines={2}
            >
              {blogDetails.summary}
            </ExpandableText>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-7 gap-2 md:gap-4 p-3 md:p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm items-center">
            <div className="col-span-3 text-gray-300 min-w-0">
              <AuthorTooltip 
                author={blogDetails.editor.name}
                className="text-sm md:text-lg font-medium block"
              />
            </div>
            <div className="col-span-2 text-gray-300 min-w-0">
              <DateTooltip 
                date={blogDetails.published_at}
                className="text-sm md:text-lg font-medium"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <ShareButton />
            </div>
          </div>
        </header>
      </article>

      {/* Article Content */}
      <div className="bg-gray-900/80 rounded-3xl p-4 md:p-8 lg:p-12 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <div 
          className="prose prose-xl max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-8
            prose-h2:text-3xl prose-h2:text-purple-300 prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-3
            prose-h3:text-2xl prose-h3:text-blue-300
            prose-h4:text-xl prose-h4:text-green-300
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-purple-400 prose-strong:font-semibold
            prose-ul:text-gray-300 prose-ol:text-gray-300 
            prose-li:mb-2 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300
            prose-code:text-purple-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-600 prose-pre:rounded-lg
            prose-a:text-purple-400 prose-a:hover:text-purple-300 prose-a:no-underline prose-a:font-medium
            prose-img:rounded-lg prose-img:shadow-lg
            first:prose-p:text-xl first:prose-p:text-gray-200 first:prose-p:font-medium"
          dangerouslySetInnerHTML={{ __html: blogDetails.content }}
        />
      </div>
    </>
  );
};

export default BlogHeader;