import api from "@/app/api"
import { PostComment } from "../types/Post/comment"

export const PublicComment = (data: PostComment) => {
   
    
    return api.post("/api/v1/game/reviews", {...data})
}