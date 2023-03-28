import { useState, useCallback } from "react";

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? storedValue : defaultValue;
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue(newValue);
      window.localStorage.setItem(key, newValue);
    },
    [key]
  );

  return [value, setStoredValue];
}