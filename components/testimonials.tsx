"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Star, ThumbsUp, Send, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

// Helper function to generate consistent color based on name
const generateAvatarColor = (name: string): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#D7BDE2",
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface Testimonial {
  name: string
  date: string
  avatar: string
  rating: number
  text: string
  likes: number
  game?: string // Optional: to specify which game the review is for
}

const initialTestimonials: Testimonial[] = [
  {
    name: "Alex Johnson",
    date: "2 weeks ago",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "These games are perfect for my daily commute. Quick to load and super fun to play!",
    likes: 24,
  },
  {
    name: "Sarah Miller",
    date: "1 month ago",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "My kids love these games! They're colorful, engaging, and I don't have to worry about inappropriate content.",
    likes: 42,
  },
  {
    name: "Michael Chen",
    date: "3 weeks ago",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
    text: "Great collection of casual games. I especially love the puzzle ones - they're challenging but not frustrating.",
    likes: 18,
  },
  {
    name: "DashMasterFlex",
    date: "1 day ago",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Speed Stars is insanely fun! The controls are tricky at first, but so satisfying once you get the rhythm. Been racing my friends non-stop!",
    likes: 33,
    game: "Speed Stars",
  },
  {
    name: "PuzzleProPatty",
    date: "3 days ago",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
    text: "Crazy Cattle 3D is a charming and surprisingly challenging puzzle game. Some levels really make you think! The 3D aspect is well done.",
    likes: 27,
    game: "CRAZY CATTLE 3D",
  },
  {
    name: "RetroRacerRick",
    date: "5 days ago",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Love the unblocked access for Speed Stars! Perfect for a quick race during my break. The physics-based running is hilarious and addictive.",
    likes: 45,
    game: "Speed Stars",
  },
]

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [newReview, setNewReview] = useState({ name: "", rating: 0, text: "" })
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewReview((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rate: number) => {
    setNewReview((prev) => ({ ...prev, rating: rate }))
  }

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault()
    if (!newReview.name || newReview.rating === 0 || !newReview.text) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, rating, and review text.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      const submittedReview: Testimonial = {
        ...newReview,
        date: "Just now",
        avatar: "/placeholder.svg?height=60&width=60",
        likes: 0,
      }
      setTestimonials((prev) => [submittedReview, ...prev]) // Add new review to the top
      setNewReview({ name: "", rating: 0, text: "" }) // Reset form
      setIsSubmitting(false)
      toast({
        title: "Review Submitted!",
        description: "Thanks for your feedback!",
      })
    }, 1000)
  }

  return (
    <section id="testimonials" className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-text mb-4 pop-in">
            What Players <span className="gradient-text">Say</span>
          </h2>
          <p className="text-xl text-text/80 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our happy players!
          </p>
        </div>

        {/* Optimized layout with testimonials carousel and review form side by side on larger screens */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Testimonials Section */}
          <div className="lg:w-2/3 space-y-6">
            {/* Featured testimonials in a horizontal scrollable row on mobile, grid on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div
                  key={index}
                  className="card p-6 flex flex-col pop-in hover:shadow-cartoon-lg transition-all hover:rotate-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  {/* Add itemReviewed - Critical Fix */}
                  <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Game">
                    <meta itemProp="name" content={testimonial.game || "Speed Stars Game Collection"} />
                    <meta itemProp="applicationCategory" content="Game" />
                  </div>

                  <div className="flex items-center mb-4">
                    <div
                      className="h-14 w-14 rounded-full mr-4 shadow-md border-2 border-white flex items-center justify-center font-black text-white text-lg"
                      style={{ backgroundColor: generateAvatarColor(testimonial.name) }}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    {/* Fix author structure - Non-Critical Fix */}
                    <div itemProp="author" itemScope itemType="https://schema.org/Person">
                      <h3 className="font-black text-lg text-text" itemProp="name">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs text-text/60">
                        <meta itemProp="datePublished" content={testimonial.date} />
                        {testimonial.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                    <meta itemProp="bestRating" content="5" />
                  </div>

                  {testimonial.game && (
                    <p className="text-xs font-semibold text-primary mb-2 bg-primary/10 px-2 py-1 rounded-full inline-block">
                      Review for: {testimonial.game}
                    </p>
                  )}

                  <p className="text-text/80 mb-4 flex-grow text-sm leading-relaxed" itemProp="reviewBody">
                    {testimonial.text}
                  </p>

                  <button className="flex items-center text-text/60 hover:text-primary transition-colors mt-auto pt-3 border-t border-gray-200/70">
                    <ThumbsUp className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">{testimonial.likes} people found this helpful</span>
                  </button>
                </div>
              ))}
            </div>

            {/* More testimonials in a compact row */}
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible">
              {testimonials.slice(4).map((testimonial, index) => (
                <div
                  key={`more-${index}`}
                  className="card p-5 flex-shrink-0 w-[280px] md:w-auto flex flex-col pop-in hover:shadow-cartoon-lg transition-all hover:-rotate-1"
                  style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  {/* Add itemReviewed - Critical Fix */}
                  <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Game">
                    <meta itemProp="name" content={testimonial.game || "Speed Stars Game Collection"} />
                    <meta itemProp="applicationCategory" content="Game" />
                  </div>

                  <div className="flex items-center mb-3">
                    <div
                      className="h-12 w-12 rounded-full mr-3 shadow-md border-2 border-white flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: generateAvatarColor(testimonial.name) }}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    {/* Fix author structure - Non-Critical Fix */}
                    <div itemProp="author" itemScope itemType="https://schema.org/Person">
                      <h3 className="font-bold text-base text-text" itemProp="name">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-text/60">
                          <meta itemProp="datePublished" content={testimonial.date} />
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                    <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                    <meta itemProp="bestRating" content="5" />
                  </div>

                  {testimonial.game && (
                    <p className="text-xs font-semibold text-primary mb-2 bg-primary/10 px-2 py-1 rounded-full inline-block">
                      {testimonial.game}
                    </p>
                  )}

                  <p className="text-text/80 mb-3 flex-grow text-sm leading-relaxed line-clamp-3" itemProp="reviewBody">
                    {testimonial.text}
                  </p>

                  <div className="flex items-center text-text/60 text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>{testimonial.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form Section */}
          <div className="lg:w-1/3 lg:sticky lg:top-24">
            <div className="card p-6 md:p-8 shadow-cartoon-xl border-4 border-primary">
              <h3 className="text-2xl md:text-3xl font-black text-center text-primary mb-6">Leave Your Review!</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-text mb-1.5">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newReview.name}
                    onChange={handleInputChange}
                    placeholder="Awesome Gamer"
                    className="w-full text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">Your Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-7 w-7 cursor-pointer transition-colors ${
                          (hoverRating || newReview.rating) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="text" className="block text-sm font-bold text-text mb-1.5">
                    Your Review
                  </label>
                  <Textarea
                    id="text"
                    name="text"
                    value={newReview.text}
                    onChange={handleInputChange}
                    placeholder="Tell us what you think about our games..."
                    rows={4}
                    className="w-full text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-primary w-full text-lg py-3.5 flex items-center justify-center jello"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" /> Submit Review
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
