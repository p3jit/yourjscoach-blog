import React, { useState } from "react";

const TestCasesContainer = ({ data, output, success, incommingResult, timeTaken, error }) => {
  const [currentTestCase, setCurrentTestCase] = useState(data[0]);
  const [currIndex, setCurrentIndex] = useState(0);

  const handleSingleTestCaseClick = (index) => {
    setCurrentIndex(index);
    setCurrentTestCase(data[index]);
  };

  return (
    <div className="mt-6 p-2 overflow-auto overflow-x-hidden">
      <div className="flex justify-between">
        <div className="flex gap-3 text-white">
        {data.map((_, index) => {
          return (
            <button
              key={index}
              className={`px-3 py-2 bg-zinc-700 rounded-md text-sm font-semibold ${success ? "outline-lime-400 outline-4 outline" : "" } ${error ? "outline-red-500 outline-4 outline" : "" }`}
              onClick={() => {
                handleSingleTestCaseClick(index);
              }}
            >
              Case {index}
            </button>
          );
        })}
        </div>
        { success ? <h1 className="text-xl text-lime-400">Accepted : <span className="font-semibold">{String(timeTaken)} ms</span></h1> : error ? <h1 className="text-xl text-red-600">Wrong answer : <span className="font-semibold">{String(timeTaken)} ms</span></h1> : ""}
      </div>
      <div className="flex-col flex mt-5 gap-3 w-full h-40 flex-wrap ">
        {currentTestCase.map((singleTestCase, index) => {
          return (
            <div key={Math.random()}>
              <h2 className="text-white">param {index} =</h2>
              <input
                value={singleTestCase}
                className="mt-1 px-3 py-1 rounded bg-zinc-400 font-semibold w-full outline-0"
                readOnly
              />
            </div>
          );
        })}
        <div>
          <h2 className="text-white">Expected output</h2>
          <input className={`mt-1 px-3 py-1 rounded bg-zinc-400 font-semibold w-full outline-0 ${success ? "outline-lime-400 outline-4 outline" : "" } ${error ? "outline-red-500 outline-4 outline" : "" }`} value={output[currIndex]} readOnly />
        </div>
        <div>
          <h2 className="text-white">Your output</h2>
          <input className={`mt-1 px-3 py-1 rounded bg-zinc-400 font-semibold w-full outline-0 ${success ? "outline-lime-400 outline-4 outline" : "" } ${error ? "outline-red-500 outline-4 outline" : "" }`} value={ incommingResult[0] ? incommingResult[currIndex] : ' -- Execute first --'} readOnly />
        </div>
      </div>
    </div>
  );
};

export default TestCasesContainer;
