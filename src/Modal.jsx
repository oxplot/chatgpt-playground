import "./Modal.css";
import { useCallback } from "react";

export function Modal({ onCancel, width, children, contentClassName }) {
  const stopProp = useCallback(e => e.stopPropagation());
  return <div onClick={onCancel} className="modal">
    <div
      onClick={stopProp}
      className={`content ${contentClassName}`}
      style={{ width: width }}
    >{children}</div>
  </div >;
}