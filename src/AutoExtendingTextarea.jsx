import { useEffect, useRef, forwardRef, useState } from "react"

export default AutoExtendingTextarea = forwardRef((props, forwardedRef) => {
  const [width, setWidth] = useState(-1);
  const shadowRef = useRef(null);
  const internalRef = useRef(null);
  const ref = forwardedRef || internalRef;
  useEffect(() => {
    if (ref.current !== null) {
      ref.current.style.height = (5 + shadowRef.current.scrollHeight) + "px";
    }
  }, [width, shadowRef, ref, props.value]);

  const shadowStyle = {
    minHeight: "0",
    height: "0",
    border: "0",
    margin: "0",
    padding: "0",
    shadowStyle: "0",
    overflow: "hidden",
  };

  // Force recalculate height if width changes.
  useEffect(() => {
    const observer = new ResizeObserver(e => { setWidth(e[0].contentRect.width) });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref.current]);

  return <>
    <div style={shadowStyle}>
      <textarea {...props} disabled ref={shadowRef} />
    </div>
    <textarea {...props} ref={ref} />
  </>
})