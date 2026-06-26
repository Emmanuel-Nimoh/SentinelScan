import { useEffect, useRef } from 'react';

// Repeatedly invokes `callback` every `interval` ms while `shouldPoll` is true.
// The callback ref avoids resetting the timer on every render.
export function usePolling(callback, shouldPoll = true, interval = 5000) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!shouldPoll) return undefined;

    const timer = setInterval(() => {
      callbackRef.current();
    }, interval);

    return () => clearInterval(timer);
  }, [shouldPoll, interval]);
}
