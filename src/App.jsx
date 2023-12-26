import { useState, useEffect } from "react";
import { WatchedMovieList } from "./components/WatchedMovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { ErrorMessage } from "./utils/ErrorMessage";
import { Loader } from "./utils/Loader";
import { NavBar } from "./components/NavBar";
import { Search } from "./components/Search";
import { NumResults } from "./utils/NumResults";
import { Box } from "./utils/Box";
import { Message } from "./utils/Message";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export const average = (arr) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

export const KEY = "e8aa8854266962110e77b7545569710c";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSelectedMovie(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(movieId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbId !== movieId)
    );
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovie() {
        setIsLoading(true);
        setError("");
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${encodeURIComponent(
              query
            )}`,
            { signal: controller.signal }
          );

          if (!response.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await response.json();

          if (!data.results?.length) throw new Error("Movie not found");

          setMovies(data.results);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      handleCloseMovie();

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {!movies.length && !error && !isLoading && (
            <Message>
              <h3 style={{ fontSize: "2rem" }}>
                <em>
                  Simply type the movie&apos;s title in the search box above,
                  and we&apos;ll do the rest. 🍿
                </em>
              </h3>
            </Message>
          )}
          {isLoading && <Loader />}
          {movies.length > 0 && (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              onSelectMovie={handleSelectedMovie}
            />
          )}
          {error && !movies?.length && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              key={selectedId}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              watched={watched}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              {!watched.length ? (
                <Message>
                  <h3 style={{ fontSize: "2rem" }}>
                    <em>
                      You haven&apos;t watched any movies yet. Start watching
                      now! 🎬
                    </em>
                  </h3>
                </Message>
              ) : (
                <WatchedMovieList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              )}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

import PropTypes from "prop-types";

function Main({ children }) {
  return <main className="main">{children}</main>;
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};
