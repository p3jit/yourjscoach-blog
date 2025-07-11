import React, { useContext, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import ReactConfetti from "react-confetti";

// Components
import ProblemDescription from "../components/Practice/ProblemDescription";
import EditorSection from "../components/Practice/EditorSection";
import ResultsPanel from "../components/Practice/ResultsPanel";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import { LocalStorageProvider } from "../contexts/localStorageContext";
import { useStudyPlan } from "../contexts/StudyPlanContext";
import ResetButton from "../components/ResetButton";
import { IconBrandCss3, IconBrandHtml5, IconBrandJavascript } from "@tabler/icons";

// Custom hook for managing problem data
const useProblemData = (location, navigate, resetExecutionState) => {
  const {
    currentProblem,
    fetchProblemById,
    setCurrentProblem,
    problems,
    setCurrentProblemIndex,
    setProblems,
    allProblems,
  } = useContext(ProblemDataProvider);
  const { fetchStudyPlanById, setActiveStudyPlan } = useStudyPlan();
  const documentId = location.pathname.split("/")[2];

  useEffect(() => {
    const currentPlanId = new URLSearchParams(location.search).get("plan");
    fetchProblemById(documentId);
    if (currentPlanId) fetchStudyPlanById(currentPlanId);
    else {
      setActiveStudyPlan(null);
      setProblems((_prev) => allProblems);
    }
    const problemIndex = problems.findIndex((prblm) => prblm.documentId === documentId);
    if (problemIndex >= 0) {
      setCurrentProblemIndex(problemIndex);
    }
    if (location.pathname.includes("/problems")) {
      setProblems(allProblems);
    }
    resetExecutionState();
  }, [location.pathname, navigate]);

  return { currentProblem, setCurrentProblem, problems };
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
    setDidExecute(false);
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
  const { progressMap } = useContext(LocalStorageProvider);

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
          editorValue: progressMap[currentProblem.documentId]
            ? progressMap[currentProblem.documentId].htmlCode
            : currentProblem.editorHtmlCode,
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
          editorValue: progressMap[currentProblem.documentId]
            ? progressMap[currentProblem.documentId].cssCode
            : currentProblem.editorCssCode,
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
          editorValue: progressMap[currentProblem.documentId]
            ? progressMap[currentProblem.documentId].jsCode
            : currentProblem.editorJsCode,
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

const CodeEditorMiddleBar = ({
  middleBarTabs,
  middleBarTabIndex,
  handleMiddleBarTabClick,
  setMiddleBarTabs,
  setConsoleLogMap,
}) => {
  const { progressMap, setProgressMap, updateLocalStorage } = useContext(LocalStorageProvider);
  const { currentProblem } = useContext(ProblemDataProvider);

  const handleEditorChange = (value) => {
    const updatedTabs = middleBarTabs.map((tab) => {
      if (tab.id === middleBarTabIndex) {
        return { ...tab, editorValue: value };
      }
      return tab;
    });
    setMiddleBarTabs(updatedTabs);
    const clonedMap = progressMap ? structuredClone(progressMap) : {};
    const currentId = currentProblem.documentId;
    if (clonedMap[currentId]) {
      clonedMap[currentId] = {
        jsCode: updatedTabs[2].editorValue,
        cssCode: updatedTabs[1].editorValue,
        htmlCode: updatedTabs[0].editorValue,
      };
    } else {
      clonedMap[currentId] = "";
      clonedMap[currentId] = {
        jsCode: updatedTabs[2].editorValue,
        cssCode: updatedTabs[1].editorValue,
        htmlCode: updatedTabs[0].editorValue,
      };
    }
    // Update current progressMap and localStorage progressMap
    updateLocalStorage({ progressMap: { ...clonedMap } });
    setProgressMap({ ...clonedMap });
    setConsoleLogMap({});
  };

  const handleReset = () => {
    const newMiddleBarTabs = structuredClone(middleBarTabs);
    newMiddleBarTabs[0].editorValue = currentProblem.editorHtmlCode;
    newMiddleBarTabs[1].editorValue = currentProblem.editorCssCode;
    newMiddleBarTabs[2].editorValue = currentProblem.editorJsCode;
    setMiddleBarTabs([...newMiddleBarTabs]);
  };

  // Debounce the editor change handler to prevent excessive updates
  const debouncedHandleEditorChange = useDebounce(handleEditorChange, 500);

  return (
    <div className="h-full border-r-2 border-r-zinc-700">
      <div className="flex items-center justify-between gap-8 py-3 px-4 bg-zinc-900">
        <div className="flex space-x-1 rounded-lg bg-zinc-800/40 p-0.5">
          {middleBarTabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`${
                middleBarTabIndex === tab.id
                  ? "bg-zinc-700/70 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30"
              } px-3 py-1.5 text-sm rounded-md transition-colors flex justify-center items-center`}
              onClick={() => handleMiddleBarTabClick(tab.id)}
            >
              {index === 0 && <IconBrandHtml5 className="w-5 mr-1.5" />}
              {index === 1 && <IconBrandCss3 className="w-5 mr-1.5" />}
              {index == 2 && <span className="mr-1.5 font-bold text-md">JS</span>}
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          <ResetButton onClick={handleReset} />
        </div>
      </div>
      <div className="h-[calc(100%-7.1vh)] bg-zinc-900">
        {middleBarTabs[middleBarTabIndex] && (
          <Editor
            defaultLanguage={middleBarTabs[middleBarTabIndex].language}
            language={middleBarTabs[middleBarTabIndex].language}
            value={middleBarTabs[middleBarTabIndex].editorValue}
            theme="vs-dark"
            options={{
              fontSize: 14,
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
            }}
            onChange={debouncedHandleEditorChange}
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { setSolvedProblems, solvedProblems, updateLocalStorage, progressMap, setProgressMap } =
    useContext(LocalStorageProvider);
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

  const { currentProblem, setCurrentProblem } = useProblemData(location, navigate, resetExecutionState);

  const { middleBarTabIndex, middleBarTabs, setMiddleBarTabs, handleMiddleBarTabClick } =
    useMiddleBarTabs(currentProblem);

  const [editorValue, setEditorValue] = useState({ code: "", tests: "" });

  // State for UI
  const [showConsoleOutput, setShowConsoleOutput] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [currentEditorTabIndex, setCurrentEditorTabIndex] = useState(0);

  const markSolved = (shouldSolve) => {
    if (!shouldSolve) return;
    const currentId = currentProblem.documentId || currentProblem.documentId;
    const isAlreadySolved = solvedProblems.includes(currentId);
    let updatedSolvedProblems = [];
    if (!isAlreadySolved) {
      updatedSolvedProblems = [...solvedProblems, currentId];
      setSolvedProblems(updatedSolvedProblems);
      updateLocalStorage({ solvedProblems: [...updatedSolvedProblems] });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // Message handler for iframe communication
  useEffect(() => {
    const handleMessage = (event) => {
      // this check is needed for local development
      if (event.data && !event.data.vscodeScheduleAsyncWork && event.data.type == "IFRAME_DSA_CODE") {
        const { stack, name, error, testResultsPassed, testResultsFailed, consoleLogList, shouldSolve } = event.data;
        const err = error || stack || name;
        if (err) {
          setErrorMsg(err);
          setSuccess(false);
        } else {
          // Fixed bug in the condition check
          if (testResultsPassed?.length > 0 && testResultsFailed?.length === 0) {
            setSuccess(true);
          } else {
            setSuccess(false);
          }
        }

        setTestResults({
          passed: testResultsPassed !== undefined ? testResultsPassed : [],
          failed: testResultsFailed !== undefined ? testResultsFailed : [],
        });

        // Check is the current problem is solved or not
        if (!err && testResultsPassed.length + testResultsFailed.length === testResultsPassed.length) {
          markSolved(shouldSolve);
        }

        setConsoleLogMap(consoleLogList ? consoleLogList : {});
        setDidExecute(true);
        setIsRunning(false);
      }
      if (event.data && !event.data.vscodeScheduleAsyncWork && event.data.type === "IFRAME_JS_CODE") {
        setConsoleLogMap((prev) => {
          if (prev && prev.length > 0) {
            return [...prev, event.data.message];
          } else {
            return [event.data.message];
          }
        });
      }
    };

    // Add iframe message event listener
    window.addEventListener("message", handleMessage);

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

  // We unselect currentPost on unMount
  useEffect(() => {
    return () => {
      setCurrentProblem({});
    };
  }, []);

  const debouncedSetCurrentProblem = useDebounce(
    (value) => {
      setEditorValue((oldValue) => {
        return currentEditorTabIndex === 0 ? { ...oldValue, code: value } : { ...oldValue, tests: value };
      });
      if (currentEditorTabIndex != 0) return false;
      const clonedMap = progressMap ? structuredClone(progressMap) : {};
      const currentId = currentProblem.documentId;
      if (clonedMap[currentId]) {
        clonedMap[currentId] = value;
      } else {
        clonedMap[currentId] = "";
        clonedMap[currentId] = value;
      }
      // Update current progressMap and localStorage progressMap
      updateLocalStorage({ progressMap: { ...clonedMap } });
      setProgressMap({ ...clonedMap });
      setConsoleLogMap({});
    },
    300 // debounce delay in ms, adjust as needed
  );

  const handleEditorValueChange = (value) => {
    debouncedSetCurrentProblem(value);
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
          code: editorValue.code || " ", //need the empty space for proper parsing the code value
          shouldSolve: type === "submit" ? true : false,
          functionName: currentProblem.functionName,
          testCode:
            type === "submit"
              ? currentProblem.submitTests
                ? currentProblem.submitTests
                : currentProblem.editorValueTests
              : editorValue.tests,
          sampleTestInput: currentProblem.sampleTestInput,
        },
        "*"
      );
    }
  };

  const handleEditorTabClick = (id) => {
    setCurrentEditorTabIndex(id);
  };

  const debouncedSendMessageToIframe = useDebounce(sendMessageToIframe, 500);

  const handleRunCode = () => {
    setDidExecute(false);
    handleShowResults();
    setIsRunning(true);
    setConsoleLogMap();
    setErrorMsg("");
    debouncedSendMessageToIframe();
  };

  const handleSubmitCode = () => {
    setDidExecute(false);
    handleShowResults();
    setIsRunning(true);
    setErrorMsg("");
    debouncedSendMessageToIframe("submit");
  };

  // If problem is not loaded yet, don't render anything
  if (!currentProblem.problemTitle) {
    return null;
  }

  const successMessageStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#059669", // green-600
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    zIndex: 50,
    pointerEvents: "none",
    opacity: showConfetti ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={700}
            gravity={1.3}
          />
          <div style={successMessageStyle}>
            <div className="text-xl font-bold text-center">Problem Solved! 🎉</div>
            <div className="text-sm text-center">Great job! Keep it up!</div>
          </div>
        </div>
      )}
      <PanelGroup key={currentProblem.documentId} direction="horizontal" className="flex h-full">
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
                  setConsoleLogMap={setConsoleLogMap}
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
                editorValue={editorValue}
                setEditorValue={setEditorValue}
                setConsoleLogMap={setConsoleLogMap}
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
                currentProblem={currentProblem}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </>
  );
};

export default Practice;
