export const importsRegex =
  /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
export const pureRegex = /\/\*#__PURE__\*\//g;

export function replace(string, regex, value = "") {
  return string.toString().replace(regex, value).trim();
}

window.YJC_Result = new Array();
window.YJC_Error = null;

function transpileCode(code) {
  // ignore imports so Babel doesn't transpile it
  const codeToTranspile = replace(code.code, importsRegex);
  // the magic sauce used to transpile the code
  const options = { presets: ["es2015-loose", "react"] };
  const { code: transpiledCode } = Babel.transform(codeToTranspile, options);

  if (!transpiledCode) {
    // syntax errors get caught by the `error` listener
    throw new Error(`Something went wrong transpiling ${codeToTranspile}.`);
  }

  const hasImports = Boolean(code.code.match(importsRegex));
  const imports = code.code.match(importsRegex)?.join("\n") ?? "";

  return {
    // this is passed to `updateIframe`
    iframeCode: hasImports ? `${imports}\n${transpiledCode}` : transpiledCode,
    // this is passed to `updateSource`
    // ignore /*#__PURE__*/ from transpiled output to reduce noise
    sourceCode: replace(transpiledCode, pureRegex),
  };
}

window.addEventListener("message", (event) => {
  if (
    ["https://yourjscoach.online", "http://localhost:5173"].find((currElem) => {
      currElem == event.origin;
    })
  ) {
    console.warn("Origin mismatch:", event.origin);
    return;
  }
  const data = event.data;
  if (typeof data === "object" && data.code) {
    // data processing will be handled here.
    // in our case we run the code here and send the evaluated result to the parent react component.
    let res;
    try {
      res = transpileCode(data);
    } catch (error) {
      event.source.postMessage(error, event.origin);
      return;
    }

    const scriptElem = document.createElement("script");
    scriptElem.setAttribute("type", "module");
    scriptElem.setAttribute("nonce", "runMe");
    scriptElem.innerHTML = `${res.iframeCode.split("\n").slice(1).join("\n")}
    \
    const testCases = ${JSON.stringify(data.testCases).toString()};
    try {
    testCases.forEach((currTestCase) => {
      window.YJC_Result.push(${data.functionName}(...currTestCase));
    });
    } catch (error) {
      window.YJC_Error = error;
    }
    `;
    document.body.appendChild(scriptElem);
    setTimeout(() => {
      if (!window.YJC_Error)
        event.source.postMessage(`[${window.YJC_Result}]`, event.origin);
      else event.source.postMessage(window.YJC_Error, event.origin);
      window.YJC_Result = [];
      window.YJC_Error = null;
    }, 10);
  } else {
    console.warn("Invalid message data:", data);
  }
});
