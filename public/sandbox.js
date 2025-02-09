export const importsRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
export const pureRegex = /\/\*#__PURE__\*\//g;

export function replace(string, regex, value = "") {
  return string.toString().replace(regex, value).trim();
}

window.YJC_Result = [];
window.YJC_Error = null;

function transpileCode(code) {
  const codeToTranspile = replace(code.code, importsRegex);
  const options = { presets: ["es2015-loose", "react"] };
  const { code: transpiledCode } = Babel.transform(codeToTranspile, options);

  if (!transpiledCode) {
    throw new Error(`Something went wrong transpiling ${codeToTranspile}.`);
  }

  const hasImports = importsRegex.test(code.code);
  const imports = code.code.match(importsRegex)?.join("\n") ?? "";

  return {
    iframeCode: hasImports ? `${imports}\n${transpiledCode}` : transpiledCode,
    sourceCode: replace(transpiledCode, pureRegex),
  };
}

function postMessage(event) {
  const validOrigins = [
    "https://www.yourjscoach.online",
    "https://api.yourjscoach.online",
  ];

  // extra check for local development
  if (!location.hostname === "localhost" || !location.hostname === "127.0.0.1") {
    if (!validOrigins.includes(event.origin)) {
      console.warn("Origin mismatch:", event.origin);
      return;
    }
  }

  const { data } = event;
  if (typeof data === "object" && data.code) {
    let res;
    try {
      res = transpileCode(data);
    } catch (error) {
      window.YJC_Error = error;
      event.source.postMessage(error, event.origin);
      return;
    }

    const scriptElem = document.createElement("script");
    scriptElem.setAttribute("type", "module");
    scriptElem.setAttribute("nonce", "runMe");
    scriptElem.innerHTML = `
      try {
        ${res.iframeCode.split("\n").slice(1).join("\n")}
        const testCases = ${JSON.stringify(data.testCases)};
        const startTime = performance.now();
        testCases.forEach((currTestCase) => {
          window.YJC_Result.push(${data.functionName}(...currTestCase));
        });
        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        window.YJC_TimeTaken = timeTaken;
      } catch (error) {
        window.YJC_Error = error;
      }
    `;
    document.body.appendChild(scriptElem);

    setTimeout(() => {
      if (!window.YJC_Error) {
        event.source.postMessage({ timeTaken: window.YJC_TimeTaken, message: `[${window.YJC_Result}]` }, event.origin);
      } else {
        event.source.postMessage(window.YJC_Error, event.origin);
      }
      window.YJC_Result = [];
      window.YJC_Error = null;
    }, 10);
  } else {
    console.warn("Invalid message data:", data);
  }
}

window.addEventListener("message", (event) => {
  const handleMessage = () => postMessage(event);
  if (typeof Babel !== 'undefined') {
    handleMessage();
  } else {
    setTimeout(handleMessage, 500);
  }
});
