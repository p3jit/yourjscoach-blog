import React, { useContext } from "react";
import { IconArrowNarrowRight, IconCalendar, IconClock } from "@tabler/icons";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Tag from "../tag/Tag";

/**
 * Formats a date to a readable month and day format
 * @param {Date} value - Date to format
 * @returns {string} Formatted date string (Month DD)
 */
const formatDate = (value) => {
  const date = value;
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "long" });
  return `${month} ${day}`;
};

/**
 * CardImage component for rendering the post banner image
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with identifier for image
 * @returns {JSX.Element|null} The CardImage component or null if no banner
 */
const CardImage = ({ data }) => {
  if (!data.bannerImage) return null;

  const imagePath = `/images/${data.identifier}/${data.identifier}_banner.png`;
  
  return (
    <div className="relative overflow-hidden">
      <ProgressiveImage
        src={imagePath}
        placeholder={imagePath}
      >
        {(src, loading) => (
          <img
            rel="preload"
            className={`${
              loading ? "blur-[4px]" : "blur-none"
            } transition-all duration-500 ease-in-out w-full h-[200px] object-cover transform group-hover:scale-105`}
            src={src}
            alt={`Banner image for ${data.title}`}
            width="500"
            height="300"
          />
        )}
      </ProgressiveImage>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

/**
 * CardContent component for rendering the post title, tags, and description
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with title, tags, and description
 * @param {boolean} props.isDarkMode - Current theme mode
 * @returns {JSX.Element} The CardContent component
 */
const CardContent = ({ data, isDarkMode }) => {
  const titleClass = `text-xl font-semibold leading-tight tracking-tight transition-colors duration-300 group-hover:text-zinc-100 ${
    !isDarkMode ? "text-zinc-200" : "text-zinc-800"
  }`;
  
  const descriptionClass = `font-normal mt-3 text-base leading-relaxed line-clamp-3 transition-colors duration-300 ${
    !isDarkMode ? "text-zinc-400" : "text-zinc-600"
  }`;

  // Truncate description to 160 characters for better visual balance
  const truncatedDescription = 
    data.description.length > 160
      ? data.description.slice(0, 160) + "..."
      : data.description;

  return (
    <div className="p-5">
      <h3 id={`post-title-${data.displayId}`} className={titleClass}>
        {data.title}
      </h3>
      <div className="flex gap-2 flex-wrap py-3">
        {data.tags.slice(0, 3).map((singleTag) => (
          <Tag data={singleTag} key={singleTag} />
        ))}
      </div>
      <p className={descriptionClass}>
        {truncatedDescription}
      </p>
    </div>
  );
};

/**
 * CardMeta component for rendering post metadata
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with timestamp and read time
 * @param {boolean} props.isDarkMode - Current theme mode
 * @returns {JSX.Element} The CardMeta component
 */
const CardMeta = ({ data, isDarkMode }) => {
  const metaClass = `text-xs font-medium flex items-center gap-1.5 transition-colors duration-300 ${
    !isDarkMode ? "text-zinc-400" : "text-zinc-500"
  }`;

  return (
    <div className="flex items-center gap-4">
      <div className={metaClass}>
        <IconCalendar size={16} />
        <span>{formatDate(new Date(data.timeStamp))}</span>
      </div>
      {data.minRead && (
        <div className={metaClass}>
          <IconClock size={16} />
          <span>{data.minRead} min read</span>
        </div>
      )}
    </div>
  );
};

/**
 * CardFooter component for rendering the post date and read more button
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data with timestamp
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {Function} props.onReadMore - Handler for read more button click
 * @returns {JSX.Element} The CardFooter component
 */
const CardFooter = ({ data, isDarkMode, onReadMore }) => {
  const buttonClass = `flex items-center gap-2 font-medium text-sm transition-all duration-300 ${
    !isDarkMode 
      ? "text-zinc-300 hover:text-zinc-100" 
      : "text-zinc-600 hover:text-zinc-800"
  }`;

  return (
    <div className="flex justify-between items-center px-5 py-4 border-t border-zinc-800/30">
      <CardMeta data={data} isDarkMode={isDarkMode} />
      <button
        className={buttonClass}
        onClick={onReadMore}
        aria-label={`Read more about ${data.title}`}
      >
        <span className="transition-transform group-hover:translate-x-[-4px] duration-300">Read</span>
        <IconArrowNarrowRight 
          size={18} 
          className="transition-transform group-hover:translate-x-1 duration-300" 
          aria-hidden="true" 
        />
      </button>
    </div>
  );
};

/**
 * NewPostCard component for displaying a blog post card
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data including title, content, and metadata
 * @returns {JSX.Element} The NewPostCard component
 */
const NewPostCard = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();
  
  const handleReadMore = (e) => {
    // Prevent event bubbling if clicked on the button specifically
    if (e) {
      e.stopPropagation();
    }
    navigate(`/blog/${data.displayId}`);
  };

  const cardClass = !isDarkMode 
    ? "bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600" 
    : "bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md";

  return (
    <article 
      className={`group rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out cursor-pointer ${cardClass}`}
      onClick={handleReadMore}
      aria-labelledby={`post-title-${data.displayId}`}
    >
      <CardImage data={data} />
      <div className="flex flex-col flex-grow">
        <CardContent data={data} isDarkMode={isDarkMode} />
        <div className="mt-auto">
          <CardFooter 
            data={data} 
            isDarkMode={isDarkMode} 
            onReadMore={handleReadMore} 
          />
        </div>
      </div>
    </article>
  );
};

export default NewPostCard;
