"use client"

import Script from "next/script"

export default function ExternalScripts() {
  return (
    <>
      {/* Unity WebGL 优化脚本 */}
      <Script
        src="/unity-webgl-optimizer.js"
        strategy="afterInteractive"
      />
    </>
  )
}