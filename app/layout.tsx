import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ScrollToTop from "@/components/scroll-to-top"
import { Toaster } from 'react-hot-toast'
import Providers from "@/components/providers"
import ExternalScripts from "@/components/external-scripts"

const inter = Inter({ subsets: ["latin"] })

// 静态结构化数据，避免水合错误
const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GameHub Central",
  url: "https://gamehub-central.net",
  description: "GameHub Central - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gamehub-central.net/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "GameHub Central",
    url: "https://gamehub-central.net",
    logo: {
      "@type": "ImageObject",
      url: "https://gamehub-central.net/images/logo.png",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+16070231235",
      contactType: "customer service",
      email: "support@gamehub-central.net",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "36 Central Avenue",
      addressLocality: "California",
      addressRegion: "CA",
      postalCode: "90210",
      addressCountry: "US",
    },
  },
  sameAs: [
    "https://facebook.com/gamehubcentral",
    "https://twitter.com/gamehubcentral",
    "https://instagram.com/gamehubcentral",
    "https://youtube.com/@gamehubcentral",
  ],
}

const gameStructuredData = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "GameHub Central Games",
  description: "Free online games platform featuring physics, puzzle, action and adventure games",
  url: "https://gamehub-central.net/games",
  genre: ["Sports", "Racing", "Physics"],
  gamePlatform: ["Web Browser", "HTML5"],
  operatingSystem: "Any",
  applicationCategory: "Game",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  publisher: {
    "@type": "Organization",
    name: "GameHub Central",
    url: "https://gamehub-central.net",
    logo: {
      "@type": "ImageObject",
      url: "https://gamehub-central.net/images/logo.png",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "36 Central Avenue",
      addressLocality: "California",
      addressRegion: "CA",
      postalCode: "90210",
      addressCountry: "US",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1247",
    bestRating: "5",
    worstRating: "1",
  },
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gamehub-central.net'),
  title: "GameHub Central: Play Free Online Games!",
  description:
    "GameHub Central - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
  keywords:
    "GameHub Central, free online games, browser games, HTML5 games, running games, physics games, puzzle games, action games, gaming platform",
  openGraph: {
    title: "GameHub Central: Play Free Online Games!",
    description:
      "GameHub Central - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
    url: "https://gamehub-central.net",
    siteName: "GameHub Central",
    images: [
      {
        url: "https://gamehub-central.net/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GameHub Central - Free Online Games Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameHub Central: Play Free Online Games!",
    description:
      "GameHub Central - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
    images: ["https://gamehub-central.net/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  canonical: "https://gamehub-central.net",
  alternates: {
    canonical: "https://gamehub-central.net",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    yandex: "your-yandex-verification-code", // Replace with actual verification code
    yahoo: "your-yahoo-verification-code", // Replace with actual verification code
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/placeholder-logo.png" sizes="any" />
        <link rel="icon" href="/placeholder-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ff006e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GameHub Central" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ff006e" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Permissions Policy for Unity WebGL games to access device sensors */}
        <meta httpEquiv="Permissions-Policy" content="accelerometer=*, gyroscope=*, magnetometer=*, ambient-light-sensor=*, camera=*, microphone=*, geolocation=*" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />

        {/* Game-specific structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(gameStructuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ScrollToTop />
          {children}
          <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4aed88',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ff4b4b',
                secondary: '#fff',
              },
            },
          }}
        />
        </Providers>
        <ExternalScripts />
      </body>
    </html>
  )
}
