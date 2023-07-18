import { useState, useEffect } from 'react';
import { hashEncode, hashDecode } from './AppStateCodec';

export default function WindowHash({ state, defaultState, loadState }) {

  const [oldHash, setOldHash] = useState(null);
  const [hash, setHash] = useState(window.location.hash.replace(/^#/, ''));

  useEffect(() => {
    let toh = null;
    const checkHash = () => {
      const h = window.location.hash.replace(/^#/, '');
      setHash(h);
      toh = window.setTimeout(checkHash, 100);
    };
    toh = window.setTimeout(checkHash, 0);
    return () => {
      window.clearTimeout(toh);
    };
  }, []);

  // Hash to state conversion on changes to hash.
  useEffect(() => {
    if (hash === oldHash) {
      return;
    }
    setOldHash(hash);
    if (hash === "") {
      loadState(defaultState);
      return;
    }
    try {
      loadState(hashDecode(hash));
    } catch (e) {
      alert('Failed to load state from URL:' + e);
      console.log(hash, oldHash);
      loadState(JSON.parse(JSON.stringify(state)))
    }
  }, [hash, oldHash]);

  // State to hash conversion after 200ms of inactivity.
  const [timeoutHandle, setTimeoutHandle] = useState(null);
  useEffect(() => {
    if (timeoutHandle) {
      window.clearTimeout(timeoutHandle);
    }
    setTimeoutHandle(window.setTimeout(() => {
      let h = hashEncode(state)
      setHash(h);
      setOldHash(h);
      const url = window.location.href.split('#')[0] + '#' + h;
      window.history.replaceState(null, null, url);
    }, 200));
  }, [state])

  return '';
}