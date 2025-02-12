import React, { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import useDebounce from "../hooks/useDebounce";
import Markdown from "markdown-to-jsx";
import NormalText from "../components/markdown-components/normalText/NormalText";
import ExampleBlock from "../components/markdown-components/example-block/ExampleBlock";
import Tag from "../components/tag/Tag";
import { mockPractice } from "../utils/mockData";

const Practice = () => {
  const iframeRef = useRef(null);
  const [didExecute, setDidExecute] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [incommingTestResults, setIncommingTestResults] = useState({ passed: [], failed: [] });
  const [showConsoleOutput, setShowConsoleOutput] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [currentProblem, setCurrentProblem] = useState(mockPractice);
  const [currentEditorTabIndex, setCurrentEditorTabIndex] = useState(0);
  const [defaultCode, setDefaultCode] = useState("");
  const [defaultTestCode, setDefaultTestCode] = useState("");
  const [consoleLogMap, setConsoleLogMap] = useState({});

  useEffect(() => {
    const handleMessage = (event) => {
      // this check is needed for local development
      if (event.data && !event.data.vscodeScheduleAsyncWork) {
        const { stack, name, error, testResultsPassed, testResultsFailed, consoleLogList } = event.data;
        if (error || stack || name) {
          setErrorMsg(error || stack || name);
          setSuccess(false);
        } else {
          if (testResultsPassed?.length === testResultsPassed?.length + testResultsFailed?.length) {
            setSuccess(true);
          } else {
            setErrorMsg("Test case mismatch");
          }
        }
        //setIncommingResult(res);
        setIncommingTestResults({
          passed: testResultsPassed !== undefined ? testResultsPassed : [],
          failed: testResultsFailed !== undefined ? testResultsFailed : [],
        });
        setConsoleLogMap(consoleLogList ? consoleLogList : {});
        setDidExecute(true);
      }
    };

    // Add iframe message event listener
    window.addEventListener("message", handleMessage);

    // Set default code and test
    setDefaultCode(currentProblem.editorValueCode);
    setDefaultTestCode(currentProblem.editorValueTests);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

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
    setErrorMsg("");
    setSuccess(false);
    setIncommingTestResults({});
    iframeRef.current.contentWindow.postMessage(
      {
        code: type === "submit" ? defaultCode : currentProblem.editorValueCode,
        functionName: currentProblem.functionName,
        testCases: currentProblem.testCases,
        testCode: type === "submit" ? defaultTestCode : currentProblem.editorValueTests,
        sampleTestInput: currentProblem.sampleTestInput,
      },
      "*"
    );
    handleShowResults();
  };

  const handleEditorTabClick = (id) => {
    setCurrentEditorTabIndex(id);
  };

  const debouncedSendMessageToIframe = useDebounce(sendMessageToIframe, 1000);

  return (
    <PanelGroup direction="horizontal" className="flex gap-1">
      <Panel minSize={30}>
        <div className="w-full rounded-md h-[87vh] p-7 bg-zinc-800 flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-500">
          <h1 className="text-zinc-100 text-2xl font-medium text-wrap">{currentProblem.problemTitle}</h1>
          <div className="flex justify-between w-full">
            <span className="px-2 py-1 rounded-lg bg-zinc-600 font-normal text-sm text-lime-500 w-fit h-fit">
              {currentProblem.difficulty}
            </span>
            <div className="flex gap-2">
              {currentProblem.tags.map((currentTag, index) => {
                return (
                  <div key={index}>
                    <Tag data={currentTag} key={index}></Tag>
                  </div>
                );
              })}
            </div>
          </div>
          <Markdown
            options={{ overrides: { NormalText: { component: NormalText }, Example: { component: ExampleBlock } } }}
          >
            {currentProblem.mdContent}
          </Markdown>
        </div>
      </Panel>
      <PanelResizeHandle className="bg-zinc-500 w-1 h-16 self-center rounded-md bottom-32 left-1 relative" />
      <Panel minSize={45}>
        <PanelGroup direction="vertical" className="flex gap-1">
          <Panel defaultSize={55} minSize={48} className="rounded-md mx-2">
            <div className="flex gap-6 py-3 bg-zinc-800 px-3">
              <button
                className={`${
                  currentEditorTabIndex === 0 ? "text-zinc-200 " : "text-zinc-500"
                } flex gap-1 cursor-pointer text-sm`}
                onClick={() => handleEditorTabClick(0)}
              >
                <svg
                  className={`w-4 h-4 mt-px ${currentEditorTabIndex === 0 ? "text-zinc-200" : "text-zinc-500"}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
                  />
                </svg>
                Code
              </button>
              <button
                className={`${
                  currentEditorTabIndex === 1 ? "text-zinc-200 " : "text-zinc-500"
                } flex gap-1 cursor-pointer text-sm`}
                onClick={() => handleEditorTabClick(1)}
              >
                <svg
                  className={`w-4 h-4 mt-px ${currentEditorTabIndex === 1 ? "text-zinc-200" : "text-zinc-500"}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm-.293 9.293a1 1 0 0 1 0 1.414L9.414 14l1.293 1.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Zm2.586 1.414a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L14.586 14l-1.293-1.293Z"
                    clipRule="evenodd"
                  />
                </svg>
                Test Cases
              </button>
            </div>
            <Editor
              defaultLanguage="javascript"
              value={currentEditorTabIndex === 0 ? currentProblem.editorValueCode : currentProblem.editorValueTests}
              onChange={handleEditorValueChange}
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: false,
                },
                autoIndent: true,
              }}
            />
            ;
          </Panel>
          <PanelResizeHandle className="h-1 w-10 self-center bg-zinc-500 rounded-md relative top-2" />
          <Panel defaultSize={45} minSize={8}>
            <div className="mt-1 pl-2 w-full h-full flex flex-col">
              <div className="flex items-center right-1">
                <iframe
                  ref={iframeRef}
                  src={
                    import.meta.env.VITE_ENV === "prod"
                      ? "https://api.yourjscoach.online/assets/3cae4489-5ac4-4c09-bd97-a2cd51409c12.html"
                      : "sandbox.html"
                  }
                  sandbox={`allow-scripts ${import.meta.env.VITE_ENV === "prod" ? "" : "allow-same-origin"}`}
                  className="hidden"
                ></iframe>
              </div>
              <div className="flex-grow bg-zinc-800 rounded-md mb-1 mt-4">
                <div className="flex gap-3 justify-between w-full">
                  <div className="flex gap-1 p-2">
                    <button
                      className={`${
                        showConsoleOutput ? "text-zinc-300" : "text-zinc-500"
                      }  text-sm flex gap-2 items-center w-fit h-fit self-center px-2 py-1 rounded-lg`}
                      onClick={handleShowTestCases}
                    >
                      <svg
                        className={`${
                          showConsoleOutput ? "text-zinc-300" : "text-zinc-500"
                        } h-4 w-4`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H3Zm4.293 5.707a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L9.586 12 7.293 9.707ZM13 14a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Console
                    </button>
                    <button
                      className={`${
                        showResults ? "text-zinc-300" : "text-zinc-500"
                      }  text-sm flex gap-1 items-center w-fit h-fit self-center px-2 py-1 rounded-lg`}
                      onClick={handleShowResults}
                    >
                      <svg
                        className={`${
                          showResults ? "text-zinc-300" : "text-zinc-500"
                        } h-4 w-4`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Result
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="text-lime-500 text-sm flex gap-2 items-center h-fit w-fit self-center px-3 py-1 rounded-lg"
                      onClick={() => debouncedSendMessageToIframe()}
                    >
                      <span className="text-xs mt-1">▶</span>Run
                    </button>
                    <button
                      className="text-zinc-300 text-sm flex gap-2 items-center h-fit w-fit self-center px-3 py-1 rounded-lg mr-2"
                      onClick={() => debouncedSendMessageToIframe("submit")}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                {showConsoleOutput ? (
                  <>
                    {" "}
                    <div className="test-case-container min-h-[150px] max-h-[250px] overflow-y-auto flex flex-col ">
                      {consoleLogMap
                        ? Object.keys(consoleLogMap).map((singleKey, singleCount) => {
                            return (
                              <div key={singleCount}>
                                <span
                                  className={`test-case pl-4 py-2 flex relative  border-b-2 border-zinc-700 ${
                                    singleCount === 0 ? "mt-4 border-t-2" : ""
                                  } gap-4 items-center text-xs text-zinc-300`}
                                >
                                  <span className="bg-yellow-400 text-black rounded-md px-2 py-px">
                                    {consoleLogMap[singleKey]}
                                  </span>{" "}
                                  {singleKey}
                                </span>
                              </div>
                            );
                          })
                        : ""}
                    </div>
                  </>
                ) : (
                  ""
                )}
                {showResults ? (
                  <div className="w-full h-full flex flex-col justify-between relative">
                    {didExecute ? (
                      <>
                        <div className="test-case-container min-h-[150px] max-h-[250px] overflow-y-auto flex flex-col ">
                          {Array.isArray(incommingTestResults.passed)
                            ? new Array(...incommingTestResults.passed)
                                .concat(incommingTestResults.failed)
                                .map((singleCase, index) => {
                                  return (
                                    <div key={index}>
                                      <span
                                        className={`test-case pl-6 py-2 flex relative  border-b-2 border-zinc-700 ${
                                          index === 0 ? "mt-4 border-t-2" : ""
                                        } gap-1 items-center text-sm text-zinc-300`}
                                      >
                                        {singleCase.status === "passed" ? (
                                          <svg
                                            className="w-5 h-5 text-lime-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M5 11.917 9.724 16.5 19 7.5"
                                            />
                                          </svg>
                                        ) : (
                                          <svg
                                            className="w-5 h-5 text-red-600"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M6 18 17.94 6M18 18 6.06 6"
                                            />
                                          </svg>
                                        )}
                                        {singleCase.parentTitle} {">"} {singleCase.title} {" > "} {singleCase.status}{" "}
                                        <span className="">{singleCase.timeTaken}</span>
                                      </span>
                                    </div>
                                  );
                                })
                            : ""}
                        </div>
                        <div>
                          <hr className="h-px bg-zinc-900 border-0 relative bottom-14"></hr>
                          <div className="mx-3 mb-1 relative bottom-12 gap-2 flex">
                            {success || !errorMsg.length > 0 ? (
                              <>
                                <span className="text-sm text-lime-500 pr-2">Correct answer</span>
                                <span className="text-sm text-lime-500">
                                  {incommingTestResults?.passed?.length} passed,
                                </span>
                              </>
                            ) : (
                              ""
                            )}
                            {!success || errorMsg.length > 0 ? (
                              <>
                                <span className="text-sm text-red-500 pr-2">Wrong answer</span>
                                <span className="text-sm text-red-500">
                                  {incommingTestResults?.failed?.length} failed,
                                </span>
                              </>
                            ) : (
                              ""
                            )}
                            <span className="text-sm text-zinc-300">
                              {incommingTestResults?.failed?.length + incommingTestResults?.passed?.length} total
                            </span>
                            <button
                              className="relative text-end flex-grow text-sm text-zinc-300"
                              onClick={() => handleEditorTabClick(1)}
                            >
                              Edit tests
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {!didExecute ? (
                      <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="w-10 h-10 text-zinc-200 "
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M15.9994 2V4H14.9994V7.24291C14.9994 8.40051 15.2506 9.54432 15.7357 10.5954L20.017 19.8714C20.3641 20.6236 20.0358 21.5148 19.2836 21.8619C19.0865 21.9529 18.8721 22 18.655 22H5.34375C4.51532 22 3.84375 21.3284 3.84375 20.5C3.84375 20.2829 3.89085 20.0685 3.98181 19.8714L8.26306 10.5954C8.74816 9.54432 8.99939 8.40051 8.99939 7.24291V4H7.99939V2H15.9994ZM13.3873 10.0012H10.6115C10.5072 10.3644 10.3823 10.7221 10.2371 11.0724L10.079 11.4335L6.12439 20H17.8734L13.9198 11.4335C13.7054 10.9691 13.5276 10.4902 13.3873 10.0012ZM10.9994 7.24291C10.9994 7.49626 10.9898 7.7491 10.9706 8.00087H13.0282C13.0189 7.87982 13.0119 7.75852 13.0072 7.63704L12.9994 7.24291V4H10.9994V7.24291Z"></path>
                        </svg>
                        <h1 className="text-zinc-200">Please run your code to see the result </h1>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default Practice;
