import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export default function useLocalStorageState<T>(
  initialState: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
