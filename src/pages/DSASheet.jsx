// import { ReactSVG } from "react-svg";
// import { DarkModeProvider } from "../contexts/DarkModeContext";
// import { mockQuestions } from "../utils/mockData";
// import { generateTableDataFromCsv } from "../utils/utils";
import Table from "../components/table/Table";
import React, { useEffect, useState } from "react";
import { IconSearch, IconMoodCry, IconX } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const DSASheet = () => {
  // const { isDarkMode } = useContext(DarkModeProvider);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const navigate = useNavigate();

  const handleSearchQuestion = (e) => {
    const val = e.target.value;
    if (val.length === 0) {
      setFilteredQuestions(questions);
      return;
    }
    const res = questions.filter(
      (singleQuestion) => singleQuestion.questionName.includes(val) || singleQuestion.askedIn.map((a) => a.toLowerCase()).includes(val) || singleQuestion.topics.map((a) => a.toLowerCase()).includes(val)
    );
    setFilteredQuestions(res);
  };
  const debouncedHandleSearchQuestion = useDebounce(handleSearchQuestion, 400);

  useEffect(() => {
    fetch("/data/questions.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
        setFilteredQuestions(data);
      })
      .catch((err) => {
        navigate("/404");
        console.log(err);
      });
  }, []);

  return (
    <div className="py-10 flex flex-col items-center gap-10 min-h-[85vh]">
      <div className="flex w-2/6 justify-center items-center self-start relative mx-1 flex-col">
        <input
          type="text"
          spellCheck="false"
          className={`bg-zinc-700 outline outline-3 w-full text-zinc-200 outline-zinc-800 rounded-md py-2 pr-10 pl-12 tracking-wide text-sm ${
            false ? "outline-zinc-200" : "outline-none"
          }`}
          onChange={debouncedHandleSearchQuestion}
        />
        <IconSearch className="absolute left-3 text-zinc-400 text-2xl" />
        {false ? (
          <IconX className="absolute right-3 text-2xl text-zinc-400 cursor-pointer" onClick={handleClear} />
        ) : (
          ""
        )}
      </div>
      {filteredQuestions?.length > 0 ? (
        <Table data={filteredQuestions} key={Math.random()} />
      ) : (
        <div className="w-full h-96 border-2 border-zinc-700 rounded-md">
          <div className="flex flex-col gap-3 w-full h-full justify-center items-center">
            <svg
              className="w-10 h-10 text-zinc-500 dark:text-white"
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
                d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="font-medium text-zinc-300 tracking-wide">Not found</span>
            <span className="font-normal tracking-wide text-zinc-400">Try searching something different</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSASheet;
