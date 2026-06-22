import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import css from "./App.module.css";
import MovieModal from "../MovieModal/MovieModal";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };
  useEffect(() => {
    if (query === "") {
      return;
    }
    const getMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setMovies([]);
        const data = await fetchMovies(query);
        if (data.length === 0) {
          toast.error("No movies found for your request.");
          return;
        }
        setMovies(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getMovies();
  }, [query]);
  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" reverseOrder={false} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && !isLoading && !isError && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
