import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

// 更新404页面的元数据

export const metadata: Metadata = {
  title: "Page Not Found | Speed Stars",
  description: "Oops! The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="relative h-[200px] w-full mb-8">
          <Image
            src="/placeholder.svg?height=200&width=300&query=cartoon character looking confused with question marks"
            alt="Confused character"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Page Not Found</h2>
        <p className="text-text/80 mb-8 max-w-md mx-auto">
          Oops! The game you're looking for seems to have wandered off to another level.
        </p>
        <Link
          href="/"
          className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
