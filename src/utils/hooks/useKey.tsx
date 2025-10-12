import { useEffect, useRef } from "react";

export default function useKey<K extends keyof DocumentEventMap>(
  keyListener: K,
  callback: (e: DocumentEventMap[K]) => void
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    const handler = (e: DocumentEventMap[K]) => cbRef.current(e);

    document.addEventListener(keyListener, handler as EventListener);
    return () => {
      document.removeEventListener(keyListener, handler as EventListener);
    };
  }, [keyListener]);
}
