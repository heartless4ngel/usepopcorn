import { useEffect, useRef } from "react";

type SearchProps = {
  query: string;
  setQuery: (query: string) => void;
};

export function Search({ query, setQuery }: SearchProps) {
  const inputEl = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.code === "Enter") {
        if (document.activeElement === inputEl.current) return;
        inputEl.current?.focus();
        setQuery("");
      }
    }
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);

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
