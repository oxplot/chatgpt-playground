import { useCallback, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { openAICompletionURL } from './OpenAI';

export function CompletionURLModal({ completionURL, onSave, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  const reset = useCallback(() => {
    if (ref.current) {
      ref.current.value = openAICompletionURL;
    }
  }, [ref]);
  return <Modal onCancel={onCancel} width="500px">
    <h2>Chat Completion Endpoint</h2>
    <input
      ref={ref}
      style={{ marginBottom: "1em" }}
      type="text"
      placeholder="https://..."
      defaultValue={completionURL} />
    <button onClick={() => onSave(ref.current.value)}>Save</button>
    &nbsp;
    <button onClick={onCancel}>Cancel</button>
    &nbsp;
    <button style={{ float: "right" }} onClick={reset}>Reset to OpenAI</button>
  </Modal>;
}