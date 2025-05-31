import Table from "../components/table/Table";
import React, { useEffect, useState } from "react";
import { IconSearch, IconX } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const DSASheet = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  
  const navigate = useNavigate();

  // Filter questions based on search text and selected category
  const filterQuestions = (searchValue, category = "") => {
    if (!questions.length) return [];
    
    let filtered = questions;
    
    // Apply search text filter
    if (searchValue.length > 0) {
      filtered = questions.filter(question => 
        question.questionName.includes(searchValue) ||
        question.askedIn.some(company => company.toLowerCase().includes(searchValue)) ||
        question.topics.some(topic => topic.toLowerCase().includes(searchValue))
      );
    }
    
    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter(question => question.category === category);
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
    fetch("/data/questions.json")
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setFilteredQuestions(data);
      })
      .catch(err => {
        console.error("Failed to fetch questions:", err);
        navigate("/404");
      });
  }, [navigate]);

  // Tab component
  const TabNavigation = () => (
    <div className="self-start">
      <div className="hidden sm:block">
        <div className="border-b border-zinc-500">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {["all", "js", "dsa"].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium hover:border-gray-300 hover:text-zinc-200 ${
                  currentTab === tab ? "text-zinc-200 border-zinc-200" : "text-zinc-500 border-transparent"
                }`}
              >
                {tab === "all" ? "All" : tab === "js" ? "JS Questions" : "DSA Questions"}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Search component
  const SearchBar = () => (
    <div className="flex w-2/6 justify-center items-center self-start relative mx-1 flex-col">
      <input
        type="text"
        spellCheck="false"
        defaultValue={searchText}
        className="bg-zinc-700 outline-none w-full text-zinc-200 rounded-md py-2 pr-10 pl-12 tracking-wide text-sm"
        onChange={debouncedHandleSearchQuestion}
      />
      <IconSearch className="absolute left-3 text-zinc-400 text-2xl" />
      {searchText && (
        <IconX 
          className="absolute right-3 text-2xl text-zinc-400 cursor-pointer" 
          onClick={clearSearch} 
        />
      )}
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

  return (
    <div className="py-10 flex flex-col items-center gap-10 min-h-[85vh]">
      <SearchBar />
      <TabNavigation />
      
      {filteredQuestions?.length > 0 ? (
        <Table data={filteredQuestions} key={filteredQuestions.length} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default DSASheet;
