"use client"

import Link from "next/link"
import { GamepadIcon as GameController, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-text via-accent-3 to-primary text-white py-12 relative overflow-hidden border-t-8 border-white">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full pop-in"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full pop-in"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full pop-in"
          style={{ animationDelay: "0.6s" }}
        ></div>

        {/* Additional decorative elements */}
        <div
          className="absolute top-20 right-1/4 w-16 h-16 bg-accent-2 rounded-full pop-in"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent-4 rounded-full pop-in"
          style={{ animationDelay: "1.2s" }}
        ></div>

        {/* Cartoon stars */}
        <div className="absolute top-1/3 right-1/3 text-4xl pop-in" style={{ animationDelay: "0.4s" }}>
          ⭐
        </div>
        <div className="absolute bottom-1/3 left-1/5 text-3xl pop-in" style={{ animationDelay: "0.7s" }}>
          ✨
        </div>
        <div className="absolute top-2/3 right-1/5 text-5xl pop-in" style={{ animationDelay: "1s" }}>
          🌟
        </div>
      </div>
      <div className="container mx-auto px-4">
        {/* Top Footer with Logo and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <GameController className="h-12 w-12 text-accent drop-shadow-lg wiggle" />
            <span className="text-4xl font-black text-white text-stroke">GameHub Central</span>
          </Link>

          <div className="w-full md:w-auto">
            <h3 className="text-lg font-bold mb-2 text-center md:text-right">Stay Updated with New Games</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-6 py-3 rounded-l-full bg-white/20 text-white border-4 border-white/30 focus:border-accent focus:outline-none w-full md:w-64 font-bold placeholder-white/70"
              />
              <button className="bg-accent hover:bg-accent-2 text-text font-black py-3 px-6 rounded-r-full transition-all hover:scale-110 border-4 border-white shadow-cartoon">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {" "}
          {/* Updated grid-cols from md:grid-cols-4 to md:grid-cols-3 */}
          <div>
            <h3 className="text-xl font-black mb-4 border-b-4 border-white/30 pb-2 text-accent">About Us</h3>
            <p className="text-white/80 mb-4">
              GameHub Central offers the best collection of free HTML5 games for your entertainment, optimized for all
              devices and completely unblocked.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/sharer/sharer.php?u=https://speed-stars.net&quote=Play%20Speed%20Stars%20and%20amazing%20HTML5%20games%20for%20free!%20Unblocked%20access%20to%20the%20best%20online%20games."
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-accent transition-all hover:scale-125 transform"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/intent/tweet?text=Check%20out%20Speed%20Stars%20-%20Amazing%20free%20HTML5%20games!%20🎮&url=https://speed-stars.net&hashtags=SpeedStars,HTML5Games,FreeGames,UnblockedGames"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-accent transition-all hover:scale-125 transform"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/sharing/share-offsite/?url=https://speed-stars.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-accent transition-all hover:scale-125 transform"
                aria-label="Share on LinkedIn"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.reddit.com/submit?url=https://speed-stars.net&title=Speed%20Stars%20-%20Amazing%20Free%20HTML5%20Games!"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-accent transition-all hover:scale-125 transform"
                aria-label="Share on Reddit"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          {/* Popular Games section removed */}
          <div>
            <h3 className="text-xl font-black mb-4 border-b-4 border-white/30 pb-2 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-secondary rounded-full mr-2"></div>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-secondary rounded-full mr-2"></div>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-secondary rounded-full mr-2"></div>
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-black mb-4 border-b-4 border-white/30 pb-2 text-accent">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-accent rounded-full mr-2"></div>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-accent rounded-full mr-2"></div>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-accent rounded-full mr-2"></div>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-accent rounded-full mr-2"></div>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-white/80 hover:text-primary transition-colors flex items-center">
                  <div className="h-2 w-2 bg-accent rounded-full mr-2"></div>
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-white/10 text-center text-white/60">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} GameHub Central. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center text-white/80 hover:text-accent transition-all font-black hover:scale-110"
                aria-label="Back to top"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Back to Top
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm">
            <p className="mb-2">GameHub Central is not affiliated with any game developers unless specifically stated.</p>
            <address className="mt-2 not-italic flex flex-col md:flex-row justify-center items-center gap-2">
              <span className="flex items-center">
                <span className="mr-2">📍</span>
                36 Central Avenue, California, USA
              </span>
              <span className="hidden md:inline mx-2">|</span>
              <span className="flex items-center">
                <span className="mr-2">📧</span>
                support@speed-stars.net
              </span>
              <span className="hidden md:inline mx-2">|</span>
              <span className="flex items-center">
                <span className="mr-2">📱</span>
                +16070231235
              </span>
            </address>

            <div className="mt-4 pt-4 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
              <p>🎮 Made with love for gamers everywhere</p>
              <p>🔒 Your privacy and security are our priority</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
