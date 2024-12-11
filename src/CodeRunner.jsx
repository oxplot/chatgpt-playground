
export const codeRunnerFunctionName = 'run_python_code';

export function mergeCodeRunnerFuncDef(func_defs, remove) {
  func_defs = func_defs || [];
  func_defs = func_defs.filter(f => f.name !== codeRunnerFunctionName);
  if (!remove) {
    func_defs.push({
      name: codeRunnerFunctionName,
      description: "Runs python code. Uses Pyodide runtime. Following libs are installed: scipy, requests, matplotlib, numpy. Use aggressively.",
      parameters: {
        type: "object",
        required: ["code"],
        properties: {
          code: {
            type: "string",
            description: "Module body. Must print output into stdout."
          }
        },
        additionalProperties: false
      }
    })
  }
  return func_defs.length == 0 ? undefined : func_defs;
}

export function codeRunnerFuncDefined(func_defs) {
  return !!func_defs?.some(f => f.name === codeRunnerFunctionName);
}