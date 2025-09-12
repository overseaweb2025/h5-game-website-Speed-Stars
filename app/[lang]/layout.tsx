import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ScrollToTop from "@/components/scroll-to-top"
import { Toaster } from 'react-hot-toast'
import Providers from "@/components/providers"
import ExternalScripts from "@/components/external-scripts"
import NotificationBar from "@/components/notification-bar"
import { getCanonicalDomain } from "@/lib/seo-utils"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] })

// 获取动态域名和结构化数据
const getWebsiteStructuredData = () => {
  const domain = getCanonicalDomain()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Speed Stars",
    url: domain,
    description: "Speed Stars - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
    potentialAction: {
      "@type": "SearchAction",
      target: `${domain}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Speed Stars",
      url: domain,
      logo: {
        "@type": "ImageObject",
        url: `${domain}/images/logo.png`,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+16070231235",
        contactType: "customer service",
        email: `support@${domain}`,
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
      "https://facebook.com/speedstars",
      "https://twitter.com/speedstars",
      "https://instagram.com/speedstars",
      "https://youtube.com/@speedstars",
    ],
  }
}

const getGameStructuredData = () => {
  const domain = getCanonicalDomain()
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Speed Stars Games",
    description: "Free online games platform featuring physics, puzzle, action and adventure games",
    url: `${domain}/games`,
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
      name: "Speed Stars",
      url: domain,
      logo: {
        "@type": "ImageObject",
        url: `${domain}/images/logo.png`,
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
}

// 生成动态metadata
const generateMetadata = (): Metadata => {
  const domain = getCanonicalDomain()
  return {
    metadataBase: new URL(domain),
    title: "Speed Stars: Play Free Online Games!",
    description:
      "Speed Stars - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
    keywords:
      "Speed Stars, free online games, browser games, HTML5 games, running games, physics games, puzzle games, action games, gaming platform",
    alternates: {
      canonical: domain,
      languages: {
        en: domain,
        zh: `${domain}/zh`,
        ru: `${domain}/ru`,
        es: `${domain}/es`,
        hi: `${domain}/hi`,
        fr: `${domain}/fr`,
        ja: `${domain}/ja`,
        ko: `${domain}/ko`,
        "x-default": domain
      }
    },
    openGraph: {
      title: "Speed Stars: Play Free Online Games!",
      description:
        "Speed Stars - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
      url: domain,
      siteName: "Speed Stars",
      images: [
        {
          url: `${domain}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Speed Stars - Free Online Games Platform",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Speed Stars: Play Free Online Games!",
      description:
        "Speed Stars - Your ultimate destination for free online games. Discover hundreds of games including running, physics, puzzle, and action games. Play now!",
      images: [`${domain}/images/twitter-image.jpg`],
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
    verification: {
      google: "your-google-verification-code", // Replace with actual verification code
      yandex: "your-yandex-verification-code", // Replace with actual verification code
      yahoo: "your-yahoo-verification-code", // Replace with actual verification code
    },
    generator: 'Next.js',
  }
}

export const metadata: Metadata = generateMetadata()

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ff006e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Speed Stars" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ff006e" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Permissions Policy for Unity WebGL games to access device sensors */}
        <meta httpEquiv="Permissions-Policy" content="accelerometer=*, gyroscope=*, magnetometer=*, ambient-light-sensor=*, camera=*, microphone=*, geolocation=*, fullscreen=*" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebsiteStructuredData()),
          }}
        />

        {/* Game-specific structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getGameStructuredData()),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-51B9X4KSSF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-51B9X4KSSF');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          <ScrollToTop />
          {children}
          <NotificationBar />
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
