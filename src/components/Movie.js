export function Movie({ movie, onSelectMovie }) {
  const getPosterUrl = (posterPath, size = "w500") =>
    `https://www.themoviedb.org/t/p/${size}${posterPath}`;

  const poster = getPosterUrl(movie.poster_path);

  return (
    <li onClick={() => onSelectMovie(movie.id)} key={movie.id}>
      <img
        src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${poster}`}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
