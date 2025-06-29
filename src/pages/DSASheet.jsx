import Table from "../components/table/Table";
import React, { useState, useEffect } from "react";
import { IconSearch, IconTable, IconX, IconLayoutGrid } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import InterviewPrepPlans from "../components/interviewPrep/InterviewPrepPlans";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";
import { useContext } from "react";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import { fuzzySearchWithFuse } from "../utils/utils";

const DSASheet = () => {
  const { filteredProblems, setFilteredProblems, problems, setProblem, filterProblems } =
    useContext(ProblemDataProvider);
  const [searchText, setSearchText] = useState("");
  const [isTableView, setIsTableView] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const navigate = useNavigate();

  const clearSearch = () => {
    setSearchText("");
    applyFilters("", selectedCategories, selectedTags, selectedCompanies);
  };

  // Apply all filters and update filteredProblems
  const applyFilters = (search, categories, tags, companies) => {
    let filtered = problems;
    
    // Apply search text filter
    if (search.length > 0) {
      filtered = filtered.filter(
        (problem) =>
          problem.problemTitle.toLowerCase().includes(search.toLowerCase()) ||
          problem.askedIn.some((comp) => comp.toLowerCase().includes(search.toLowerCase())) ||
          problem.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply categories filter
    if (categories.length > 0) {
      filtered = filtered.filter((problem) => 
        categories.includes(problem.category)
      );
    }
    
    // Apply tags filter
    if (tags.length > 0) {
      filtered = filtered.filter((problem) => 
        tags.some(tag => problem.tags.includes(tag))
      );
    }
    
    // Apply companies filter
    if (companies.length > 0) {
      filtered = filtered.filter((problem) => 
        companies.some(company => problem.askedIn.includes(company))
      );
    }
    
    setFilteredProblems(filtered);
  };

  // Handle search input changes
  const handleSearchQuestion = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    applyFilters(searchValue, selectedCategories, selectedTags, selectedCompanies);
  };

  const debouncedHandleSearchQuestion = useDebounce(handleSearchQuestion, 800);

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompanies(prev => {
      if (prev.includes(company)) {
        return prev.filter(c => c !== company);
      } else {
        return [...prev, company];
      }
    });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Effect to apply filters when selections change
  useEffect(() => {
    applyFilters(searchText, selectedCategories, selectedTags, selectedCompanies);
  }, [selectedCategories, selectedTags, selectedCompanies]);

  // Extract unique tags, companies, and categories when problems change
  useEffect(() => {
    if (problems.length > 0) {
      // Extract unique tags
      const tags = new Set();
      problems.forEach(problem => {
        problem.tags.forEach(tag => tags.add(tag));
      });
      setUniqueTags(Array.from(tags).sort());
      
      // Extract unique companies
      const companies = new Set();
      problems.forEach(problem => {
        problem.askedIn.forEach(company => companies.add(company));
      });
      setUniqueCompanies(Array.from(companies).sort());
      
      // Extract unique categories
      const categories = new Set();
      problems.forEach(problem => {
        if (problem.category) {
          categories.add(problem.category);
        }
      });
      setUniqueCategories(Array.from(categories).sort());
    }
  }, [problems]);

  // Filter component
  const FilterComponent = () => (
    <div className="flex flex-wrap gap-6 w-full mb-4">
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-zinc-400">Filter by Categories</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 py-1 text-sm rounded-full capitalize  ${
                selectedCategories.includes(category)
                  ? "bg-zinc-200 text-zinc-800"
                  : "bg-zinc-800 text-zinc-300 border border-zinc-600"
              }`}
            >
              {category === "dsa" ? "Data Structures and Algorithm Problems" : ""}
              {category === "js" ? "UI Problems" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-zinc-400">Filter by Tags</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedTags.includes(tag)
                  ? "bg-zinc-200 text-zinc-800"
                  : "bg-zinc-800 text-zinc-300 border border-zinc-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-zinc-400">Filter by Companies</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {uniqueCompanies.map((company) => (
            <button
              key={company}
              onClick={() => handleCompanySelect(company)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCompanies.includes(company)
                  ? "bg-zinc-200 text-zinc-800"
                  : "bg-zinc-800 text-zinc-300 border border-zinc-600"
              }`}
            >
              {company}
            </button>
          ))}
        </div>
      </div>
      
      {(selectedCategories.length > 0 || selectedTags.length > 0 || selectedCompanies.length > 0) && (
        <div className="flex items-start w-full">
          <button 
            className="bg-zinc-700 text-zinc-200 px-3 py-2 rounded-md text-sm flex items-center gap-1"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedTags([]);
              setSelectedCompanies([]);
              applyFilters(searchText, [], [], []);
            }}
          >
            Clear Filters <IconX size={16} />
          </button>
        </div>
      )}
    </div>
  );

  // Search component
  const SearchBar = () => (
    <div className="flex w-full justify-center items-center self-start relative mx-1 flex-col shadow shadow-zinc-700">
      <input
        type="text"
        autoFocus={true}
        spellCheck="false"
        placeholder="Search problems by title, tags and company"
        className="bg-zinc-800 outline outline-1 outline-zinc-400 w-full text-zinc-200 rounded-md py-3 pr-10 pl-12 tracking-wide text-sm"
        onChange={debouncedHandleSearchQuestion}
        defaultValue={searchText}
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
            <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
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

      {/* View Switch Component */}
      {/* <div className="flex w-full justify-end items-center">
        <div className="flex gap-3 text-zinc-400 cursor-pointer">
          {isTableView ? (
            <span
              onClick={() => {
                setIsTableView(false);
              }}
              title="Switch to Grid View"
            >
              <IconLayoutGrid />
            </span>
          ) : (
            <span
              onClick={() => {
                setIsTableView(true);
              }}
              title="Switch to Table View"
            >
              <IconTable />
            </span>
          )}
        </div>
      </div> */}

      <FilterComponent />

      {isTableView ? (
        <div className="flex-col w-full flex gap-5">
          {filteredProblems?.length > 0 ? (
            <Table data={filteredProblems} key={filteredProblems.length} />
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <div className="flex-col w-full flex gap-5">
          {filteredProblems?.length > 0 ? <ProblemSet data={filteredProblems} /> : <EmptyState />}
        </div>
      )}
      <FeatureCards />
    </div>
  );
};

export default DSASheet;
