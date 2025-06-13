import Table from "../components/table/Table";
import React, { useEffect, useState } from "react";
import { IconSearch, IconTable, IconX, IconLayoutGrid } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import InterviewPrepPlans from "../components/interviewPrep/InterviewPrepPlans";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";

const DSASheet = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isTableView, setIsTableView] = useState(true);

  const isDev = false;

  const navigate = useNavigate();

  // Filter questions based on search text and selected category
  const filterQuestions = (searchValue, category = "") => {
    if (!questions.length) return [];

    let filtered = questions;

    // Apply search text filter
    if (searchValue.length > 0) {
      filtered = questions.filter(
        (question) =>
          question.problemTitle.includes(searchValue) ||
          question.askedIn.some((company) => company.toLowerCase().includes(searchValue)) ||
          question.tags.some((tag) => tag.toLowerCase().includes(searchValue))
      );
    }

    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter((question) => question.category === category);
    }

    return filtered;
  };

  const handleSearchQuestion = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setFilteredQuestions(filterQuestions(value, currentTab !== "all" ? currentTab : ""));
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setFilteredQuestions(filterQuestions(searchText, tab !== "all" ? tab : ""));
  };

  const clearSearch = () => {
    setSearchText("");
    setFilteredQuestions(filterQuestions("", currentTab !== "all" ? currentTab : ""));
  };

  const debouncedHandleSearchQuestion = useDebounce(handleSearchQuestion, 400);

  // Fetch questions data on component mount
  useEffect(() => {
    fetch(isDev ? "http://localhost:1337/api/problems" : "/data/questions.json")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setFilteredQuestions(data);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        navigate("/404");
      });
  }, [navigate]);

  // Tab component
  const TabNavigation = () => (
    <div className="self-start">
      <div className="hidden sm:block">
        <div className="">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {["all", "js", "dsa"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`inline-flex shrink-0 items-center gap-2 px-1 pb-2 text-sm font-medium hover:border-gray-300 hover:text-zinc-200 ${
                  currentTab === tab ? "text-zinc-200 border-zinc-200 border-b-2" : "text-zinc-500 border-transparent"
                }`}
              >
                {tab === "all" ? "All Problems" : tab === "js" ? "JS Questions" : "DSA Questions"}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Search component
  const SearchBar = () => (
    <div className="flex w-full justify-center items-center self-start relative mx-1 flex-col shadow shadow-zinc-700">
      <input
        type="text"
        spellCheck="false"
        placeholder="Search problems by title, tags and company"
        className="bg-zinc-800 outline outline-1 outline-zinc-400 w-full text-zinc-200 rounded-md py-3 pr-10 pl-12 tracking-wide text-sm"
        onChange={debouncedHandleSearchQuestion}
      />
      <IconSearch className="absolute left-3 text-zinc-400 text-2xl" />
      {searchText && <IconX className="absolute right-3 text-2xl text-zinc-400 cursor-pointer" onClick={clearSearch} />}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
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
  );

  const Caption = () => (
    <div className="self-start mt-5">
      <h1 className="text-2xl font-semibold tracking-wide text-zinc-200 mb-2">Explore Problems</h1>
      <p className="text-lg tracking-normal text-zinc-500">Find challenges by topic, difficulty or company</p>
    </div>
  );

  return (
    <div className="py-6 flex flex-col items-center gap-10 min-h-[85vh]">
      {/* <div className="w-full bg-[length:200%_100%] animate-gradient-x h-[60vh] bg-gradient-to-tr from-zinc-900 shadow-md from-5% to-zinc-600 to-85%   rounded-2xl mb-10 flex flex-col gap-10 items-center justify-center">
        <h1 className="bg-gradient-to-tr from-zinc-300 to-zinc-100 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl text-wrap w-3/4 text-center">Code with Confidence: Ace Your Interviews</h1>
        <button className="bg-zinc-100 text-zinc-950 px-3 py-2 rounded-2xl flex items-center justify-center gap-2">Get Started <span>→</span></button>
      </div> */}
      <div className="w-full ">
        <div
          className="bg-[length:200%_100%] animate-gradient-x h-[60vh] bg-gradient-to-tr from-zinc-900 shadow-md from-25% to-zinc-700 to-95% coding inverse-toggle px-1 text-gray-100 text-sm font-mono subpixel-antialiased 
               pb-6 pt-4 rounded-lg leading-normal overflow-hidden"
        >
          <div className="top mb-2 flex pl-3">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div className="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
            <div class="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-16 py-28 ">
            <div className="flex flex-col gap-8 w-full px-9">
              <h1 className="bg-gradient-to-tr from-zinc-300 to-zinc-100 bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl text-wrap text-center">
                Level Up Your UI Engineering Skills
              </h1>
              <h2 className="bg-gradient-to-tr from-zinc-300 to-zinc-100 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl text-wrap text-center">
                Your Complete Interview Preparation Toolkit
              </h2>
            </div>

            <button className="w-1/4 bg-zinc-100 text-zinc-950 px-3 py-2 rounded-2xl flex items-center justify-center gap-2">
              View Problems <span>→</span>
            </button>
          </div>
        </div>
      </div>
      {/* <InterviewPrepPlans /> */}
      <div className="flex flex-col w-full gap-7">
        <Caption />
        <SearchBar />
      </div>
      <div className="flex w-full justify-between items-center">
        <TabNavigation />
        <div className="flex gap-3 text-zinc-400 cursor-pointer">
          <span
            onClick={() => {
              setIsTableView(false);
            }}
          >
            <IconLayoutGrid />
          </span>

          <span>|</span>
          <span
            onClick={() => {
              setIsTableView(true);
            }}
          >
            <IconTable />
          </span>
        </div>
      </div>

      {isTableView ? (
        <div className="flex-col w-full flex gap-5">
          {filteredQuestions?.length > 0 ? (
            <Table data={filteredQuestions} key={filteredQuestions.length} />
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <ProblemSet data={filteredQuestions} />
      )}
      <FeatureCards />
    </div>
  );
};

export default DSASheet;
