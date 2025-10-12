import { useEffect, useState } from "react";
import { API_KEY, type Watched } from "../utils/data";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import StarRating from "./StarRating";
import useKey from "../utils/hooks/useKey";

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
  onAddWatched: (movie: Watched) => void;
  onCloseMovie: () => void;
  selectedId: string;
  watchedMovies: Watched[];
};
export default function MovieDetails({
  onAddWatched,
  onCloseMovie,
  selectedId,
  watchedMovies,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<OdmbIdSearchMovie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);

  useKey("keydown", e => {
    if (e.code === "Escape") {
      onCloseMovie();
    }
  });

  const isMovieAlreadyAdded = watchedMovies.some(
    movie => movie.imdbID === selectedId
  );
  const watchedUserRating = watchedMovies.find(
    movie => movie.imdbID
  )?.userRating;

  function handleAdd() {
    if (movie) {
      const newWatchedMovie: Watched = {
        imdbID: selectedId,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        runtime: Number(movie.Runtime.split(" ").at(0)),
        imdbRating: Number(movie.imdbRating),
        userRating,
      };

      onAddWatched(newWatchedMovie);
      onCloseMovie();
    }
  }

  useEffect(() => {
    (async () => {
      setError(null);
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectedId}&apikey=${API_KEY}`
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

  useEffect(() => {
    if (!movie) return;
    document.title = `Movie | ${movie.Title}`;

    return () => {
      document.title = "UsePopcorn";
    };
  }, [movie]);

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
              {!isMovieAlreadyAdded ? (
                <>
                  <StarRating size={24} onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
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
