importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(["numpy", "pytz", "requests"]);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  await pyodideReadyPromise;
  const { script } = event.data;
  let stdout = '';
  let stderr = '';
  try {
    self.pyodide.setStdout({ batched: m => { stdout += m } });
    self.pyodide.setStderr({ batched: m => { stderr += m } });
    await self.pyodide.loadPackagesFromImports(script);
    await self.pyodide.runPythonAsync(script);
    self.postMessage({ output: stdout });
  } catch (e) {
    self.postMessage({ output: `ERROR: ${e.message}\n\n ${stderr}` });
  }
};