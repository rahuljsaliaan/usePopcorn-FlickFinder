import { useEffect, useRef, useState } from "react";
import StarRating from "../utils/StarRating";
import { KEY } from "../App";
import { Loader } from "../utils/Loader";
import { getImageUrl } from "../services/utilityServices";
import { useKey } from "../hooks/useKey";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  watched,
  onAddWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useKey("Escape", onCloseMovie);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const {
    title,
    Year: year,
    poster_path: posterPath,
    backdrop_path: backdropPath,
    runtime,
    vote_average: imdbRating,
    release_date: released,
    genres,
    overview,
  } = movie;

  const poster = getImageUrl(posterPath);
  const backdrop = getImageUrl(backdropPath, "w1280");

  function handleAdd() {
    const newMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime,
      backdrop,
      countRatingDecisions: countRef.current,
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

          setMovie(data);
          setIsLoading(false);
        } catch (error) {}
      }

      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(() => {
    document.body.style.backgroundImage = `url(${backdrop})`;

    return function () {
      document.body.style.backgroundImage = "none";
    };
  }, [backdrop]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn-FlickFinder";
    };
  }, [title]);

  return (
    <div className="details fade-in">
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
              <ul className="genre-list">
                {genres &&
                  genres.map((genre) => <li key={genre?.id}>{genre?.name}</li>)}
              </ul>
              <p>{overview}</p>
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
                  <p>
                    Love it or not, your rating counts! Give your star rating
                    for this movie now! 🙂{" "}
                  </p>
                  <StarRating
                    maxRating={10}
                    size={35}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p>You rated this movie 🍿</p>
                  {
                    <StarRating
                      maxRating={watchedUserRating}
                      defaultRating={watchedUserRating}
                      size={35}
                      className="pointer-none"
                      messages={`You rated this movie ${watchedUserRating}`}
                    />
                  }
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
