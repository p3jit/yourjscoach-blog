// Constants and regex patterns
const IMPORTS_REGEX = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;
const PURE_REGEX = /\/\*#__PURE__\*\//g;
const DEBUGGER_REGEX = /^\s*debugger;\s*$/gm;
const VALID_ORIGINS = ["https://www.yourjscoach.online", "https://api.yourjscoach.online"];
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "192.168.0.106"];

// State variables
let startTime = null;

// Initialize global test variables
const initGlobals = () => {
  window.YJC_Test_Results_Passed = [];
  window.YJC_Test_Results_Failed = [];
  window.YJC_Console_Log_List = [];
  window.expect = chai.expect;
  window.assert = chai.assert;
  window.YJC_Result = [];
  window.YJC_Error = null;
  window.YJC_ShouldSolve = false;
};

// Helper function to replace content in a string using regex
const replace = (string, regex, value = "") => string.toString().replace(regex, value).trim();

// Function to set up Mocha testing environment
const setupMocha = () => {
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
        const endTime = performance.now();
        const testResult = {
          title: this.currentTest.title,
          status: this.currentTest.state,
          parentTitle: this.currentTest.parent.title,
          timeTaken: Math.round((endTime - startTime) * 10) / 100,
        };

        if (this.currentTest.state === "passed") {
          window.YJC_Test_Results_Passed.push(testResult);
        } else {
          window.YJC_Test_Results_Failed.push(testResult);
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

    mocha.setup({
      ui: "bdd",
      rootHooks: customRootHooks,
      cleanReferencesAfterRun: true,
    });
    mocha.checkLeaks();
  };

  document.body.appendChild(newMochaScript);
};

// Function to transpile code using Babel
const transpileCode = (code) => {
  let codeToTranspile = replace(code, IMPORTS_REGEX);
  codeToTranspile = replace(code, DEBUGGER_REGEX);
  const options = { presets: ["es2015-loose", "react"] };
  const { code: transpiledCode } = Babel.transform(codeToTranspile, options);

  if (!transpiledCode) {
    throw new Error(`Error transpiling code: ${codeToTranspile}.`);
  }

  const hasImports = IMPORTS_REGEX.test(code);
  const imports = code.match(IMPORTS_REGEX)?.join("\n") ?? "";

  return {
    iframeCode: hasImports ? `${imports}\n${transpiledCode}` : transpiledCode,
    sourceCode: replace(transpiledCode, PURE_REGEX),
  };
};

// Validate the origin of the message event
const validateOrigin = (event) => {
  if (!LOCAL_HOSTS.includes(location.hostname) && !VALID_ORIGINS.includes(event.origin)) {
    console.warn("Origin mismatch:", event.origin);
    return false;
  }
  return true;
};

// Create a script element to run the tests
const createTestScript = (codeBlock, testBlock, data) => {
  const scriptElem = document.createElement("script");
  scriptElem.setAttribute("type", "text/javascript");
  scriptElem.setAttribute("nonce", "runMe");
  scriptElem.innerHTML = `
    // Override Default Console
    (function(){
    const _privateLog = console.log;
    console.log = function (...msg) {
      const strArguments = [...msg].flat(Infinity).toString();
      window.YJC_Console_Log_List.push(strArguments);
      _privateLog(strArguments);
    };
    })();
    try {
      ${codeBlock.iframeCode.split("\n").slice(1).join("\n")}
      ${testBlock.iframeCode.split("\n").slice(1).join("\n")}
      // warmup to check errors in code
      mocha.run();
    } catch (error) {
      console.log(error);
      window.YJC_Error = error;
    } finally {
      window.YJC_Console_Log_List = [];
    }
  `;
  return scriptElem;
};

// Post the test results or errors after execution
const postTestResults = (event) => {
  if (!window.YJC_Error) {
    event.source.postMessage(
      {
        testResultsPassed: window.YJC_Test_Results_Passed,
        testResultsFailed: window.YJC_Test_Results_Failed,
        consoleLogList: window.YJC_Console_Log_List || [],
        error: window.YJC_Error,
        shouldSolve: window.YJC_ShouldSolve
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
  window.YJC_Error = null;
  window.YJC_Console_Log_List = [];
  startTime = null;
  setupMocha();
};

// Function to handle the postMessage event
const postMessages = (event) => {
  if (!validateOrigin(event)) return;

  const { data } = event;
  if (typeof data === "object" && data.code && data.testCode) {
    let codeBlock, testBlock;
    try {
      codeBlock = transpileCode(data.code);
      testBlock = transpileCode(data.testCode);
      window.YJC_ShouldSolve = data.shouldSolve;
    } catch (error) {
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
};

// Initialize the environment
const init = () => {
  initGlobals();
  setupMocha();

  // Add event listener for message events
  window.addEventListener("message", (event) => {
    const handleMessage = () => postMessages(event);
    if (typeof Babel !== "undefined") {
      handleMessage();
    } else {
      setTimeout(handleMessage, 500);
    }
  });
};

// Bootstrap the application
init();
