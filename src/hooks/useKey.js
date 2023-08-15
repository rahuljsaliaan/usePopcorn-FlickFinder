import { useEffect } from "react";

export function useKey(key, callBack) {
  useEffect(
    function () {
      function handleKeyDown(e) {
        if (e.key.toLowerCase() !== key.toLowerCase()) return;

        callBack();
      }

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    },
    [callBack, key]
  );
}
