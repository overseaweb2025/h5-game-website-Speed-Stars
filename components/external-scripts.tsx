"use client"

import Script from "next/script"

export default function ExternalScripts() {
  return (
    <>
      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2660471109682751"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Plausible Analytics */}
      <Script
        defer
        data-domain="gamehub-central.net"
        src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        strategy="afterInteractive"
      />
      
      <Script
        id="plausible-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
        }}
      />

      {/* Unity WebGL 优化脚本 */}
      <Script
        src="/unity-webgl-optimizer.js"
        strategy="afterInteractive"
      />
    </>
  )
}