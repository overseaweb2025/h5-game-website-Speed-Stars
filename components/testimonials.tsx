"use client"

import React, { useState, useEffect, useMemo, type FormEvent } from "react"
import { Star, Send, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PublicComment } from "@/app/api/comment/index" // 确保这个路径是正确的
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

interface Review {
    user_name: string;
    rating: number;
    content: string;
    email: string;
    created_at: string;
}

interface TestimonialsProps {
    gameSlug?: string;
    reviews?: Review[];
    t?: any; // 国际化翻译对象
    isHomepage?: boolean;
}

// 独立的评论卡片组件
interface CommentCardProps {
    testimonial: Testimonial;
    t: any;
}

const CommentCard = ({ testimonial, t }: CommentCardProps) => (
    <div
        className="bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-6 flex flex-col rounded-[9px] hover:border-purple-500/50 transition-all m-0"
        itemScope
        
    >
        <div itemProp="itemReviewed" itemScope >
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
            <div itemProp="author" itemScope >
                <h3 className="font-black text-base md:text-lg text-white" itemProp="name">
                    {testimonial.name}
                </h3>
                <p className="text-xs text-gray-300">
                    <meta itemProp="datePublished" content={testimonial.date} />
                    {testimonial.date}
                </p>
            </div>
        </div>

        <div className="flex mb-3" itemProp="reviewRating" itemScope >
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
                {t?.testimonials?.reviewFor?.replace('{gameName}', testimonial.game) || `Review for: ${testimonial.game}`}
            </p>
        )}

        <p className="text-gray-200 mb-4 flex-grow text-sm md:text-base leading-relaxed" itemProp="reviewBody">
            {testimonial.text}
        </p>
    </div>
);

// 为“更多评论”创建的卡片组件（略有不同样式）
const MoreCommentCard = ({ testimonial, t, indexOffset = 0 }: CommentCardProps & { indexOffset?: number }) => (
    <div
        className="bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-5 flex-shrink-0 w-[calc(100vw-2.5rem)] max-w-[280px] md:w-auto flex flex-col rounded-[9px] hover:border-purple-500/50 transition-all snap-start m-0"
        // 只有非首页才应用pop-in动画和旋转效果
        // 如果您希望首页的更多评论也有动画，可以把这些类加回来，但通常首页的布局会更静态
        // className={`bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-5 flex-shrink-0 w-[calc(100vw-2.5rem)] max-w-[280px] md:w-auto flex flex-col rounded-2xl hover:border-purple-500/50 transition-all snap-start ${!isHomepage ? 'pop-in hover:shadow-cartoon-lg hover:-rotate-1' : ''}`}
        // style={{ animationDelay: `${(indexOffset) * 0.1}s` }}
        itemScope
        
    >
        <div itemProp="itemReviewed" itemScope >
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
            <div itemProp="author" itemScope >
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

        <div itemProp="reviewRating" itemScope >
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
);


export default function Testimonials({ gameSlug, reviews, t, isHomepage = false }: TestimonialsProps) {
    const [newReview, setNewReview] = useState({ rating: 0, text: "" })
    const [hoverRating, setHoverRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()

    // 当前游戏名，默认首页用 speed-stars
    const currentGameName = gameSlug || "speed-stars"

    const [testimonials, setTestimonials] = useState<Testimonial[]>([])

    // 当reviews prop更新时，更新testimonials
    useEffect(() => {
        if (Array.isArray(reviews) && reviews.length > 0) {
            const gameName = currentGameName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
            const newMappedReviews: Testimonial[] = reviews.map(r => ({
                name: r.user_name,
                date: r.created_at,
                // 您这里使用了 placeholder.svg，如果session.user?.image存在，应该优先使用
                avatar: session?.user?.image || "/placeholder.svg?height=60&width=60", // 确保这里拿到的是实际的用户头像
                rating: r.rating,
                text: r.content,
                email: r.email,
                likes: 0,
                game: gameName,
            }))
            setTestimonials(newMappedReviews)
        } else {
            setTestimonials([])
        }
    }, [reviews, gameSlug, session]) // 增加 session 依赖，以便在用户登录状态变化时更新 avatar

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
                title: t?.testimonials?.loginRequired || "Login Required",
                description: t?.testimonials?.pleaseSignInToLeaveReview || "Please sign in to leave a review.",
                variant: "destructive",
            })
            return
        }
        if (newReview.rating === 0 || !newReview.text.trim()) {
            toast({
                title: t?.testimonials?.missingInformation || "Missing Information",
                description: t?.testimonials?.fillRatingAndReview || "Please fill in your rating and review text.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            // 发送评论数据到 API
            console.log('执行提交操作',{currentGameName,newReview})
            await PublicComment({
                game_name: currentGameName,
                rating:    newReview.rating,
                content:   newReview.text,
            })
            // 本地添加刚提交评论显示
            const submittedReview: Testimonial = {
                name: session.user?.name || session.user?.email || "Anonymous User",
                rating: newReview.rating,
                text: newReview.text,
                date: "Just now", // 新提交的评论日期显示为 "Just now"
                avatar: session.user?.image || "/placeholder.svg?height=60&width=60",
                likes: 0,
                game: currentGameName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                email: session.user?.email || "",
            }
            // 将新评论添加到最前面
            setTestimonials(prev => [submittedReview, ...prev])

            setNewReview({ rating: 0, text: "" })

            toast({
                title: t?.testimonials?.reviewSubmitted || "Review Submitted!",
                description: t?.testimonials?.thanksForFeedback || "Thanks for your feedback!",
            })
        } catch (error) {
            console.error("Failed to submit review:", error); // 添加详细错误日志
            toast({
                title: t?.testimonials?.submissionFailed || "Submission Failed",
                description: t?.testimonials?.failedToSubmitReview || "Failed to submit your review. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // 判断当前用户是否已经评论过，避免重复显示表单
    const hasUserReviewed = useMemo(() => {
        if (!session?.user?.email) return false
        return testimonials.some(t => t.email === session.user?.email)
    }, [session, testimonials])

    // 是否显示评论表单的逻辑 (已优化)
    const shouldShowReviewForm = useMemo(() => {
        // 如果用户已登录且已评论过，不显示表单
        if (session?.user?.email && hasUserReviewed) return false
        // 其他情况 (未登录或未评论)，显示表单
        return true
    }, [session, hasUserReviewed])

    return (
        <section id="testimonials" className="pb-3 md:pb-7 pt-8 md:pt-12 bg-gray-900/50 rounded-3xl">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 pop-in text-shadow-lg">
                        {t?.testimonials?.whatPlayersSay || "What Players Say"}
                    </h2>
                    <h4 className="text-xl text-gray-200 max-w-2xl mx-auto font-semibold">
                        {t?.testimonials?.dontJustTakeOurWord || "Don't just take our word for it - hear from our happy players!"}
                    </h4>
                </div>

                <div style={{ margin: '0 30px' }}> {/* 保持这个外边距 div */}
                    {isHomepage ? (
                        <>
                            {/* 首页布局：小屏幕一行一条，大屏幕传统布局 */}
                            
                            {/* 小屏幕和移动端：一条评论一行（全宽） */}
                            <div className="sm:hidden grid grid-cols-1 gap-4">
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="col-span-1">
                                        <CommentCard testimonial={testimonial} t={t} />
                                    </div>
                                ))}
                            </div>

                            {/* 中等屏幕及以上：传统布局 */}
                            <div className="hidden sm:block xl:w-2/3 space-y-4 md:space-y-6 mx-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    {testimonials.slice(0, 4).map((testimonial, index) => (
                                        <CommentCard key={index} testimonial={testimonial} t={t} />
                                    ))}
                                </div>
                                {/* 更多评论的横向滚动或网格 */}
                                <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible md:snap-none">
                                    {testimonials.slice(4).map((testimonial, index) => (
                                        <MoreCommentCard key={`more-${index}`} testimonial={testimonial} t={t} indexOffset={index + 4} />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        // 非首页布局：统一的传统布局
                        <div className="xl:w-2/3 space-y-4 md:space-y-6 mx-auto"> {/* 非首页也居中 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {testimonials.slice(0, 4).map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-6 flex flex-col pop-in hover:shadow-cartoon-lg transition-all hover:rotate-1 rounded-[9px] hover:border-purple-500/50 m-0"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        itemScope
                                        
                                    >
                                        <div itemProp="itemReviewed" itemScope >
                                            <meta itemProp="name" content={testimonial.game || "Speed Stars Game Collection"} />
                                            <meta itemProp="applicationCategory" content="Game" />
                                        </div>
                                        {/* 这里是 testimonial card 的内容，与 CommentCard 类似但可能带有动画和特定的 hover 效果 */}
                                        <div className="flex items-center mb-4">
                                            <div
                                                className="h-12 w-12 md:h-14 md:w-14 rounded-full mr-3 md:mr-4 shadow-md border-2 border-white flex items-center justify-center font-black text-white text-base md:text-lg"
                                                style={{ backgroundColor: generateAvatarColor(testimonial.name) }}
                                            >
                                                {getInitials(testimonial.name)}
                                            </div>
                                            <div itemProp="author" itemScope >
                                                <h3 className="font-black text-base md:text-lg text-white" itemProp="name">
                                                    {testimonial.name}
                                                </h3>
                                                <p className="text-xs text-gray-300">
                                                    <meta itemProp="datePublished" content={testimonial.date} />
                                                    {testimonial.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex mb-3" itemProp="reviewRating" itemScope >
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
                                                {t?.testimonials?.reviewFor?.replace('{gameName}', testimonial.game) || `Review for: ${testimonial.game}`}
                                            </p>
                                        )}
                                        <p className="text-gray-200 mb-4 flex-grow text-sm md:text-base leading-relaxed" itemProp="reviewBody">
                                            {testimonial.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible md:snap-none">
                                {testimonials.slice(4).map((testimonial, index) => (
                                    <div
                                        key={`more-${index}`}
                                        className="bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 p-4 md:p-5 flex-shrink-0 w-[calc(100vw-2.5rem)] max-w-[280px] md:w-auto flex flex-col pop-in hover:shadow-cartoon-lg transition-all hover:-rotate-1 snap-start rounded-[9px] hover:border-purple-500/50 m-0"
                                        style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                                        itemScope
                                        
                                    >
                                        <div itemProp="itemReviewed" itemScope >
                                            <meta itemProp="name" content={testimonial.game || "Speed Stars Game Collection"} />
                                            <meta itemProp="applicationCategory" content="Game" />
                                        </div>
                                        {/* 这里是 testimonial card 的内容，与 MoreCommentCard 类似但可能带有动画和特定的 hover 效果 */}
                                        <div className="flex items-center mb-3">
                                            <div
                                                className="h-12 w-12 rounded-full mr-3 shadow-md border-2 border-white flex items-center justify-center font-bold text-white text-sm"
                                                style={{ backgroundColor: generateAvatarColor(testimonial.name) }}
                                            >
                                                {getInitials(testimonial.name)}
                                            </div>
                                            <div itemProp="author" itemScope >
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
                                        <div itemProp="reviewRating" itemScope >
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
                        </div>
                    )}

                    {/* 评论表单的渲染逻辑 */}
                    {shouldShowReviewForm && (
                        <div className="col-span-3 mt-8"> {/* 确保表单在正确的列和有顶部间距 */}
                            <div className="bg-gray-800/90 backdrop-blur-sm border-2 border-purple-500/50 p-4 sm:p-6 md:p-8 shadow-cartoon-xl rounded-lg hover:border-purple-400/70 transition-all">
                                <p className="text-xl sm:text-2xl md:text-3xl font-black text-center text-purple-400 mb-4 md:mb-6">
                                    {testimonials.length === 0 ? (t?.testimonials?.beFirstToReview || 'Be the First to Review!') : (t?.testimonials?.leaveYourReview || 'Leave Your Review!')}
                                </p>

                                {!session && (
                                    <div className="text-center mb-4 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                                        <p className="text-sm text-yellow-200 mb-2">{t?.testimonials?.pleaseSignInToLeaveReview || "Please sign in to leave a review"}</p>
                                        <p className="text-xs text-yellow-300">{t?.testimonials?.needToBeLoggedIn || "You need to be logged in to share your experience with other players."}</p>
                                    </div>
                                )}

                                {/* hasUserReviewed 的提示在表单外展示，避免重复，且更清晰 */}
                                {hasUserReviewed && session && (
                                    <div className="text-center mb-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                                        <p className="text-sm text-green-200 mb-2">{t?.testimonials?.thankYouForReview || "Thank you for your review!"}</p>
                                        <p className="text-xs text-green-300">{t?.testimonials?.alreadySubmittedReview || "You have already submitted a review for this game."}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmitReview} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-white mb-1.5">{t?.testimonials?.yourRating || "Your Rating"}</label>
                                        <div className="flex items-center justify-center space-x-2 sm:justify-start">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`h-8 w-8 sm:h-7 sm:w-7 transition-colors touch-manipulation ${
                                                        session && !hasUserReviewed ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                                                    } ${
                                                        (hoverRating || newReview.rating) >= star
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300 hover:text-yellow-300"
                                                    }`}
                                                    onClick={() => session && !hasUserReviewed && handleRatingChange(star)}
                                                    onMouseEnter={() => session && !hasUserReviewed && setHoverRating(star)}
                                                    onMouseLeave={() => session && !hasUserReviewed && setHoverRating(0)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="text" className="block text-sm font-bold text-white mb-1.5">
                                            {t?.testimonials?.yourReview || "Your Review"}
                                        </label>
                                        <Textarea
                                            id="text"
                                            name="text"
                                            value={newReview.text}
                                            onChange={handleInputChange}
                                            placeholder={
                                                !session
                                                    ? (t?.testimonials?.pleaseSignInToLeaveReview || "Please sign in to leave a review")
                                                    : hasUserReviewed
                                                        ? (t?.testimonials?.alreadyReviewed || "You have already reviewed this game")
                                                        : (t?.testimonials?.tellUsWhatYouThink?.replace('{gameName}', currentGameName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())) || `Tell us what you think about ${currentGameName.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}...`)
                                            }
                                            rows={4}
                                            className="w-full text-base sm:text-base resize-none min-h-[100px] touch-manipulation"
                                            disabled={!session || hasUserReviewed}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="btn-primary w-full text-base sm:text-lg py-4 sm:py-3.5 flex items-center justify-center jello touch-manipulation min-h-[48px]"
                                        disabled={isSubmitting || !session || hasUserReviewed}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t?.testimonials?.submitting || "Submitting..."}
                                            </>
                                        ) : hasUserReviewed ? (
                                            t?.testimonials?.reviewAlreadySubmitted || "Review Already Submitted"
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" /> {t?.testimonials?.submitReview || "Submit Review"}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* 如果没有评论且用户已评论过，显示感谢消息（这个现在应该被上面的 hasUserReviewed 逻辑包含了，但为了清晰，保留其独立判断） */}
                    {testimonials.length === 0 && hasUserReviewed && (
                        <div className="col-span-3 mt-8"> {/* 确保有顶部间距 */}
                            <div className="bg-gray-800/90 backdrop-blur-sm border-2 border-green-500/50 p-8 shadow-cartoon-xl rounded-lg text-center">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t?.testimonials?.thankYou || "Thank You!"}</h3>
                                <p className="text-gray-200">{t?.testimonials?.reviewSubmittedApproval || "Your review has been submitted and will appear once approved."}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}