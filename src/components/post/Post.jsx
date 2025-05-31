import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Heading from "../markdown-components/heading/Heading";
import NormalText from "../markdown-components/normalText/NormalText";
import PostTitle from "../PostTitle/PostTitle";
import RoundedText from "../markdown-components/roundedText/RoundedText";
import SkeletonLoaderPost from "../skeleton-loader-components/skeletonLoaderPost/SkeletonLoaderPost";
import UrlTag from "../markdown-components/urlTag/UrlTag";

// Lazy-loaded components to improve initial performance
const LazyComponents = {
  Code: lazy(() => import("../markdown-components/newCode/NewCode")),
  VideoTag: lazy(() => import("../markdown-components/videoTag/VideoTag")),
  ImageTag: lazy(() => import("../markdown-components/imageTag/ImageTag")),
};

// Environment variable for API URL
const ENV_VITE_API_URL = import.meta.env.VITE_API_URL;

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
 * PostHeader component for rendering post title, date, and banner image
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data
 * @returns {JSX.Element} The PostHeader component
 */
const PostHeader = ({ data }) => (
  <div className="flex flex-col">
    <PostTitle data={data.title} />
    <h3 className="text-center text-sm md:text-lg text-zinc-400 pt-2" aria-label={`Published on ${formatDate(new Date(data.timeStamp))}`}>
      {formatDate(new Date(data.timeStamp))}
    </h3>
    <BannerImage data={data} />
  </div>
);

/**
 * BannerImage component for rendering the post's banner image
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data containing banner image info
 * @returns {JSX.Element|null} The BannerImage component or null if no banner
 */
const BannerImage = ({ data }) => {
  if (!data.bannerImage) return null;
  
  const imagePath = `/images/${data.identifier}/${data.identifier}_banner.png`;
  
  return (
    <div className="mt-5">
      <ProgressiveImage
        src={imagePath}
        placeholder={imagePath}
      >
        {(src, loading) => (
          <img
            rel="preload"
            className={`${
              loading ? "blur-[4px]" : "blur-none"
            } delay-200 mb-2 mt-1 rounded-xl w-full h-[20rem] md:h-[25rem] lg:h-[30rem] respImage object-contain`}
            src={src}
            alt={`Banner image for ${data.title}`}
            width="600"
            height="300"
          />
        )}
      </ProgressiveImage>
    </div>
  );
};

/**
 * PostContent component for rendering markdown content with custom components
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {Object} props.data - Post data with image and video lists
 * @returns {JSX.Element} The PostContent component
 */
const PostContent = ({ content, data }) => (
  <Suspense>
    <Markdown
      options={{
        overrides: {
          Syntax: { component: LazyComponents.Code },
          Heading: { component: Heading },
          RoundedText: { component: RoundedText },
          NormalText: { component: NormalText },
          ImageTag: {
            component: LazyComponents.ImageTag,
            props: { imageList: data.imageList },
          },
          VideoTag: {
            component: LazyComponents.VideoTag,
            props: { imageList: data.videoList },
          },
          UrlTag: {
            component: UrlTag,
          },
        },
      }}
    >
      {content}
    </Markdown>
  </Suspense>
);

/**
 * TagList component for rendering the post's tags
 * @param {Object} props - Component props
 * @param {Array} props.tags - Array of tag strings
 * @param {boolean} props.isDarkMode - Current theme mode
 * @returns {JSX.Element} The TagList component
 */
const TagList = ({ tags, isDarkMode }) => (
  <div className="flex flex-col justify-between pt-1">
    <div className="text-zinc-600 flex gap-2 flex-wrap" aria-label="Post tags">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`w-fit px-3 py-1 rounded-xl ${
            isDarkMode ? "bg-zinc-200" : "bg-zinc-600 text-white"
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

/**
 * Post component for displaying a blog post with its content and metadata
 * @param {Object} props - Component props
 * @param {Object} props.data - Post data including title, content, and metadata
 * @returns {JSX.Element} The Post component
 */
export const Post = ({ data }) => {             
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrl = !ENV_VITE_API_URL
      ? `../${"mdFiles/" + data.mdFile + ".md"}`
      : `${ENV_VITE_API_URL}/assets/${data.mdFile}`;
      
    fetch(fetchUrl)
      .then((response) => response.text())
      .then((md) => {
        setPostContent(md);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load post content:", err);
        navigate("/404");
      });
  }, [data.mdFile, navigate]);

  if (isLoading) return <SkeletonLoaderPost />;

  return (
    <article className="flex flex-col gap-5 pt-[3vh] md:pt-[2vh]">
      <PostHeader data={data} />
      <PostContent content={postContent} data={data} />
      <hr className="bg-zinc-400" aria-hidden="true" />
      <TagList tags={data.tags} isDarkMode={isDarkMode} />
    </article>
  );
};
