import { useEffect, useState } from "react";
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

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "e8aa8854266962110e77b7545569710c";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

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
      watched.filter((movie) => movie.imdbID !== movieId)
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
          console.error(error.message);

          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovie();

      return function () {
        controller.abort();
        console.log("abort");
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
                  Simply type the movie's title in the search box above, and
                  we'll do the rest. 🍿
                </em>
              </h3>
            </Message>
          )}
          {isLoading && <Loader />}
          {movies.length > 0 && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && !movies?.length && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              key={selectedId}
              selectedId={selectedId}
              onRemoveSelectedMovie={setSelectedId}
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
                      You haven't watched any movies yet. Start watching now! 🎬
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

function Main({ children }) {
  return <main className="main">{children}</main>;
}
