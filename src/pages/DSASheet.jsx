import React, { useContext, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import Table from "../components/table/Table";
import { usePapaParse } from "react-papaparse";
import { generateTableDataFromCsv } from "../utils/utils";

const DSASheet = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const [tableData, setTableData] = useState([]);
  const { readString } = usePapaParse();

  useEffect(() => {
    fetch("/data/sampleCsv.csv")
      .then((response) => {
        return response.text();
      })
      .then((txt) => {
        readString(txt, {
          worker: true,
          complete: (results) => {
            const parsedData = generateTableDataFromCsv(results.data);
            setTableData(parsedData);
          },
        });
      })
      .catch((err) => {
        navigate("/404");
        console.log(err);
      });
  }, []);

  return (
    <div className="py-10 flex flex-col items-center gap-14 min-h-[85vh]">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-10 md:gap-0">
        <h1
          className={`text-2xl font-medium ${
            isDarkMode ? "text-zinc-700" : "text-white"
          } w-full first-letter:uppercase first-letter:text-[3rem] leading-8`}
        >
          curated list of problems that will help you crack your next coding
          interview
        </h1>
        <div className="w-full">
          <ReactSVG src="/code-typing-animate.svg" className="" />
        </div>
      </div>
      {tableData?.map((singleTableData, index) => (
        <Table data={singleTableData} key={Math.random()} />
      ))}
    </div>
  );
};

export default DSASheet;
