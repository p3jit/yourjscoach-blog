import React, { Fragment, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import useDebounce from "../hooks/useDebounce";

const Practice = () => {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentProblem, setCurrentProblem] = useState({
    editorValue: `\
    // Complete the following function to execute the code
    function addTwoNumbers (x,y) {
        return x+y;
    }
  `,
    functionName: "addTwoNumber",
    testCases: [
      [2, 3],
      [4, 5],
      [9, 10],
      [9, 10],
    ],
  });

  useEffect(() => {
    const handleMessage = (event) => {
      if (import.meta.env.VITE_ENV !== "dev") {
        if (event.origin !== "https://www.yourjscoach.online" || event.origin !== "https://api.yourjscoach.online") {
          console.warn("Origin mismatch:", event.origin);
          return;
        }
      }
      if (event.data && !event.data.vscodeScheduleAsyncWork) {
        if (event.data.stack) {
          setError(event.data.stack);
        } else {
          console.log(event);
          setSuccess(new Array(event.data));
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

  const sendMessageToIframe = () => {
    setError(null);
    setSuccess(null);
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
      <Panel minSize={30} className="mt-1">
        <textarea className="w-full rounded-md h-[70vh]"></textarea>
      </Panel>
      <PanelResizeHandle className="bg-zinc-500 w-1 h-10 self-center rounded-md" />
      <Panel minSize={45} className="mt-1">
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
          <Panel defaultSize={45} minSize={17}>
            <div className=" mt-1">
              <div className="flex justify-end items-center right-1">
                <iframe
                  ref={iframeRef}
                  // srcDoc={sandboxHTML}
                  src={
                    import.meta.env.VITE_ENV === "prod" ? "https://api.yourjscoach.online/assets/3cae4489-5ac4-4c09-bd97-a2cd51409c12.html" : "sandbox.html"
                  }
                  sandbox={`allow-scripts ${ import.meta.env.VITE_ENV === "prod" ? "" : "allow-same-origin"}`}
                  className="hidden"
                ></iframe>
                <div className="flex gap-3">
                  <button
                    className="bg-zinc-700 rounded-md text-sm px-3 py-2 flex gap-2 items-center justify-center text-lime-500 font-bold"
                    onClick={debouncedSendMessageToIframe}
                  >
                    <span>▶</span>Run
                  </button>
                  <button className="bg-zinc-700 rounded-md text-sm px-3 py-2 font-bold text-zinc-300">
                    Submit
                  </button>
                </div>
              </div>
              {error ? (
                <div className="text-red-600 mt-5 font-bold text-lg">
                  {error}
                </div>
              ) : (
                ""
              )}
              {success ? (
                <div className="text-lime-500 mt-5 font-bold text-lg">
                  {success}
                </div>
              ) : (
                ""
              )}
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default Practice;
