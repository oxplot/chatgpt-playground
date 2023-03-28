"use strict";module.exports = validate10;module.exports.default = validate10;const schema11 = {"type":"object","properties":{"model":{"description":"ID of the model to use. See the [model endpoint compatibility](/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.","example":"gpt-3.5-turbo","oneOf":[{"type":"string","enum":["gpt-4","gpt-4-0613","gpt-4-32k","gpt-4-32k-0613","gpt-3.5-turbo","gpt-3.5-turbo-16k","gpt-3.5-turbo-0613","gpt-3.5-turbo-16k-0613","gpt-4-0314","gpt-3.5-turbo-0301"]}]},"messages":{"description":"A list of messages comprising the conversation so far. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb).","type":"array","minItems":1,"items":{"type":"object","properties":{"role":{"type":"string","enum":["system","user","assistant","function"],"description":"The role of the messages author. One of `system`, `user`, `assistant`, or `function`."},"content":{"type":"string","description":"The contents of the message. `content` is required for all messages except assistant messages with function calls."},"name":{"type":"string","description":"The name of the author of this message. `name` is required if role is `function`, and it should be the name of the function whose response is in the `content`. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters."},"function_call":{"type":"object","description":"The name and arguments of a function that should be called, as generated by the model.","properties":{"name":{"type":"string","description":"The name of the function to call."},"arguments":{"type":"string","description":"The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function."}}}},"required":["role"]}},"functions":{"description":"A list of functions the model may generate JSON inputs for.","type":"array","minItems":1,"items":{"type":"object","properties":{"name":{"type":"string","description":"The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64."},"description":{"type":"string","description":"The description of what the function does."},"parameters":{"type":"object","description":"The parameters the functions accepts, described as a JSON Schema object. See the [guide](/docs/guides/gpt/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.","additionalProperties":true}},"required":["name"]}},"function_call":{"description":"Controls how the model responds to function calls. \"none\" means the model does not call a function, and responds to the end-user. \"auto\" means the model can pick between an end-user or calling a function.  Specifying a particular function via `{\"name\":\\ \"my_function\"}` forces the model to call that function. \"none\" is the default when no functions are present. \"auto\" is the default if functions are present.","oneOf":[{"type":"string","enum":["none","auto"]},{"type":"object","properties":{"name":{"type":"string","description":"The name of the function to call."}},"required":["name"]}]},"temperature":{"type":"number","minimum":0,"maximum":2,"default":1,"example":1,"nullable":true,"description":"What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n\nWe generally recommend altering this or `top_p` but not both.\n"},"top_p":{"type":"number","minimum":0,"maximum":1,"default":1,"example":1,"nullable":true,"description":"An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\n\nWe generally recommend altering this or `temperature` but not both.\n"},"n":{"type":"integer","minimum":1,"maximum":128,"default":1,"example":1,"nullable":true,"description":"How many chat completion choices to generate for each input message."},"stream":{"description":"If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb).\n","type":"boolean","nullable":true,"default":false},"stop":{"description":"Up to 4 sequences where the API will stop generating further tokens.\n","default":null,"oneOf":[{"type":"string","nullable":true},{"type":"array","minItems":1,"maxItems":4,"items":{"type":"string"}}]},"max_tokens":{"description":"The maximum number of [tokens](/tokenizer) to generate in the chat completion.\n\nThe total length of input tokens and generated tokens is limited by the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.\n","default":"inf","type":"integer"},"presence_penalty":{"type":"number","default":0,"minimum":-2,"maximum":2,"nullable":true,"description":"Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.\n\n[See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)\n"},"frequency_penalty":{"type":"number","default":0,"minimum":-2,"maximum":2,"nullable":true,"description":"Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.\n\n[See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)\n"},"logit_bias":{"type":"object","x-oaiTypeLabel":"map","default":null,"nullable":true,"description":"Modify the likelihood of specified tokens appearing in the completion.\n\nAccepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.\n"},"user":{"type":"string","example":"user-1234","description":"A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).\n"}},"required":["model","messages"]};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((data.model === undefined) && (missing0 = "model")) || ((data.messages === undefined) && (missing0 = "messages"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.model !== undefined){let data0 = data.model;const _errs1 = errors;const _errs2 = errors;let valid1 = false;let passing0 = null;const _errs3 = errors;if(typeof data0 !== "string"){const err0 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(!((((((((((data0 === "gpt-4") || (data0 === "gpt-4-0613")) || (data0 === "gpt-4-32k")) || (data0 === "gpt-4-32k-0613")) || (data0 === "gpt-3.5-turbo")) || (data0 === "gpt-3.5-turbo-16k")) || (data0 === "gpt-3.5-turbo-0613")) || (data0 === "gpt-3.5-turbo-16k-0613")) || (data0 === "gpt-4-0314")) || (data0 === "gpt-3.5-turbo-0301"))){const err1 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/oneOf/0/enum",keyword:"enum",params:{allowedValues: schema11.properties.model.oneOf[0].enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}var _valid0 = _errs3 === errors;if(_valid0){valid1 = true;passing0 = 0;}if(!valid1){const err2 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;validate10.errors = vErrors;return false;}else {errors = _errs2;if(vErrors !== null){if(_errs2){vErrors.length = _errs2;}else {vErrors = null;}}}var valid0 = _errs1 === errors;}else {var valid0 = true;}if(valid0){if(data.messages !== undefined){let data1 = data.messages;const _errs5 = errors;if(errors === _errs5){if(Array.isArray(data1)){if(data1.length < 1){validate10.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];return false;}else {var valid2 = true;const len0 = data1.length;for(let i0=0; i0<len0; i0++){let data2 = data1[i0];const _errs7 = errors;if(errors === _errs7){if(data2 && typeof data2 == "object" && !Array.isArray(data2)){let missing1;if((data2.role === undefined) && (missing1 = "role")){validate10.errors = [{instancePath:instancePath+"/messages/" + i0,schemaPath:"#/properties/messages/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data2.role !== undefined){let data3 = data2.role;const _errs9 = errors;if(typeof data3 !== "string"){validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/role",schemaPath:"#/properties/messages/items/properties/role/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if(!((((data3 === "system") || (data3 === "user")) || (data3 === "assistant")) || (data3 === "function"))){validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/role",schemaPath:"#/properties/messages/items/properties/role/enum",keyword:"enum",params:{allowedValues: schema11.properties.messages.items.properties.role.enum},message:"must be equal to one of the allowed values"}];return false;}var valid3 = _errs9 === errors;}else {var valid3 = true;}if(valid3){if(data2.content !== undefined){const _errs11 = errors;if(typeof data2.content !== "string"){validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/content",schemaPath:"#/properties/messages/items/properties/content/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs11 === errors;}else {var valid3 = true;}if(valid3){if(data2.name !== undefined){const _errs13 = errors;if(typeof data2.name !== "string"){validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/name",schemaPath:"#/properties/messages/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs13 === errors;}else {var valid3 = true;}if(valid3){if(data2.function_call !== undefined){let data6 = data2.function_call;const _errs15 = errors;if(errors === _errs15){if(data6 && typeof data6 == "object" && !Array.isArray(data6)){if(data6.name !== undefined){const _errs17 = errors;if(typeof data6.name !== "string"){validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/function_call/name",schemaPath:"#/properties/messages/items/properties/function_call/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs17 === errors;}else {var valid4 = true;}if(valid4){if(data6.arguments !== undefined){const _errs19 = errors;if(typeof data6.arguments !== "string"){validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/function_call/arguments",schemaPath:"#/properties/messages/items/properties/function_call/properties/arguments/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs19 === errors;}else {var valid4 = true;}}}else {validate10.errors = [{instancePath:instancePath+"/messages/" + i0+"/function_call",schemaPath:"#/properties/messages/items/properties/function_call/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs15 === errors;}else {var valid3 = true;}}}}}}else {validate10.errors = [{instancePath:instancePath+"/messages/" + i0,schemaPath:"#/properties/messages/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid2 = _errs7 === errors;if(!valid2){break;}}}}else {validate10.errors = [{instancePath:instancePath+"/messages",schemaPath:"#/properties/messages/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs5 === errors;}else {var valid0 = true;}if(valid0){if(data.functions !== undefined){let data9 = data.functions;const _errs21 = errors;if(errors === _errs21){if(Array.isArray(data9)){if(data9.length < 1){validate10.errors = [{instancePath:instancePath+"/functions",schemaPath:"#/properties/functions/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];return false;}else {var valid5 = true;const len1 = data9.length;for(let i1=0; i1<len1; i1++){let data10 = data9[i1];const _errs23 = errors;if(errors === _errs23){if(data10 && typeof data10 == "object" && !Array.isArray(data10)){let missing2;if((data10.name === undefined) && (missing2 = "name")){validate10.errors = [{instancePath:instancePath+"/functions/" + i1,schemaPath:"#/properties/functions/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data10.name !== undefined){const _errs25 = errors;if(typeof data10.name !== "string"){validate10.errors = [{instancePath:instancePath+"/functions/" + i1+"/name",schemaPath:"#/properties/functions/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs25 === errors;}else {var valid6 = true;}if(valid6){if(data10.description !== undefined){const _errs27 = errors;if(typeof data10.description !== "string"){validate10.errors = [{instancePath:instancePath+"/functions/" + i1+"/description",schemaPath:"#/properties/functions/items/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs27 === errors;}else {var valid6 = true;}if(valid6){if(data10.parameters !== undefined){let data13 = data10.parameters;const _errs29 = errors;if(errors === _errs29){if(data13 && typeof data13 == "object" && !Array.isArray(data13)){}else {validate10.errors = [{instancePath:instancePath+"/functions/" + i1+"/parameters",schemaPath:"#/properties/functions/items/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid6 = _errs29 === errors;}else {var valid6 = true;}}}}}else {validate10.errors = [{instancePath:instancePath+"/functions/" + i1,schemaPath:"#/properties/functions/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid5 = _errs23 === errors;if(!valid5){break;}}}}else {validate10.errors = [{instancePath:instancePath+"/functions",schemaPath:"#/properties/functions/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs21 === errors;}else {var valid0 = true;}if(valid0){if(data.function_call !== undefined){let data14 = data.function_call;const _errs32 = errors;const _errs33 = errors;let valid7 = false;let passing1 = null;const _errs34 = errors;if(typeof data14 !== "string"){const err3 = {instancePath:instancePath+"/function_call",schemaPath:"#/properties/function_call/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(!((data14 === "none") || (data14 === "auto"))){const err4 = {instancePath:instancePath+"/function_call",schemaPath:"#/properties/function_call/oneOf/0/enum",keyword:"enum",params:{allowedValues: schema11.properties.function_call.oneOf[0].enum},message:"must be equal to one of the allowed values"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}var _valid1 = _errs34 === errors;if(_valid1){valid7 = true;passing1 = 0;}const _errs36 = errors;if(errors === _errs36){if(data14 && typeof data14 == "object" && !Array.isArray(data14)){let missing3;if((data14.name === undefined) && (missing3 = "name")){const err5 = {instancePath:instancePath+"/function_call",schemaPath:"#/properties/function_call/oneOf/1/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}else {if(data14.name !== undefined){if(typeof data14.name !== "string"){const err6 = {instancePath:instancePath+"/function_call/name",schemaPath:"#/properties/function_call/oneOf/1/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}}}}else {const err7 = {instancePath:instancePath+"/function_call",schemaPath:"#/properties/function_call/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}}var _valid1 = _errs36 === errors;if(_valid1 && valid7){valid7 = false;passing1 = [passing1, 1];}else {if(_valid1){valid7 = true;passing1 = 1;}}if(!valid7){const err8 = {instancePath:instancePath+"/function_call",schemaPath:"#/properties/function_call/oneOf",keyword:"oneOf",params:{passingSchemas: passing1},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;validate10.errors = vErrors;return false;}else {errors = _errs33;if(vErrors !== null){if(_errs33){vErrors.length = _errs33;}else {vErrors = null;}}}var valid0 = _errs32 === errors;}else {var valid0 = true;}if(valid0){if(data.temperature !== undefined){let data16 = data.temperature;const _errs40 = errors;if((!(typeof data16 == "number")) && (data16 !== null)){validate10.errors = [{instancePath:instancePath+"/temperature",schemaPath:"#/properties/temperature/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}if(errors === _errs40){if(typeof data16 == "number"){if(data16 > 2 || isNaN(data16)){validate10.errors = [{instancePath:instancePath+"/temperature",schemaPath:"#/properties/temperature/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2},message:"must be <= 2"}];return false;}else {if(data16 < 0 || isNaN(data16)){validate10.errors = [{instancePath:instancePath+"/temperature",schemaPath:"#/properties/temperature/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}}}var valid0 = _errs40 === errors;}else {var valid0 = true;}if(valid0){if(data.top_p !== undefined){let data17 = data.top_p;const _errs43 = errors;if((!(typeof data17 == "number")) && (data17 !== null)){validate10.errors = [{instancePath:instancePath+"/top_p",schemaPath:"#/properties/top_p/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}if(errors === _errs43){if(typeof data17 == "number"){if(data17 > 1 || isNaN(data17)){validate10.errors = [{instancePath:instancePath+"/top_p",schemaPath:"#/properties/top_p/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"}];return false;}else {if(data17 < 0 || isNaN(data17)){validate10.errors = [{instancePath:instancePath+"/top_p",schemaPath:"#/properties/top_p/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"}];return false;}}}}var valid0 = _errs43 === errors;}else {var valid0 = true;}if(valid0){if(data.n !== undefined){let data18 = data.n;const _errs46 = errors;if((!((typeof data18 == "number") && (!(data18 % 1) && !isNaN(data18)))) && (data18 !== null)){validate10.errors = [{instancePath:instancePath+"/n",schemaPath:"#/properties/n/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}if(errors === _errs46){if(typeof data18 == "number"){if(data18 > 128 || isNaN(data18)){validate10.errors = [{instancePath:instancePath+"/n",schemaPath:"#/properties/n/maximum",keyword:"maximum",params:{comparison: "<=", limit: 128},message:"must be <= 128"}];return false;}else {if(data18 < 1 || isNaN(data18)){validate10.errors = [{instancePath:instancePath+"/n",schemaPath:"#/properties/n/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"}];return false;}}}}var valid0 = _errs46 === errors;}else {var valid0 = true;}if(valid0){if(data.stream !== undefined){let data19 = data.stream;const _errs49 = errors;if((typeof data19 !== "boolean") && (data19 !== null)){validate10.errors = [{instancePath:instancePath+"/stream",schemaPath:"#/properties/stream/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];return false;}var valid0 = _errs49 === errors;}else {var valid0 = true;}if(valid0){if(data.stop !== undefined){let data20 = data.stop;const _errs52 = errors;const _errs53 = errors;let valid9 = false;let passing2 = null;const _errs54 = errors;if((typeof data20 !== "string") && (data20 !== null)){const err9 = {instancePath:instancePath+"/stop",schemaPath:"#/properties/stop/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}var _valid2 = _errs54 === errors;if(_valid2){valid9 = true;passing2 = 0;}const _errs57 = errors;if(errors === _errs57){if(Array.isArray(data20)){if(data20.length > 4){const err10 = {instancePath:instancePath+"/stop",schemaPath:"#/properties/stop/oneOf/1/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}else {if(data20.length < 1){const err11 = {instancePath:instancePath+"/stop",schemaPath:"#/properties/stop/oneOf/1/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}else {var valid10 = true;const len2 = data20.length;for(let i2=0; i2<len2; i2++){const _errs59 = errors;if(typeof data20[i2] !== "string"){const err12 = {instancePath:instancePath+"/stop/" + i2,schemaPath:"#/properties/stop/oneOf/1/items/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}var valid10 = _errs59 === errors;if(!valid10){break;}}}}}else {const err13 = {instancePath:instancePath+"/stop",schemaPath:"#/properties/stop/oneOf/1/type",keyword:"type",params:{type: "array"},message:"must be array"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}}var _valid2 = _errs57 === errors;if(_valid2 && valid9){valid9 = false;passing2 = [passing2, 1];}else {if(_valid2){valid9 = true;passing2 = 1;}}if(!valid9){const err14 = {instancePath:instancePath+"/stop",schemaPath:"#/properties/stop/oneOf",keyword:"oneOf",params:{passingSchemas: passing2},message:"must match exactly one schema in oneOf"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;validate10.errors = vErrors;return false;}else {errors = _errs53;if(vErrors !== null){if(_errs53){vErrors.length = _errs53;}else {vErrors = null;}}}var valid0 = _errs52 === errors;}else {var valid0 = true;}if(valid0){if(data.max_tokens !== undefined){let data22 = data.max_tokens;const _errs61 = errors;if(!((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22)))){validate10.errors = [{instancePath:instancePath+"/max_tokens",schemaPath:"#/properties/max_tokens/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid0 = _errs61 === errors;}else {var valid0 = true;}if(valid0){if(data.presence_penalty !== undefined){let data23 = data.presence_penalty;const _errs63 = errors;if((!(typeof data23 == "number")) && (data23 !== null)){validate10.errors = [{instancePath:instancePath+"/presence_penalty",schemaPath:"#/properties/presence_penalty/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}if(errors === _errs63){if(typeof data23 == "number"){if(data23 > 2 || isNaN(data23)){validate10.errors = [{instancePath:instancePath+"/presence_penalty",schemaPath:"#/properties/presence_penalty/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2},message:"must be <= 2"}];return false;}else {if(data23 < -2 || isNaN(data23)){validate10.errors = [{instancePath:instancePath+"/presence_penalty",schemaPath:"#/properties/presence_penalty/minimum",keyword:"minimum",params:{comparison: ">=", limit: -2},message:"must be >= -2"}];return false;}}}}var valid0 = _errs63 === errors;}else {var valid0 = true;}if(valid0){if(data.frequency_penalty !== undefined){let data24 = data.frequency_penalty;const _errs66 = errors;if((!(typeof data24 == "number")) && (data24 !== null)){validate10.errors = [{instancePath:instancePath+"/frequency_penalty",schemaPath:"#/properties/frequency_penalty/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}if(errors === _errs66){if(typeof data24 == "number"){if(data24 > 2 || isNaN(data24)){validate10.errors = [{instancePath:instancePath+"/frequency_penalty",schemaPath:"#/properties/frequency_penalty/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2},message:"must be <= 2"}];return false;}else {if(data24 < -2 || isNaN(data24)){validate10.errors = [{instancePath:instancePath+"/frequency_penalty",schemaPath:"#/properties/frequency_penalty/minimum",keyword:"minimum",params:{comparison: ">=", limit: -2},message:"must be >= -2"}];return false;}}}}var valid0 = _errs66 === errors;}else {var valid0 = true;}if(valid0){if(data.logit_bias !== undefined){let data25 = data.logit_bias;const _errs69 = errors;if((!(data25 && typeof data25 == "object" && !Array.isArray(data25))) && (data25 !== null)){validate10.errors = [{instancePath:instancePath+"/logit_bias",schemaPath:"#/properties/logit_bias/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}var valid0 = _errs69 === errors;}else {var valid0 = true;}if(valid0){if(data.user !== undefined){const _errs72 = errors;if(typeof data.user !== "string"){validate10.errors = [{instancePath:instancePath+"/user",schemaPath:"#/properties/user/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs72 === errors;}else {var valid0 = true;}}}}}}}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;}