"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export default function CustomPagination({ currentPage, totalPages, onPageChange }: CustomPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/30 text-gray-300 hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all ${
            currentPage === page
              ? "bg-primary text-white border-primary"
              : "border-primary/30 text-gray-300 hover:bg-primary hover:text-white"
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/30 text-gray-300 hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}