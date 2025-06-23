import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

/**
 * Component for the code editor section with tabs for code and test cases
 */
const EditorSection = ({
  currentProblem,
  currentEditorTabIndex,
  handleEditorValueChange,
  handleEditorTabClick,
  setErrorMsg,
}) => {

  // Function to check for errors
  const checkForErrors = (markers) => {
    if (markers) {
      let errorMessages = markers
        .map((marker) => {
          if (marker.severity === 8) {
            return `Line ${marker.startLineNumber}: ${marker.message}`;
          }
        })
        .join("\n");
      if (errorMessages === "\n") errorMessages = "";
      if (errorMessages.length > 0) {
        setErrorMsg((prev) => {console.log(prev); return errorMessages});
      } else {
        setErrorMsg((prev) => {console.log(prev); return ""});
      }
    }
  };

  const handleValueChange = (value) => {
    handleEditorValueChange(value);
  };

  const handleErrorCheck = (markers) => {
    // Check for errors after a short delay to allow Monaco to validate
    setTimeout(() => {checkForErrors(markers)}, 100);
  };

  return (
    <>
      <div className="flex gap-8 py-3 px-4 bg-zinc-800">
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
        onChange={handleValueChange}
        onValidate={handleErrorCheck}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
          autoIndent: true,
        }}
      />
    </>
  );
};

export default EditorSection;
