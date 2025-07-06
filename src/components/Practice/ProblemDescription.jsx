import React, { useContext, useMemo, useState } from "react";
import Markdown from "markdown-to-jsx";
import Tag from "../tag/Tag";
import { IconCircleCheck, IconFlame, IconUserCheck, IconCode, IconChevronDown } from "@tabler/icons";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import NormalText from "../markdown-components/normalText/NormalText";
import ExampleBlock from "../markdown-components/example-block/ExampleBlock";
import { LocalStorageProvider } from "../../contexts/localStorageContext";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";
import { useNavigate } from "react-router-dom";

/**
 * Component to display the problem description, difficulty, tags, and other metadata
 */
const ProblemDescription = ({ currentProblem }) => {
  if (!currentProblem) return null;

  const { solvedProblems } = useContext(LocalStorageProvider);
  const { allProblems } = useContext(ProblemDataProvider);
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const currentId = currentProblem.displayId || currentProblem.documentId;
  const isSolved = currentId ? solvedProblems.includes(currentId) : false;

  // Memoize similar problems calculation
  const similarProblems = useMemo(() => {
    if (!currentProblem?.tags?.length || !allProblems?.length) return [];

    return allProblems
      .filter((problem) => {
        const problemId = problem.displayId || problem.documentId;
        if (problemId === currentId) return false;

        return problem.tags && problem.tags.some((tag) => currentProblem.tags.includes(tag));
      })
      .slice(0, 3);
  }, [currentProblem, allProblems, currentId]);

  const handleProblemClick = (problem) => {
    const problemId = problem.displayId || problem.documentId;
    navigate(`/practice/${problemId}`);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden border-r-2 border-zinc-800 bg-zinc-900/50">
      {/* Header Section - Simplified */}
      <div className="bg-gradient-to-r from-zinc-800/40 to-zinc-900/30 p-6 border-b border-zinc-700/30">
        <div className="max-w-4xl">
          {/* Problem Title with Badge Row */}
          <div className="flex justify-between gap-3 mb-3">
            <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-zinc-300">
              {currentProblem.problemTitle}
            </h1>

            <div className="flex items-start gap-3">
              {/* Difficulty Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${returnColor(
                  currentProblem.difficulty
                )} bg-opacity-10 backdrop-blur-sm border border-zinc-600/70 ${returnColor(currentProblem.difficulty)
                  .replace("text-", "border-")
                  .replace("text-", "border-")}`}
              >
                <IconFlame className="w-4 h-4" />
                <span className="font-mono tracking-wide">{returnDifficultyText(currentProblem.difficulty)}</span>
              </span>

              {/* Solved Badge */}
              {isSolved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-800/50 backdrop-blur-sm">
                  <IconCircleCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Solved</span>
                </span>
              )}
            </div>
          </div>

          {/* Tags with Category */}
          <div className="flex flex-wrap items-center gap-2">
            {currentProblem.category && (
              <span className="text-sm font-medium px-2.5 py-1 rounded-md bg-zinc-700/50 text-zinc-300 border border-zinc-600/50">
                {currentProblem.category == "dsa" && "Data Structures and Algorithms"}
                {currentProblem.category == "js" && "UI Problem"}
                {currentProblem.category == "sd" && "System Design Problem"}
              </span>
            )}
            <div className="h-4 w-px bg-zinc-700/50 mx-1" />
            <div className="flex flex-wrap gap-1.5">
              {currentProblem.tags?.map((tag, index) => (
                <Tag
                  key={index}
                  data={tag}
                  className="text-xs px-2.5 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Content - Optimized */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 pr-2  scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        <Markdown
          options={{
            overrides: {
              NormalText: { component: NormalText },
              Example: { component: ExampleBlock },
            },
          }}
          className="prose prose-invert max-w-none"
        >
          {currentProblem.mdContent || ""}
        </Markdown>
      </div>

      {/* Similar Problems Section with Accordion */}
      {similarProblems.length > 0 && (
        <div className="border-t border-zinc-700/50 bg-zinc-800/20">
          <button
            onClick={toggleAccordion}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-700/30"
            aria-expanded={isAccordionOpen}
          >
            <h3 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
              <IconCode className="w-5 h-5 text-zinc-400" />
              Similar Problems
              <span className="text-sm text-zinc-400 ml-1">({similarProblems.length})</span>
            </h3>
            <IconChevronDown
              className={`w-5 h-5 text-zinc-400 transition-transform ${isAccordionOpen ? "" : "rotate-180"}`}
            />
          </button>

          <div className={`overflow-hidden ${isAccordionOpen ? "block" : "hidden"}`} aria-hidden={!isAccordionOpen}>
            <div className="px-4 pt-5 pb-4 space-y-2">
              {similarProblems.map((problem) => {
                const problemId = problem.displayId || problem.documentId;
                const isProblemSolved = solvedProblems.includes(problemId);

                return (
                  <div
                    key={problemId}
                    onClick={() => handleProblemClick(problem)}
                    className="p-3 rounded-lg bg-zinc-700/30 border border-zinc-600/30 cursor-pointer hover:bg-zinc-700/50 active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-zinc-100">
                        {problem.problemTitle}
                        {isProblemSolved && (
                          <span className="ml-2 text-xs text-zinc-400">
                            <IconCircleCheck className="inline w-3.5 h-3.5" />
                          </span>
                        )}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${returnColor(problem.difficulty)} bg-zinc-700/50`}
                      >
                        {returnDifficultyText(problem.difficulty)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {problem.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-zinc-600/50 text-zinc-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {problem.tags?.length > 2 && (
                        <span className="text-xs text-zinc-500">+{problem.tags.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Simplified */}
      <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {currentProblem.askedIn?.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-400">Asked in:</span>
              <div className="flex flex-wrap gap-2">
                {currentProblem.askedIn.map((company, index) => (
                  <Tag key={index} data={company} showHash={false} />
                ))}
              </div>
            </div>
          )}

          {currentProblem.submitCount > 10 && (
            <div className="flex items-center gap-2 text-zinc-400">
              <IconUserCheck className="w-4 h-4" />
              <span className="text-sm">{currentProblem.submitCount} users solved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
