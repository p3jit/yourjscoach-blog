import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { IconArrowUpRight, IconCalendar, IconClock, IconBookmark } from "@tabler/icons";

/**
 * Formats a date to a readable string format
 * @param {Date} value - Date to format
 * @returns {string} Formatted date string (DD MMM, YYYY)
 */
const formatDate = (value) => {
  const date = value;
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  return `${day} ${month}, ${year}`;
};

/**
 * CategoryBadge component for displaying the post category
 * @param {Object} props - Component props
 * @param {string} props.category - Category name
 * @returns {JSX.Element} The CategoryBadge component
 */
const CategoryBadge = ({ category, isDarkMode }) => {
  // Define category colors
  const getCategoryColor = (cat) => {
    const category = (cat || "").toLowerCase();

    if (category.includes("javascript") || category === "js") {
      return !isDarkMode
        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        : "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    if (category.includes("react") || category.includes("frontend")) {
      return !isDarkMode
        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
        : "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (category.includes("node") || category.includes("backend")) {
      return !isDarkMode
        ? "bg-green-500/20 text-green-300 border-green-500/30"
        : "bg-green-50 text-green-700 border-green-200";
    }

    // Default color
    return !isDarkMode ? "bg-zinc-700 text-zinc-300 border-zinc-600" : "bg-zinc-100 text-zinc-700 border-zinc-200";
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-md border ${getCategoryColor(category)}`}>{category || "General"}</span>
  );
};

/**
 * SearchCard component for displaying a search result card
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data including title, content, and metadata
 * @returns {JSX.Element} The SearchCard component
 */
const SearchCard = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${data.documentId}`);
  };

  const cardClass = !isDarkMode
    ? "bg-zinc-800/40 border border-zinc-700/50 hover:border-zinc-600"
    : "bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow";

  const titleClass = !isDarkMode ? "text-zinc-100 group-hover:text-white" : "text-zinc-800 group-hover:text-black";

  const metaClass = !isDarkMode ? "text-zinc-400" : "text-zinc-500";

  return (
    <article
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${cardClass}`}
      onClick={handleReadMore}
      aria-labelledby={`search-title-${data.documentId}`}
    >
      {/* Top accent bar - subtle design element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-600 to-zinc-700"></div>

      {/* Main content */}
      <div className="px-5 pb-5 pt-1">
        <button
          className={`p-2 rounded-full transition-colors ${
            !isDarkMode
              ? "hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300"
              : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
          }`}
          aria-label="Save article"
        ></button>

        <h2
          id={`search-title-${data.documentId}`}
          className={`font-bold text-lg leading-tight mb-2 transition-colors duration-300 ${titleClass}`}
        >
          {data.title}
        </h2>

        <p className={`text-sm line-clamp-2 mb-4 ${metaClass}`}>
          {data.description.length > 120 ? data.description.slice(0, 120) + "..." : data.description}
        </p>

        {/* Display all tags with animations */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2.5 py-1 text-xs rounded-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                  !isDarkMode
                    ? "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-zinc-700/30">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-xs ${metaClass}`}>
              <IconCalendar size={14} stroke={1.5} />
              <span>{formatDate(new Date(data.createdAt))}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs ${metaClass}`}>
              <IconClock size={14} stroke={1.5} />
              <span>{data.minRead || "5"} min</span>
            </div>
          </div>

          <span
            className={`flex items-center text-xs font-medium transition-colors duration-300 ${
              !isDarkMode ? "text-zinc-400 group-hover:text-zinc-200" : "text-zinc-500 group-hover:text-zinc-800"
            }`}
          >
            Read article
            <IconArrowUpRight
              size={14}
              className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
};

export default SearchCard;
