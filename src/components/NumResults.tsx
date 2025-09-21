import type { MovieOmdb } from "../utils/data";

type NumResultsProps = {
  movies: MovieOmdb[];
};
export function NumResults({ movies }: NumResultsProps) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
