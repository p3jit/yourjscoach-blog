// Regex for matching imports and pure markers in code
const importsRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
const pureRegex = /\/\*#__PURE__\*\//g;

// Helper function to replace content in a string using regex
function replace(string, regex, value = "") {
  return string.toString().replace(regex, value).trim();
}

// Initialize global variables for test results and error handling
window.YJC_Test_Results_Passed = [];
window.YJC_Test_Results_Failed = [];
window.YJC_Console_Log_List = [];
window.expect = chai.expect;
window.assert = chai.assert;
window.YJC_Result = [];
window.YJC_Error = null;
let startTime = null;

// Function to set up Mocha testing environment
function setupMocha() {
  const mochaDomScript = document.getElementById("mocha-import");
  if (mochaDomScript) {
    delete window.mocha;
    mochaDomScript.remove();
  }

  const newMochaScript = document.createElement("script");
  newMochaScript.src = "https://unpkg.com/mocha/mocha.js";
  newMochaScript.setAttribute("nonce", "runMe");
  newMochaScript.setAttribute("id", "mocha-import");

  newMochaScript.onload = () => {
    const customRootHooks = {
      afterEach(done) {
        let endTime = performance.now();
        if (this.currentTest.state === "passed") {
          window.YJC_Test_Results_Passed.push({
            title: this.currentTest.title,
            status: this.currentTest.state,
            parentTitle: this.currentTest.parent.title,
            timeTaken: Math.round((endTime - startTime) * 10) / 100,
          });
        } else {
          window.YJC_Test_Results_Failed.push({
            title: this.currentTest.title,
            status: this.currentTest.state,
            parentTitle: this.currentTest.parent.title,
            timeTaken: Math.round((endTime - startTime) * 10) / 100,
          });
        }
        done();
      },
      beforeAll(done) {
        assert.equal(1, 1);
        done();
      },
      beforeEach() {
        startTime = performance.now();
      },
    };

    mocha.setup({ ui: "bdd", rootHooks: customRootHooks, cleanReferencesAfterRun: true });
    mocha.checkLeaks();
  };

  document.body.appendChild(newMochaScript);
}

// Function to transpile code using Babel
function transpileCode(code) {
  const codeToTranspile = replace(code, importsRegex);
  const options = { presets: ["es2015-loose", "react"] };
  const { code: transpiledCode } = Babel.transform(codeToTranspile, options);

  if (!transpiledCode) {
    throw new Error(`Error transpiling code: ${codeToTranspile}.`);
  }

  const hasImports = importsRegex.test(code);
  const imports = code.match(importsRegex)?.join("\n") ?? "";

  return {
    iframeCode: hasImports ? `${imports}\n${transpiledCode}` : transpiledCode,
    sourceCode: replace(transpiledCode, pureRegex),
  };
}

// Validate the origin of the message event
function validateOrigin(event) {
  const validOrigins = ["https://www.yourjscoach.online", "https://api.yourjscoach.online"];

  if (
    // replace any other local ip if you see mismatch origin error in console
    !["localhost", "127.0.0.1", "192.168.0.106"].includes(location.hostname) &&
    !validOrigins.includes(event.origin)
  ) {
    console.warn("Origin mismatch:", event.origin);
    return false;
  }
  return true;
}

// Function to handle the postMessage event
function postMessage(event) {
  if (!validateOrigin(event)) return;

  const { data } = event;
  if (typeof data === "object" && data.code && data.testCode) {
    let codeBlock, testBlock;

    try {
      codeBlock = transpileCode(data.code);
      testBlock = transpileCode(data.testCode);
    } catch (error) {
      window.YJC_Error = error;
      event.source.postMessage(error, event.origin);
      return;
    }

    // Create and inject the script element to run tests
    const scriptElem = createTestScript(codeBlock, testBlock, data);
    document.body.appendChild(scriptElem);

    // Post results after tests run
    setTimeout(() => postTestResults(event), 50);
  } else {
    console.warn("Invalid message data:", data);
  }
}

// Create a script element to run the tests
function createTestScript(codeBlock, testBlock, data) {
  const scriptElem = document.createElement("script");
  scriptElem.setAttribute("type", "text/javascript");
  scriptElem.setAttribute("nonce", "runMe");
  scriptElem.innerHTML = `
    // Override Default Console
    (function(){
    var _privateLog = console.log;
    console.log = function (...msg) {
      const strArguments = [...msg].flat(Infinity).toString();
      window.YJC_Console_Log_List.push(strArguments);
      _privateLog(strArguments);
    //_privateLog.apply(console, arguments);
    };
    })();
    try {
      ${codeBlock.iframeCode.split("\n").slice(1).join("\n")}
      ${testBlock.iframeCode.split("\n").slice(1).join("\n")}
      // warmup to check errors in code
      ${data.functionName}(1,2);
      mocha.run();
    } catch (error) {
      console.log(error);
      window.YJC_Error = error;
    } finally {
      window.YJC_Console_Log_List = [];
    }
  `;
  return scriptElem;
}

// Post the test results or errors after execution
function postTestResults(event) {
  if (!window.YJC_Error) {
    event.source.postMessage(
      {
        testResultsPassed: window.YJC_Test_Results_Passed,
        testResultsFailed: window.YJC_Test_Results_Failed,
        consoleLogList: window.YJC_Console_Log_List ? window.YJC_Console_Log_List : [],
        error: window.YJC_Error,
      },
      event.origin
    );
  } else {
    event.source.postMessage(window.YJC_Error, event.origin);
  }

  // Reset state
  window.YJC_Result = [];
  window.YJC_Test_Results_Passed = [];
  window.YJC_Test_Results_Failed = [];
  startTime = null;
  setupMocha();
}

// Initialize the Mocha environment
setupMocha();

// Add event listener for message events to handle postMessage logic
window.addEventListener("message", (event) => {
  const handleMessage = () => postMessage(event);
  if (typeof Babel !== "undefined") {
    handleMessage();
  } else {
    setTimeout(handleMessage, 500);
  }
});
