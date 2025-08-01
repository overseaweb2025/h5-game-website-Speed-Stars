"use client"

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopyLink}
      className="inline-flex items-center px-3 md:px-6 py-2 md:py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-xs md:text-sm"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
          <span className="truncate">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
          <span className="truncate">Share</span>
        </>
      )}
    </button>
  );
}