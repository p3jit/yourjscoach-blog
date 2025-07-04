import React, { useContext, useState, useEffect } from "react";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";
import {
  IconCircleCheck, 
  IconCircle, 
  IconX,
  IconSearch,
  IconFilter,
  IconAdjustments,
  IconChartBar
} from "@tabler/icons";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import Brand from "../brand/Brand";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalStorageProvider } from "../../contexts/localStorageContext";
import { useStudyPlan } from "../../contexts/StudyPlanContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { problems, currentProblem } = useContext(ProblemDataProvider);
  const { solvedProblems } = useContext(LocalStorageProvider);
  const location = useLocation();
  const navigate = useNavigate();
  const { activeStudyPlan } = useStudyPlan();
  
  // State for sidebar functionality
  const [activeTab, setActiveTab] = useState("dsa");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [expandedSections, setExpandedSections] = useState({
    dsa: true,
    js: false,
    systemDesign: false,
  });

  // Filter problems by category
  const dsaProblems = problems?.filter((problem) => problem?.category === "dsa");
  const jsProblems = problems?.filter((problem) => problem?.category === "js");
  const systemDesignProblems = problems?.filter((problem) => problem?.category === "System Design");

  // Calculate progress for each category
  const calculateProgress = (problemList) => {
    if (!problemList || problemList.length === 0) return 0;
    const solved = problemList.filter(problem => solvedProblems.includes(problem.documentId)).length;
    return Math.round((solved / problemList.length) * 100);
  };

  const dsaProgress = calculateProgress(dsaProblems);
  const jsProgress = calculateProgress(jsProblems);
  const sdProgress = calculateProgress(systemDesignProblems);

  // Get active problems based on selected tab
  const getActiveProblems = () => {
    switch (activeTab) {
      case "dsa": return dsaProblems || [];
      case "js": return jsProblems || [];
      case "systemDesign": return systemDesignProblems || [];
      default: return [];
    }
  };

  // Filter problems based on search and difficulty
  const filteredProblems = getActiveProblems().filter(problem => {
    const matchesSearch = searchQuery === "" || 
      problem.problemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || 
      problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Update expanded sections based on current problem
  useEffect(() => {
    if (currentProblem && Object.keys(currentProblem).length > 0) {
      if (currentProblem.category === "dsa") {
        setActiveTab("dsa");
      } else if (currentProblem.category === "js") {
        setActiveTab("js");
      } else if (currentProblem.category === "System Design") {
        setActiveTab("systemDesign");
      }
    }
  }, [location.pathname, currentProblem]);

  // Function to get difficulty badge
  const DifficultyBadge = ({ difficulty }) => {
    const color = returnColor(difficulty);
    return (
      <span className={`text-xs font-medium ${color} px-2 py-0.5 rounded-full`}>
        {returnDifficultyText(difficulty) || "N/A"}
      </span>
    );
  };

  // Problem list item component
  const ProblemItem = ({ problem }) => {
    const isCurrentProblem = currentProblem && currentProblem.documentId === problem.documentId;
    const isSolved = solvedProblems.includes(problem.documentId);

    return (
      <li
        onClick={() => navigate(`/practice/${problem.documentId || problem.displayId}`)}
        key={problem.id}
        className={`px-4 py-3 hover:bg-zinc-700/40 rounded-md transition-all cursor-pointer mb-1 ${
          isCurrentProblem ? "bg-zinc-700/50 ring-1 ring-zinc-500" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isSolved ? (
                <IconCircleCheck size={18} className="text-green-400 flex-shrink-0" />
              ) : (
                <IconCircle size={18} className="text-zinc-500 flex-shrink-0" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm line-clamp-1 ${
                    isCurrentProblem ? "text-zinc-100 font-medium" : "text-zinc-300"
                  }`}
                >
                  {problem.problemTitle}
                </span>
                {isCurrentProblem && (
                  <span className="bg-zinc-600 text-zinc-200 text-xs px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              {problem.tags && problem.tags.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {problem.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-xs bg-zinc-700/70 text-zinc-400 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                  {problem.tags.length > 2 && (
                    <span className="text-xs text-zinc-500">+{problem.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </li>
    );
  };

  // Tab component for navigation
  const Tab = ({ id, label, count, progress }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-2 px-1 relative ${
        activeTab === id 
          ? "text-white" 
          : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      <div className="flex flex-col items-center">
        <span className="font-medium text-sm">{label}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-zinc-700/70 px-1.5 py-0.5 rounded">{count}</span>
          <span className="text-xs text-zinc-400">{progress}%</span>
        </div>
      </div>
      {activeTab === id && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-300 rounded-full"></div>
      )}
    </button>
  );

  return (
    <div className={`flex w-full absolute z-50 h-full ${!isOpen ? "pointer-events-none" : ""}`}>
      {/* Overlay with improved animation */}
      <div
        className={`fixed inset-0 bg-black/70 transition-opacity will-change-opacity duration-200 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar with improved design */}
      <div
        className={`bg-zinc-800 h-full min-w-[600px] w-5/12 max-w-lg flex flex-col overflow-hidden shadow-2xl 
          will-change-transform transform fixed left-0 transition-transform duration-200 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header with study plan info */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 py-5 px-5 border-b border-zinc-700/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-zinc-400 uppercase tracking-wider font-medium">current plan</p>
              <h2 className="text-xl font-bold text-white mt-1">
                {activeStudyPlan ? activeStudyPlan.title : "All Problems"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-zinc-700/50"
            >
              <IconX size={20} />
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={16} className="text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/70 text-zinc-200 placeholder-zinc-500 py-2 pl-9 pr-4 rounded-md 
                focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex border-b border-zinc-700/50">
          <Tab 
            id="dsa" 
            label="DSA" 
            count={dsaProblems?.length || 0} 
            progress={dsaProgress} 
          />
          <Tab 
            id="js" 
            label="JavaScript" 
            count={jsProblems?.length || 0} 
            progress={jsProgress} 
          />
          <Tab 
            id="systemDesign" 
            label="System Design" 
            count={systemDesignProblems?.length || 0} 
            progress={sdProgress} 
          />
        </div>

        {/* Filter options */}
        <div className="bg-zinc-900/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFilter size={16} className="text-zinc-400" />
            <span className="text-sm text-zinc-300">Filters</span>
          </div>
          <div className="flex gap-2">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button 
              className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-700 flex items-center gap-1"
              onClick={() => {
                setSearchQuery("");
                setDifficultyFilter("all");
              }}
            >
              <IconX size={12} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Problem list with improved scrolling */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {filteredProblems.length > 0 ? (
            <ul className="space-y-1">
              {filteredProblems.map((problem) => (
                <ProblemItem key={problem.id} problem={problem} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <IconSearch size={40} className="text-zinc-600 mb-3" />
              <p className="text-zinc-400 text-sm">No problems match your filters</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter("all");
                }}
                className="mt-3 text-indigo-400 text-sm hover:text-indigo-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Progress summary */}
        <div className="bg-zinc-900/70 px-5 py-4 border-t border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IconChartBar size={18} className="text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Your Progress</span>
            </div>
            <span className="text-xs text-zinc-400">
              {solvedProblems.length}/{problems?.length || 0} solved
            </span>
          </div>
          <div className="w-full bg-zinc-700/30 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" 
              style={{ width: `${problems?.length ? (solvedProblems.length / problems.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
