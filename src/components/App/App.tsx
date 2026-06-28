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
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;
function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  useEffect(() => {
    if (data && movies.length === 0 && query !== "") {
      toast.error("No movies found for your request.");
    }
  }, [data, query, movies.length]);

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      <Toaster position="top-right" reverseOrder={false} />
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
