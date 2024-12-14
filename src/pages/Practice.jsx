import React, { Fragment, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import useDebounce from "../hooks/useDebounce";
import TestCasesContainer from "../components/test-cases-container/TestCasesContainer";
import Markdown from "markdown-to-jsx";
import NormalText from "../components/markdown-components/normalText/NormalText";
import ExampleBlock from "../components/markdown-components/example-block/ExampleBlock";
import Tag from "../components/tag/Tag";
import { arraysEqual } from "../utils/utils";
import { mockPractice } from "../utils/mockData";

const Practice = () => {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [success, setSuccess] = useState(false);
  const [incommingResult, setIncommingResult] = useState([]);
  const [showTestCases, setShowTestCases] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(mockPractice);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && !event.data.vscodeScheduleAsyncWork) {
        if (event.data.stack || event.data.name || event.data.code) {
          if (event.data.stack) {
            setError(event.data.stack);
          } else {
            setError(event.data.message);
          }
        } else {
          const res = JSON.parse(event.data.message);
          setTimeTaken(event.data.timeTaken);
          if (arraysEqual(res, currentProblem.correctOutput)) {
            setSuccess(true);
          } else {
            setError("Test case mismatch");
          }
          setIncommingResult(res);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleCodeChange = (value, event) => {
    setCurrentProblem((oldValue) => {
      oldValue.editorValue = value;
      return oldValue;
    });
  };

  const handleShowTestCases = () => {
    setShowTestCases(!showTestCases);
    setShowResults(!showResults);
  };

  const handleShowResults = () => {
    setShowResults(!showResults);
    setShowTestCases(!showTestCases);
  };

  const sendMessageToIframe = () => {
    setError(null);
    setSuccess(null);
    setIncommingResult([]);
    iframeRef.current.contentWindow.postMessage(
      {
        code: currentProblem.editorValue,
        functionName: currentProblem.functionName,
        testCases: currentProblem.testCases,
      },
      "*"
    );
  };

  const debouncedSendMessageToIframe = useDebounce(sendMessageToIframe, 800);

  return (
    <PanelGroup direction="horizontal" className="flex gap-1">
      <Panel minSize={30}>
        <div className="w-full rounded-md h-[87vh] p-7 bg-zinc-800 flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-500">
          <h1 className="text-zinc-100 text-2xl font-semibold text-wrap">{currentProblem.problemTitle}</h1>
          <div className="flex justify-between w-full">
            <span className="px-2 py-1 rounded-lg bg-zinc-600 font-bold text-md text-lime-500 w-fit">
              {currentProblem.difficulty}
            </span>
            <div className="flex gap-2">
              {currentProblem.tags.map((currentTag) => {
                return (
                  <Fragment>
                    <Tag data={currentTag}></Tag>
                  </Fragment>
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
      <PanelResizeHandle className="bg-zinc-500 w-1 h-10 self-center rounded-md" />
      <Panel minSize={45}>
        <PanelGroup direction="vertical" className="flex gap-1 relative">
          <Panel defaultSize={55} minSize={55} className="rounded-md">
            <Editor
              defaultLanguage="javascript"
              defaultValue={currentProblem.editorValue}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: false,
                },
              }}
            />
            ;
          </Panel>
          <PanelResizeHandle className="h-1 w-10 self-center bg-zinc-500 rounded-md" />
          <Panel defaultSize={45} minSize={7}>
            <div className=" mt-1 pl-2 w-full h-full">
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
                <div className="flex gap-3 justify-between w-full">
                  <div className="flex gap-3">
                    <button
                      className={`${
                        showTestCases ? "bg-zinc-800 outline-1 outline-zinc-300 outline-double" : "bg-zinc-700"
                      }  rounded-md text-sm px-3 py-2 font-bold text-zinc-200 flex justify-center items-center gap-2`}
                      onClick={handleShowTestCases}
                    >
                      <svg
                        className="w-4 h-4 text-zinc-200"
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
                      Test cases
                    </button>
                    <button
                      className={`${
                        showResults ? "bg-zinc-800 outline-1 outline-zinc-300 outline-double" : "bg-zinc-700"
                      }  rounded-md text-sm px-3 py-2 font-bold text-zinc-200 flex justify-center items-center gap-2`}
                      onClick={handleShowResults}
                    >
                      <svg
                        className="w-4 h-4 text-zinc-200"
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
                      Result
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="bg-zinc-600 hover:bg-zinc-700 rounded-md text-sm px-3 py-2 flex gap-2 items-center justify-center text-lime-500 font-bold"
                      onClick={debouncedSendMessageToIframe}
                    >
                      <span>▶</span>Run
                    </button>
                    <button className="bg-zinc-600 hover:bg-zinc-700 rounded-md text-sm px-3 py-2 font-bold text-zinc-300">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full h-full">
                {showTestCases ? (
                  <TestCasesContainer
                    error={error}
                    incommingResult={incommingResult}
                    timeTaken={timeTaken}
                    success={success}
                    data={eval(JSON.stringify(currentProblem.testCases)).slice(0, 3)}
                    output={currentProblem.correctOutput}
                  />
                ) : (
                  ""
                )}
                {showResults ? (
                  <div className="w-full h-full">
                    {success && !error ? (
                      <h1 className="text-lime-500 p-5 text-xl font-semibold flex items-center gap-3">
                        <span>
                          <svg
                            className="w-6 h-6"
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
                              d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </span>
                        {`All test cases has passed - ${currentProblem.correctOutput}`}
                      </h1>
                    ) : (
                      ""
                    )}
                    {error && !success ? (
                      <h1 className="text-red-500 py-10 pr-10 text-wrap text-lg font-semibold flex items-center gap-3">
                        <span>
                          {" "}
                          <svg
                            className="w-6 h-6"
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
                              d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </span>
                        {error}
                      </h1>
                    ) : (
                      ""
                    )}
                    {!success && !error ? (
                      <div className="w-full h-full flex justify-center items-center gap-2">
                        <svg
                          className="w-6 h-6 text-zinc-200"
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
                            d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        <h1 className="text-zinc-200">Not ran yet </h1>
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
