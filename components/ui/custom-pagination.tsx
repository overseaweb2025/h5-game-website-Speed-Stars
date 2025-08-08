"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export default function CustomPagination({ currentPage, totalPages, onPageChange }: CustomPaginationProps) {
  const getVisiblePages = () => {
    if (totalPages <= 1) return [1];
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range = [];
    const result = [];

    // Always show first page
    result.push(1);

    if (currentPage <= delta + 2) {
      // Show pages 1 to delta+3, then ellipsis, then last page
      for (let i = 2; i <= Math.min(delta + 3, totalPages - 1); i++) {
        result.push(i);
      }
      if (delta + 3 < totalPages - 1) {
        result.push('...');
      }
    } else if (currentPage >= totalPages - delta - 1) {
      // Show first page, ellipsis, then last delta+2 pages
      if (totalPages - delta - 2 > 2) {
        result.push('...');
      }
      for (let i = Math.max(totalPages - delta - 1, 2); i <= totalPages - 1; i++) {
        result.push(i);
      }
    } else {
      // Show first page, ellipsis, current page +/- delta, ellipsis, last page
      result.push('...');
      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i >= 2 && i <= totalPages - 1) {
          result.push(i);
        }
      }
      result.push('...');
    }

    // Always show last page (if not already included)
    if (totalPages > 1 && !result.includes(totalPages)) {
      result.push(totalPages);
    }

    return result;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1];

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-8 px-2">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary/30 text-gray-300 hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300"
      >
        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
      
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-400">
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange?.(page as number)}
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-semibold transition-all text-sm sm:text-base ${
                currentPage === page
                  ? "bg-primary text-white border-primary"
                  : "border-primary/30 text-gray-300 hover:bg-primary hover:text-white"
              }`}
            >
              {page}
            </button>
          )}
        </div>
      ))}
      
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary/30 text-gray-300 hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300"
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </div>
  )
}