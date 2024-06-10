import React, { useState } from "react";

const TestCasesContainer = ({ data, output }) => {
  const [currentTestCase, setCurrentTestCase] = useState(data[0]);
  const [currIndex, setCurrentIndex] = useState(0);

  const handleSingleTestCaseClick = (index) => {
    setCurrentIndex(index);
    setCurrentTestCase(data[index]);
  };
  return (
    <div className="mt-6 p-2 overflow-auto overflow-x-hidden">
      <div className="flex text-white gap-3 ">
        {data.map((singleData, index) => {
          return (
            <button
              key={index}
              className="px-3 py-2 bg-zinc-700 rounded-md text-sm font-semibold"
              onClick={() => {
                handleSingleTestCaseClick(index);
              }}
            >
              Case {index}
            </button>
          );
        })}
      </div>
      <div className="flex-col flex mt-5 gap-3 w-full h-40 flex-wrap ">
        {currentTestCase.map((singleTestCase, index) => {
          return (
            <div key={Math.random()}>
              <h2 className="text-white">param {index} =</h2>
              <input
                value={singleTestCase}
                className="mt-1 px-3 py-1 rounded bg-zinc-400 font-semibold w-full"
                readOnly
              />
            </div>
          );
        })}
        <div>
          <h2 className="text-white">Expected output</h2>
          <input className="mt-1 px-3 py-1 rounded bg-zinc-400 font-semibold w-full" value={output[currIndex]} readOnly />
        </div>
        <div>
          <h2 className="text-white">Your output</h2>
          <input className="mt-1 px-3 py-1 rounded bg-zinc-400 font-semibold w-full text-lime-300 " value={'-- Execute first --'} readOnly />
        </div>
      </div>
    </div>
  );
};

export default TestCasesContainer;
