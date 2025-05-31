import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

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
 * CardHeader component for rendering the post title and date
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with title and timestamp
 * @param {boolean} props.isDarkMode - Current theme mode
 * @returns {JSX.Element} The CardHeader component
 */
const CardHeader = ({ data, isDarkMode }) => {
  const titleClass = `font-medium leading-6 text-xl w-9/12 md:text-2xl tracking-normal ${
    !isDarkMode ? "text-zinc-200" : "text-black"
  }`;
  
  const dateClass = `text-xs font-medium w-3/12 md:text-base mt-1 text-right ${
    !isDarkMode ? "text-white" : "text-zinc-400"
  }`;

  return (
    <div className="flex justify-between items-start">
      <h2 
        id={`search-title-${data.displayId}`}
        className={titleClass}
      >
        {data.title}
      </h2>
      <time
        className={dateClass}
        dateTime={new Date(data.timeStamp).toISOString()}
      >
        {formatDate(new Date(data.timeStamp))}
      </time>
    </div>
  );
};

/**
 * CardMeta component for rendering post metadata like read time
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with minRead information
 * @returns {JSX.Element} The CardMeta component
 */
const CardMeta = ({ data }) => (
  <div className="flex flex-col pt-1 md:flex-row md:justify-between md:items-center">
    <span 
      className="text-sm font-medium text-zinc-400 pl-[1px] md:pl-0 pt-1 md:pt-0"
      aria-label={`${data.minRead} minute read`}
    >
      {data.minRead} min
    </span>
  </div>
);

/**
 * CardDescription component for rendering the post description
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with description
 * @param {boolean} props.isDarkMode - Current theme mode
 * @returns {JSX.Element} The CardDescription component
 */
const CardDescription = ({ data, isDarkMode }) => {
  const descriptionClass = `break-words font-normal py-4 text-md md:text-lg ${
    !isDarkMode ? "text-zinc-400" : "text-zinc-500"
  }`;

  // Truncate description to 280 characters if longer
  const truncatedDescription = 
    data.description.length > 280
      ? data.description.slice(0, 280) + "..."
      : data.description;

  return (
    <p className={descriptionClass}>
      {truncatedDescription}
    </p>
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
    navigate(`/blog/${data.displayId}`);
  };

  return (
    <article
      className="flex flex-col rounded p-6 outline outline-2 outline-zinc-200"
      aria-labelledby={`search-title-${data.displayId}`}
    >
      <CardHeader data={data} isDarkMode={isDarkMode} />
      <CardMeta data={data} />
      <CardDescription data={data} isDarkMode={isDarkMode} />
      <button
        className="p-2 mt-4 font-medium rounded bg-zinc-300 hover:bg-zinc-400 text-zinc-600 transition-colors"
        onClick={handleReadMore}
        aria-label={`Read more about ${data.title}`}
      >
        Read more
      </button>
    </article>
  );
};

export default SearchCard;
