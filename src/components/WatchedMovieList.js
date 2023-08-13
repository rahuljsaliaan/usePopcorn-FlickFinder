import { WatchedMovie } from "./WatchedMovie";

export function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list fade-in">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbId}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
