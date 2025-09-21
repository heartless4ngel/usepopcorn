import type { MovieOmdb } from "../utils/data";
import { Movie } from "./Movie";

type MovieListProps = {
  onSelectMovie: (id: string) => void;
  movies: MovieOmdb[];
};
export function MovieList({ onSelectMovie, movies }: MovieListProps) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
