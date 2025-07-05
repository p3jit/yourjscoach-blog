import React, { useContext } from "react";
import Markdown from "markdown-to-jsx";
import Tag from "../tag/Tag";
import { IconCircleCheck, IconFlame, IconUserCheck } from "@tabler/icons";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import NormalText from "../markdown-components/normalText/NormalText";
import ExampleBlock from "../markdown-components/example-block/ExampleBlock";
import { LocalStorageProvider } from "../../contexts/localStorageContext";

/**
 * Component to display the problem description, difficulty, tags, and other metadata
 */
const ProblemDescription = ({ currentProblem }) => {
  if (!currentProblem) return null;
  const {solvedProblems} = useContext(LocalStorageProvider);
  const currentId = currentProblem.displayId || currentProblem.documentId;
  const isSolved = currentId ? solvedProblems.includes(currentId) : false;

  return (
    <div className="w-full pr-2 h-full flex flex-col overflow-hidden border-r-2 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      {/* Header Section */}
      <div className="p-6 pb-6 border-b border-zinc-800/50">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              {currentProblem.problemTitle}
            </h1>
            <div className="flex items-center gap-2">
              {isSolved && (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full">
                  <IconCircleCheck className="w-4 h-4" />
                  Solved
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  returnColor(currentProblem.difficulty)
                } bg-opacity-10`}
              >
                <IconFlame className="w-4 h-4" />
                {returnDifficultyText(currentProblem.difficulty)}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-1">
            {currentProblem.tags?.map((tag, index) => (
              <Tag key={index} data={tag} />
            ))}
          </div>
        </div>
      </div>

      {/* Problem Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-thin scrollbar-thumb-zinc-700/50 scrollbar-track-transparent">
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

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
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
