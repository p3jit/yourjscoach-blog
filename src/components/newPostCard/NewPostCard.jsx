import React, { useContext } from "react";
import { IconArrowNarrowRight } from "@tabler/icons";
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
    <div className="m-[0.04rem]">
      <ProgressiveImage
        src={imagePath}
        placeholder={imagePath}
      >
        {(src, loading) => (
          <img
            rel="preload"
            className={`${
              loading ? "blur-[4px]" : "blur-none"
            } delay-200 mb-4 rounded-t-md w-full h-[15rem] object-cover`}
            src={src}
            alt={`Banner image for ${data.title}`}
            width="500"
            height="300"
          />
        )}
      </ProgressiveImage>
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
  const titleClass = `text-xl font-normal leading-7 mb-1 tracking-tight ${
    !isDarkMode ? "text-zinc-200" : "text-black"
  }`;
  
  const descriptionClass = `font-normal mt-2 text-md md:text-lg ${
    !isDarkMode ? "text-zinc-400" : "text-zinc-700"
  }`;

  // Truncate description to 300 characters if longer
  const truncatedDescription = 
    data.description.length > 300
      ? data.description.slice(0, 300) + "..."
      : data.description;

  return (
    <>
      <h3 id={`post-title-${data.displayId}`} className={titleClass}>
        {data.title}
      </h3>
      <div className="flex gap-1 md:gap-2 flex-wrap py-1">
        {data.tags.map((singleTag) => (
          <Tag data={singleTag} key={singleTag} />
        ))}
      </div>
      <p className={descriptionClass}>
        {truncatedDescription}
      </p>
    </>
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
  const dateClass = `text-sm mb-2 font-medium ${
    !isDarkMode ? "text-zinc-200" : "text-zinc-400"
  }`;
  
  const buttonClass = `underline underline-offset-4 decoration-zinc-400 text-base flex gap-2 font-medium ${
    !isDarkMode ? "text-zinc-100" : "text-zinc-600"
  }`;

  return (
    <div className="flex justify-between mt-5 mb-3 items-end">
      <div className="flex gap-3 items-center">
        <h3 className={dateClass}>
          {formatDate(new Date(data.timeStamp))}
        </h3>
      </div>
      <button
        className={buttonClass}
        onClick={onReadMore}
        aria-label={`Read more about ${data.title}`}
      >
        Read More <IconArrowNarrowRight aria-hidden="true" />
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

  const cardClass = `outline outline-2 rounded-md h-fit cursor-pointer ${
    !isDarkMode ? "outline-zinc-700" : "outline-zinc-200"
  }`;

  return (
    <article 
      className={cardClass}
      onClick={handleReadMore}
      aria-labelledby={`post-title-${data.displayId}`}
    >
      <CardImage data={data} />
      <div className="flex flex-col px-5 py-4">
        <CardContent data={data} isDarkMode={isDarkMode} />
        <CardFooter 
          data={data} 
          isDarkMode={isDarkMode} 
          onReadMore={handleReadMore} 
        />
      </div>
    </article>
  );
};

export default NewPostCard;
