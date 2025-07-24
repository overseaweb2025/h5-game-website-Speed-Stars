"use client"

import { MaximizeIcon, ExternalLinkIcon } from "lucide-react";

interface GameIframeProps {
  src: string;
  title: string;
}

export default function GameIframe({ src, title }: GameIframeProps) {
  return (
    <div className="aspect-[16/9] relative bg-text/10 rounded-lg overflow-hidden shadow-2xl border-4 border-secondary cartoon-shadow">
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        allow="gyroscope; accelerometer; magnetometer; camera; microphone; fullscreen; autoplay; clipboard-write"
      />
      <button
        className="absolute top-2 right-2 bg-text/70 hover:bg-text/90 text-white z-10 rounded-full w-10 h-10 shadow-md flex items-center justify-center"
        aria-label="Enter Fullscreen"
        onClick={() => {
          const iframe = document.querySelector('iframe');
          if (iframe) {
            iframe.requestFullscreen().catch((err) => {
              console.error("Fullscreen error:", err);
              alert("Fullscreen not supported or blocked");
            });
          }
        }}
      >
        <MaximizeIcon className="w-5 h-5" />
      </button>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-text/70 hover:bg-text/90 text-white z-10 px-3 py-1.5 rounded-full text-xs inline-flex items-center shadow-md"
        aria-label={`Open ${title} in new tab`}
      >
        Open in new tab <ExternalLinkIcon className="w-3 h-3 ml-1.5" />
      </a>
    </div>
  );
}