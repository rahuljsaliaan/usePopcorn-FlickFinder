import { Movie } from "./Movie";

export function MovieList({ movies, selectedId, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.id}
          selectedId={selectedId}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
