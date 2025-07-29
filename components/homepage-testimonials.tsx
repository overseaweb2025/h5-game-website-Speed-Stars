"use client"

import React, { useState, useEffect, useMemo, type FormEvent } from "react"
import { Star, Send, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PublicComment } from "@/app/api/comment/index"
import { getGameDetails } from "@/app/api/gameList"
import { reviews_comment } from "@/app/api/types/Get/game"
import { useSession } from "next-auth/react"

// 辅助函数，根据用户名生成头像颜色
const generateAvatarColor = (name: string): string => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 辅助函数，获取姓名首字母缩写（最多两位）
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// 类型定义
interface Testimonial {
  name: string;
  date: string;
  rating: number;
  text: string;
  email: string;
  avatar?: string;
  likes?: number;
  game?: string;
}

export default function HomepageTestimonials() {
  const [newReview, setNewReview] = useState({ rating: 0, text: "" })
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const { toast } = useToast()
  const { data: session } = useSession()

  // 固定的游戏名
  const gameSlug = "speed-stars"

  // 获取speed-stars游戏的评论数据
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const response = await getGameDetails(gameSlug)
        
        if (response.data.data?.reviews) {
          const mappedReviews: Testimonial[] = response.data.data.reviews.map((r: reviews_comment) => ({
            name: r.user_name,
            date: r.created_at,
            avatar: `/placeholder.svg?height=60&width=60`,
            rating: r.rating,
            text: r.content,
            email: r.email,
            likes: 0,
            game: "Speed Stars",
          }))
          setTestimonials(mappedReviews)
        }
      } catch (error) {
        console.error('Failed to fetch speed-stars reviews:', error)
        toast({
          title: "Loading Error",
          description: "Failed to load reviews. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [gameSlug, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewReview(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rate: number) => {
    setNewReview(prev => ({ ...prev, rating: rate }))
  }

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      })
      return
    }
    if (newReview.rating === 0 || !newReview.text.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your rating and review text.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // 发送评论数据到 API
      await PublicComment({
        game_name: gameSlug,
        rating: newReview.rating,
        content: newReview.text,
      })

      // 本地添加刚提交评论显示
      const submittedReview: Testimonial = {
        name: session.user?.name || session.user?.email || "Anonymous User",
        rating: newReview.rating,
        text: newReview.text,
        date: "Just now",
        avatar: session.user?.image || "/placeholder.svg?height=60&width=60",
        likes: 0,
        game: "Speed Stars",
        email: session.user?.email || "",
      }
      setTestimonials(prev => [submittedReview, ...prev])

      setNewReview({ rating: 0, text: "" })

      toast({
        title: "Review Submitted!",
        description: "Thanks for your feedback!",
      })
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 判断当前用户是否已经评论过，避免重复显示表单
  const hasUserReviewed = useMemo(() => {
    if (!session) return false
    return testimonials.some(t => t.email === session.user?.email)
  }, [session, testimonials])

  const UserCommentCards = () => (
    <div className="xl:w-2/3 space-y-4 md:space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="ml-3 text-white text-lg">Loading reviews...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Reviews Yet</h3>
          <p className="text-gray-300">Be the first to share your experience with Speed Stars!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <div
                key={`main-${index}`}
                className="bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-6 flex flex-col pop-in hover:shadow-cartoon-lg transition-all hover:rotate-1 rounded-2xl hover:border-purple-500/50"
                style={{ animationDelay: `${index * 0.1}s` }}
                itemScope
                itemType="https://schema.org/Review"
              >
                <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Game">
                  <meta itemProp="name" content={testimonial.game || "Speed Stars Game Collection"} />
                  <meta itemProp="applicationCategory" content="Game" />
                </div>

                <div className="flex items-center mb-4">
                  <div
                    className="h-12 w-12 md:h-14 md:w-14 rounded-full mr-3 md:mr-4 shadow-md border-2 border-white flex items-center justify-center font-black text-white text-base md:text-lg"
                    style={{ backgroundColor: generateAvatarColor(testimonial.name) }}
                  >
                    {getInitials(testimonial.name)}
                  </div>
                  <div itemProp="author" itemScope itemType="https://schema.org/Person">
                    <h3 className="font-black text-base md:text-lg text-white" itemProp="name">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-gray-300">
                      <meta itemProp="datePublished" content={testimonial.date} />
                      {testimonial.date}
                    </p>
                  </div>
                </div>

                <div className="flex mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 md:h-5 md:w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
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

                <p className="text-gray-200 mb-4 flex-grow text-sm md:text-base leading-relaxed" itemProp="reviewBody">
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>

          {testimonials.length > 4 && (
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible md:snap-none">
              {testimonials.slice(4).map((testimonial, index) => (
                <div
                  key={`more-${index}`}
                  className="bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-5 flex-shrink-0 w-[280px] md:w-auto flex flex-col pop-in hover:shadow-cartoon-lg transition-all hover:-rotate-1 snap-start rounded-2xl hover:border-purple-500/50"
                  style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  itemScope
                  itemType="https://schema.org/Review"
                >
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
                    <div itemProp="author" itemScope itemType="https://schema.org/Person">
                      <h3 className="font-bold text-base text-white" itemProp="name">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-300">
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

                  <p className="text-gray-200 mb-3 flex-grow text-sm leading-relaxed line-clamp-3" itemProp="reviewBody">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <section id="testimonials" className="py-8 md:py-12 bg-gray-900/50 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 pop-in text-shadow-lg">
            What Players <span className="gradient-text">Say</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto font-semibold">
            Don't just take our word for it - hear from our happy players!
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start">
          <UserCommentCards />
          {!hasUserReviewed ? (
            <div className="xl:w-1/3 xl:sticky xl:top-24">
              <div className="bg-gray-800/90 backdrop-blur-sm border-2 border-purple-500/50 p-4 sm:p-6 md:p-8 shadow-cartoon-xl rounded-2xl hover:border-purple-400/70 transition-all">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-center text-purple-400 mb-4 md:mb-6">
                  Leave Your Review!
                </h3>

                {!session && (
                  <div className="text-center mb-4 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                    <p className="text-sm text-yellow-200 mb-2">Please sign in to leave a review</p>
                    <p className="text-xs text-yellow-300">You need to be logged in to share your experience with other players.</p>
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-1.5">Your Rating</label>
                    <div className="flex items-center justify-center space-x-2 sm:justify-start">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-8 w-8 sm:h-7 sm:w-7 transition-colors touch-manipulation ${
                            session ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                          } ${
                            (hoverRating || newReview.rating) >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                          onClick={() => session && handleRatingChange(star)}
                          onMouseEnter={() => session && setHoverRating(star)}
                          onMouseLeave={() => session && setHoverRating(0)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="text" className="block text-sm font-bold text-white mb-1.5">
                      Your Review
                    </label>
                    <Textarea
                      id="text"
                      name="text"
                      value={newReview.text}
                      onChange={handleInputChange}
                      placeholder={session ? "Tell us what you think about Speed Stars..." : "Please sign in to leave a review"}
                      rows={4}
                      className="w-full text-base sm:text-base resize-none min-h-[100px] touch-manipulation"
                      disabled={!session}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn-primary w-full text-base sm:text-lg py-4 sm:py-3.5 flex items-center justify-center jello touch-manipulation min-h-[48px]"
                    disabled={isSubmitting || !session}
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
          ) : null}
        </div>
      </div>
    </section>
  )
}