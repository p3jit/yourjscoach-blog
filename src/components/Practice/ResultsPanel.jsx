import { IconTerminal2 } from "@tabler/icons";
import React from "react";

/**
 * Component for displaying test results, console output, and run controls
 */
const ResultsPanel = ({
  iframeRef,
  showConsoleOutput,
  showResults,
  didExecute,
  isRunning,
  success,
  errorMsg,
  testResults,
  consoleLogMap,
  handleShowTestCases,
  handleShowResults,
  handleRunCode,
  handleSubmitCode,
  handleEditorTabClick,
  currentProblem,
}) => {
  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex w-full h-full justify-center items-center relative">
      <div role="status" className="bottom-10 left-9 relative">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-600 animate-spin dark:text-gray-600 fill-zinc-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
      <span className="text-zinc-500 text-md">Running...</span>
    </div>
  );

  // Empty state component for console output
  const EmptyStateOutput = ({ message = "console.log() statements show here" }) => (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <IconTerminal2 className="text-zinc-300" />
      <h1 className="text-zinc-400">{message}</h1>
    </div>
  );

  // Empty state component for result output
  const EmptyStateResult = ({ message = "Please run your code to see the result" }) => (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-10 h-10 text-zinc-400"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15.9994 2V4H14.9994V7.24291C14.9994 8.40051 15.2506 9.54432 15.7357 10.5954L20.017 19.8714C20.3641 20.6236 20.0358 21.5148 19.2836 21.8619C19.0865 21.9529 18.8721 22 18.655 22H5.34375C4.51532 22 3.84375 21.3284 3.84375 20.5C3.84375 20.2829 3.89085 20.0685 3.98181 19.8714L8.26306 10.5954C8.74816 9.54432 8.99939 8.40051 8.99939 7.24291V4H7.99939V2H15.9994ZM13.3873 10.0012H10.6115C10.5072 10.3644 10.3823 10.7221 10.2371 11.0724L10.079 11.4335L6.12439 20H17.8734L13.9198 11.4335C13.7054 10.9691 13.5276 10.4902 13.3873 10.0012ZM10.9994 7.24291C10.9994 7.49626 10.9898 7.7491 10.9706 8.00087H13.0282C13.0189 7.87982 13.0119 7.75852 13.0072 7.63704L12.9994 7.24291V4H10.9994V7.24291Z"></path>
      </svg>
      <h1 className="text-zinc-400">{message}</h1>
    </div>
  );

  // Console output component
  const ConsoleOutput = () => (
    <div className="bg-zinc-900 test-case-container min-h-[150px] max-h-[300px] overflow-y-auto flex flex-col w-full h-full scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-zinc-900 scrollbar-track-zinc-800">
      {consoleLogMap && Object.keys(consoleLogMap).length > 0
        ? Object.keys(consoleLogMap).map((singleLog, singleCount) => (
            <div key={singleCount}>
              <span
                className={`test-case pl-4 py-2 flex relative border-b-2 border-zinc-700 ${
                  singleCount === 0 ? "mt-4 border-t-2" : ""
                } gap-4 items-center text-xs text-zinc-300`}
              >
                {consoleLogMap[singleLog]}
              </span>
            </div>
          ))
        : ""}
      {errorMsg && <p className="text-red-500 p-5 whitespace-pre-wrap text-sm tracking-wide">{`${errorMsg}`}</p>}
    </div>
  );

  // Test results component
  const TestResults = () => (
    <>
      <div className="min-h-[150px] max-h-[250px] overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-800 pr-2 mr-1 pb-14">
        {Array.isArray(testResults.passed) && Array.isArray(testResults.failed)
          ? [...testResults.passed, ...testResults.failed].map((singleCase, index) => (
              <div
                key={index}
                className={`pl-6 relative py-2 justify-between flex border-b-2 border-zinc-700 ${
                  index === 0 ? "mt-4 border-t-2" : ""
                } gap-1 items-center text-sm text-zinc-300`}
              >
                <div className="flex gap-3">
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
                  <span>{singleCase.parentTitle}</span>
                  {">"}
                  <span>{singleCase.title}</span>
                </div>
                <div className="flex text-zinc-500 justify-end mr-6">{singleCase.timeTaken} ms</div>
              </div>
            ))
          : null}
      </div>
      <div>
        <hr className="h-px pt-0.5 bg-zinc-700 border-0 relative bottom-14"></hr>
        <div className="mx-3 mb-1 relative bottom-12 gap-2 flex">
          {success ? (
            <>
              <span className="text-sm text-lime-500 pr-2">Correct answer</span>
              <span className="text-sm text-lime-500">{testResults?.passed?.length} passed,</span>
            </>
          ) : null}
          {!success ? (
            <>
              <span className="text-sm text-red-500 pr-2">Wrong answer</span>
              <span className="text-sm text-red-500">{testResults?.failed?.length} failed,</span>
            </>
          ) : null}
          <span className="text-sm text-zinc-300">
            {(testResults?.failed?.length || 0) + (testResults?.passed?.length || 0)} total
          </span>
          <button className="relative text-end flex-grow text-sm text-zinc-300" onClick={() => handleEditorTabClick(1)}>
            Edit tests
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full h-full flex flex-col border-t-2 border-t-zinc-700">
      {/* Hidden iframe for running code */}
      <div>
        <iframe
          ref={iframeRef}
          src={
            import.meta.env.VITE_ENV === "prod"
              ? "https://api.yourjscoach.online/assets/3cae4489-5ac4-4c09-bd97-a2cd51409c12.html"
              : "/sandbox.html"
          }
          sandbox={`allow-scripts ${import.meta.env.VITE_ENV === "prod" ? "" : "allow-same-origin"}`}
          className="hidden"
        ></iframe>
      </div>

      {/* Control panel */}
      <div className="flex-grow bg-zinc-800">
        <div className="flex gap-3 justify-between w-full">
          {/* Tab buttons */}
          <div className="flex gap-1 p-2">
            <button
              className={`${
                showConsoleOutput ? "text-zinc-300" : "text-zinc-500"
              } text-sm flex gap-2 items-center w-fit h-fit self-center px-2 py-1 rounded-lg`}
              onClick={handleShowTestCases}
            >
              <svg
                className={`${showConsoleOutput ? "text-zinc-300" : "text-zinc-500"} h-4 w-4`}
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
            {!currentProblem.category === "js" && (
              <button
                className={`${
                  showResults ? "text-zinc-300" : "text-zinc-500"
                } text-sm flex gap-1 items-center w-fit h-fit self-center px-2 py-1 rounded-lg`}
                onClick={handleShowResults}
              >
                <svg
                  className={`${showResults ? "text-zinc-300" : "text-zinc-500"} h-4 w-4`}
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
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              className="text-lime-500 text-sm tracking-wide flex gap-2 items-center h-fit w-fit self-center px-3 py-1 rounded-lg"
              onClick={handleRunCode}
            >
              <span className="text-xs">▶</span>Run
            </button>
            <button
              className="text-zinc-300 text-sm tracking-wide flex gap-2 items-center h-fit w-fit self-center px-3 py-1 rounded-lg mr-2"
              onClick={handleSubmitCode}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Console output panel */}
        {showConsoleOutput && (
          <div className="w-full h-full flex flex-col justify-between relative">
            {didExecute && !isRunning ? <ConsoleOutput /> : null}
            {!didExecute && !isRunning ? <EmptyStateOutput /> : null}
            {isRunning ? <LoadingSpinner /> : null}
          </div>
        )}

        {/* Results panel */}
        {showResults && (
          <div className="w-full h-full flex flex-col justify-between relative">
            {didExecute && !isRunning ? <TestResults /> : null}
            {!didExecute && !isRunning ? <EmptyStateResult /> : null}
            {isRunning ? <LoadingSpinner /> : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
