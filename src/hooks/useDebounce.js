import { useEffect, useState } from "react";

export function useDebounce(data, delay = 500) {
  const [debounceValue, setDebounceValue] = useState(data);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounceValue(data);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, delay]);

  return debounceValue;
}
