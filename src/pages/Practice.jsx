import React, { useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";

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
    ],
  });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://api.yourjscoach.online") {
        console.warn('Origin mismatch:', event.origin);
        return;
      }
      if (event.data && !event.data.vscodeScheduleAsyncWork) {
        if (event.data.stack) {
          setError(event.data.stack.toString());
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
      "https://api.yourjscoach.online"
    );
  };

  return (
    <PanelGroup direction="horizontal" className="flex gap-1">
      <Panel minSize={30} className="mt-1">
        <textarea className="w-full rounded-md h-[70vh]"></textarea>
      </Panel>
      <PanelResizeHandle className="bg-zinc-500 w-1 h-10 self-center rounded-md" />
      <Panel minSize={30} className="mt-1">
        <PanelGroup direction="vertical" className="flex gap-1">
          <Panel defaultSize={70} minSize={65} className="rounded-md">
            <Editor
              defaultLanguage="javascript"
              defaultValue={currentProblem.editorValue}
              onChange={handleCodeChange}
              theme="vs-dark"
            />
            ;
          </Panel>
          <PanelResizeHandle className="h-1 w-10 self-center bg-zinc-500 rounded-md" />
          <Panel defaultSize={30} maxSize={35} minSize={25}>
            <div className=" mt-4 ml-4">
              <div className="flex justify-between items-center">
                <iframe
                  ref={iframeRef}
                  src="https://api.yourjscoach.online/assets/2f6c44e7-1cdb-43c0-a251-55fe80f73bff.html"
                  // sandbox="allow-scripts"
                  className="hidden"
                ></iframe>
                <h2 className="text-zinc-400 font-gap-2bold text-xl">Output</h2>
                <div className="flex gap-3">
                  <button
                    className="bg-zinc-700 rounded-md px-3 py-2 flex gap-2 items-center justify-center text-lime-500 font-bold"
                    onClick={sendMessageToIframe}
                  >
                    <span>▶</span>Run
                  </button>
                  <button className="bg-zinc-700 rounded-md px-3 py-2 font-bold text-zinc-300">
                    Submit
                  </button>
                </div>
              </div>
              {error ? <div className="text-red-600 mt-5 font-bold text-lg">{error}</div> : ""}
              {success ? <div className="text-lime-500 mt-5 font-bold text-lg">{success}</div> : ""}
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default Practice;
