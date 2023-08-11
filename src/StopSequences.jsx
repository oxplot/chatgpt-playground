import { useCallback, useState, useEffect, useRef } from "react";
import { } from "react";
import AutoExtendingTextarea from "./AutoExtendingTextarea";

function strToList(s) {
  const l = s.split("\n").filter(v => v);
  if (l.length === 0) {
    return undefined;
  }
  return l;
}

function listToStr(l) {
  if (l === undefined) {
    return "";
  }
  return l.join("\n");
}

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function StopSequences({ stopSequences, setStopSequences }) {
  const ref = useRef(null);
  const [value, setValue] = useState(listToStr(stopSequences));
  const valid = deepEqual(strToList(value), stopSequences);

  useEffect(() => {
    if (ref && document.activeElement !== ref.current) {
      setValue(listToStr(stopSequences));
    }
  }, [stopSequences]);

  const onInput = useCallback(e => {
    setValue(e.target.value);
    setStopSequences(strToList(e.target.value));
  }, [setStopSequences]);

  const onBlur = useCallback(() => {
    setValue(listToStr(stopSequences));
  }, [stopSequences]);

  return <AutoExtendingTextarea
    ref={ref}
    onInput={onInput}
    onBlur={onBlur}
    value={value}
    className={valid ? '' : 'invalid'}
  />;
}