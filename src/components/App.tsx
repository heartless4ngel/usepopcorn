import { NavBar } from "./NavBar";
import { Main } from "./Main";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_KEY, type MovieOmdb, type Watched } from "../utils/data";
import { Logo } from "./Logo";
import { NumResults } from "./NumResults";
import { Search } from "./Search";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { Summary } from "./Summary";
import { WatchedMovieList } from "./WatchedMovieList";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { getFromCache, setToCache, useDebouncedValue } from "../utils/helper";
import MovieDetails from "./MovieDetails";

type OmdbSearchResponse =
  | { Response: "True"; Search: OmdbSearchItemRaw[]; totalResults: string }
  | { Response: "False"; Error: string };

interface OmdbSearchItemRaw {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode" | string;
  Poster: string;
}

export default function App() {
  const [movies, setMovies] = useState<MovieOmdb[]>([]);
  const [watched, setWatched] = useState<Watched[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, 500);
  const cacheRef = useRef<Map<string, MovieOmdb[]>>(new Map());
  const controllerRef = useRef<AbortController | null>(null);
  const fetchMovies = useCallback(async function (
    title: string = ""
  ): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const cached = getFromCache(cacheRef.current, title);
      if (cached) {
        setMovies(cached);
        return;
      }

      controllerRef.current = new AbortController();

      const res = await fetch(
        `http://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`,
        { signal: controllerRef.current.signal }
      );

      if (!res.ok) throw new Error("Something went wrong with fetching movies");

      const data: OmdbSearchResponse = await res.json();

      if (data.Response === "False") throw new Error(data.Error);

      setToCache(cacheRef.current, title, data.Search as MovieOmdb[]);
      setMovies(data.Search as MovieOmdb[]);
    } catch (err) {
      let msg: string;
      if (err instanceof Error) {
        if (err.name === "AbortError") return;
        msg = err.message;
      } else {
        msg = String(err);
      }
      setError(msg);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  },
  []);
  useEffect(
    function () {
      if (!debouncedQuery.length) {
        setMovies([]);
        setError(null);
        return;
      }
      if (debouncedQuery.length > 2) {
        closeHandleMovie();
        fetchMovies(debouncedQuery);
      }
      return () => {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
      };
    },
    [debouncedQuery, fetchMovies]
  );

  function handleSelectMovie(id: string) {
    setSelectedId(selectedId => (id === selectedId ? null : id));
  }

  function closeHandleMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie: Watched) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id: string) {
    setWatched(movies => movies.filter(movie => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              onCloseMovie={closeHandleMovie}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              watchedMovies={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
