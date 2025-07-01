import React, { useContext, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

// Components
import ProblemDescription from "../components/Practice/ProblemDescription";
import EditorSection from "../components/Practice/EditorSection";
import ResultsPanel from "../components/Practice/ResultsPanel";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import { LocalStorageProvider } from "../contexts/localStorageContext";

// Custom hook for managing problem data
const useProblemData = (location, navigate) => {
  const { currentProblem, setCurrentProblem, fetchProblemById } = useContext(ProblemDataProvider);
  const documentId = location.pathname.split("/")[2];

  useEffect(() => {
    fetchProblemById(documentId);
  }, [location.pathname, navigate]);

  return { currentProblem, setCurrentProblem };
};

// Custom hook for managing execution state
const useExecutionState = () => {
  const [didExecute, setDidExecute] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [testResults, setTestResults] = useState({ passed: [], failed: [] });
  const [consoleLogMap, setConsoleLogMap] = useState({});

  const resetExecutionState = () => {
    setIsRunning(false);
    setErrorMsg("");
    setSuccess(false);
    setTestResults({});
  };

  return {
    didExecute,
    setDidExecute,
    errorMsg,
    setErrorMsg,
    success,
    setSuccess,
    isRunning,
    setIsRunning,
    isSolved,
    setIsSolved,
    testResults,
    setTestResults,
    consoleLogMap,
    setConsoleLogMap,
    resetExecutionState,
  };
};

// Custom hook for managing middle bar tabs
const useMiddleBarTabs = (currentProblem) => {
  const [middleBarTabIndex, setMiddleBarTabIndex] = useState(0);
  const [middleBarTabs, setMiddleBarTabs] = useState([]);

  useEffect(() => {
    if (currentProblem) {
      setMiddleBarTabs([
        {
          id: 0,
          label: "index.html",
          icon: {
            path: "M4.136 3.012h15.729l-1.431 16.15-6.451 1.826-6.414-1.826-1.433-16.15zm5.266 7.302-.173-2.035 7.533.002.173-1.963-9.87-.002.522 5.998h6.835l-.243 2.566-2.179.602-2.214-.605-.141-1.58H7.691l.247 3.123L12 17.506l4.028-1.08.558-6.111H9.402v-.001z",
            viewBox: "0 0 24 24",
            fill: "currentColor",
          },
          content: "HTML Content",
          editorValue: currentProblem.editorHtmlCode,
          language: "html",
        },
        {
          id: 1,
          label: "index.css",
          icon: {
            path: "M4.192 3.143h15.615l-1.42 16.034-6.404 1.812-6.369-1.813L4.192 3.143zM16.9 6.424l-9.8-.002.158 1.949 7.529.002-.189 2.02H9.66l.179 1.913h4.597l-.272 2.62-2.164.598-2.197-.603-.141-1.569h-1.94l.216 2.867L12 17.484l3.995-1.137.905-9.923z",
            viewBox: "0 0 24 24",
            fill: "currentColor",
          },
          content: "CSS Content",
          editorValue: currentProblem.editorCssCode,
          language: "css",
        },
        {
          id: 2,
          label: "index.js",
          icon: {
            path: "M0 0v24h24V0H0zm18.52 18.15c-.44.54-1.03.93-1.78 1.14-.75.21-1.53.21-2.28 0-.75-.21-1.39-.58-1.9-1.08-.51-.5-.87-1.14-.99-1.89l2.18-.93c.1.39.3.69.59.89.29.2.62.3.98.3.42 0 .78-.09.99-.27.21-.18.32-.45.32-.81 0-.21-.04-.39-.12-.54s-.2-.28-.36-.39c-.16-.11-.37-.21-.61-.31-.24-.1-.53-.21-.86-.31-.4-.12-.76-.26-1.08-.42s-.59-.36-.81-.59c-.22-.23-.38-.51-.48-.84-.1-.33-.15-.7-.15-1.11 0-.48.09-.92.27-1.32.18-.4.45-.73.81-1.01.36-.28.8-.48 1.3-.6s1.03-.18 1.58-.18c.63 0 1.23.09 1.78.27.55.18.98.45 1.29.81.31.36.5.78.56 1.26l-2.1.86c-.05-.3-.18-.54-.38-.71-.2-.17-.48-.25-.81-.25-.3 0-.56.06-.75.18-.19.12-.28.3-.28.53 0 .21.04.39.12.53.08.14.2.26.36.36.16.1.37.19.61.28.24.09.53.19.86.29.4.12.77.26 1.09.42.32.16.59.35.81.58.22.23.38.51.48.84.1.33.15.7.15 1.11 0 .49-.09.93-.27 1.33s-.45.73-.81 1.01zm-8.17-1.42-1.11 1.23H5.31l3.2-3.59-3.03-3.54h2.22l1.96 2.28 1.93-2.28H16l-3.2 3.57 3.23 3.56h-2.22l-2.1-2.46z",
            viewBox: "0 0 24 24",
            fill: "currentColor",
          },
          content: "JavaScript Content",
          editorValue: currentProblem.editorJsCode,
          language: "javascript",
        },
      ]);
    }
  }, [currentProblem]);

  // Handler for middle bar tab clicks
  const handleMiddleBarTabClick = (id) => {
    setMiddleBarTabIndex(id);
  };

  return {
    middleBarTabIndex,
    middleBarTabs,
    setMiddleBarTabs,
    handleMiddleBarTabClick,
  };
};

// Middle bar component for code editors
const CodeEditorMiddleBar = ({ middleBarTabs, middleBarTabIndex, handleMiddleBarTabClick, setMiddleBarTabs }) => {
  return (
    <div className="h-full border-r-2 border-r-zinc-700">
      <div className="flex gap-8 py-3 px-4 bg-zinc-800">
        {middleBarTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${
              middleBarTabIndex === tab.id ? "text-zinc-200 " : "text-zinc-500"
            } flex gap-1 cursor-pointer text-sm`}
            onClick={() => handleMiddleBarTabClick(tab.id)}
          >
            <svg
              className={`w-5 h-5 mt-px ${middleBarTabIndex === tab.id ? "text-zinc-200" : "text-zinc-500"}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill={tab.icon.fill || "currentColor"}
              viewBox={tab.icon.viewBox}
            >
              <path
                stroke={tab.icon.fill ? undefined : "currentColor"}
                strokeLinecap={tab.icon.strokeLinecap}
                strokeLinejoin={tab.icon.strokeLinejoin}
                strokeWidth={tab.icon.strokeWidth}
                d={tab.icon.path}
                fillRule={tab.icon.fillRule}
                clipRule={tab.icon.clipRule}
              />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="h-[calc(100%-5vh)] bg-zinc-900">
        {middleBarTabs[middleBarTabIndex] && (
          <Editor
            defaultLanguage={middleBarTabs[middleBarTabIndex].language}
            language={middleBarTabs[middleBarTabIndex].language}
            value={middleBarTabs[middleBarTabIndex].editorValue}
            theme="vs-dark"
            options={{
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
            onChange={(value) => {
              // Update the editor content in the middleBarTabs state
              const updatedTabs = middleBarTabs.map((tab) => {
                if (tab.id === middleBarTabIndex) {
                  return { ...tab, editorValue: value };
                }
                return tab;
              });
              setMiddleBarTabs(updatedTabs);
            }}
            key={middleBarTabIndex} // Important: This forces re-render when tab changes
          />
        )}
      </div>
    </div>
  );
};

const Practice = () => {
  // Refs
  const iframeRef = useRef(null);

  // Custom hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProblem, setCurrentProblem } = useProblemData(location, navigate);
  const { setSolvedProblems, solvedProblems, updateLocalStorage } = useContext(LocalStorageProvider);
  const {
    didExecute,
    setDidExecute,
    errorMsg,
    setErrorMsg,
    success,
    setSuccess,
    isRunning,
    setIsRunning,
    isSolved,
    testResults,
    setTestResults,
    consoleLogMap,
    setConsoleLogMap,
    resetExecutionState,
  } = useExecutionState();

  const { middleBarTabIndex, middleBarTabs, setMiddleBarTabs, handleMiddleBarTabClick } =
    useMiddleBarTabs(currentProblem);

  // State for UI
  const [showConsoleOutput, setShowConsoleOutput] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [currentEditorTabIndex, setCurrentEditorTabIndex] = useState(0);

  // State for code
  const [defaultTestCode, setDefaultTestCode] = useState("");

  const markSolved = () => {
    const currentId = currentProblem.documentId || currentProblem.displayId;
    const isSolved = solvedProblems.includes(currentId);
    let updatedSolvedProblems = [];
    if (!isSolved) {
      updatedSolvedProblems = [...solvedProblems, currentId];
      setSolvedProblems(updatedSolvedProblems);
      updateLocalStorage(JSON.stringify({ solvedProblems: [...updatedSolvedProblems] }));
    }
  };

  // Message handler for iframe communication
  useEffect(() => {
    const handleMessage = (event) => {
      // this check is needed for local development
      if (event.data && !event.data.vscodeScheduleAsyncWork) {
        const { stack, name, error, testResultsPassed, testResultsFailed, consoleLogList } = event.data;

        if (error || stack || name) {
          setErrorMsg(error || stack || name);
          setSuccess(false);
        } else {
          // Fixed bug in the condition check
          if (testResultsPassed?.length > 0 && testResultsFailed?.length === 0) {
            setSuccess(true);
          } else {
            setErrorMsg("Test case mismatch");
            setSuccess(false);
          }
        }

        setTestResults({
          passed: testResultsPassed !== undefined ? testResultsPassed : [],
          failed: testResultsFailed !== undefined ? testResultsFailed : [],
        });

        setConsoleLogMap(consoleLogList ? consoleLogList : {});
        setDidExecute(true);
        setIsRunning(false);
      }
    };

    // Add iframe message event listener
    window.addEventListener("message", handleMessage);

    // Set default test
    setDefaultTestCode(currentProblem.editorValueTests);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [
    currentProblem.editorValueCode,
    currentProblem.editorValueTests,
    setConsoleLogMap,
    setDidExecute,
    setErrorMsg,
    setIsRunning,
    setSuccess,
    setTestResults,
  ]);

  const handleEditorValueChange = (value) => {
    setCurrentProblem((oldValue) => {
      return currentEditorTabIndex === 1 // Adjusted for new tab order
        ? { ...oldValue, editorValueCode: value }
        : { ...oldValue, editorValueTests: value };
    });
  };

  const handleShowTestCases = () => {
    setShowConsoleOutput(true);
    setShowResults(false);
  };

  const handleShowResults = () => {
    setShowResults(true);
    setShowConsoleOutput(false);
  };

  const sendMessageToIframe = (type) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          code: currentProblem.editorValueCode,
          functionName: currentProblem.functionName,
          testCases: currentProblem.testCases,
          testCode: type === "submit" ? defaultTestCode : currentProblem.editorValueTests,
          sampleTestInput: currentProblem.sampleTestInput,
        },
        "*"
      );
    }
  };

  const handleEditorTabClick = (id) => {
    setCurrentEditorTabIndex(id);
  };

  const debouncedSendMessageToIframe = useDebounce(sendMessageToIframe, 1000);

  const handleRunCode = () => {
    setDidExecute(false);
    handleShowResults();
    setIsRunning(true);
    setConsoleLogMap({});
    debouncedSendMessageToIframe();
  };

  const handleSubmitCode = () => {
    setDidExecute(false);
    handleShowResults();
    setIsRunning(true);
    debouncedSendMessageToIframe("submit");
    markSolved();
  };

  // If problem is not loaded yet, don't render anything
  if (!currentProblem.problemTitle) {
    return null;
  }

  return (
    <PanelGroup direction="horizontal" className="flex h-full">
      <Panel minSize={30}>
        <ProblemDescription currentProblem={currentProblem} isSolved={isSolved} />
      </Panel>
      {currentProblem.category === "js" && (
        <>
          <PanelResizeHandle />
          <Panel minSize={30}>
            <div className="w-full h-full flex flex-col">
              <CodeEditorMiddleBar
                middleBarTabs={middleBarTabs}
                middleBarTabIndex={middleBarTabIndex}
                handleMiddleBarTabClick={handleMiddleBarTabClick}
                setMiddleBarTabs={setMiddleBarTabs}
              />
            </div>
          </Panel>
        </>
      )}
      <PanelResizeHandle />
      <Panel minSize={30}>
        <PanelGroup direction="vertical">
          <Panel defaultSize={55} minSize={60}>
            <EditorSection
              currentProblem={currentProblem}
              currentEditorTabIndex={currentEditorTabIndex}
              handleEditorValueChange={handleEditorValueChange}
              handleEditorTabClick={handleEditorTabClick}
              setErrorMsg={setErrorMsg}
              middleBarTabs={middleBarTabs}
              middleBarTabIndex={middleBarTabIndex}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={45} minSize={5.2}>
            <ResultsPanel
              iframeRef={iframeRef}
              showConsoleOutput={showConsoleOutput}
              showResults={showResults}
              didExecute={didExecute}
              isRunning={isRunning}
              success={success}
              errorMsg={errorMsg}
              testResults={testResults}
              consoleLogMap={consoleLogMap}
              handleShowTestCases={handleShowTestCases}
              handleShowResults={handleShowResults}
              handleRunCode={handleRunCode}
              handleSubmitCode={handleSubmitCode}
              handleEditorTabClick={handleEditorTabClick}
            />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default Practice;
