export interface ApiResponse<T> {
  meta: any;
  code?: number;
  data: T;
  message?: string;
}
export interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
}
export interface GoogleLogin {
  name:string;
  email:string;
  provider_name:string;
  provider_id:string;
}
export interface token {
  name: string,
  email: string,
  picture: string,
  sub: string
}
export interface Comment{
  gameId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}