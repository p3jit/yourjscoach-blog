import Table from "../components/table/Table";
import React, { useState, useEffect, useContext, memo } from "react";
import { IconSearch, IconX } from "@tabler/icons";
import useDebounce from "../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import FeatureCards from "../components/features/FeatureCards";
import ProblemSet from "../components/ProblemSet/ProblemSet";
import { ProblemDataProvider } from "../contexts/ProblemDataContext";
import Footer from "../components/footer/Footer";
import Tag from "../components/tag/Tag";
import StudyPlans from "../components/studyPlans/StudyPlans";

// Memoized HeroSection to prevent unnecessary re-renders
const HeroSection = memo(() => (
  <div className="w-full">
    <div className="relative h-[70vh] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg rounded-lg overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="geometric-grid"></div>
      </div>

      {/* Floating 3D shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-shapes"></div>
      </div>

      {/* Main content area with spotlight effect */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[70%] bg-gradient-to-b from-zinc-300/10 to-transparent rounded-full blur-3xl"></div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-6xl z-20">
          {/* Left side: Text content */}
          <div className="space-y-6 text-center md:text-left md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Master UI Engineering
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl text-zinc-400">Interactive problems to sharpen your coding skills</h2>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(129,140,248,0.5)]">
                <span className="relative z-10 flex items-center justify-center gap-2 text-zinc-100 font-medium">
                  Start Coding <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </button>

              {/* <button className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-800/50 transition-colors">
                View Curriculum
              </button> */}
            </div>
          </div>

          {/* Right side: Interactive elements */}
          <div className="md:w-1/2 relative">
            {/* Code card with 3D effect */}
            <div className="perspective-card bg-zinc-800/80 backdrop-blur-sm p-5 rounded-lg border border-zinc-700/50 shadow-xl transform hover:rotate-y-5 transition-transform duration-300">
              <div className="flex items-center mb-3">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="ml-4 text-sm text-zinc-400 font-mono">problem-solving.js</div>
              </div>

              <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                <code className="language-javascript">
                  {`function solveProblem(problem) {
  // Break it down into smaller steps
  const steps = decompose(problem);
  
  // Apply the right patterns
  const solution = steps.map(step => 
    applyPattern(step)
  );
  
  return solution.join();
}`}
                </code>
              </pre>

              {/* Interactive skill badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["JavaScript", "React", "CSS", "System Design"].map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-zinc-700/70 text-zinc-300 rounded-full hover:bg-indigo-600/70 hover:text-white transition-colors cursor-pointer"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats with counters */}
            <div className="flex justify-around mt-6 bg-zinc-800/50 backdrop-blur-sm p-4 rounded-lg border border-zinc-700/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-300 counter-animate">50+</div>
                <div className="text-sm text-zinc-500">Problems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300 counter-animate">10+</div>
                <div className="text-sm text-zinc-500">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-300 counter-animate">8+</div>
                <div className="text-sm text-zinc-500">Topics</div>
              </div>
            </div>
          </div>
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

    /* Geometric grid background */
    .geometric-grid {
      background-image: linear-gradient(rgba(161, 161, 170, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(161, 161, 170, 0.1) 1px, transparent 1px);
      background-size: 40px 40px;
      width: 100%;
      height: 100%;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: 40px 40px;
      }
    }

    /* Floating 3D shapes */
    .floating-shapes {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .floating-shapes::before,
    .floating-shapes::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      opacity: 0.2;
    }

    .floating-shapes::before {
      width: 150px;
      height: 150px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      top: 20%;
      left: 15%;
      animation: float1 15s ease-in-out infinite;
    }

    .floating-shapes::after {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      bottom: 10%;
      right: 10%;
      animation: float2 18s ease-in-out infinite;
    }

    @keyframes float1 {
      0%,
      100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(20px, -30px) rotate(90deg);
      }
      50% {
        transform: translate(-20px, 20px) rotate(180deg);
      }
      75% {
        transform: translate(-30px, -20px) rotate(270deg);
      }
    }

    @keyframes float2 {
      0%,
      100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(-30px, 20px) rotate(-90deg);
      }
      50% {
        transform: translate(20px, -20px) rotate(-180deg);
      }
      75% {
        transform: translate(30px, 30px) rotate(-270deg);
      }
    }

    /* 3D card effect */
    .perspective-card {
      transform-style: preserve-3d;
      transition: transform 0.5s ease;
    }

    .perspective-card:hover {
      transform: rotateY(5deg) rotateX(5deg);
    }
  `}</style>
);

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

  // Main render
  return (
    <div className="py-6 flex flex-col items-center gap-10 min-h-[85vh]">
      <HeroSection />
      <AnimationStyles />
      <StudyPlans />

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
