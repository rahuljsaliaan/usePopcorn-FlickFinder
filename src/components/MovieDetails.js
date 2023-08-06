import { useEffect, useState } from "react";
import StarRating from "../utils/StarRating";
import { KEY } from "../App";
import { Loader } from "../utils/Loader";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  watched,
  onAddWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    original_title: title,
    Year: year,
    poster_path: posterPath,
    runtime,
    vote_average: imdbRating,
    Plot: plot,
    release_date: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const getPosterUrl = (posterPath, size = "w500") =>
    `https://www.themoviedb.org/t/p/${size}${posterPath}`;

  const poster = getPosterUrl(posterPath);

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: runtime,
    };

    onAddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${selectedId}?api_key=${KEY}`
          );

          const data = await response.json();
          console.log(data);

          setMovie(data);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }

      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime} min
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
              <p>Starring: {actors}</p>
              <p>Directed by: {director}</p>
            </p>
          </section>
        </>
      )}
    </div>
  );
}
