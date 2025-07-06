import Table from "../components/table/Table";
import React, { useState, useEffect, useContext } from "react";
import { IconSearch, IconX, IconLayoutGrid, IconTag, IconBuilding, IconChevronDown, IconCheck } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import Footer from "../components/footer/Footer";
import Tag from "../components/tag/Tag";
import StudyPlans from "../components/studyPlans/StudyPlans";
import NewBadge from "../components/new-badge/NewBadge";

const ProblemSheet = () => {
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
  const FilterComponent = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const filterSections = [
      {
        id: "categories",
        label: "Categories",
        items: uniqueCategories,
        selected: selectedCategories,
        action: handleCategorySelect,
        icon: <IconLayoutGrid className="w-4 h-4" />,
      },
      {
        id: "tags",
        label: "Tags",
        items: uniqueTags,
        selected: selectedTags,
        action: handleTagSelect,
        icon: <IconTag className="w-4 h-4" />,
      },
      {
        id: "companies",
        label: "Companies",
        items: uniqueCompanies,
        selected: selectedCompanies,
        action: handleCompanySelect,
        icon: <IconBuilding className="w-4 h-4" />,
      },
    ];

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (!e.target.closest(".filter-dropdown")) {
          setOpenDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="space-y-3 w-full">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {filterSections.map((section) => (
            <div key={section.id} className="relative filter-dropdown">
              <button
                onClick={() => setOpenDropdown(openDropdown === section.id ? null : section.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  section.selected.length > 0
                    ? "bg-zinc-700/30 border-zinc-600 text-zinc-100"
                    : "border-zinc-700 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                }`}
              >
                {section.icon}
                {section.label}
                {section.selected.length > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-zinc-600/50">
                    {section.selected.length}
                  </span>
                )}
                <IconChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === section.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === section.id && (
                <div className="absolute z-10 mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
                  <div className="p-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {section.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => section.action(item)}
                        className={`w-full px-3 py-2 text-sm rounded-md flex items-center justify-between ${
                          section.selected.includes(item)
                            ? "bg-zinc-700/50 text-zinc-100"
                            : "text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200"
                        }`}
                      >
                        <span className="truncate">
                          {item == "dsa"
                            ? "Data Structures and Algorithms"
                            : item == "js"
                            ? "UI Problem"
                            : item == "sd"
                            ? "System Design Problem"
                            : item}
                        </span>
                        {section.selected.includes(item) && (
                          <IconCheck className="w-4 h-4 flex-shrink-0 text-zinc-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {(selectedCategories.length > 0 || selectedTags.length > 0 || selectedCompanies.length > 0) && (
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedTags([]);
                setSelectedCompanies([]);
              }}
              className="ml-auto text-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              Clear all
              <IconX size={16} />
            </button>
          )}
        </div>

        {/* Selected Filters */}
        {(selectedCategories.length > 0 || selectedTags.length > 0 || selectedCompanies.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filterSections.flatMap((section) =>
              section.selected.map((item) => (
                <div
                  key={`${section.id}-${item}`}
                  className="bg-zinc-700/50 px-3 py-1.5 rounded-full text-sm text-zinc-200 flex items-center gap-1.5"
                >
                  <span className="text-sm text-zinc-400">{section.label}:</span>{" "}
                  {item == "dsa"
                    ? "Data Structures and Algorithms"
                    : item == "js"
                    ? "UI Problem"
                    : item == "sd"
                    ? "System Design Problem"
                    : item}
                  <button onClick={() => section.action(item)} className="text-zinc-400 hover:text-zinc-200">
                    <IconX size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-zinc-500">
            <IconSearch size={20} className={isFocused ? "text-blue-400" : ""} />
          </div>

          <input
            type="text"
            className={`w-full py-4 pl-10 pr-10 text-md rounded-lg border ${
              isFocused ? "bg-zinc-800 border-blue-500/50" : "bg-zinc-800/70 border-zinc-700 hover:border-zinc-600"
            } text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200`}
            placeholder="Search problems by title, tag, or company..."
            defaultValue={searchText}
            onChange={debouncedHandleSearchQuestion}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {searchText ? (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 text-zinc-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <IconX size={18} />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

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
        <FilterComponent />
      </div>

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

export default ProblemSheet;
