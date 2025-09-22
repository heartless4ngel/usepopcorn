import type { Watched } from "../utils/data";
import { WatchedMovie } from "./WatchedMovie";

type WatchedMovieListProps = {
  onDeleteWatchedMovie: (id: string) => void;
  watched: Watched[];
};
export function WatchedMovieList({
  onDeleteWatchedMovie,
  watched,
}: WatchedMovieListProps) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie
          onDeleteWatchedMovie={onDeleteWatchedMovie}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
