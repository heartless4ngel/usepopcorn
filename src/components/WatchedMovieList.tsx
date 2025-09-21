import type { Watched } from "../utils/data";
import { WatchedMovie } from "./WatchedMovie";

type WatchedMovieListProps = {
  watched: Watched[];
};
export function WatchedMovieList({ watched }: WatchedMovieListProps) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
