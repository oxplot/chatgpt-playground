
import "./LogitBias.css";
import NumberInput from "./NumberInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextToTokens, TokensToText } from "./OpenAI";
import { Modal } from "./Modal";

// Returns array of tokens. Value of -1 indicates an unusable token.
function textToLogitTokens(t) {
  // Due to the method with which the tokenizer assigns tokens to segments of a
  // single Unicode sequence, we cannot interpret a single token as representing
  // one or more characters. This issue arises in the TokensToText process,
  // where the decoder maintains an internal state. When the decoder encounters
  // a token that represents only a part of a character, it produces an empty
  // string. Upon encountering the token that completes the character, it then
  // produces the character. This process is effective for full text encoding
  // and decoding, but for the purpose of logit bias, we are only interested in
  // tokens that correspond to at least one Unicode character. To filter out
  // characters that are represented by multiple tokens, we first encode the
  // text. We then decode each individual token, resetting the decoder state
  // after each token. Finally, we filter out any tokens that do not match the
  // original text.

  // In the future, we may want to consider allowing multi-token characters by
  // hiding the multi-token aspect of the character and add two tokens to the
  // logit bias map, setting their bias to the same value.

  return TextToTokens(t).map(i => {
    const reToken = TextToTokens(TokensToText([i]));
    if (reToken[0] !== i) {
      return -1;
    }
    return i;
  });
}

function visualToken(t) {
  return t === -1 ? "🚫" : TokensToText([Number(t)]).replace(/ /g, '⎵');
}

export default function LogitBiasSet({ logitBiasSet, setLogitBiasSet }) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [addText, setAddText] = useState("");
  const addTextTokens = useMemo(() => {
    return textToLogitTokens(addText);
  }, [addText]);
  const closeAdd = useCallback(() => {
    setShowAddModal(false);
    setAddText("");
  });
  const onAdd = useCallback(() => setShowAddModal(true));
  const onAddTextChange = useCallback(e => setAddText(e.target.value));
  const addToken = useCallback(token => {
    setLogitBiasSet(v => ({ ...v, [`${token}`]: 0 }));
    closeAdd();
  }, [setLogitBiasSet]);

  const addRef = useRef(null);
  useEffect(() => {
    if (showAddModal && addRef) {
      addRef.current.focus();
    }
  }, [showAddModal]);

  return <>
    <table className="logit-bias-set"><tbody>
      {Object.keys(logitBiasSet || {}).sort().map(token =>
        <tr key={token} className="item">
          <td className="token" title={`ID: ${token}`}>{visualToken(token)}</td>
          <td>
            <NumberInput
              number={logitBiasSet[token]}
              setNumber={n => setLogitBiasSet(
                v => ({ ...v, [token]: n })
              )}
              placeholder="Required"
            />
          </td>
          <td
            className="delete"
            title="Delete"
            onClick={() => setLogitBiasSet(v => {
              const { [token]: _, ...rest } = v; // remove token key
              return rest;
            })}
          ></td>
        </tr>
      )}
    </tbody></table >

    <button onClick={onAdd}>Add</button>

    {
      showAddModal &&
      <Modal
        onCancel={closeAdd}
        contentClassName="logit-bias-add-modal"
        width="400px"
      >
        <h2>Add Logit Bias</h2>
        <div><input
          ref={addRef}
          type="text"
          value={addText}
          onChange={onAddTextChange}
          placeholder="Enter text to tokenize"
        /></div>
        <h4>Select token to add:</h4>
        <div className="add-tokens">
          {addTextTokens.length === 0 ?
            <i>no tokens</i> :
            addTextTokens.map((token, i) =>
              token === -1 ?
                <span key={i} className="unusable" title="Unusable">{visualToken(token)}</span>
                :
                <span key={i} title={`ID: ${token}`} onClick={() => addToken(token)}>{visualToken(token)}</span>
            )
          }
        </div>
        <button onClick={closeAdd}>Cancel</button>
      </Modal>
    }
  </>;
}