import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

/**
 * TableHeader component for rendering the table header row
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Current theme mode
 * @returns {JSX.Element} The TableHeader component
 */
const TableHeader = ({ isDarkMode }) => {
  const headerCellClass = `whitespace-nowrap px-4 py-2 text-left font-medium tracking-wide text-lg ${
    isDarkMode ? "text-zinc-900" : "text-white"
  }`;

  const headers = ["Question", "Difficulty", "Asked in", "Topic"];

  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header} className={headerCellClass} scope="col">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

/**
 * TagList component for rendering lists of tags
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of tag strings
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {string} props.maxWidth - Max width class for the container
 * @returns {JSX.Element} The TagList component
 */
const TagList = ({ items = [], isDarkMode, maxWidth = "max-w-[14rem]" }) => (
  <div className={`flex gap-2 flex-wrap ${maxWidth}`}>
    {items?.map((item, index) => (
      <span
        key={`tag-${item}-${index}`}
        className={`w-fit px-3 py-1 rounded-xl first-letter:uppercase text-sm font-normal ${
          isDarkMode ? "bg-zinc-200" : "bg-zinc-600 text-white"
        }`}
      >
        {item}
      </span>
    ))}
  </div>
);

/**
 * TableRow component for rendering a single question row
 * @param {Object} props - Component props
 * @param {Object} props.question - Question data
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {Function} props.onRowClick - Handler for row click
 * @returns {JSX.Element} The TableRow component
 */
const TableRow = ({ question, isDarkMode, onRowClick }) => {
  const questionCellClass = `whitespace-nowrap px-4 py-2 font-light tracking-wide text-sm ${
    isDarkMode ? "text-zinc-900" : "text-white"
  }`;

  return (
    <tr 
      className="cursor-pointer" 
      onClick={onRowClick}
      aria-label={`Question: ${question.questionName}`}
    >
      <td className={questionCellClass}>
        {question.questionName}
      </td>
      <td
        className={`whitespace-nowrap px-4 py-2 font-medium text-sm ${returnColor(
          question.difficulty
        )}`}
      >
        {returnDifficultyText(question.difficulty)}
      </td>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-zinc-700 max-w-3xl">
        <TagList 
          items={question.askedIn} 
          isDarkMode={isDarkMode} 
        />
      </td>
      <td className="whitespace-nowrap px-4 py-2">
        <TagList 
          items={question.topics} 
          isDarkMode={isDarkMode} 
          maxWidth="max-w-[10rem]" 
        />
      </td>
    </tr>
  );
};

/**
 * EmptyState component for when there's no data
 * @returns {JSX.Element} The EmptyState component
 */
const EmptyState = () => (
  <div className="p-6 text-center text-zinc-500">
    No questions available
  </div>
);

/**
 * Table component for displaying a list of questions with their details
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of question objects
 * @returns {JSX.Element} The Table component
 */
const Table = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/practice");
  };

  const hasData = data && data.length > 0;

  return (
    <section className="flex flex-col gap-3 w-full" aria-label="Questions table">
      <div className="overflow-x-auto border-zinc-700 rounded-md border-2 w-full">
        {hasData ? (
          <table className="min-w-full divide-y-2 divide-zinc-700">
            <TableHeader isDarkMode={isDarkMode} />
            <tbody className="divide-y divide-zinc-700">
              {data.map((question, index) => (
                <TableRow
                  key={`question-${index}-${question.questionName}`}
                  question={question}
                  isDarkMode={isDarkMode}
                  onRowClick={handleRowClick}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
};

export default Table;
