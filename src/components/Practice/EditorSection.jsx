import React, { useRef, useState, useEffect, useContext } from "react";
import Editor from "@monaco-editor/react";
import useDebounce from "../../hooks/useDebounce";
import { LocalStorageProvider } from "../../contexts/localStorageContext";
import ResetButton from "../ResetButton";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";

const EditorSection = ({
  currentProblem,
  currentEditorTabIndex,
  handleEditorValueChange,
  handleEditorTabClick,
  setErrorMsg,
  middleBarTabs,
  middleBarTabIndex,
  editorValue,
  setEditorValue
}) => {
  const iframeRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState(``);
  const [cssContent, setCssContent] = useState(``);
  const [jsContent, setJsContent] = useState("");
  const { progressMap } = useContext(LocalStorageProvider);

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
        setErrorMsg((prev) => {
          return errorMessages;
        });
      } else {
        setErrorMsg((prev) => {
          return "";
        });
      }
    } else {
      setErrorMsg("");
    }
  };

  const handleValueChange = (value) => {
    handleEditorValueChange(value);
  };

  const handleErrorCheck = (markers) => {
    // Check for errors after a short delay to allow Monaco to validate
    setTimeout(() => {
      checkForErrors(markers);
    }, 100);
  };

  // Function to update iframe content
  const updateIframe = useDebounce(() => {
    if (currentEditorTabIndex === 0 && iframeRef.current && middleBarTabs && currentProblem.category !== "dsa") {
      // Get the content from middleBarTabs
      const htmlTab = middleBarTabs.find((tab) => tab.label.includes("html"));
      const cssTab = middleBarTabs.find((tab) => tab.label.includes("css"));
      const jsTab = middleBarTabs.find((tab) => tab.label.includes("js"));

      const html = htmlTab ? htmlTab.editorValue : "";
      const css = cssTab ? cssTab.editorValue : "";
      let js = jsTab ? jsTab.editorValue : "";

      setHtmlContent(html);
      setCssContent(css);
      setJsContent(js);

      const DEBUGGER_REGEX = /^\s*debugger;\s*$/gm;
      js = js.replace(DEBUGGER_REGEX,"");

      // Combine HTML, CSS, and JS for the iframe
      const iframeContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            (function() {
              ${js}
            })();
          </script>
        </body>
        </html>
      `;

      // Update the iframe content
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(iframeContent);
      iframeDoc.close();
    }
  }, 500); // 500ms debounce delay

  const handleReset = () => {
    setEditorValue({code: currentProblem.editorValueCode, tests: currentProblem.editorValueTests});
  }

  useEffect(() => {
    setEditorValue({
      tests: currentProblem.editorValueTests,
      code: progressMap[currentProblem.documentId]
        ? progressMap[currentProblem.documentId]
        : currentProblem.editorValueCode,
    });
  }, [currentProblem]);

  // Update iframe content when code changes or tab changes
  useEffect(() => {
    updateIframe();
  }, [currentEditorTabIndex, middleBarTabs, middleBarTabIndex, currentProblem.category]);

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-zinc-800/30">
      {/* Tabs */}
      <div className="flex items-center px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800/30">
        <div className="flex space-x-1 rounded-lg bg-zinc-800/50 p-0.5">
          {currentProblem.category !== "dsa" ? (
            <button
              onClick={() => handleEditorTabClick(0)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentEditorTabIndex === 0
                  ? 'bg-zinc-700/70 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
              }`}
            >
              Output
            </button>
          ) : (
            <>
              <button
                onClick={() => handleEditorTabClick(0)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentEditorTabIndex === 0
                    ? 'bg-zinc-700/70 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => handleEditorTabClick(1)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentEditorTabIndex === 1
                    ? 'bg-zinc-700/70 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
                }`}
              >
                Test Cases
              </button>
            </>
          )}
        </div>
        
        <div className="ml-auto">
          <ResetButton onClick={handleReset} />
        </div>
      </div>

      {/* Editor/Output Area */}
      <div className="flex-1  bg-zinc-950/70">
        {currentEditorTabIndex === 0 ? (
          currentProblem.category === "dsa" ? (
            <div className="h-full">
              <Editor
                defaultLanguage="javascript"
                value={editorValue?.code}
                onChange={handleValueChange}
                onValidate={handleErrorCheck}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14
                }}
              />
            </div>
          ) : (
            <div className="h-full bg-white">
              <iframe
                ref={iframeRef}
                title="output"
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )
        ) : (
          <div className="h-full">
            <Editor
              defaultLanguage="javascript"
              value={editorValue?.tests}
              onChange={(value) => handleEditorValueChange(value, 'tests')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorSection;
