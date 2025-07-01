import React, { useContext, useState, useEffect } from "react";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";
import { IconChevronDown, IconChevronUp, IconCircleCheck, IconCircle, IconX } from "@tabler/icons";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import Brand from "../brand/Brand";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const { problems, currentProblem } = useContext(ProblemDataProvider);
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    dsa: false,
    js: false,
    sd: false,
  });

  // Filter problems by category
  const dsaProblems = problems.filter((problem) => problem?.category === "dsa");
  const jsProblems = problems.filter((problem) => problem?.category === "js");
  const systemDesignProblems = problems.filter((problem) => problem?.category === "System Design");

  // Update expanded sections based on current problem
  useEffect(() => {
    // Get current path
    const currentPath = location.pathname;
    
    // Check if we're viewing a specific problem
    if (currentProblem && Object.keys(currentProblem).length > 0) {
      // Expand the section based on the current problem's category
      if (currentProblem.category === "dsa") {
        setExpandedSections(prev => ({ ...prev, dsa: true }));
      } else if (currentProblem.category === "js") {
        setExpandedSections(prev => ({ ...prev, js: true }));
      } else if (currentProblem.category === "sd") {
        setExpandedSections(prev => ({ ...prev, systemDesign: true }));
      }
    }
  }, [location.pathname, currentProblem]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to get difficulty badge
  const DifficultyBadge = ({ difficulty }) => {
    const color = returnColor(difficulty);
    return (
      <span className={`text-xs font-medium ${color} px-2 py-0.5 rounded-full`}>
        {returnDifficultyText(difficulty) || "N/A"}
      </span>
    );
  };

  const AccordionItem = ({ title, items, section, icon }) => (
    <div className="border-b border-zinc-700/50">
      <button
        className={`flex justify-between items-center w-full py-4 px-5 text-left transition-colors ${
          expandedSections[section] 
            ? "bg-zinc-700/30 text-white" 
            : "text-zinc-300 hover:bg-zinc-700/20"
        }`}
        onClick={() => toggleSection(section)}
      >
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-lg">{icon}</span>
          <span className="font-medium">{title}</span>
          <span className="bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <div className={`transition-transform duration-200 ${expandedSections[section] ? "rotate-180" : ""}`}>
          <IconChevronDown size={18} />
        </div>
      </button>

      {expandedSections[section] && (
        <div className="bg-zinc-800/50">
          {items.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 my-2 mr-2">
              {items.map((item) => {
                // Check if this is the current problem
                const isCurrentProblem = currentProblem && currentProblem.id === item.id;
                
                return (
                  <li 
                    key={item.id} 
                    className={`px-5 py-2.5 hover:bg-zinc-700/30 border-l-2 transition-all cursor-pointer ${
                      isCurrentProblem 
                        ? "border-zinc-400 bg-zinc-700/50" 
                        : "border-transparent hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.solved ? (
                          <IconCircleCheck size={16} className="text-green-400 flex-shrink-0" />
                        ) : (
                          <IconCircle size={16} className="text-zinc-500 flex-shrink-0" />
                        )}
                        <div className="flex items-center gap-2">
                          <span className={`text-sm line-clamp-1 ${isCurrentProblem ? "text-zinc-100 font-medium" : "text-zinc-300"}`}>
                            {item.problemTitle}
                          </span>
                          {isCurrentProblem && (
                            <span className="bg-zinc-600 text-zinc-200 text-xs px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <DifficultyBadge difficulty={item.difficulty} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-5 py-4 text-zinc-500 text-sm flex items-center justify-center">
              No problems available
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex w-full absolute z-50 h-full ${!isOpen ? 'pointer-events-none' : ''}`}>
      {/* Overlay - add fade in/out */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar - modify animation */}
      <div 
        className={`bg-zinc-800 h-full w-4/12 flex flex-col overflow-hidden shadow-xl 
          transform transition-all duration-300 ease-in-out fixed left-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Study Plan Name */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 py-5 px-5 border-b border-zinc-700/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-zinc-400 uppercase tracking-wider font-medium">current plan</p>
              <h2 className="text-xl font-bold text-white mt-1">All Problems</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-700/30"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {/* Accordion Menu */}
        <div className="flex-1 overflow-y-auto">
          <AccordionItem 
            title="DSA Problems" 
            items={dsaProblems} 
            section="dsa" 
            icon="◆"
          />
          <AccordionItem 
            title="JavaScript Problems" 
            items={jsProblems} 
            section="js" 
            icon="◆"
          />
          <AccordionItem 
            title="System Design Problems" 
            items={systemDesignProblems} 
            section="systemDesign" 
            icon="◆"
          />
        </div>
        
        {/* Footer */}
        <div className="bg-zinc-900/50 py-3 px-5 border-t border-zinc-700/50">
        <Brand size="1.2rem" fontSize="text-lg"/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
