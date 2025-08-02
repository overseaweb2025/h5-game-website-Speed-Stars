"use client"

import { useState } from "react";

interface AuthorTooltipProps {
  author: string;
  className?: string;
}

export default function AuthorTooltip({ author, className = "" }: AuthorTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div 
        className={`${className} truncate cursor-pointer`}
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {author}
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-50 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-600 whitespace-nowrap max-w-xs">
          {author}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}