import Table from "../components/table/Table";
import React, { useState, useEffect, useContext, memo } from "react";
import { IconSearch, IconX } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import Footer from "../components/footer/Footer";

// Memoized HeroSection to prevent unnecessary re-renders
const HeroSection = memo(() => (
  <div className="w-full">
    <div className="relative h-[70vh] bg-zinc-900 shadow-lg rounded-lg overflow-hidden">
      {/* Animated background with code particles */}
      <div className="absolute inset-0">
        <div className="code-particles"></div>
      </div>

      {/* Code editor header */}
      <div className="relative z-10 flex items-center px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-zinc-500 rounded-full"></div>
          <div className="h-3 w-3 bg-zinc-400 rounded-full"></div>
          <div className="h-3 w-3 bg-zinc-300 rounded-full"></div>
        </div>
        <div className="ml-4 text-sm text-zinc-400 font-mono">interview-prep.js</div>
        <div className="flex-1"></div>
        <div className="text-xs text-zinc-500 font-mono">JavaScript</div>
      </div>

      {/* Main content area with typing animation and floating elements */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Animated typing code in background */}
        <div className="absolute left-0 top-1/4 w-full h-1/2 opacity-20 overflow-hidden">
          <pre className="typing-code font-mono text-sm text-zinc-300 whitespace-pre-wrap">
            <code className="language-javascript">
              {`function prepareForInterview() {
const skills = ['JavaScript', 'React', 'CSS', 'System Design'];
const practice = skills.map(skill => master(skill));

return practice.reduce((confidence, skill) => {
  return confidence + skill.proficiency;
}, initialConfidence);
}`}
            </code>
          </pre>
        </div>

        {/* Floating code symbols */}
        <div className="floating-elements absolute inset-0 pointer-events-none">
          <span className="floating-item text-zinc-400">{`{}`}</span>
          <span className="floating-item text-zinc-300">{`()`}</span>
          <span className="floating-item text-zinc-400">{`=>`}</span>
          <span className="floating-item text-zinc-300">{`</>`}</span>
          <span className="floating-item text-zinc-400">{`[]`}</span>
          <span className="floating-item text-zinc-300">{`$`}</span>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl z-20">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-100 bg-clip-text text-transparent">
                Master UI Engineering
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-zinc-400">
              Interactive problems to sharpen your coding skills
            </h2>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <button className="group relative px-6 py-3 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(113,113,122,0.5)]">
              <span className="relative z-10 flex items-center justify-center gap-2 text-zinc-100 font-medium">
                Start Coding <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="absolute inset-0 bg-zinc-500/20 translate-y-full group-hover:translate-y-0 transition-transform"></span>
            </button>

            <button className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors">
              View Curriculum
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-300 counter-animate">100+</div>
              <div className="text-sm text-zinc-500">Coding Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-300 counter-animate">15+</div>
              <div className="text-sm text-zinc-500">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-300 counter-animate">8+</div>
              <div className="text-sm text-zinc-500">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom terminal line */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 px-4 py-2 z-10">
        <div className="flex items-center">
          <span className="text-zinc-300 font-mono text-xs">$</span>
          <span className="typing-cursor ml-2 text-zinc-400 font-mono text-xs">npm run start-interview-prep</span>
        </div>
      </div>
    </div>
  </div>
));

// Animations CSS
const AnimationStyles = () => (
  <style jsx="true">{`
    .code-particles {
      background-image: radial-gradient(circle, rgba(113, 113, 122, 0.4) 1px, transparent 1px),
        radial-gradient(circle, rgba(113, 113, 122, 0.2) 1px, transparent 1px);
      background-size: 20px 20px, 40px 40px;
      background-position: 0 0, 20px 20px;
      animation: particleShift 8s linear infinite;
    }

    @keyframes particleShift {
      0% {
        background-position: 0 0, 20px 20px;
      }
      100% {
        background-position: 20px 20px, 40px 40px;
      }
    }

    .typing-code {
      display: inline-block;
      animation: typing 10s steps(40) infinite;
      overflow: hidden;
      white-space: nowrap;
      max-width: 100%;
    }

    @keyframes typing {
      0% {
        width: 0;
      }
      50% {
        width: 100%;
      }
      90% {
        width: 100%;
      }
      100% {
        width: 0;
      }
    }

    .typing-cursor::after {
      content: "|";
      animation: blink 1s step-end infinite;
    }

    @keyframes blink {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }

    .floating-elements {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .floating-item {
      position: absolute;
      font-size: 1.5rem;
      font-family: monospace;
      opacity: 0.6;
      animation-name: float, fade;
      animation-duration: 10s, 10s;
      animation-timing-function: ease-in-out, ease-in-out;
      animation-iteration-count: infinite, infinite;
      animation-direction: normal, normal;
    }

    .floating-item:nth-child(1) {
      top: 20%;
      left: 10%;
      animation-delay: 0s, 0s;
    }

    .floating-item:nth-child(2) {
      top: 30%;
      left: 80%;
      animation-delay: 1s, 1s;
    }

    .floating-item:nth-child(3) {
      top: 70%;
      left: 20%;
      animation-delay: 2s, 2s;
    }

    .floating-item:nth-child(4) {
      top: 40%;
      left: 60%;
      animation-delay: 3s, 3s;
    }

    .floating-item:nth-child(5) {
      top: 80%;
      left: 70%;
      animation-delay: 4s, 4s;
    }

    .floating-item:nth-child(6) {
      top: 60%;
      left: 30%;
      animation-delay: 5s, 5s;
    }

    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    @keyframes fade {
      0%,
      100% {
        opacity: 0.2;
      }
      50% {
        opacity: 0.8;
      }
    }

    .counter-animate {
      animation: countUp 2s ease-out forwards;
      opacity: 0;
    }

    @keyframes countUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
);

const DSASheet = () => {
  // Context and state
  const { filteredProblems, setFilteredProblems, problems, newProblems } = useContext(ProblemDataProvider);

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

  // UI Components
  const FilterComponent = () => (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-medium text-zinc-300">Filter by Categories</label>
        <div className="flex flex-wrap gap-2.5 mt-1.5">
          {uniqueCategories.map((category) => (
            <span
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3.5 py-1.5 text-sm rounded-md cursor-pointer ${
                selectedCategories.includes(category) ? "bg-zinc-600 text-zinc-100" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {category === "dsa" ? "Data Structures and Algorithm Problem" : ""}
              {category === "js" ? "UI Problems" : ""}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-medium text-zinc-300">Filter by Tags</label>
        <div className="flex flex-wrap gap-2.5 mt-1.5">
          {uniqueTags.map((tag) => (
            <span
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-3.5 py-1.5 text-sm rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-zinc-600 text-zinc-100" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-base font-medium text-zinc-300">Filter by Companies</label>
        <div className="flex flex-wrap gap-2.5 mt-1.5">
          {uniqueCompanies.map((company) => (
            <span
              key={company}
              onClick={() => handleCompanySelect(company)}
              className={`px-3.5 py-1.5 text-sm rounded-md cursor-pointer ${
                selectedCompanies.includes(company) ? "bg-zinc-600 text-zinc-100" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {(selectedCategories.length > 0 || selectedTags.length > 0 || selectedCompanies.length > 0) && (
        <div className="flex items-start w-full mt-1.5">
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

  const navigate = useNavigate();

  // Main render
  return (
    <div className="py-6 flex flex-col items-center gap-10 min-h-[85vh]">
      <HeroSection />
      <AnimationStyles />

      {/* Newly added problems section */}
      {newProblems.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl font-semibold text-zinc-300 mb-3 flex items-center">Newly Added Problems</h2>
          {newProblems.length > 0 && (
            <div className="flex gap-5 w-full">
              {newProblems.map((problem, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/practice/${problem.documentId}`)}
                  className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 rounded-lg shadow-lg hover:shadow-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col w-6/12"
                >
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute transform rotate-45 bg-zinc-700 text-xs font-medium text-zinc-200 text-center py-1 right-[-35px] top-[12px] w-[120px]">
                      New
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-200 pr-6 mb-3">
                    {problem.category === "dsa" && "Data Structure and Algorithm Problem"}
                    {problem.category === "js" && "Javascript Problem"}
                    {problem.category === "sd" && "System Design & Architecture Problem"}
                  </h3>
                  <h3 className="text-xl font-semibold text-white group-hover:text-zinc-200 pr-6 mb-3">
                    {problem.problemTitle}
                  </h3>
                  <p className="text-zinc-400 line-clamp-3 mb-4 flex-grow">{problem.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-4">
                    <div className="flex flex-wrap gap-2">
                      {problem.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded-md bg-zinc-700/50 text-zinc-300">
                          {tag}
                        </span>
                      ))}
                      {problem.tags?.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-md bg-zinc-700/50 text-zinc-300">
                          +{problem.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <span className="text-zinc-400 group-hover:text-zinc-300 flex items-center">
                      Solve <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
