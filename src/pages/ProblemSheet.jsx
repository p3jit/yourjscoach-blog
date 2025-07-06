import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconSearch, IconX, IconLayoutGrid, IconTag, IconBuilding, IconChevronDown, IconCheck } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import Table from "../components/table/Table";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import Footer from "../components/footer/Footer";
import Tag from "../components/tag/Tag";
import StudyPlans from "../components/studyPlans/StudyPlans";
import NewBadge from "../components/new-badge/NewBadge";

// Custom hook for filter logic
const useProblemFilters = (initialProblems) => {
  const [filters, setFilters] = useState({
    searchText: "",
    selectedTags: [],
    selectedCompanies: [],
    selectedCategories: [],
  });

  const [uniqueValues, setUniqueValues] = useState({
    tags: [],
    companies: [],
    categories: [],
  });

  const [filteredProblems, setFilteredProblems] = useState(initialProblems);

  // Extract unique values from problems
  useEffect(() => {
    if (initialProblems.length === 0) return;

    const tags = new Set();
    const companies = new Set();
    const categories = new Set();

    initialProblems.forEach((problem) => {
      problem.tags?.forEach(tag => tags.add(tag));
      problem.askedIn?.forEach(company => companies.add(company));
      if (problem.category) categories.add(problem.category);
    });

    setUniqueValues({
      tags: Array.from(tags).sort(),
      companies: Array.from(companies).sort(),
      categories: Array.from(categories).sort(),
    });
  }, [initialProblems]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...initialProblems];
    const { searchText, selectedCategories, selectedTags, selectedCompanies } = filters;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (problem) =>
          problem.problemTitle.toLowerCase().includes(searchLower) ||
          problem.askedIn?.some(comp => comp.toLowerCase().includes(searchLower)) ||
          problem.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(problem => selectedCategories.includes(problem.category));
    }

    if (selectedTags.length > 0) {
      result = result.filter(problem => selectedTags.some(tag => problem.tags?.includes(tag)));
    }

    if (selectedCompanies.length > 0) {
      result = result.filter(problem => 
        selectedCompanies.some(company => problem.askedIn?.includes(company))
      );
    }

    setFilteredProblems(result);
  }, [filters, initialProblems]);

  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const clearFilter = useCallback((filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: Array.isArray(prev[filterName]) ? [] : ""
    }));
  }, []);

  return {
    filters,
    filteredProblems,
    uniqueValues,
    updateFilter,
    clearFilter,
  };
};

// Filter Dropdown Component
const FilterDropdown = ({ 
  label, 
  items, 
  selectedItems = [], 
  onSelect, 
  icon,
  isOpen,
  onToggle,
  dropdownRef
}) => (
  <div ref={dropdownRef} className="relative">
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
        selectedItems.length > 0
          ? "bg-zinc-700/30 border-zinc-600 text-zinc-100"
          : "border-zinc-700 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
      }`}
    >
      {icon}
      {label}
      {selectedItems.length > 0 && (
        <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-zinc-600/50">
          {selectedItems.length}
        </span>
      )}
      <IconChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>

    {isOpen && (
      <div className="absolute z-10 mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
        <div className="p-1 max-h-64 overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`w-full px-3 py-2 text-sm rounded-md flex items-center justify-between ${
                selectedItems.includes(item)
                  ? "bg-zinc-700/50 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200"
              }`}
            >
              <span className="truncate">{item}</span>
              {selectedItems.includes(item) && <IconCheck className="w-4 h-4 text-blue-400" />}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Search Input Component
const SearchInput = ({ value, onChange, onClear }) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <IconSearch className="w-5 h-5 text-zinc-500" />
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search problems..."
      className="w-full pl-10 pr-10 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
      >
        <IconX className="w-4 h-4" />
      </button>
    )}
  </div>
);

// View Toggle Component
const ViewToggle = ({ isTableView, onToggle }) => (
  <div className="flex border border-zinc-700 rounded-lg overflow-hidden">
    <button
      onClick={() => onToggle(true)}
      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
        isTableView
          ? "bg-zinc-700/50 text-white"
          : "bg-transparent text-zinc-400 hover:bg-zinc-800/50"
      }`}
    >
      Table View
    </button>
    <button
      onClick={() => onToggle(false)}
      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
        !isTableView
          ? "bg-zinc-700/50 text-white"
          : "bg-transparent text-zinc-400 hover:bg-zinc-800/50"
      }`}
    >
      Card View
    </button>
  </div>
);

// Main Component
const ProblemSheet = () => {
  const { filteredProblems, setFilteredProblems, problems, newProblems, setProblems, allProblems } =
    useContext(ProblemDataProvider);
  
  const [isTableView, setIsTableView] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    categories: React.useRef(null),
    tags: React.useRef(null),
    companies: React.useRef(null),
  };

  const {
    filters,
    filteredProblems: currentFilteredProblems,
    uniqueValues,
    updateFilter,
    clearFilter,
  } = useProblemFilters(problems);

  const location = useLocation();
  const navigate = useNavigate();

  // Update filtered problems in context
  useEffect(() => {
    setFilteredProblems(currentFilteredProblems);
  }, [currentFilteredProblems, setFilteredProblems]);

  // Reset filters when path changes
  useEffect(() => {
    if (location.pathname === "/problems") {
      setProblems([...allProblems]);
      setFilteredProblems([...allProblems]);
    }
  }, [location.pathname, navigate, allProblems, setProblems, setFilteredProblems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = Object.values(dropdownRefs).every(
        ref => !ref.current?.contains(e.target)
      );
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search with debounce
  const handleSearch = useDebounce((e) => {
    updateFilter("searchText", e.target.value);
  }, 300);

  const handleClearSearch = () => {
    clearFilter("searchText");
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const filterSections = [
    {
      id: "categories",
      label: "Categories",
      items: uniqueValues.categories,
      selected: filters.selectedCategories,
      onSelect: (item) => {
        const newCategories = filters.selectedCategories.includes(item)
          ? filters.selectedCategories.filter(cat => cat !== item)
          : [...filters.selectedCategories, item];
        updateFilter("selectedCategories", newCategories);
      },
      icon: <IconLayoutGrid className="w-4 h-4" />,
    },
    {
      id: "tags",
      label: "Tags",
      items: uniqueValues.tags,
      selected: filters.selectedTags,
      onSelect: (item) => {
        const newTags = filters.selectedTags.includes(item)
          ? filters.selectedTags.filter(tag => tag !== item)
          : [...filters.selectedTags, item];
        updateFilter("selectedTags", newTags);
      },
      icon: <IconTag className="w-4 h-4" />,
    },
    {
      id: "companies",
      label: "Companies",
      items: uniqueValues.companies,
      selected: filters.selectedCompanies,
      onSelect: (item) => {
        const newCompanies = filters.selectedCompanies.includes(item)
          ? filters.selectedCompanies.filter(comp => comp !== item)
          : [...filters.selectedCompanies, item];
        updateFilter("selectedCompanies", newCompanies);
      },
      icon: <IconBuilding className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100">
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Problem Sheet
          </h1>
          <p className="text-zinc-400">Practice coding problems to improve your skills</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchInput
              value={filters.searchText}
              onChange={(e) => {
                e.persist();
                handleSearch(e);
              }}
              onClear={handleClearSearch}
            />
            <ViewToggle 
              isTableView={isTableView} 
              onToggle={setIsTableView} 
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {filterSections.map((section) => (
              <FilterDropdown
                key={section.id}
                ref={dropdownRefs[section.id]}
                label={section.label}
                items={section.items}
                selectedItems={section.selected}
                onSelect={section.onSelect}
                icon={section.icon}
                isOpen={openDropdown === section.id}
                onToggle={() => toggleDropdown(section.id)}
              />
            ))}
            
            {(filters.selectedCategories.length > 0 || 
              filters.selectedTags.length > 0 || 
              filters.selectedCompanies.length > 0) && (
              <button
                onClick={() => {
                  clearFilter("selectedCategories");
                  clearFilter("selectedTags");
                  clearFilter("selectedCompanies");
                }}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 ml-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.selectedCategories.map((category) => (
            <Tag
              key={`cat-${category}`}
              data={category}
              onRemove={() => {
                updateFilter("selectedCategories", 
                  filters.selectedCategories.filter(c => c !== category)
                );
              }}
            />
          ))}
          {filters.selectedTags.map((tag) => (
            <Tag
              key={`tag-${tag}`}
              data={tag}
              onRemove={() => {
                updateFilter("selectedTags", 
                  filters.selectedTags.filter(t => t !== tag)
                );
              }}
            />
          ))}
          {filters.selectedCompanies.map((company) => (
            <Tag
              key={`comp-${company}`}
              data={company}
              onRemove={() => {
                updateFilter("selectedCompanies", 
                  filters.selectedCompanies.filter(c => c !== company)
                );
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-12">
          {isTableView ? (
            <Table problems={filteredProblems} />
          ) : (
            <ProblemSet problems={filteredProblems} />
          )}
        </div>

        {/* New Problems Section */}
        {newProblems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Newly Added
                <NewBadge />
              </h2>
            </div>
            <FeatureCards problems={newProblems} />
          </div>
        )}

        {/* Study Plans Section */}
        <StudyPlans />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProblemSheet;
