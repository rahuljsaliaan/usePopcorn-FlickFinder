import { useRef, useEffect } from "react";

export function Search({ query, setQuery }) {
  const inputEl = useRef();

  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.key !== "Enter") return;

        inputEl.current.focus();
        setQuery("");
      }

      document.addEventListener("keydown", callBack);
      return () => document.removeEventListener("keydown", callBack);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
