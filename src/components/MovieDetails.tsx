import { useEffect, useState } from "react";
import { API_KEY } from "../utils/data";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import StarRating from "./StarRating";

interface OdmbIdSearchMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
}

interface OdmbIdSearchOk extends OdmbIdSearchMovie {
  Response: "True";
}

type OdmbIdSearchResponse =
  | OdmbIdSearchOk
  | { Response: "False"; Error: string };

type MovieDetailsProps = {
  onCloseMovie: () => void;
  selectedId: string;
};
export default function MovieDetails({
  onCloseMovie,
  selectedId,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<OdmbIdSearchMovie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedId}&apikey=${API_KEY}`
        );
        const data: OdmbIdSearchResponse = await res.json();

        if (data.Response === "False") throw new Error(data.Error);

        setMovie(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!error && movie && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={movie.Poster} alt={movie.Title} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating size={24} />
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
