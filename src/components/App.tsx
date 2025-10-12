import { NavBar } from "./NavBar";
import { Main } from "./Main";
import { useCallback, useState } from "react";
import { type Watched } from "../utils/data";
import { Logo } from "./Logo";
import { NumResults } from "./NumResults";
import { Search } from "./Search";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { Summary } from "./Summary";
import { WatchedMovieList } from "./WatchedMovieList";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import MovieDetails from "./MovieDetails";
import useMovies from "../utils/hooks/useMovies";
import useLocalStorageState from "../utils/hooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const closeHandleMovie = useCallback(function () {
    setSelectedId(null);
  }, []);

  const { movies, isLoading, error } = useMovies(query, closeHandleMovie);
  const [watched, setWatched] = useLocalStorageState<Watched[]>([], "watched");

  function handleSelectMovie(id: string) {
    setSelectedId(selectedId => (id === selectedId ? null : id));
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
