import { useRef } from "react";
import useKey from "../utils/hooks/useKey";

type SearchProps = {
  query: string;
  setQuery: (query: string) => void;
};

export function Search({ query, setQuery }: SearchProps) {
  const inputEl = useRef<HTMLInputElement | null>(null);
  useKey("keydown", e => {
    if (e.code === "Enter") {
      if (document.activeElement === inputEl.current) return;
      inputEl.current?.focus();
      setQuery("");
    }
  });

  return (
    <input
      autoFocus
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
