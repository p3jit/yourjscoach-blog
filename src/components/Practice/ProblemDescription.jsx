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
  const isSolved = solvedProblems.includes(currentId);

  return (
    <div className="w-full border-r-2 h-full border-r-zinc-700 justify-between p-5 flex flex-col gap-3 overflow-y-auto">
      <div className="flex gap-3 flex-col">
        {/* Problem Title and Difficulty */}
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-zinc-100 text-2xl font-medium text-wrap">{currentProblem.problemTitle}</h1>
          <span
            className={`rounded-lg font-normal text-md ${returnColor(
              currentProblem.difficulty
            )} flex justify-center items-center gap-1`}
          >
            <IconFlame className="text-sm w-5 relative" stroke={2} />
            {returnDifficultyText(currentProblem.difficulty)}
          </span>
        </div>

        <div className="flex gap-6 flex-col">
          {/* Solved Status and Tags */}
          <div className="flex gap-2 items-center">
            {isSolved && (
              <span className="flex gap-1 text-lime-500 mr-4">
                <IconCircleCheck className="w-5" /> Solved
              </span>
            )}
            <div className="flex gap-2 flex-wrap">
              {currentProblem.tags?.map((currentTag, index) => (
                <div key={index}>
                  <Tag data={currentTag} key={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Problem Content */}
          <div className="flex gap-4 flex-col h-[65vh]">
            <Markdown
              className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-900 pr-4"
              options={{
                overrides: { 
                  NormalText: { component: NormalText },
                  Example: { component: ExampleBlock },
                },
              }}
            >
              {currentProblem.mdContent || ""}
            </Markdown>
          </div>
        </div>
      </div>

      {/* Footer with Companies and Solved Count */}
      <div className="flex justify-between w-full items-end border-t-2 border-t-zinc-800 pt-4">
        <div className="flex gap-3">
          <p className="text-zinc-300">Companies - </p>
          <div className="flex gap-2 flex-wrap">
            {currentProblem.askedIn?.map((company, index) => (
              <Tag data={company} key={index} showHash={false} />
            ))}
          </div>
        </div>
        {currentProblem.submitCount > 10 && (
          <div className="flex items-center gap-2">
            <IconUserCheck className="text-zinc-500 w-5" />
            <span className="text-zinc-500 text-md">{currentProblem.submitCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;
