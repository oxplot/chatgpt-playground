import { encode, decode } from "gpt-tokenizer/esm/encoding/cl100k_base"

export const openAICompletionURL = "https://api.openai.com/v1/chat/completions";

export function createRequest({ apiKey, payload, dataCallback, completionURL = openAICompletionURL }) {
  const abortController = new AbortController();
  return {
    send: async () => {
      const response = await fetch(completionURL, {
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
    id: "gpt-4o",
    alias: "gpt-4o-2024-05-13",
  },
  {
    id: "gpt-4-turbo",
    alias: "gpt-4-turbo-2024-04-09",
  },
  {
    id: "gpt-4-turbo-preview",
    alias: "gpt-4-0125-preview",
  },
  {
    id: "gpt-4-vision-preview",
    alias: "gpt-4-1106-vision-preview",
  },
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
    alias: "gpt-3.5-turbo-0125",
  },

  {
    id: "gpt-4o-2024-05-13",
    promptCost: 1e-5 / 2,
    completionCost: 3e-5 / 2,
  },
  {
    id: "gpt-4-turbo-2024-04-09",
    promptCost: 1e-5,
    completionCost: 3e-5,
  },
  {
    id: "gpt-4-0125-preview",
    promptCost: 1e-5,
    completionCost: 3e-5,
  },
  {
    id: "gpt-4-1106-preview",
    promptCost: 1e-5,
    completionCost: 3e-5,
  },
  {
    id: "gpt-4-1106-vision-preview",
    promptCost: 1e-5,
    completionCost: 3e-5,
  },


  {
    id: "gpt-4-0613",
    promptCost: 3e-5,
    completionCost: 6e-5,
  },
  {
    id: "gpt-4-32k-0613",
    promptCost: 6e-5,
    completionCost: 1.2e-4,
  },
  {
    id: "gpt-4-0314",
    promptCost: 3e-5,
    completionCost: 6e-5,
  },

  {
    id: "gpt-3.5-turbo-0125",
    promptCost: 5e-7,
    completionCost: 1.5e-6,
  },
  {
    id: "gpt-3.5-turbo-1106",
    promptCost: 5e-7,
    completionCost: 1.5e-6,
  },
  {
    id: "gpt-3.5-turbo-0301",
    promptCost: 5e-7,
    completionCost: 1.5e-6,
  },

  // Fine tuned and other base models.

  {
    prefix: "ft:gpt-3.5-turbo-0613:",
    promptCost: 3e-6,
    completionCost: 6e-6,
  }
];

modelNamesSortedByLength = models.map(m => m.id).sort((a, b) => b.length - a.length);

export function createValidator() {
  return p => {
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
    // Logit bias keys must be non-negative integers.
    for (const key of Object.keys(p.logit_bias || {})) {
      if (!/^\d+$/.test(key)) {
        throw "Logit bias keys must be non-negative integers.";
      }
    }
  };
}

// This is an estimate arrived at by running a whole bunch of text through
// tiktoken tokenizer.
const charToTokenRatio = 0.34;

export function estimateCost(payload) {

  let model = models.find(m => m.id ? m.id === payload.model : payload.model.startsWith(m.prefix));
  if (model && model.alias) {
    model = models.find(m => m.id === model.alias);
  }

  let totalCost = 0;
  let roundTrips = 0;

  // Walk through the conversation.
  // Skip to end of each consequetive sequence of user messages.
  // For assistant messages, add one to the set one at a time.

  for (var upTo = 0; upTo < payload.messages.length; upTo++) {
    const msg = payload.messages[upTo];
    if (msg.role === "assistant") {
      if (model) {
        const promptChars = payload.messages.slice(0, upTo).map(
          m => m.function_call ? m.function_call.arguments : m.content
        ).join('').length;
        const promptCost = promptChars * charToTokenRatio * model.promptCost;
        const completionCost = (msg.function_call ? msg.function_call.arguments : msg.content).length * charToTokenRatio * model.completionCost;
        totalCost += promptCost + completionCost;
      }
      roundTrips++;
    }
  }
  // In case the conversation doesn't end with assistant messages, just
  // calculate the prompt cost.
  if (model && payload.messages.slice(-1)[0].role !== "assistant") {
    const promptChars = payload.messages.slice(0, upTo).map(
      m => m.function_call ? m.function_call.arguments : m.content
    ).join('').length;
    const promptCost = promptChars * charToTokenRatio * model.promptCost;
    totalCost += promptCost;
  }

  // Add functions
  if (model && payload.functions) {
    const promptCost = JSON.stringify(payload.functions).length * charToTokenRatio * model.promptCost;
    totalCost += promptCost;
  }

  return { totalCost: model ? totalCost : null, roundTrips };
}

export function ModelDropdown({ model, setModel }) {
  const baseModel = !!models.find(m => m.id === model);
  return <>
    <select onChange={e => setModel(e.target.value)} value={baseModel ? model : ""}>
      {models.filter(m => m.id && m.alias).map(({ id }, i) => <option key={id} value={id}>{id}</option>)}
      <option disabled>Snapshots</option>
      {models.filter(m => m.id && !m.alias).map(({ id }, i) => <option key={id} value={id}>{id}</option>)}
      <option disabled>Others</option>
      <option value="">Custom</option>
    </select>
    {!baseModel &&
      <input
        type="text"
        placeholder="Custom model name"
        style={{ marginTop: "2px" }}
        onChange={e => setModel(e.target.value)}
        value={model} />
    }
  </>;
}

// This is necessary because the tokenizer is stateful to handle multi-GPT token
// unicode characters.
function flushTokenizerState() {
  decode(encode("1 2 3 4"));
}

export function TokensToText(t) {
  flushTokenizerState();
  return decode(t);
}

export function TextToTokens(t) {
  flushTokenizerState();
  return encode(t);
}