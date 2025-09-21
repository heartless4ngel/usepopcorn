import type { MovieOmdb } from "../utils/data";

type MovieProps = {
  onSelectMovie: (id: string) => void;
  movie: MovieOmdb;
};
export function Movie({ onSelectMovie, movie }: MovieProps) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓️</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
