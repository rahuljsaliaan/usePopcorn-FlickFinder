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

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "f0e5fc51";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // NOTE: Effects only runs after the browser paint
  /*
  useEffect(function () {
    // runs after initial render
    console.log("A");
  }, []);

  useEffect(function () {
    // runs after each render and re-render
    console.log("B");
  });

  useEffect(
    function () {
      // runs after there is a change in the query state (dependency)
      console.log("D");
    },
    [query]
  );
  console.log("C");
*/

  function handleSelectedMovie(movieId) {
    setSelectedId((selectedId) => (movieId === selectedId ? null : movieId));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    console.log(watched);
  }

  function handleDeleteWatched(movieId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== movieId)
    );
  }

  useEffect(
    function () {
      // fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=interstellar`)
      //   .then((response) => response.json())
      //   .then((data) => setMovies(data.Search));

      async function fetchMovie() {
        setIsLoading(true);
        setError("");
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
          );

          if (!response.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await response.json();

          if (!data.Search) throw new Error("Movie not found");

          setMovies(data.Search);
        } catch (error) {
          console.error(error.message);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovie();
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
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && !movies?.length && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              watched={watched}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// * Main Component
function Main({ children }) {
  return <main className="main">{children}</main>;
}
