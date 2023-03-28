import { useRef, useState, useEffect, useCallback } from 'react';

function numToStr(n) {
  return n === undefined ? '' : n.toString();
}
function strToNum(s) {
  return s === '' ? undefined : parseFloat(s);
}

const NumberInput = ({ number, setNumber, placeholder = "Default" }) => {

  const ref = useRef(null);
  const [value, setValue] = useState(numToStr(number));
  const valid = strToNum(value) === number;

  useEffect(() => {
    if (ref && document.activeElement !== ref.current) {
      setValue(numToStr(number));
    }
  }, [number]);

  const onInput = useCallback(e => {
    setValue(e.target.value);
    setNumber(strToNum(e.target.value));
  }, [setNumber]);

  const onBlur = useCallback(() => {
    setValue(numToStr(number));
  }, [number]);

  return (
    <input
      type="text"
      value={value}
      onBlur={onBlur}
      onInput={onInput}
      placeholder={placeholder}
      className={valid ? '' : 'invalid'}
    />
  );
};

export default NumberInput;