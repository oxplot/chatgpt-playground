import { useRef, useState, useEffect, useCallback } from 'react';

function numToStr(n) {
  return n === undefined ? '' : n.toString();
}
function strToNum(s) {
  return s.trim() === '' ? undefined : parseFloat(s);
}

const NumberInput = ({ number, setNumber, placeholder = "Default" }) => {

  const [value, setValue] = useState(numToStr(number));
  const valid = strToNum(value) === number;

  useEffect(() => {
    setValue(numToStr(number));
  }, [number]);

  const onInput = useCallback(e => {
    setValue(e.target.value);
    const num = strToNum(e.target.value);
    if (!isNaN(num)) {
      setNumber(num);
    }
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