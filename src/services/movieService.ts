import axios from "axios";
import type { Movie } from "../types/movie";

interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<TMDBResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  const { data } = await axios.get<TMDBResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: query,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};
