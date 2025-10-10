import type { MovieOmdb } from "./data";

export const average = (arr: number[]) =>
  arr.reduce(
    (acc: number, cur: number, _i: number, arr: number[]) =>
      acc + cur / arr.length,
    0
  );

const MAX_ITEMS = 50;
const normalize = (q: string) => q.trim().toLowerCase();
export function getFromCache(cache: Map<string, MovieOmdb[]>, q: string) {
  const key = normalize(q);
  const data = cache.get(key);
  if (!data) return null;

  cache.delete(key);
  cache.set(key, data);
  return data;
}

export function setToCache(
  cache: Map<string, MovieOmdb[]>,
  q: string,
  data: MovieOmdb[]
) {
  const key = normalize(q);
  cache.delete(key);
  cache.set(key, data);
  if (cache.size > MAX_ITEMS) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (oldestKey) cache.delete(oldestKey);
  }
}
