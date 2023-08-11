import { useRef, useEffect } from 'react';
import './APIKeyModal.css';
import { Modal } from './Modal';

export function APIKeyModal({ apiKey, onSave, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  return <Modal onCancel={onCancel} width="320px" contentClassName="api-key-modal">
    <h2>OpenAI API Key</h2>
    <p>
      <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener">Get a new key</a> and
      enter it below:
    </p>
    <input ref={ref} type="text" placeholder="sk-..." defaultValue={apiKey} />
    <button onClick={() => onSave(ref.current.value)}>Save</button>
    &nbsp;
    <button onClick={onCancel}>Cancel</button>
  </Modal>;
}