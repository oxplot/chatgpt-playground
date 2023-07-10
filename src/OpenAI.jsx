import validate from "./openai-payload-validate.js";

export function createRequest({ apiKey, payload, dataCallback }) {
  const abortController = new AbortController();
  return {
    send: async () => {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...payload, stream: true, n: 1 }),
        signal: abortController.signal,
      });
      if (!response.ok) {
        var jsonErr;
        try {
          jsonErr = await response.json();
        } catch (e) { }
        if (jsonErr) {
          throw 'APIError: ' + (jsonErr.error.message || jsonErr.error.code);
        }
        throw `HTTPError: ${response.status}`;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      var buf = "";
      while (true) {
        var { value, done } = await reader.read();
        if (done) {
          throw "APIError: stream ended unexpectedly";
        }
        buf += decoder.decode(value);
        while (buf.indexOf("\n") !== -1) {
          const nlIdx = buf.indexOf("\n");
          var line = buf.slice(0, nlIdx).trim();
          buf = buf.slice(nlIdx + 1);
          if (!line.startsWith("data:")) {
            continue;
          }
          line = line.slice("data:".length).trim();
          if (line === "[DONE]") {
            await dataCallback();
            return;
          }
          const data = JSON.parse(line);
          if (data.error) {
            throw `${data.error.type}: ${data.error.message}`;
          }
          await dataCallback(data.choices[0]);
        }
      }
    },
    cancel: () => abortController.abort(),
  };
}

export const models = [
  {
    id: "gpt-4",
    alias: "gpt-4-0613",
  },
  {
    id: "gpt-4-32k",
    alias: "gpt-4-32k-0613",
  },
  {
    id: "gpt-3.5-turbo",
    alias: "gpt-3.5-turbo-0613",
  },
  {
    id: "gpt-3.5-turbo-16k",
    alias: "gpt-3.5-turbo-16k-0613",
  },

  {
    id: "gpt-4-0613",
    promptCost: 0.00003,
    completionCost: 0.00006,
  },
  {
    id: "gpt-4-32k-0613",
    promptCost: 0.00006,
    completionCost: 0.00012,
  },
  {
    id: "gpt-3.5-turbo-0613",
    promptCost: 0.0000015,
    completionCost: 0.000002,
  },
  {
    id: "gpt-3.5-turbo-16k-0613",
    promptCost: 0.000003,
    completionCost: 0.000004,
  },

  {
    id: "gpt-4-0314",
    promptCost: 0.00003,
    completionCost: 0.00006,
  },
  {
    id: "gpt-3.5-turbo-0301",
    promptCost: 0.0000015,
    completionCost: 0.000002,
  },
];

export function createValidator() {
  return p => {
    const a = new Date().getTime();
    if (!validate(p)) {
      throw validate.errors;
    }
    // There must be one and only one system message and it must be the first
    // message.
    if (p.messages.length === 0 || p.messages[0].role !== "system") {
      throw "The first message must be a system message.";
    }
    if (p.messages.slice(1).find(m => m.role === "system")) {
      throw "There can be only one system message.";
    }
    // Duplicate function names are disallowed.
    const nameSet = new Set();
    for (const fn of p.functions || []) {
      if (nameSet.has(fn.name)) {
        throw "Duplicate function names are not allowed."
      } else {
        nameSet.add(fn.name);
      }
    }
  };
}

// This is an estimate arrived at by running a whole bunch of text through
// tiktoken tokenizer.
const charToTokenRatio = 0.34;

export function estimateCost(payload) {

  let model = models.find(m => m.id === payload.model);
  if (model.alias) {
    model = models.find(m => m.id == model.alias);
  }
  var totalCost = 0;
  var roundTrips = 0;

  // Walk through the conversation.
  // Skip to end of each consequetive sequence of user messages.
  // For assistant messages, add one to the set one at a time.

  for (var upTo = 0; upTo < payload.messages.length; upTo++) {
    const msg = payload.messages[upTo];
    if (msg.role === "assistant") {
      const promptChars = payload.messages.slice(0, upTo).map(
        m => m.function_call ? m.function_call.arguments : m.content
      ).join('').length;
      const promptCost = promptChars * charToTokenRatio * model.promptCost;
      const completionCost = (msg.function_call ? msg.function_call.arguments : msg.content).length * charToTokenRatio * model.completionCost;
      totalCost += promptCost + completionCost;
      roundTrips++;
    }
  }
  // In case the conversation doesn't end with assistant messages, just
  // calculate the prompt cost.
  if (payload.messages.slice(-1)[0].role !== "assistant") {
    const promptChars = payload.messages.slice(0, upTo).map(
      m => m.function_call ? m.function_call.arguments : m.content
    ).join('').length;
    const promptCost = promptChars * charToTokenRatio * model.promptCost;
    totalCost += promptCost;
  }

  // Add functions
  if (payload.functions) {
    const promptCost = JSON.stringify(payload.functions).length * charToTokenRatio * model.promptCost;
    totalCost += promptCost;
  }

  return { totalCost, roundTrips };
}

export function ModelDropdown({ model, setModel }) {
  return <select onChange={e => setModel(e.target.value)} value={model}>
    {models.filter(m => m.alias).map(({ id }, i) => <option key={id} value={id}>{id}</option>)}
    <option disabled>Snapshots</option>
    {models.filter(m => !m.alias).map(({ id }, i) => <option key={id} value={id}>{id}</option>)}
  </select>;
}
