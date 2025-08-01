"use client"

import { useState } from "react";
import { CalendarDays } from "lucide-react";

interface DateTooltipProps {
  date: string;
  className?: string;
}

export default function DateTooltip({ date, className = "" }: DateTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center min-w-0">
      <CalendarDays className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 text-purple-400 flex-shrink-0" />
      <div 
        className={`${className} truncate cursor-pointer`}
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {date}
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-600 whitespace-nowrap">
          {date}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}