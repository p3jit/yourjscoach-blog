import Table from "../components/table/Table";
import React, { useState, useEffect, useContext } from "react";
import { IconSearch, IconX } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import Footer from "../components/footer/Footer";
import Tag from "../components/tag/Tag";
import StudyPlans from "../components/studyPlans/StudyPlans";
import NewBadge from "../components/new-badge/NewBadge";

const DSASheet = () => {
  // Context and state
  const { filteredProblems, setFilteredProblems, problems, newProblems, setProblems, allProblems } =
    useContext(ProblemDataProvider);

  // UI state
  const [searchText, setSearchText] = useState("");
  const [isTableView, setIsTableView] = useState(true);

  // Filter state
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Filter functions
  const clearSearch = () => {
    setSearchText("");
    applyFilters("", selectedCategories, selectedTags, selectedCompanies);
  };

  const applyFilters = (search, categories, tags, companies) => {
    let filtered = problems;

    if (search.length > 0) {
      filtered = filtered.filter(
        (problem) =>
          problem.problemTitle.toLowerCase().includes(search.toLowerCase()) ||
          problem.askedIn.some((comp) => comp.toLowerCase().includes(search.toLowerCase())) ||
          problem.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (categories.length > 0) {
      filtered = filtered.filter((problem) => categories.includes(problem.category));
    }

    if (tags.length > 0) {
      filtered = filtered.filter((problem) => tags.some((tag) => problem.tags.includes(tag)));
    }

    if (companies.length > 0) {
      filtered = filtered.filter((problem) => companies.some((company) => problem.askedIn.includes(company)));
    }

    setFilteredProblems(filtered);
  };

  const handleSearchQuestion = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    applyFilters(searchValue, selectedCategories, selectedTags, selectedCompanies);
  };

  const debouncedHandleSearchQuestion = useDebounce(handleSearchQuestion, 800);

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleCompanySelect = (company) => {
    setSelectedCompanies((prev) => (prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Effects
  useEffect(() => {
    applyFilters(searchText, selectedCategories, selectedTags, selectedCompanies);
  }, [selectedCategories, selectedTags, selectedCompanies]);

  useEffect(() => {
    if (problems.length > 0) {
      const tags = new Set();
      const companies = new Set();
      const categories = new Set();

      problems.forEach((problem) => {
        problem.tags.forEach((tag) => tags.add(tag));
        problem.askedIn.forEach((company) => companies.add(company));
        if (problem.category) categories.add(problem.category);
      });

      setUniqueTags(Array.from(tags).sort());
      setUniqueCompanies(Array.from(companies).sort());
      setUniqueCategories(Array.from(categories).sort());
    }
  }, [problems]);

  useEffect(() => {
    if (location.pathname == "/problems") {
      setProblems([...allProblems]);
      setFilteredProblems([...allProblems]);
    }
  }, [location.pathname, navigate]);

  // UI Components
  const FilterComponent = () => (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-medium text-zinc-300">Filter by Categories</label>
        <div className="flex flex-wrap gap-2.5 mt-1.5">
          {uniqueCategories.map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <Tag
                key={category}
                data={category === "dsa" ? "Data Structures and Algorithm Problem" : "UI Problems"}
                isClickable={true}
                isActive={isActive}
                showHash={false}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategorySelect(category);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-medium text-zinc-300">Filter by Tags</label>
        <div className="flex flex-wrap gap-2.5 mt-1.5">
          {uniqueTags.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <Tag
                key={tag}
                data={tag}
                isClickable={true}
                isActive={isActive}
                showHash={false}
                onClick={(e) => {
                  e.preventDefault();
                  handleTagSelect(tag);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-medium text-zinc-300">Filter by Companies</label>
        <div className="flex flex-wrap gap-2.5 mt-1.5">
          {uniqueCompanies.map((company) => {
            const isActive = selectedCompanies.includes(company);
            return (
              <Tag
                key={company}
                data={company}
                isClickable={true}
                isActive={isActive}
                showHash={false}
                onClick={(e) => {
                  e.preventDefault();
                  handleCompanySelect(company);
                }}
              />
            );
          })}
        </div>
      </div>

      {(selectedCategories.length > 0 || selectedTags.length > 0 || selectedCompanies.length > 0) && (
        <div className="reltaive flex items-start w-full mt-1.5">
          <button
            className="bg-zinc-700 text-zinc-200 px-5 py-2.5 rounded-md text-sm flex items-center gap-1.5"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedTags([]);
              setSelectedCompanies([]);
            }}
          >
            Clear Filters <IconX size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const SearchBar = () => (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <IconSearch className="text-zinc-400" size={24} />
      </div>
      <input
        type="text"
        className="block w-full p-4 pl-12 text-base rounded-lg bg-zinc-800 border-zinc-700 placeholder-zinc-400 text-white focus:outline-none focus:ring-1 focus:ring-zinc-500"
        placeholder="Search problems by title, tag, or company..."
        defaultValue={searchText}
        onChange={debouncedHandleSearchQuestion}
      />
      {searchText && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-white"
        >
          <IconX size={24} />
        </button>
      )}
    </div>
  );

  const EmptyState = () => (
    <div className="w-full flex flex-col items-center justify-center py-20 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-zinc-600 text-6xl">¯\_(ツ)_/¯</div>
        <h3 className="text-2xl font-semibold text-zinc-300">No problems found</h3>
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

  // Main render
  return (
    <div className="flex flex-col items-center gap-10">
      {/* <StudyPlans /> */}

      {/* Newly added problems section */}
      {newProblems.length > 0 && (
        <div className="w-full pt-8">
          <div className="flex pb-2 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Newly Added Problems</h2>
            </div>
            <span className="text-sm text-zinc-400">{newProblems.length} problems</span>
          </div>
          <h2 className="text-lg tracking-wide font-medium text-zinc-500 mb-8">Fresh problems to test your skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newProblems.map((problem, index) => (
              <div
                key={index}
                onClick={() => navigate(`/practice/${problem.documentId}`)}
                className="group relative bg-zinc-800/40 rounded-xl p-5 hover:bg-zinc-800/60 transition-all duration-300 cursor-pointer border border-zinc-700/30 hover:border-zinc-600/50"
              >
                {/* Category and New Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-700/50 text-zinc-300">
                    {problem.category === "dsa" ? "DSA" : problem.category === "js" ? "JavaScript" : "System Design"}
                  </span>
                  <NewBadge />
                </div>

                {/* Problem Content */}
                <div className="space-y-3 pb-5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    {problem.problemTitle}
                  </h3>
                  <p className="text-zinc-400 text-md line-clamp-4">{problem.description}</p>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {problem.tags?.slice(0, 2).map((tag, idx) => (
                    <Tag key={idx} data={tag} isClickable={false} showHash={false} className="text-xs" />
                  ))}
                  {problem.tags?.length > 2 && (
                    <Tag
                      data={`+${problem.tags.length - 2}`}
                      isClickable={false}
                      showHash={false}
                      className="text-xs bg-zinc-700/40 text-zinc-400"
                    />
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-5 pt-4 border-t border-zinc-700/30 flex justify-end">
                  <button
                    className="text-sm text-zinc-400 hover:text-white flex items-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/practice/${problem.documentId}`);
                    }}
                  >
                    Start Solving
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="problems" className="flex flex-col w-full gap-7">
        <Caption />
        <SearchBar />
      </div>

      <FilterComponent />

      <div className="flex-col w-full flex gap-5">
        {filteredProblems?.length > 0 ? (
          isTableView ? (
            <Table data={filteredProblems} key={filteredProblems.length} />
          ) : (
            <ProblemSet data={filteredProblems} />
          )
        ) : (
          <EmptyState />
        )}
      </div>

      <FeatureCards />
      <div className="w-full">{!location.pathname.includes("/practice") && <Footer />}</div>
    </div>
  );
};

export default DSASheet;
