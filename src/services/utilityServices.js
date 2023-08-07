export const getImageUrl = (posterPath, size = "w500") =>
  posterPath
    ? `https://www.themoviedb.org/t/p/${size}${posterPath}`
    : "/img/usePopcorn-poster-frame.png";
