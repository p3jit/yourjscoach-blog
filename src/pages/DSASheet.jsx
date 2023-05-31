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
    <div className="flex flex-col gap-4 min-h-[85vh]">
      <div className="w-96 md:w-[32em] mx-auto">
        <ReactSVG src="/code-typing-animate.svg" className="" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 text-center pb-14">
        Dsa questions
      </h1>
      {tableData?.map((singleTableData) => (
        <Table data={singleTableData} key={Math.random()} />
      ))}
    </div>
  );
};

export default DSASheet;
