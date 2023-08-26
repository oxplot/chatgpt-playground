import "./Vars.css";

// Substitutes variables in the app state with their values from a map or with a

import AutoExtendingTextarea from "./AutoExtendingTextarea";

// result of a function.
export function sub(openai_payload, repl) {
  let replFn;
  if (typeof repl === 'function') {
    replFn = (_, v) => repl(v);
  } else {
    let vars = repl;
    replFn = (_, v) => vars[v];
  }
  openai_payload = JSON.parse(JSON.stringify(openai_payload)); // clone
  const pat = /\$\{([a-z0-9_.-]+)\}/ig;
  openai_payload.messages = openai_payload.messages.map(m => {
    if (m.role !== 'assistant') {
      m.content = m.content.replace(pat, replFn);
    }
    return m;
  });
  return openai_payload;
}

export function Vars({ openai_payload, appVars, setAppVars }) {
  const vars = new Set();
  sub(openai_payload, v => vars.add(v));

  return <div>
    {[...vars].sort().map(v =>
      <div key={v}>
        <label className="var-name">{v}</label>
        <AutoExtendingTextarea
          className="var-value"
          onInput={(e) => setAppVars({ ...appVars, [v]: e.target.value })}
          value={appVars[v] || ''}
        />
      </div>
    )}
  </div >
}