"use client"

import { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  children: React.ReactNode;
  className?: string;
  maxLines?: number;
}

export default function ExpandableText({ 
  children, 
  className = "", 
  maxLines = 2 
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && typeof window !== 'undefined') {
        const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
        const maxHeight = lineHeight * maxLines;
        const actualHeight = textRef.current.scrollHeight;
        setNeedsExpansion(actualHeight > maxHeight);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkOverflow, 100);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkOverflow);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkOverflow);
      }
    };
  }, [maxLines]);

  const shouldShowExpanded = isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 768); // md breakpoint

  return (
    <div className="relative">
      <div 
        ref={textRef}
        className={`${className} ${
          !shouldShowExpanded && needsExpansion ? '' : ''
        } md:line-clamp-none`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: !shouldShowExpanded && needsExpansion ? maxLines : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: !shouldShowExpanded && needsExpansion ? 'hidden' : 'visible'
        }}
      >
        {children}
      </div>
      
      {needsExpansion && (
        <div className="md:hidden">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-purple-400 hover:text-purple-300 text-sm mt-1 font-medium"
            >
              展开
            </button>
          ) : (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-purple-400 hover:text-purple-300 text-sm mt-2 font-medium"
            >
              隐藏
            </button>
          )}
        </div>
      )}
    </div>
  );
}