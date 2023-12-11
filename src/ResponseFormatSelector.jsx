import { useCallback } from "react";
import InfoLabel from "./InfoLabel.jsx";

export function ResponseFormatSelector({ responseFormat, setResponseFormat }) {

  let value = responseFormat;
  if (value === undefined) {
    value = "default";
  } else {
    value = value.type;
  }

  const setType = useCallback(e => {
    const v = e.target.value;
    if (v === 'default') {
      setResponseFormat(undefined);
    } else {
      setResponseFormat({ type: v });
    }
  }, [setResponseFormat]);

  return <><label>Response Format<InfoLabel href="response_format" /></label>
    <select onChange={setType} value={value}>
      <option value="default">
        Default (Text)
      </option>
      <option value="text">Text</option>
      <option value="json_object">JSON</option>
    </select>
  </>;
}