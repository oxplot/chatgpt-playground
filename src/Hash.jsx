import { useState, useCallback, useEffect } from 'react';

export const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handler = () => setHash(window.location.hash.replace(/^#/, ''));
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, []);

  const updateHash = useCallback(
    (newHash, replace) => {
      if (newHash !== hash) {
        if (replace) {
          window.history.replaceState(null, null, '#' + newHash);
        } else {
          window.location.hash = newHash;
        }
      }
    },
    [hash]
  );

  return [hash, updateHash];
};