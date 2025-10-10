import { useEffect, useRef, useState } from "react";
import { getFromCache, setToCache } from "../helper";
import { API_KEY, type MovieOmdb } from "../data";
import useDebouncedValue from "./useDebounced";

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

export default function useMovies(query: string, callback?: () => void) {
  const [movies, setMovies] = useState<MovieOmdb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, MovieOmdb[]>>(new Map());

  const debouncedQuery = useDebouncedValue(query, 500);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(null);

          const cached = getFromCache(cacheRef.current, debouncedQuery);
          if (cached) {
            setMovies(cached);
            return;
          }

          const res = await fetch(
            `http://www.omdbapi.com/?s=${debouncedQuery}&apikey=${API_KEY}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data: OmdbSearchResponse = await res.json();

          if (data.Response === "False") throw new Error(data.Error);

          setToCache(
            cacheRef.current,
            debouncedQuery,
            data.Search as MovieOmdb[]
          );
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
      }
      if (!debouncedQuery.length) {
        setMovies([]);
        setError(null);
        return;
      }
      if (debouncedQuery.length > 2) {
        callback?.();
        fetchMovies();
      }

      return () => {
        if (controller) {
          controller.abort();
        }
      };
    },
    [debouncedQuery, callback]
  );

  return { movies, isLoading, error };
}
