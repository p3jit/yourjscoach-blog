import React, { useContext, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import ProblemDescription from "../components/Practice/ProblemDescription";
import EditorSection from "../components/Practice/EditorSection";
import ResultsPanel from "../components/Practice/ResultsPanel";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";

// Custom hook for managing problem data
const useProblemData = (location, navigate) => {
  const {currentProblem, setCurrentProblem, fetchProblemById} = useContext(ProblemDataProvider);
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

const Practice = () => {
  // Refs
  const iframeRef = useRef(null);

  // Custom hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProblem, setCurrentProblem } = useProblemData(location, navigate);
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

  // State for UI
  const [showConsoleOutput, setShowConsoleOutput] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [currentEditorTabIndex, setCurrentEditorTabIndex] = useState(0);

  // State for code
  const [defaultTestCode, setDefaultTestCode] = useState("");

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
  }, [currentProblem.editorValueCode, currentProblem.editorValueTests]);

  const handleEditorValueChange = (value) => {
    setCurrentProblem((oldValue) => {
      return currentEditorTabIndex === 0
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
    //resetExecutionState();
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
  };

  return (
    <>
      {currentProblem.problemTitle && (
        <PanelGroup direction="horizontal" className="flex">
          <Panel minSize={30}>
            <ProblemDescription currentProblem={currentProblem} isSolved={isSolved} />
          </Panel>
          <PanelResizeHandle />
          <Panel minSize={45}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={55} minSize={60}>
                <EditorSection
                  currentProblem={currentProblem}
                  currentEditorTabIndex={currentEditorTabIndex}
                  handleEditorValueChange={handleEditorValueChange}
                  handleEditorTabClick={handleEditorTabClick}
                  setErrorMsg={setErrorMsg}
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
      )}
    </>
  );
};

export default Practice;
