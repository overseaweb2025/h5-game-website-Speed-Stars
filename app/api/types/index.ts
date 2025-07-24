interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseDate: string;
}