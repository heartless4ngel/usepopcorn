import type { Watched } from "../utils/data";

type WatchedMovieProps = {
  onDeleteWatchedMovie: (id: string) => void;
  movie: Watched;
};
export function WatchedMovie({
  onDeleteWatchedMovie,
  movie,
}: WatchedMovieProps) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime.toFixed(2)} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDeleteWatchedMovie(movie.imdbID)}
      >
        &#x2715;
      </button>
    </li>
  );
}
