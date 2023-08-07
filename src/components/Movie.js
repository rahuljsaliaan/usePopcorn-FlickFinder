import { getImageUrl } from "../services/utilityServices";

export function Movie({ movie, onSelectMovie }) {
  const poster = getImageUrl(movie.poster_path);

  return (
    <li onClick={() => onSelectMovie(movie.id)} key={movie.id}>
      <img src={poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date}</span>
        </p>
      </div>
    </li>
  );
}
