import { useState, useEffect } from 'react';
import { hashEncode, hashDecode } from './AppStateCodec';
import { useHash } from './Hash';

export default function WindowHash({ state, setState, defaultState, loadState }) {

  const [hash, setHash] = useHash();

  useEffect(() => {
    if (hash === "") {
      loadState(defaultState);
      return;
    }
    try {
      loadState(hashDecode(hash));
    } catch (e) {
      alert('Failed to load state from URL:' + e);
      setState(s => { JSON.parse(JSON.stringify(s)) });
    }
  }, [hash]);

  // State to hash conversion after 200ms of inactivity.
  const [timeoutHandle, setTimeoutHandle] = useState(null);
  useEffect(() => {
    if (timeoutHandle) {
      window.clearTimeout(timeoutHandle);
    }
    setTimeoutHandle(window.setTimeout(() => {
      setHash(hashEncode(state), true);
    }, 200));
  }, [state])
}