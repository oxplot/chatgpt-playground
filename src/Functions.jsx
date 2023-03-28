import { useCallback, useState, useEffect, useRef } from "react";
import AutoExtendingTextarea from "./AutoExtendingTextarea";

const stringify = s => s ? JSON.stringify(s, null, "  ") : '';
const parse = s => {
  if (s === '') {
    return undefined;
  }
  try {
    return JSON.parse(s);
  } catch {
    return [22, "invalid"]; // a hack to fail the validation
  }
};
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function Functions({ functions, setFunctions }) {
  const ref = useRef(null);
  const [value, setValue] = useState(stringify(functions));
  // setFunctions only updates the functions when the value is valid.
  const valid = deepEqual(parse(value), functions);

  useEffect(() => {
    if (ref && document.activeElement !== ref.current) {
      setValue(stringify(functions));
    }
  }, [functions]);

  const onInput = useCallback(e => {
    setValue(e.target.value);
    setFunctions(parse(e.target.value));
  }, [setFunctions]);

  const onBlur = useCallback((e) => {
    if (!valid) {
      if (window.confirm("Your input is invalid and will be reverted to last valid one if you continue. Are you sure?")) {
        setValue(stringify(functions));
      } else {
        // HACK: This is a hack to prevent the textarea from losing focus.
        window.setTimeout(() => e.target.focus(), 10);
      }
    }
  }, [valid, functions]);

  return <AutoExtendingTextarea
    ref={ref}
    onInput={onInput}
    onBlur={onBlur}
    value={value}
    className={valid ? '' : 'invalid'}
  />
}